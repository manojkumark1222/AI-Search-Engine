from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import Connection, User, QueryHistory
from routers.auth import get_current_user
from connectors.factory import get_connector
from plan_limits import can_add_connection, check_file_size
import os

router = APIRouter()

# Pydantic models
class ConnectionCreate(BaseModel):
    name: str
    type: str  # csv, excel, postgres, mysql, mongodb
    details: dict

class ConnectionUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    details: Optional[dict] = None
    status: Optional[str] = None

class ConnectionResponse(BaseModel):
    id: int
    name: str
    type: str
    details: dict
    status: Optional[str] = "active"
    last_used: Optional[datetime] = None
    last_tested: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConnectionListResponse(BaseModel):
    connections: List[str]

@router.get("/", response_model=ConnectionListResponse)
def get_connections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all connections for the current user"""
    connections = db.query(Connection).filter(Connection.user_id == current_user.id).all()
    # Return just the names for compatibility with frontend
    connection_names = [conn.name for conn in connections]
    return {"connections": connection_names}

@router.get("/all", response_model=List[ConnectionResponse])
def get_all_connections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all connections with full details"""
    connections = db.query(Connection).filter(Connection.user_id == current_user.id).all()
    return connections

@router.post("/add", response_model=ConnectionResponse)
@router.post("/", response_model=ConnectionResponse)
def add_connection(connection: ConnectionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add a new connection"""
    # Check if connection name already exists for this user
    existing = db.query(Connection).filter(
        Connection.user_id == current_user.id,
        Connection.name == connection.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection with this name already exists")
    
    # Check plan limits for connections
    current_connections_count = db.query(Connection).filter(Connection.user_id == current_user.id).count()
    can_add, message = can_add_connection(current_user, current_connections_count)
    if not can_add:
        raise HTTPException(status_code=403, detail=message)
    
    # Check file size limits for CSV/Excel files
    if connection.type in ['csv', 'excel'] and 'file_path' in connection.details:
        file_path = connection.details.get('file_path')
        if file_path and os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            can_upload, size_message = check_file_size(file_size, current_user)
            if not can_upload:
                raise HTTPException(status_code=403, detail=size_message)
    
    db_connection = Connection(
        name=connection.name,
        type=connection.type,
        details=connection.details,
        user_id=current_user.id
    )
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection

@router.get("/{connection_id}", response_model=ConnectionResponse)
def get_connection(connection_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    return connection

@router.put("/{connection_id}", response_model=ConnectionResponse)
def update_connection(
    connection_id: int, 
    connection_update: ConnectionUpdate,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Update a connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    # Update fields if provided
    if connection_update.name is not None:
        # Check if new name conflicts with existing connection
        existing = db.query(Connection).filter(
            Connection.user_id == current_user.id,
            Connection.name == connection_update.name,
            Connection.id != connection_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Connection with this name already exists")
        connection.name = connection_update.name
    
    if connection_update.type is not None:
        connection.type = connection_update.type
    
    if connection_update.details is not None:
        connection.details = connection_update.details
    
    if connection_update.status is not None:
        connection.status = connection_update.status
    
    db.commit()
    db.refresh(connection)
    return connection

@router.post("/{connection_id}/test")
def test_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Test a connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    try:
        connector = get_connector(connection.type)
        connection_details = connection.details.copy()
        
        # For SQL connectors, add type to details
        if connection.type in ['postgres', 'mysql']:
            connection_details['type'] = connection.type
        
        # Test connection
        connector.connect(connection_details)
        
        # Update last_tested timestamp
        connection.last_tested = datetime.utcnow()
        connection.status = "active"
        db.commit()
        
        return {
            "success": True,
            "message": "Connection test successful",
            "status": "active"
        }
    except Exception as e:
        # Update status to error
        connection.status = "error"
        connection.last_tested = datetime.utcnow()
        db.commit()
        
        return {
            "success": False,
            "message": f"Connection test failed: {str(e)}",
            "status": "error"
        }

@router.post("/{connection_id}/disconnect")
def disconnect_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect a connection (set status to inactive)"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    connection.status = "inactive"
    db.commit()
    
    return {"message": "Connection disconnected successfully", "status": "inactive"}

@router.post("/{connection_id}/connect")
def connect_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect a connection (set status to active and test)"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    # Test connection first
    try:
        connector = get_connector(connection.type)
        connection_details = connection.details.copy()
        
        # For SQL connectors, add type to details
        if connection.type in ['postgres', 'mysql']:
            connection_details['type'] = connection.type
        
        # Test connection
        connector.connect(connection_details)
        
        # Update status and last_tested timestamp
        connection.last_tested = datetime.utcnow()
        connection.status = "active"
        db.commit()
        
        return {"message": "Connection activated successfully", "status": "active"}
    except Exception as e:
        # Update status to error
        connection.status = "error"
        connection.last_tested = datetime.utcnow()
        db.commit()
        raise HTTPException(status_code=400, detail=f"Connection test failed: {str(e)}")

@router.delete("/{connection_id}")
def delete_connection(connection_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    # Delete related query history
    db.query(QueryHistory).filter(QueryHistory.source_id == connection_id).delete()
    
    db.delete(connection)
    db.commit()
    return {"message": "Connection deleted successfully"}

@router.get("/stats/usage")
def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics for the current user"""
    # Total connections
    total_connections = db.query(Connection).filter(Connection.user_id == current_user.id).count()
    active_connections = db.query(Connection).filter(
        Connection.user_id == current_user.id,
        Connection.status == "active"
    ).count()
    
    # Total queries
    total_queries = db.query(QueryHistory).filter(QueryHistory.user_id == current_user.id).count()
    
    # Queries today
    today = datetime.utcnow().date()
    queries_today = db.query(QueryHistory).filter(
        QueryHistory.user_id == current_user.id,
        func.date(QueryHistory.created_at) == today
    ).count()
    
    # Queries this month
    month_start = datetime.utcnow().replace(day=1).date()
    queries_this_month = db.query(QueryHistory).filter(
        QueryHistory.user_id == current_user.id,
        func.date(QueryHistory.created_at) >= month_start
    ).count()
    
    return {
        "total_connections": total_connections,
        "active_connections": active_connections,
        "total_queries": total_queries,
        "queries_today": queries_today,
        "queries_this_month": queries_this_month
    }

