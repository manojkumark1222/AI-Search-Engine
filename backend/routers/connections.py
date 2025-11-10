from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import Connection, User
from routers.auth import get_current_user

router = APIRouter()

# Pydantic models
class ConnectionCreate(BaseModel):
    name: str
    type: str  # csv, excel, postgres, mysql, mongodb
    details: dict

class ConnectionResponse(BaseModel):
    id: int
    name: str
    type: str
    details: dict
    
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
def add_connection(connection: ConnectionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Add a new connection"""
    # Check if connection name already exists for this user
    existing = db.query(Connection).filter(
        Connection.user_id == current_user.id,
        Connection.name == connection.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection with this name already exists")
    
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

@router.delete("/{connection_id}")
def delete_connection(connection_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a connection"""
    connection = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.user_id == current_user.id
    ).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(connection)
    db.commit()
    return {"message": "Connection deleted successfully"}

