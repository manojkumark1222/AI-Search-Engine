"""
API Keys router for Business plan users
Allows Business users to generate and manage API keys for programmatic access
"""
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import User, ApiKey
from routers.auth import get_current_user
from plan_limits import can_access_feature
import secrets
import string

router = APIRouter()
security = HTTPBearer()

class ApiKeyCreate(BaseModel):
    key_name: str

class ApiKeyResponse(BaseModel):
    id: int
    key_name: str
    api_key: str
    is_active: bool
    last_used: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

def generate_api_key() -> str:
    """Generate a secure API key"""
    alphabet = string.ascii_letters + string.digits
    key = ''.join(secrets.choice(alphabet) for _ in range(32))
    return f"aiinsight_{key}"

@router.get("/keys", response_model=List[ApiKeyResponse])
def get_api_keys(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all API keys for the current user"""
    # Check if user has API access
    can_access, message = can_access_feature(current_user, "api_access")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    api_keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()
    return api_keys

@router.post("/keys", response_model=ApiKeyResponse)
def create_api_key(api_key_create: ApiKeyCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new API key"""
    # Check if user has API access
    can_access, message = can_access_feature(current_user, "api_access")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Generate API key
    api_key = generate_api_key()
    
    # Create API key record
    db_api_key = ApiKey(
        user_id=current_user.id,
        key_name=api_key_create.key_name,
        api_key=api_key,
        is_active=1
    )
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    
    return db_api_key

@router.delete("/keys/{key_id}")
def delete_api_key(key_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete an API key"""
    # Check if user has API access
    can_access, message = can_access_feature(current_user, "api_access")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Get API key
    api_key = db.query(ApiKey).filter(
        ApiKey.id == key_id,
        ApiKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    db.delete(api_key)
    db.commit()
    
    return {"message": "API key deleted successfully"}

@router.post("/keys/{key_id}/toggle")
def toggle_api_key(key_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Toggle API key active status"""
    # Check if user has API access
    can_access, message = can_access_feature(current_user, "api_access")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Get API key
    api_key = db.query(ApiKey).filter(
        ApiKey.id == key_id,
        ApiKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Toggle status
    api_key.is_active = 0 if api_key.is_active == 1 else 1
    db.commit()
    db.refresh(api_key)
    
    return api_key

def get_user_from_api_key(api_key: str, db: Session) -> Optional[User]:
    """Get user from API key"""
    api_key_obj = db.query(ApiKey).filter(
        ApiKey.api_key == api_key,
        ApiKey.is_active == 1
    ).first()
    
    if not api_key_obj:
        return None
    
    # Update last_used timestamp
    api_key_obj.last_used = datetime.utcnow()
    db.commit()
    
    return db.query(User).filter(User.id == api_key_obj.user_id).first()

