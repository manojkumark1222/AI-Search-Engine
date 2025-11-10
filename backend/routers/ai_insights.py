"""
AI Insights router
Provides AI-powered insights and analysis for Pro and Business users
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from database import get_db
from models import User
from routers.auth import get_current_user
from plan_limits import can_access_feature
import pandas as pd
from datetime import datetime

router = APIRouter()

class InsightRequest(BaseModel):
    data: List[Dict[str, Any]]
    query_text: Optional[str] = None

class InsightResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    statistics: Dict[str, Any]
    trends: List[Dict[str, Any]]

@router.post("/analyze", response_model=InsightResponse)
def analyze_data(insight_request: InsightRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generate AI-powered insights from query results"""
    # Check if user has access to AI insights
    can_access, message = can_access_feature(current_user, "ai_insights")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    try:
        df = pd.DataFrame(insight_request.data)
        
        if df.empty:
            return {
                "insights": ["No data available for analysis"],
                "recommendations": [],
                "statistics": {},
                "trends": []
            }
        
        # Generate basic statistics
        statistics = {}
        insights = []
        recommendations = []
        trends = []
        
        # Numerical columns analysis
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            for col in numeric_cols:
                stats = {
                    "mean": float(df[col].mean()),
                    "median": float(df[col].median()),
                    "min": float(df[col].min()),
                    "max": float(df[col].max()),
                    "std": float(df[col].std())
                }
                statistics[col] = stats
                
                # Generate insights
                if df[col].std() > df[col].mean() * 0.5:
                    insights.append(f"High variance detected in {col}: Consider investigating outliers")
                
                if df[col].max() > df[col].mean() * 2:
                    insights.append(f"Potential outliers in {col}: Maximum value is significantly higher than mean")
        
        # Categorical columns analysis
        categorical_cols = df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            for col in categorical_cols:
                value_counts = df[col].value_counts()
                if len(value_counts) > 0:
                    top_value = value_counts.index[0]
                    top_count = int(value_counts.iloc[0])
                    total = len(df)
                    percentage = (top_count / total) * 100
                    
                    insights.append(f"Most common value in {col}: {top_value} ({percentage:.1f}%)")
                    
                    if percentage > 50:
                        recommendations.append(f"Consider analyzing {col} distribution: {top_value} dominates with {percentage:.1f}%")
        
        # Row count insights
        row_count = len(df)
        if row_count < 10:
            insights.append("Small dataset: Results may not be statistically significant")
            recommendations.append("Consider expanding your query to include more data points")
        elif row_count > 1000:
            insights.append(f"Large dataset: {row_count} rows analyzed")
            recommendations.append("Consider using sampling or aggregation for better performance")
        
        # Missing values
        missing_values = df.isnull().sum()
        if missing_values.sum() > 0:
            insights.append(f"Missing values detected in {missing_values[missing_values > 0].to_dict()}")
            recommendations.append("Consider data cleaning to handle missing values")
        
        # Generate recommendations based on query
        if insight_request.query_text:
            query_lower = insight_request.query_text.lower()
            if "average" in query_lower or "mean" in query_lower:
                recommendations.append("Consider visualizing the distribution to better understand the data spread")
            if "count" in query_lower:
                recommendations.append("Consider adding time-based grouping to identify trends")
            if "top" in query_lower:
                recommendations.append("Consider analyzing the bottom values as well for complete insights")
        
        # Generate trends (placeholder - can be enhanced with time-series analysis)
        if len(numeric_cols) > 0 and len(df) > 1:
            trends.append({
                "type": "data_summary",
                "message": f"Analyzed {row_count} rows with {len(df.columns)} columns",
                "timestamp": datetime.utcnow().isoformat()
            })
        
        return {
            "insights": insights if insights else ["No significant insights found"],
            "recommendations": recommendations if recommendations else ["Data looks good!"],
            "statistics": statistics,
            "trends": trends
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@router.post("/summary")
def get_data_summary(insight_request: InsightRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get AI-powered summary of the data"""
    # Check if user has access to AI insights
    can_access, message = can_access_feature(current_user, "ai_insights")
    if not can_access:
        raise HTTPException(status_code=403, detail=message)
    
    try:
        df = pd.DataFrame(insight_request.data)
        
        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "column_names": list(df.columns),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "memory_usage": f"{df.memory_usage(deep=True).sum() / 1024:.2f} KB"
        }
        
        # Add numerical summary
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            summary["numerical_summary"] = df[numeric_cols].describe().to_dict()
        
        # Add categorical summary
        categorical_cols = df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            summary["categorical_summary"] = {
                col: {
                    "unique_values": int(df[col].nunique()),
                    "most_common": df[col].mode().iloc[0] if len(df[col].mode()) > 0 else None
                }
                for col in categorical_cols
            }
        
        return summary
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

