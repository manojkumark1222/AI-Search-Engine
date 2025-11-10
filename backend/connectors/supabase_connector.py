import pandas as pd
from sqlalchemy import create_engine, text
from typing import Dict, List
from .base import BaseConnector

class SupabaseConnector(BaseConnector):
    """Connector for Supabase (PostgreSQL-based)"""
    
    def __init__(self):
        self.engine = None
        self.connection_string = None
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to Supabase database"""
        # Supabase connection details
        project_url = connection_details.get("project_url") or connection_details.get("host")
        db_password = connection_details.get("password")
        db_name = connection_details.get("database", "postgres")
        db_user = connection_details.get("username", "postgres")
        db_port = connection_details.get("port", 5432)
        
        # Supabase uses PostgreSQL, so we can use postgresql connection string
        # Extract host from project_url if needed
        if project_url and "supabase.co" in project_url:
            # Supabase URL format: https://xxxxx.supabase.co
            # Database host: db.xxxxx.supabase.co
            host = project_url.replace("https://", "").replace("http://", "")
            if not host.startswith("db."):
                host = f"db.{host}"
        else:
            host = connection_details.get("host", "db.supabase.co")
        
        # Construct connection string
        self.connection_string = f"postgresql://{db_user}:{db_password}@{host}:{db_port}/{db_name}"
        
        try:
            self.engine = create_engine(
                self.connection_string,
                connect_args={
                    "sslmode": "require"  # Supabase requires SSL
                }
            )
            # Test connection
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception as e:
            raise ValueError(f"Error connecting to Supabase: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute SQL query on Supabase"""
        if self.engine is None:
            raise ValueError("Not connected to Supabase database")
        
        try:
            df = pd.read_sql(query, self.engine)
            return df
        except Exception as e:
            raise ValueError(f"Error executing query on Supabase: {str(e)}")
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get database schema from Supabase"""
        if self.engine is None:
            return {}
        
        try:
            # Get tables from public schema (Supabase default)
            query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
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
                AND table_schema = 'public'
                ORDER BY ordinal_position
                """
                cols_df = pd.read_sql(cols_query, self.engine)
                schema[table] = cols_df["column_name"].tolist()
            
            return schema
        except Exception as e:
            print(f"Error getting schema: {str(e)}")
            return {}
    
    def close(self):
        """Close database connection"""
        if self.engine:
            self.engine.dispose()
        self.engine = None

