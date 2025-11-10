"""
Subscription management router
Handles plan upgrades, downgrades, and plan information
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from database import get_db
from models import User
from routers.auth import get_current_user
from plan_limits import get_user_plan, get_plan_limits, get_plan_features

router = APIRouter()

class PlanInfo(BaseModel):
    plan: str
    features: dict
    limits: dict

class UpgradeRequest(BaseModel):
    plan: str  # pro or business
    trial_days: Optional[int] = 14  # For trial period

@router.get("/current", response_model=PlanInfo)
def get_current_plan(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's plan and features"""
    plan = get_user_plan(current_user)
    limits = get_plan_limits(plan)
    features = get_plan_features(plan)
    
    return {
        "plan": plan,
        "features": features,
        "limits": limits
    }

@router.post("/upgrade")
def upgrade_plan(upgrade_request: UpgradeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Upgrade user's plan (for demo/testing purposes)"""
    if upgrade_request.plan not in ["pro", "business"]:
        raise HTTPException(status_code=400, detail="Invalid plan. Must be 'pro' or 'business'")
    
    current_plan = get_user_plan(current_user)
    
    # Check if user is already on a higher plan
    plan_hierarchy = {"free": 0, "pro": 1, "business": 2}
    if plan_hierarchy.get(upgrade_request.plan, 0) <= plan_hierarchy.get(current_plan, 0):
        raise HTTPException(status_code=400, detail=f"User is already on {current_plan} plan or higher")
    
    # Update user plan
    current_user.plan = upgrade_request.plan
    
    # Set trial expiration date
    if upgrade_request.trial_days:
        current_user.subscription_expires_at = datetime.utcnow() + timedelta(days=upgrade_request.trial_days)
    else:
        # If no trial days, set to 1 year from now (for demo)
        current_user.subscription_expires_at = datetime.utcnow() + timedelta(days=365)
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": f"Successfully upgraded to {upgrade_request.plan} plan",
        "plan": upgrade_request.plan,
        "expires_at": current_user.subscription_expires_at.isoformat() if current_user.subscription_expires_at else None
    }

@router.post("/downgrade")
def downgrade_plan(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Downgrade user's plan to free"""
    current_user.plan = "free"
    current_user.subscription_expires_at = None
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Successfully downgraded to free plan",
        "plan": "free"
    }

@router.get("/plans")
def get_available_plans():
    """Get all available plans and their features"""
    from plan_limits import PLAN_LIMITS
    
    return {
        "plans": {
            "free": {
                "name": "Free",
                "price": "$0",
                "features": PLAN_LIMITS["free"]
            },
            "pro": {
                "name": "Pro",
                "price": "$19/month",
                "features": PLAN_LIMITS["pro"]
            },
            "business": {
                "name": "Business",
                "price": "$49/month",
                "features": PLAN_LIMITS["business"]
            }
        }
    }

