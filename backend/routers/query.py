from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from database import get_db
from models import Connection, QueryHistory, User
from routers.auth import get_current_user
from connectors.factory import get_connector
from nlp.query_engine import QueryEngine
from nlp.advanced_query_engine import AdvancedQueryEngine
from plan_limits import can_execute_query
import pandas as pd

router = APIRouter()
query_engine = QueryEngine()
advanced_query_engine = AdvancedQueryEngine()  # Enhanced NLP engine

# Pydantic models
class QueryRequest(BaseModel):
    query_text: str
    source_id: Optional[str] = "default"  # Connection ID or "default"

class QueryResponse(BaseModel):
    summary: str
    results: List[Dict[str, Any]]
    suggestions: List[str]
    executed_query: Optional[str] = None

def get_connection_by_id_or_default(connection_id: str, user_id: int, db: Session) -> Optional[Connection]:
    """Get connection by ID or return default"""
    if connection_id == "default" or not connection_id:
        # Get the first connection for the user
        connection = db.query(Connection).filter(Connection.user_id == user_id).first()
        return connection
    else:
        try:
            conn_id = int(connection_id)
            connection = db.query(Connection).filter(
                Connection.id == conn_id,
                Connection.user_id == user_id
            ).first()
            return connection
        except (ValueError, TypeError):
            return None

@router.post("/run", response_model=QueryResponse)
def run_query(query_request: QueryRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Execute a natural language query on a data source"""
    try:
        # Check query limits based on plan
        start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        queries_this_month = db.query(QueryHistory).filter(
            and_(
                QueryHistory.user_id == current_user.id,
                QueryHistory.created_at >= start_of_month
            )
        ).count()
        
        can_query, message = can_execute_query(current_user, queries_this_month)
        if not can_query:
            raise HTTPException(status_code=403, detail=message)
        
        # Get connection
        connection = get_connection_by_id_or_default(query_request.source_id, current_user.id, db)
        
        if not connection:
            # Create a demo/default dataset if no connection exists
            return _run_demo_query(query_request.query_text)
        
        # Get connector
        connector = get_connector(connection.type)
        
        try:
            # Connect to data source
            connector.connect(connection.details)
            
            # Get schema
            schema = connector.get_schema()
            
            # Parse natural language query using advanced engine
            # Try advanced engine first, fallback to basic engine if needed
            try:
                parsed_query = advanced_query_engine.parse_query(query_request.query_text, schema)
            except Exception as e:
                # Fallback to basic engine
                print(f"Advanced engine failed, using basic: {e}")
                parsed_query = query_engine.parse_query(query_request.query_text, schema)
            
            # Execute query
            result_df = connector.execute_query(parsed_query["query"])
            
            # Convert DataFrame to list of dicts
            results = result_df.head(100).to_dict(orient="records")
            
            # Generate summary
            summary = f"Found {len(result_df)} rows. Showing top 100 results."
            if parsed_query.get("operation"):
                summary = f"{parsed_query['operation'].replace('_', ' ').title()}: {summary}"
            
            # Generate intelligent suggestions
            try:
                suggestions = advanced_query_engine.generate_suggestions(query_request.query_text, results)
            except:
                suggestions = query_engine.generate_suggestions(query_request.query_text, results)
            
            # Update connection last_used timestamp and log query to history
            connection.last_used = datetime.utcnow()
            
            try:
                history_entry = QueryHistory(
                    user_id=current_user.id,
                    query_text=query_request.query_text,
                    source_id=connection.id,
                    executed_query=parsed_query["query"],
                    result_count=len(result_df)
                )
                db.add(history_entry)
                db.commit()  # This will also commit the last_used update
            except Exception as e:
                # Don't fail if history logging fails, but try to commit last_used
                print(f"Error logging query history: {e}")
                db.rollback()
                try:
                    # Retry with just the last_used update
                    connection.last_used = datetime.utcnow()
                    db.commit()
                except:
                    pass
            
            return QueryResponse(
                summary=summary,
                results=results,
                suggestions=suggestions,
                executed_query=parsed_query["query"]
            )
        
        finally:
            connector.close()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing query: {str(e)}")

def _run_demo_query(query_text: str) -> QueryResponse:
    """Run a demo query with sample data if no connection is available"""
    # Create sample data
    import random
    demo_data = {
        "name": [f"Student {i}" for i in range(1, 21)],
        "marks": [random.randint(50, 100) for _ in range(20)],
        "subject": [random.choice(["Math", "Science", "English"]) for _ in range(20)]
    }
    df = pd.DataFrame(demo_data)
    
    # Parse query using advanced engine
    try:
        parsed_query = advanced_query_engine.parse_query(query_text, {"columns": list(df.columns)})
    except:
        parsed_query = query_engine.parse_query(query_text, {"columns": list(df.columns)})
    
    # Execute on demo data
    try:
        local_vars = {"df": df, "pd": pd}
        exec(f"result = {parsed_query['query']}", {"pd": pd}, local_vars)
        result = local_vars.get("result")
        
        if isinstance(result, pd.DataFrame):
            result_df = result
        elif isinstance(result, pd.Series):
            result_df = result.to_frame()
        else:
            result_df = pd.DataFrame({"result": [result]})
        
        results = result_df.head(100).to_dict(orient="records")
        summary = f"Demo query executed. Found {len(result_df)} rows. (Using sample data - please add a data connection)"
        try:
            suggestions = advanced_query_engine.generate_suggestions(query_text, results)
        except:
            suggestions = query_engine.generate_suggestions(query_text, results)
        
        return QueryResponse(
            summary=summary,
            results=results,
            suggestions=suggestions,
            executed_query=parsed_query["query"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing demo query: {str(e)}")

@router.get("/schema/{connection_id}")
def get_schema(connection_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get schema for a connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        connector = get_connector(connection.type)
        connector.connect(connection.details)
        schema = connector.get_schema()
        connector.close()
        return schema
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting schema: {str(e)}")

