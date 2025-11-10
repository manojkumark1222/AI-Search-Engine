"""
Team collaboration router for Business plan users
Allows Business users to invite team members and collaborate
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import User, TeamMember
from routers.auth import get_current_user
from plan_limits import can_access_feature, get_plan_limits
import secrets
import string

router = APIRouter()

class TeamMemberCreate(BaseModel):
    member_email: EmailStr
    role: str = "member"  # owner, admin, member

class TeamMemberResponse(BaseModel):
    id: int
    member_email: str
    role: str
    invited_at: datetime
    joined_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

@router.get("/members", response_model=List[TeamMemberResponse])
def get_team_members(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all team members for the current user's team"""
    # Check if user has team collaboration access
    can_access, message = can_access_feature(current_user, "team_collaboration")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Get team members where user is the owner
    team_members = db.query(TeamMember).filter(TeamMember.user_id == current_user.id).all()
    return team_members

@router.post("/invite", response_model=TeamMemberResponse)
def invite_team_member(team_member: TeamMemberCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Invite a new team member"""
    # Check if user has team collaboration access
    can_access, message = can_access_feature(current_user, "team_collaboration")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Check team size limit
    limits = get_plan_limits(current_user.plan)
    current_team_size = db.query(TeamMember).filter(TeamMember.user_id == current_user.id).count()
    max_members = limits.get("max_team_members", 5)
    
    if current_team_size >= max_members:
        raise HTTPException(
            status_code=403,
            detail=f"Team size limit reached. Business plan allows {max_members} team members."
        )
    
    # Check if member is already invited
    existing = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id,
        TeamMember.member_email == team_member.member_email
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Team member already invited")
    
    # Check if trying to invite themselves
    if team_member.member_email == current_user.email:
        raise HTTPException(status_code=400, detail="Cannot invite yourself to the team")
    
    # Create team member invitation
    db_team_member = TeamMember(
        user_id=current_user.id,
        member_email=team_member.member_email,
        role=team_member.role
    )
    db.add(db_team_member)
    db.commit()
    db.refresh(db_team_member)
    
    # TODO: Send invitation email
    # In production, you would send an email with an invitation link
    
    return db_team_member

@router.delete("/members/{member_id}")
def remove_team_member(member_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Remove a team member"""
    # Check if user has team collaboration access
    can_access, message = can_access_feature(current_user, "team_collaboration")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    # Get team member
    team_member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    db.delete(team_member)
    db.commit()
    
    return {"message": "Team member removed successfully"}

@router.put("/members/{member_id}/role")
def update_team_member_role(
    member_id: int,
    role: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a team member's role"""
    # Check if user has team collaboration access
    can_access, message = can_access_feature(current_user, "team_collaboration")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    if role not in ["owner", "admin", "member"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'owner', 'admin', or 'member'")
    
    # Get team member
    team_member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    team_member.role = role
    db.commit()
    db.refresh(team_member)
    
    return team_member

