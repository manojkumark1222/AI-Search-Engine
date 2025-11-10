"""
NLP Enhancement Router
Provides advanced NLP features like query suggestions, query completion, and intelligent parsing
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from database import get_db
from models import User, QueryHistory
from routers.auth import get_current_user
from nlp.advanced_query_engine import AdvancedQueryEngine
from datetime import datetime, timedelta

router = APIRouter()
advanced_engine = AdvancedQueryEngine()

class QuerySuggestionRequest(BaseModel):
    partial_query: str
    context: Optional[Dict[str, Any]] = None

class QueryCompletionResponse(BaseModel):
    suggestions: List[str]
    enhanced_query: Optional[str] = None

class QueryAnalysisRequest(BaseModel):
    query_text: str

class QueryAnalysisResponse(BaseModel):
    intent: str
    operation: str
    confidence: float
    suggested_improvements: List[str]
    estimated_complexity: str

@router.post("/suggest", response_model=QueryCompletionResponse)
def get_query_suggestions(
    request: QuerySuggestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get query completion suggestions based on partial query"""
    try:
        partial = request.partial_query.lower()
        suggestions = []
        
        # Generate suggestions based on common patterns
        if not partial or len(partial) < 2:
            suggestions = [
                "Show top 10",
                "What is the average",
                "Count total",
                "Display all",
                "Find records where"
            ]
        elif "top" in partial or "highest" in partial:
            suggestions = [
                "Show top 10 by revenue",
                "Display top 20 customers",
                "Find highest values"
            ]
        elif "average" in partial or "mean" in partial:
            suggestions = [
                "What is the average sales",
                "Calculate mean revenue",
                "Show average by category"
            ]
        elif "count" in partial:
            suggestions = [
                "Count total records",
                "How many customers",
                "Count by category"
            ]
        elif "show" in partial or "display" in partial:
            suggestions = [
                "Show all records",
                "Display top 10",
                "Show summary statistics"
            ]
        else:
            # Generic suggestions
            suggestions = [
                f"{request.partial_query} top 10",
                f"{request.partial_query} average",
                f"{request.partial_query} count"
            ]
        
        # Enhance query if possible
        enhanced_query = None
        if request.context and "schema" in request.context:
            try:
                enhanced_query = advanced_engine.enhance_query(request.partial_query, request.context["schema"])
            except:
                pass
        
        return {
            "suggestions": suggestions[:5],
            "enhanced_query": enhanced_query
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating suggestions: {str(e)}")

@router.post("/analyze", response_model=QueryAnalysisResponse)
def analyze_query(
    request: QueryAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze a query to understand intent and provide improvements"""
    try:
        query_text = request.query_text
        query_lower = query_text.lower()
        
        # Detect intent
        intent = advanced_engine._detect_intent(query_lower)
        
        # Determine operation
        if advanced_engine._is_top_n_query(query_lower):
            operation = "top_n"
            complexity = "simple"
        elif advanced_engine._is_aggregate_query(query_lower):
            operation = "aggregate"
            complexity = "medium"
        elif advanced_engine._is_filter_query(query_lower):
            operation = "filter"
            complexity = "medium"
        elif advanced_engine._is_comparison_query(query_lower):
            operation = "comparison"
            complexity = "complex"
        else:
            operation = "select"
            complexity = "simple"
        
        # Calculate confidence (simplified)
        confidence = 0.8
        if len(query_text.split()) < 3:
            confidence = 0.5
        elif len(query_text.split()) > 10:
            confidence = 0.9
        
        # Generate improvement suggestions
        improvements = []
        if "top" in query_lower and not any(char.isdigit() for char in query_text):
            improvements.append("Consider specifying the number of results (e.g., 'top 10')")
        if "average" in query_lower and "by" not in query_lower:
            improvements.append("Consider grouping by a category for more insights")
        if not any(keyword in query_lower for keyword in ["show", "display", "find", "get"]):
            improvements.append("Starting with 'Show' or 'Display' can improve clarity")
        
        if not improvements:
            improvements.append("Query looks good! Consider adding filters for more specific results.")
        
        return {
            "intent": intent,
            "operation": operation,
            "confidence": confidence,
            "suggested_improvements": improvements,
            "estimated_complexity": complexity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing query: {str(e)}")

@router.get("/popular-queries")
def get_popular_queries(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get popular queries from history"""
    try:
        # Get popular queries from user's history
        popular_queries = db.query(
            QueryHistory.query_text,
            func.count(QueryHistory.id).label('count')
        ).filter(
            QueryHistory.user_id == current_user.id
        ).group_by(
            QueryHistory.query_text
        ).order_by(
            func.count(QueryHistory.id).desc()
        ).limit(limit).all()
        
        return {
            "queries": [
                {"query": q[0], "count": q[1]}
                for q in popular_queries
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching popular queries: {str(e)}")

@router.get("/query-templates")
def get_query_templates(
    current_user: User = Depends(get_current_user)
):
    """Get query templates for common use cases"""
    templates = [
        {
            "category": "Aggregation",
            "templates": [
                "What is the average {column}?",
                "Show total {column} by {category}",
                "Calculate the sum of {column}",
                "Find the maximum {column}"
            ]
        },
        {
            "category": "Filtering",
            "templates": [
                "Show records where {column} is greater than {value}",
                "Find {category} with {column} above {value}",
                "Display {category} that contain {value}"
            ]
        },
        {
            "category": "Top/Bottom",
            "templates": [
                "Show top {n} {category} by {column}",
                "Display bottom {n} records",
                "Find highest {n} {column}"
            ]
        },
        {
            "category": "Counting",
            "templates": [
                "How many {category} are there?",
                "Count total {category}",
                "Count {category} by {group}"
            ]
        },
        {
            "category": "Trends",
            "templates": [
                "Show {column} trend over time",
                "Display growth of {column}",
                "Find changes in {column}"
            ]
        }
    ]
    
    return {"templates": templates}

