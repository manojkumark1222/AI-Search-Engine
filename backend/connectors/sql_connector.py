import pandas as pd
from sqlalchemy import create_engine, text
from typing import Dict, List
from .base import BaseConnector

class SQLConnector(BaseConnector):
    def __init__(self):
        self.engine = None
        self.connection_string = None
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to SQL database"""
        db_type = connection_details.get("type", "postgres")
        host = connection_details.get("host")
        port = connection_details.get("port", 5432 if db_type == "postgres" else 3306)
        database = connection_details.get("database")
        username = connection_details.get("username")
        password = connection_details.get("password")
        
        if db_type == "postgres":
            self.connection_string = f"postgresql://{username}:{password}@{host}:{port}/{database}"
        elif db_type == "mysql":
            self.connection_string = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
        else:
            raise ValueError(f"Unsupported database type: {db_type}")
        
        try:
            self.engine = create_engine(self.connection_string)
            # Test connection
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception as e:
            raise ValueError(f"Error connecting to database: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute SQL query"""
        if self.engine is None:
            raise ValueError("Not connected to database")
        
        try:
            df = pd.read_sql(query, self.engine)
            return df
        except Exception as e:
            raise ValueError(f"Error executing SQL query: {str(e)}")
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get database schema"""
        if self.engine is None:
            return {}
        
        try:
            # Get tables
            query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            """
            tables_df = pd.read_sql(query, self.engine)
            tables = tables_df["table_name"].tolist()
            
            schema = {}
            for table in tables:
                # Get columns for each table
                cols_query = f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '{table}'
                """
                cols_df = pd.read_sql(cols_query, self.engine)
                schema[table] = cols_df["column_name"].tolist()
            
            return schema
        except Exception as e:
            # Fallback for MySQL or other databases
            return {}
    
    def close(self):
        """Close database connection"""
        if self.engine:
            self.engine.dispose()
        self.engine = None

