import pandas as pd
import os
from typing import Dict, List
from .base import BaseConnector

class ExcelConnector(BaseConnector):
    def __init__(self):
        self.df = None
        self.file_path = None
        self.sheet_name = None
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to Excel file"""
        self.file_path = connection_details.get("file_path")
        self.sheet_name = connection_details.get("sheet_name", 0)  # Default to first sheet
        
        if not self.file_path or not os.path.exists(self.file_path):
            raise ValueError(f"Excel file not found: {self.file_path}")
        
        try:
            self.df = pd.read_excel(self.file_path, sheet_name=self.sheet_name)
            return True
        except Exception as e:
            raise ValueError(f"Error reading Excel file: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute pandas query on Excel data"""
        if self.df is None:
            raise ValueError("Not connected to Excel file")
        
        try:
            local_vars = {"df": self.df.copy(), "pd": pd}
            exec(f"result = {query}", {"pd": pd}, local_vars)
            result = local_vars.get("result")
            
            if isinstance(result, pd.DataFrame):
                return result
            elif isinstance(result, pd.Series):
                return result.to_frame()
            else:
                return pd.DataFrame({"result": [result]})
        except Exception as e:
            raise ValueError(f"Error executing query: {str(e)}")
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get Excel columns"""
        if self.df is None:
            return {}
        return {
            "columns": list(self.df.columns),
            "dtypes": {col: str(dtype) for col, dtype in self.df.dtypes.items()}
        }
    
    def close(self):
        """Close Excel connection"""
        self.df = None
        self.file_path = None

