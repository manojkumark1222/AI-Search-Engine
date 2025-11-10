import pandas as pd
import os
from typing import Dict, List
from .base import BaseConnector

class CSVConnector(BaseConnector):
    def __init__(self):
        self.df = None
        self.file_path = None
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to CSV file"""
        self.file_path = connection_details.get("file_path")
        if not self.file_path or not os.path.exists(self.file_path):
            raise ValueError(f"CSV file not found: {self.file_path}")
        
        try:
            self.df = pd.read_csv(self.file_path)
            return True
        except Exception as e:
            raise ValueError(f"Error reading CSV file: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute pandas query on CSV data"""
        if self.df is None:
            raise ValueError("Not connected to CSV file")
        
        try:
            # Use eval to execute pandas operations (in a real app, use a safer method)
            # For now, we'll use exec with a controlled environment
            local_vars = {"df": self.df.copy(), "pd": pd}
            exec(f"result = {query}", {"pd": pd}, local_vars)
            result = local_vars.get("result")
            
            if isinstance(result, pd.DataFrame):
                return result
            elif isinstance(result, pd.Series):
                return result.to_frame()
            else:
                # If result is a scalar, convert to DataFrame
                return pd.DataFrame({"result": [result]})
        except Exception as e:
            raise ValueError(f"Error executing query: {str(e)}")
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get CSV columns"""
        if self.df is None:
            return {}
        return {
            "columns": list(self.df.columns),
            "dtypes": {col: str(dtype) for col, dtype in self.df.dtypes.items()}
        }
    
    def close(self):
        """Close CSV connection"""
        self.df = None
        self.file_path = None

