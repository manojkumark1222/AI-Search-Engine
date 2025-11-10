from .csv_connector import CSVConnector
from .excel_connector import ExcelConnector
from .sql_connector import SQLConnector
from .mongodb_connector import MongoDBConnector
from .base import BaseConnector

def get_connector(connection_type: str) -> BaseConnector:
    """Factory function to get appropriate connector based on type"""
    connectors = {
        "csv": CSVConnector,
        "excel": ExcelConnector,
        "postgres": SQLConnector,
        "mysql": SQLConnector,
        "mongodb": MongoDBConnector,
    }
    
    connector_class = connectors.get(connection_type.lower())
    if not connector_class:
        raise ValueError(f"Unsupported connection type: {connection_type}")
    
    return connector_class()

