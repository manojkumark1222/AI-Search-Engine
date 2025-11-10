import re
from typing import Dict, List, Optional
from config import settings

class QueryEngine:
    """NLP Query Engine to convert natural language to SQL/Pandas queries"""
    
    def __init__(self):
        self.keywords = {
            "top": ["top", "highest", "best", "maximum", "max"],
            "bottom": ["bottom", "lowest", "worst", "minimum", "min"],
            "average": ["average", "avg", "mean"],
            "sum": ["sum", "total", "add"],
            "count": ["count", "number", "how many"],
            "group": ["by", "group", "grouped", "per"],
            "order": ["sort", "order", "arrange"],
            "filter": ["where", "filter", "with", "having"],
        }
    
    def parse_query(self, query_text: str, schema: Dict[str, List[str]] = None) -> Dict:
        """
        Parse natural language query and return query information
        Returns: {
            "type": "pandas" or "sql",
            "query": "executable query string",
            "operation": "select", "aggregate", etc.
        }
        """
        query_lower = query_text.lower().strip()
        
        # Get schema information (columns available)
        columns = []
        if schema:
            if "columns" in schema:
                columns = schema["columns"]
            else:
                # Extract from nested schema
                for table, cols in schema.items():
                    columns.extend(cols)
        
        # Detect query type and generate query
        if self._is_top_n_query(query_lower):
            return self._parse_top_n(query_text, query_lower, columns)
        elif self._is_aggregate_query(query_lower):
            return self._parse_aggregate(query_text, query_lower, columns)
        elif self._is_count_query(query_lower):
            return self._parse_count(query_text, query_lower, columns)
        elif self._is_filter_query(query_lower):
            return self._parse_filter(query_text, query_lower, columns)
        else:
            # Default: return all data or simple selection
            return self._parse_simple(query_text, query_lower, columns)
    
    def _is_top_n_query(self, query: str) -> bool:
        """Check if query is asking for top N results"""
        top_patterns = [
            r"top\s+(\d+)",
            r"first\s+(\d+)",
            r"highest\s+(\d+)",
            r"best\s+(\d+)",
            r"maximum",
            r"max",
        ]
        return any(re.search(pattern, query) for pattern in top_patterns)
    
    def _is_aggregate_query(self, query: str) -> bool:
        """Check if query is asking for aggregation"""
        agg_keywords = ["average", "avg", "mean", "sum", "total", "maximum", "minimum"]
        return any(keyword in query for keyword in agg_keywords)
    
    def _is_count_query(self, query: str) -> bool:
        """Check if query is asking for count"""
        count_keywords = ["count", "number", "how many"]
        return any(keyword in query for keyword in count_keywords)
    
    def _is_filter_query(self, query: str) -> bool:
        """Check if query has filter conditions"""
        filter_keywords = ["where", "with", "having", "that", "which"]
        return any(keyword in query for keyword in filter_keywords)
    
    def _extract_column(self, query: str, columns: List[str]) -> Optional[str]:
        """Extract column name from query by matching with available columns"""
        query_lower = query.lower()
        for col in columns:
            if col.lower() in query_lower:
                return col
        return None
    
    def _extract_number(self, query: str) -> Optional[int]:
        """Extract number from query"""
        match = re.search(r'(\d+)', query)
        return int(match.group(1)) if match else None
    
    def _parse_top_n(self, query: str, query_lower: str, columns: List[str]) -> Dict:
        """Parse top N query"""
        n = self._extract_number(query_lower) or 10
        order_column = self._extract_column(query_lower, columns)
        
        if order_column:
            # Top N by specific column
            pandas_query = f"df.nlargest({n}, '{order_column}')"
        else:
            # Top N overall
            pandas_query = f"df.head({n})"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "top_n",
            "limit": n
        }
    
    def _parse_aggregate(self, query: str, query_lower: str, columns: List[str]) -> Dict:
        """Parse aggregate query"""
        agg_column = self._extract_column(query_lower, columns)
        
        if "average" in query_lower or "avg" in query_lower or "mean" in query_lower:
            if agg_column:
                pandas_query = f"df['{agg_column}'].mean()"
            else:
                pandas_query = "df.mean()"
            operation = "average"
        elif "sum" in query_lower or "total" in query_lower:
            if agg_column:
                pandas_query = f"df['{agg_column}'].sum()"
            else:
                pandas_query = "df.sum()"
            operation = "sum"
        elif "maximum" in query_lower or "max" in query_lower:
            if agg_column:
                pandas_query = f"df['{agg_column}'].max()"
            else:
                pandas_query = "df.max()"
            operation = "max"
        elif "minimum" in query_lower or "min" in query_lower:
            if agg_column:
                pandas_query = f"df['{agg_column}'].min()"
            else:
                pandas_query = "df.min()"
            operation = "min"
        else:
            # Default to mean
            pandas_query = "df.mean()"
            operation = "average"
        
        # Check for group by
        if "by" in query_lower or "group" in query_lower:
            group_column = self._extract_column(query_lower, columns)
            if group_column:
                if operation == "average":
                    pandas_query = f"df.groupby('{group_column}').mean()"
                elif operation == "sum":
                    pandas_query = f"df.groupby('{group_column}').sum()"
                elif operation == "max":
                    pandas_query = f"df.groupby('{group_column}').max()"
                elif operation == "min":
                    pandas_query = f"df.groupby('{group_column}').min()"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": operation
        }
    
    def _parse_count(self, query: str, query_lower: str, columns: List[str]) -> Dict:
        """Parse count query"""
        pandas_query = "len(df)"
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "count"
        }
    
    def _parse_filter(self, query: str, query_lower: str, columns: List[str]) -> Dict:
        """Parse filter query"""
        # Simple filter - in production, use more sophisticated NLP
        pandas_query = "df"
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "filter"
        }
    
    def _parse_simple(self, query: str, query_lower: str, columns: List[str]) -> Dict:
        """Parse simple selection query"""
        pandas_query = "df.head(100)"  # Default limit
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "select"
        }
    
    def generate_suggestions(self, query_text: str, results: List[Dict] = None) -> List[str]:
        """Generate follow-up suggestions based on query and results"""
        suggestions = [
            "Show as table",
            "Export to CSV",
            "Visualize as chart",
            "Get summary statistics"
        ]
        return suggestions[:3]  # Return top 3 suggestions

