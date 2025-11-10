import pandas as pd
from pymongo import MongoClient
from typing import Dict, List
from .base import BaseConnector

class MongoDBConnector(BaseConnector):
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to MongoDB"""
        host = connection_details.get("host", "localhost")
        port = connection_details.get("port", 27017)
        database = connection_details.get("database")
        collection = connection_details.get("collection")
        username = connection_details.get("username")
        password = connection_details.get("password")
        
        try:
            if username and password:
                connection_string = f"mongodb://{username}:{password}@{host}:{port}/{database}"
            else:
                connection_string = f"mongodb://{host}:{port}/{database}"
            
            self.client = MongoClient(connection_string)
            self.db = self.client[database]
            
            if collection:
                self.collection = self.db[collection]
            
            # Test connection
            self.client.admin.command('ping')
            return True
        except Exception as e:
            raise ValueError(f"Error connecting to MongoDB: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute MongoDB query (for now, convert aggregation pipeline to pandas)"""
        if self.collection is None:
            raise ValueError("Collection not specified")
        
        try:
            # For simplicity, we'll use pandas operations on MongoDB data
            # In production, you'd use MongoDB aggregation pipelines
            cursor = self.collection.find({})
            df = pd.DataFrame(list(cursor))
            if "_id" in df.columns:
                df = df.drop("_id", axis=1)
            
            # Execute pandas query
            local_vars = {"df": df, "pd": pd}
            exec(f"result = {query}", {"pd": pd}, local_vars)
            result = local_vars.get("result")
            
            if isinstance(result, pd.DataFrame):
                return result
            elif isinstance(result, pd.Series):
                return result.to_frame()
            else:
                return pd.DataFrame({"result": [result]})
        except Exception as e:
            raise ValueError(f"Error executing MongoDB query: {str(e)}")
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get MongoDB collections and sample fields"""
        if self.db is None:
            return {}
        
        try:
            collections = self.db.list_collection_names()
            schema = {}
            for col_name in collections:
                # Get sample document to infer schema
                sample = self.db[col_name].find_one()
                if sample:
                    schema[col_name] = [k for k in sample.keys() if k != "_id"]
            return schema
        except Exception as e:
            return {}
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
        self.client = None
        self.db = None
        self.collection = None

