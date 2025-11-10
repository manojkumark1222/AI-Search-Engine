"""
Plan limits and feature flags for different subscription tiers
"""
from datetime import datetime, timedelta
from typing import Dict, Any
from models import User

# Plan limits configuration
PLAN_LIMITS = {
    "free": {
        "max_connections": 1,
        "max_queries_per_month": 50,
        "query_history_days": 7,
        "max_file_size_mb": 5,
        "export_enabled": False,
        "ai_insights_enabled": False,
        "custom_visualizations": False,
        "team_collaboration": False,
        "api_access": False,
        "scheduled_reports": False,
        "custom_dashboards": False,
        "priority_support": False,
        "white_label": False
    },
    "pro": {
        "max_connections": 10,
        "max_queries_per_month": -1,  # -1 means unlimited
        "query_history_days": 90,
        "max_file_size_mb": 50,
        "export_enabled": True,
        "ai_insights_enabled": True,
        "custom_visualizations": True,
        "team_collaboration": False,
        "api_access": False,
        "scheduled_reports": False,
        "custom_dashboards": False,
        "priority_support": False,
        "white_label": False
    },
    "business": {
        "max_connections": -1,  # -1 means unlimited
        "max_queries_per_month": -1,  # -1 means unlimited
        "query_history_days": -1,  # -1 means unlimited
        "max_file_size_mb": -1,  # -1 means unlimited
        "export_enabled": True,
        "ai_insights_enabled": True,
        "custom_visualizations": True,
        "team_collaboration": True,
        "max_team_members": 5,
        "api_access": True,
        "scheduled_reports": True,
        "custom_dashboards": True,
        "priority_support": True,
        "white_label": True
    }
}

def get_user_plan(user: User) -> str:
    """Get user's plan, defaulting to 'free' if not set"""
    return user.plan if user.plan else "free"

def get_plan_limits(plan: str) -> Dict[str, Any]:
    """Get limits for a specific plan"""
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])

def can_add_connection(user: User, current_connections_count: int) -> tuple[bool, str]:
    """Check if user can add a new connection"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    max_connections = limits["max_connections"]
    
    if max_connections == -1:
        return True, "OK"
    
    if current_connections_count >= max_connections:
        return False, f"Plan limit reached. {plan.capitalize()} plan allows {max_connections} connection(s). Upgrade to add more."
    
    return True, "OK"

def can_execute_query(user: User, queries_this_month: int) -> tuple[bool, str]:
    """Check if user can execute a query"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    max_queries = limits["max_queries_per_month"]
    
    if max_queries == -1:
        return True, "OK"
    
    if queries_this_month >= max_queries:
        return False, f"Monthly query limit reached. {plan.capitalize()} plan allows {max_queries} queries per month. Upgrade for unlimited queries."
    
    return True, "OK"

def can_access_feature(user: User, feature: str) -> tuple[bool, str]:
    """Check if user can access a specific feature"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    
    feature_key = f"{feature}_enabled"
    if feature_key not in limits:
        return False, f"Feature '{feature}' not found"
    
    if limits[feature_key]:
        return True, "OK"
    
    return False, f"'{feature}' is only available for Pro and Business plans. Upgrade to access this feature."

def get_query_history_days(user: User) -> int:
    """Get query history retention days for user's plan"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    return limits["query_history_days"]

def get_max_file_size_mb(user: User) -> int:
    """Get maximum file size in MB for user's plan"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    return limits["max_file_size_mb"]

def check_file_size(file_size_bytes: int, user: User) -> tuple[bool, str]:
    """Check if file size is within plan limits"""
    plan = get_user_plan(user)
    limits = get_plan_limits(plan)
    max_size_mb = limits["max_file_size_mb"]
    
    if max_size_mb == -1:
        return True, "OK"
    
    file_size_mb = file_size_bytes / (1024 * 1024)
    if file_size_mb > max_size_mb:
        return False, f"File size ({file_size_mb:.2f}MB) exceeds plan limit ({max_size_mb}MB). Upgrade to upload larger files."
    
    return True, "OK"

def is_subscription_active(user: User) -> bool:
    """Check if user's subscription is active (for paid plans)"""
    if user.plan == "free":
        return True  # Free plan is always active
    
    if user.subscription_expires_at is None:
        return False  # Paid plan without expiry date is invalid
    
    return datetime.utcnow() < user.subscription_expires_at

def get_plan_features(plan: str) -> Dict[str, Any]:
    """Get all features for a plan"""
    return get_plan_limits(plan)

