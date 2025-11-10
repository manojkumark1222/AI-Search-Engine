"""
Export functionality router
Allows Pro and Business users to export query results to PDF/Excel
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from database import get_db
from models import User
from routers.auth import get_current_user
from plan_limits import can_access_feature
import pandas as pd
import io
from datetime import datetime
import os

router = APIRouter()

class ExportRequest(BaseModel):
    data: List[Dict[str, Any]]
    format: str  # "pdf" or "excel"
    filename: Optional[str] = None

@router.post("/excel")
def export_to_excel(export_request: ExportRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Export query results to Excel format"""
    # Check if user has access to export feature
    can_export, message = can_access_feature(current_user, "export")
    if not can_export:
        raise HTTPException(status_code=403, detail=message)
    
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(export_request.data)
        
        # Create Excel file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Query Results')
        
        output.seek(0)
        
        # Generate filename
        filename = export_request.filename or f"query_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            io.BytesIO(output.read()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting to Excel: {str(e)}")

@router.post("/csv")
def export_to_csv(export_request: ExportRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Export query results to CSV format"""
    # Check if user has access to export feature
    can_export, message = can_access_feature(current_user, "export")
    if not can_export:
        raise HTTPException(status_code=403, detail=message)
    
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(export_request.data)
        
        # Create CSV file in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        
        # Generate filename
        filename = export_request.filename or f"query_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting to CSV: {str(e)}")

@router.post("/pdf")
def export_to_pdf(export_request: ExportRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Export query results to PDF format"""
    # Check if user has access to export feature
    can_export, message = can_access_feature(current_user, "export")
    if not can_export:
        raise HTTPException(status_code=403, detail=message)
    
    try:
        # For PDF export, we'll use a simple text-based approach
        # In production, you might want to use libraries like reportlab or weasyprint
        df = pd.DataFrame(export_request.data)
        
        # Create a simple text representation
        pdf_content = f"""
Query Results Export
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Total Rows: {len(df)}

{df.to_string()}
"""
        
        # Generate filename
        filename = export_request.filename or f"query_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        # For now, return as text file (PDF generation requires additional libraries)
        return StreamingResponse(
            io.BytesIO(pdf_content.encode('utf-8')),
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting to PDF: {str(e)}")

