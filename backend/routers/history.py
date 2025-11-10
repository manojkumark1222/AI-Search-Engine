from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from database import get_db
from models import QueryHistory, User
from routers.auth import get_current_user
from plan_limits import get_query_history_days

router = APIRouter()

# Pydantic models
class QueryHistoryResponse(BaseModel):
    id: int
    query_text: str
    source_id: Optional[int]
    executed_query: Optional[str]
    result_count: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/log")
def log_query(
    query: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a query to history"""
    # Support query parameter
    text = query
    if not text:
        return {"message": "No query text provided"}
    
    try:
        history_entry = QueryHistory(
            user_id=current_user.id,
            query_text=text,
            source_id=None,  # Can be updated if source_id is provided
            executed_query=None,
            result_count=None
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        return {"message": "Query logged successfully", "id": history_entry.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error logging query: {str(e)}")

@router.get("/", response_model=List[QueryHistoryResponse])
def get_history(
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get query history for current user (respecting plan limits)"""
    # Get history retention days based on plan
    history_days = get_query_history_days(current_user)
    
    # Build query with date filter if plan has limit
    query = db.query(QueryHistory).filter(QueryHistory.user_id == current_user.id)
    
    if history_days > 0:  # -1 means unlimited
        cutoff_date = datetime.utcnow() - timedelta(days=history_days)
        query = query.filter(QueryHistory.created_at >= cutoff_date)
    
    history = query.order_by(QueryHistory.created_at.desc()).limit(limit).all()
    
    return history

@router.get("/{history_id}", response_model=QueryHistoryResponse)
def get_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific history item"""
    history_item = db.query(QueryHistory).filter(
        QueryHistory.id == history_id,
        QueryHistory.user_id == current_user.id
    ).first()
    
    if not history_item:
        raise HTTPException(status_code=404, detail="History item not found")
    
    return history_item

@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a history item"""
    history_item = db.query(QueryHistory).filter(
        QueryHistory.id == history_id,
        QueryHistory.user_id == current_user.id
    ).first()
    
    if not history_item:
        raise HTTPException(status_code=404, detail="History item not found")
    
    db.delete(history_item)
    db.commit()
    return {"message": "History item deleted successfully"}

