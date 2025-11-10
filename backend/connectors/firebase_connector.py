import pandas as pd
from typing import Dict, List, Any
from .base import BaseConnector

try:
    from google.cloud import firestore
    from google.oauth2 import service_account
    import json
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

class FirebaseConnector(BaseConnector):
    """Connector for Firebase Firestore"""
    
    def __init__(self):
        self.db = None
        self.collections = []
    
    def connect(self, connection_details: dict) -> bool:
        """Connect to Firebase Firestore"""
        if not FIREBASE_AVAILABLE:
            raise ValueError(
                "Firebase libraries not installed. "
                "Install with: pip install google-cloud-firestore google-auth"
            )
        
        # Firebase connection details
        service_account_key = connection_details.get("service_account_key")
        project_id = connection_details.get("project_id")
        database_id = connection_details.get("database_id", "(default)")
        
        try:
            # If service_account_key is a JSON string, parse it
            if isinstance(service_account_key, str):
                try:
                    credentials_dict = json.loads(service_account_key)
                except json.JSONDecodeError:
                    # If it's a file path, read it
                    with open(service_account_key, 'r') as f:
                        credentials_dict = json.load(f)
            else:
                credentials_dict = service_account_key
            
            # Create credentials from service account key
            credentials = service_account.Credentials.from_service_account_info(
                credentials_dict
            )
            
            # Initialize Firestore client
            self.db = firestore.Client(
                project=project_id,
                credentials=credentials,
                database=database_id
            )
            
            # Test connection by listing collections
            collections = self.db.collections()
            self.collections = [col.id for col in collections]
            
            return True
        except Exception as e:
            raise ValueError(f"Error connecting to Firebase: {str(e)}")
    
    def execute_query(self, query: str) -> pd.DataFrame:
        """Execute query on Firebase Firestore"""
        if self.db is None:
            raise ValueError("Not connected to Firebase")
        
        # For now, we'll support simple queries
        # In a full implementation, you'd parse the query to Firestore queries
        # For simplicity, we'll return all documents from the first collection
        try:
            # Parse query to extract collection name and filters
            # This is a simplified version - you'd need a proper query parser
            collection_name = self._extract_collection_from_query(query)
            
            if not collection_name:
                # Use first collection as default
                collection_name = self.collections[0] if self.collections else None
            
            if not collection_name:
                raise ValueError("No collections available in Firebase database")
            
            # Get all documents from collection
            collection_ref = self.db.collection(collection_name)
            docs = collection_ref.stream()
            
            # Convert documents to list of dicts
            data = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['_id'] = doc.id  # Add document ID
                data.append(doc_data)
            
            if not data:
                return pd.DataFrame()
            
            # Convert to DataFrame
            df = pd.DataFrame(data)
            return df
        except Exception as e:
            raise ValueError(f"Error executing query on Firebase: {str(e)}")
    
    def _extract_collection_from_query(self, query: str) -> str:
        """Extract collection name from query (simplified parser)"""
        query_lower = query.lower()
        
        # Look for FROM clause
        if 'from' in query_lower:
            parts = query_lower.split('from')
            if len(parts) > 1:
                collection = parts[1].strip().split()[0].strip(';')
                return collection
        
        # Look for collection name in query
        for collection in self.collections:
            if collection.lower() in query_lower:
                return collection
        
        return None
    
    def get_schema(self) -> Dict[str, List[str]]:
        """Get schema information from Firebase collections"""
        if self.db is None:
            return {}
        
        schema = {}
        
        try:
            # Get schema from each collection
            for collection_name in self.collections:
                collection_ref = self.db.collection(collection_name)
                
                # Get a sample document to infer schema
                docs = collection_ref.limit(1).stream()
                columns = set()
                
                for doc in docs:
                    doc_data = doc.to_dict()
                    # Get all top-level keys as columns
                    columns.update(doc_data.keys())
                    columns.add('_id')  # Add document ID
                    break  # Only need one document to infer schema
                
                if columns:
                    schema[collection_name] = list(columns)
                else:
                    schema[collection_name] = []
        except Exception as e:
            print(f"Error getting schema from Firebase: {str(e)}")
        
        return schema
    
    def close(self):
        """Close Firebase connection"""
        # Firestore client doesn't need explicit closing
        self.db = None
        self.collections = []

