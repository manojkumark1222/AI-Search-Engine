from abc import ABC, abstractmethod
import pandas as pd
from typing import List, Dict, Any

class BaseConnector(ABC):
    """Base class for all database connectors"""
    
    @abstractmethod
    def connect(self, connection_details: dict) -> bool:
        """Establish connection to the data source"""
        pass
    
    @abstractmethod
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute a query and return results as DataFrame"""
        pass
    
    @abstractmethod
    def get_schema(self) -> Dict[str, List[str]]:
        """Get schema information (tables/collections and columns)"""
        pass
    
    @abstractmethod
    def close(self):
        """Close the connection"""
        pass

