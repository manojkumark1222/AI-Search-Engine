"""
Advanced NLP Query Engine with enhanced AI capabilities
"""
import re
from typing import Dict, List, Optional, Tuple
import pandas as pd

class AdvancedQueryEngine:
    """Enhanced NLP Query Engine with better pattern matching and intent recognition"""
    
    def __init__(self):
        # Enhanced keyword mappings
        self.keywords = {
            "top": ["top", "highest", "best", "maximum", "max", "largest", "biggest"],
            "bottom": ["bottom", "lowest", "worst", "minimum", "min", "smallest"],
            "average": ["average", "avg", "mean", "typical"],
            "sum": ["sum", "total", "add", "aggregate", "combined"],
            "count": ["count", "number", "how many", "quantity", "total number"],
            "group": ["by", "group", "grouped", "per", "for each", "for every"],
            "order": ["sort", "order", "arrange", "rank", "organize"],
            "filter": ["where", "filter", "with", "having", "that", "which", "whose"],
            "compare": ["compare", "difference", "versus", "vs", "against"],
            "trend": ["trend", "over time", "over the", "growth", "change"],
            "pattern": ["pattern", "distribution", "spread"],
            "correlation": ["correlation", "relationship", "related", "connection"],
        }
        
        # Intent patterns
        self.intent_patterns = {
            "statistical_analysis": [
                r"statistics?",
                r"stats?",
                r"describe",
                r"summary",
                r"overview"
            ],
            "visualization": [
                r"visualize",
                r"chart",
                r"graph",
                r"plot",
                r"show.*graph",
                r"display.*chart"
            ],
            "comparison": [
                r"compare",
                r"difference",
                r"versus",
                r"vs",
                r"better",
                r"worse"
            ],
            "prediction": [
                r"predict",
                r"forecast",
                r"estimate",
                r"expected",
                r"future"
            ],
            "anomaly_detection": [
                r"anomaly",
                r"outlier",
                r"unusual",
                r"unexpected",
                r"exceptional"
            ]
        }
    
    def parse_query(self, query_text: str, schema: Dict[str, List[str]] = None) -> Dict:
        """
        Advanced query parsing with intent recognition and better understanding
        """
        query_lower = query_text.lower().strip()
        
        # Get columns from schema
        columns = self._extract_columns(schema)
        
        # Detect intent
        intent = self._detect_intent(query_lower)
        
        # Parse based on intent and query type
        if self._is_top_n_query(query_lower):
            return self._parse_top_n(query_text, query_lower, columns, intent)
        elif self._is_aggregate_query(query_lower):
            return self._parse_aggregate(query_text, query_lower, columns, intent)
        elif self._is_count_query(query_lower):
            return self._parse_count(query_text, query_lower, columns, intent)
        elif self._is_filter_query(query_lower):
            return self._parse_filter(query_text, query_lower, columns, intent)
        elif self._is_comparison_query(query_lower):
            return self._parse_comparison(query_text, query_lower, columns, intent)
        elif self._is_trend_query(query_lower):
            return self._parse_trend(query_text, query_lower, columns, intent)
        elif self._is_statistical_query(query_lower):
            return self._parse_statistical(query_text, query_lower, columns, intent)
        else:
            return self._parse_simple(query_text, query_lower, columns, intent)
    
    def _extract_columns(self, schema: Dict) -> List[str]:
        """Extract column names from schema"""
        columns = []
        if schema:
            if isinstance(schema, dict):
                if "columns" in schema:
                    columns = schema["columns"]
                else:
                    for table, cols in schema.items():
                        if isinstance(cols, list):
                            columns.extend(cols)
                        elif isinstance(cols, dict) and "columns" in cols:
                            columns.extend(cols["columns"])
        return columns
    
    def _detect_intent(self, query: str) -> str:
        """Detect user intent from query"""
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query):
                    return intent
        return "general"
    
    def _is_top_n_query(self, query: str) -> bool:
        """Check if query is asking for top N results"""
        top_patterns = [
            r"top\s+(\d+)",
            r"first\s+(\d+)",
            r"highest\s+(\d+)",
            r"best\s+(\d+)",
            r"maximum",
            r"max",
            r"largest\s+(\d+)",
            r"biggest\s+(\d+)"
        ]
        return any(re.search(pattern, query, re.IGNORECASE) for pattern in top_patterns)
    
    def _is_aggregate_query(self, query: str) -> bool:
        """Check if query is asking for aggregation"""
        agg_keywords = ["average", "avg", "mean", "sum", "total", "maximum", "minimum", "median"]
        return any(keyword in query for keyword in agg_keywords)
    
    def _is_count_query(self, query: str) -> bool:
        """Check if query is asking for count"""
        count_keywords = ["count", "number", "how many", "quantity"]
        return any(keyword in query for keyword in count_keywords)
    
    def _is_filter_query(self, query: str) -> bool:
        """Check if query has filter conditions"""
        filter_keywords = ["where", "with", "having", "that", "which", "whose", "above", "below", "greater", "less"]
        return any(keyword in query for keyword in filter_keywords)
    
    def _is_comparison_query(self, query: str) -> bool:
        """Check if query is asking for comparison"""
        return any(keyword in query for keyword in ["compare", "difference", "versus", "vs", "against"])
    
    def _is_trend_query(self, query: str) -> bool:
        """Check if query is asking for trends"""
        return any(keyword in query for keyword in ["trend", "over time", "growth", "change", "increase", "decrease"])
    
    def _is_statistical_query(self, query: str) -> bool:
        """Check if query is asking for statistical analysis"""
        return any(keyword in query for keyword in ["statistics", "stats", "describe", "summary", "overview"])
    
    def _extract_column(self, query: str, columns: List[str]) -> Optional[str]:
        """Extract column name from query with fuzzy matching"""
        query_lower = query.lower()
        
        # Direct match
        for col in columns:
            col_lower = col.lower()
            if col_lower in query_lower:
                return col
        
        # Fuzzy match - check for similar words
        query_words = set(query_lower.split())
        for col in columns:
            col_words = set(col.lower().replace('_', ' ').split())
            if query_words & col_words:  # Intersection
                return col
        
        return None
    
    def _extract_number(self, query: str) -> Optional[int]:
        """Extract number from query"""
        match = re.search(r'(\d+)', query)
        return int(match.group(1)) if match else None
    
    def _extract_filter_condition(self, query: str, columns: List[str]) -> Optional[Tuple[str, str, str]]:
        """Extract filter condition (column, operator, value)"""
        # Pattern: column operator value
        patterns = [
            (r"(\w+)\s+(above|greater than|>|more than)\s+(\d+)", ">"),
            (r"(\w+)\s+(below|less than|<|lower than)\s+(\d+)", "<"),
            (r"(\w+)\s+(equal to|equals|==|=)\s+(\w+)", "=="),
            (r"(\w+)\s+containing\s+(\w+)", "contains"),
            (r"with\s+(\w+)\s+(above|greater than|>)\s+(\d+)", ">"),
            (r"with\s+(\w+)\s+(below|less than|<)\s+(\d+)", "<"),
        ]
        
        for pattern, operator in patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                col_name = match.group(1)
                column = self._extract_column(col_name, columns)
                if column:
                    value = match.group(-1)  # Last group is the value
                    return (column, operator, value)
        
        return None
    
    def _parse_top_n(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse top N query with enhanced logic"""
        n = self._extract_number(query_lower) or 10
        order_column = self._extract_column(query_lower, columns)
        
        # Check for descending/ascending
        ascending = "lowest" in query_lower or "bottom" in query_lower or "smallest" in query_lower
        
        if order_column:
            if ascending:
                pandas_query = f"df.nsmallest({n}, '{order_column}')"
            else:
                pandas_query = f"df.nlargest({n}, '{order_column}')"
        else:
            pandas_query = f"df.head({n})"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "top_n",
            "limit": n,
            "intent": intent,
            "order_column": order_column
        }
    
    def _parse_aggregate(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse aggregate query with enhanced logic"""
        agg_column = self._extract_column(query_lower, columns)
        
        # Determine aggregation function
        if "average" in query_lower or "avg" in query_lower or "mean" in query_lower:
            operation = "average"
            if agg_column:
                base_query = f"df['{agg_column}'].mean()"
            else:
                base_query = "df.select_dtypes(include=['number']).mean()"
        elif "sum" in query_lower or "total" in query_lower:
            operation = "sum"
            if agg_column:
                base_query = f"df['{agg_column}'].sum()"
            else:
                base_query = "df.select_dtypes(include=['number']).sum()"
        elif "maximum" in query_lower or "max" in query_lower:
            operation = "max"
            if agg_column:
                base_query = f"df['{agg_column}'].max()"
            else:
                base_query = "df.select_dtypes(include=['number']).max()"
        elif "minimum" in query_lower or "min" in query_lower:
            operation = "min"
            if agg_column:
                base_query = f"df['{agg_column}'].min()"
            else:
                base_query = "df.select_dtypes(include=['number']).min()"
        elif "median" in query_lower:
            operation = "median"
            if agg_column:
                base_query = f"df['{agg_column}'].median()"
            else:
                base_query = "df.select_dtypes(include=['number']).median()"
        else:
            operation = "average"
            base_query = "df.select_dtypes(include=['number']).mean()"
        
        # Check for group by
        # Extract group column from remaining query text
        remaining_query = query_lower
        if agg_column:
            remaining_query = remaining_query.replace(agg_column.lower(), "")
        group_column = None
        for col in columns:
            if col.lower() in remaining_query and col != agg_column:
                group_column = col
                break
        
        if group_column and ("by" in query_lower or "group" in query_lower or "per" in query_lower):
            # Use agg_column if specified, otherwise use first numeric column
            if agg_column:
                if operation == "average":
                    pandas_query = f"df.groupby('{group_column}')['{agg_column}'].mean().reset_index()"
                elif operation == "sum":
                    pandas_query = f"df.groupby('{group_column}')['{agg_column}'].sum().reset_index()"
                elif operation == "max":
                    pandas_query = f"df.groupby('{group_column}')['{agg_column}'].max().reset_index()"
                elif operation == "min":
                    pandas_query = f"df.groupby('{group_column}')['{agg_column}'].min().reset_index()"
                else:
                    pandas_query = base_query
            else:
                # Group by without specific column - aggregate all numeric columns
                if operation == "average":
                    pandas_query = f"df.groupby('{group_column}').mean().reset_index()"
                elif operation == "sum":
                    pandas_query = f"df.groupby('{group_column}').sum().reset_index()"
                elif operation == "max":
                    pandas_query = f"df.groupby('{group_column}').max().reset_index()"
                elif operation == "min":
                    pandas_query = f"df.groupby('{group_column}').min().reset_index()"
                else:
                    pandas_query = base_query
        else:
            pandas_query = base_query
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": operation,
            "intent": intent,
            "agg_column": agg_column
        }
    
    def _parse_count(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse count query"""
        # Check if counting specific column
        count_column = self._extract_column(query_lower, columns)
        
        if count_column:
            # Count non-null values in column
            pandas_query = f"df['{count_column}'].count()"
        else:
            # Count total rows
            pandas_query = "len(df)"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "count",
            "intent": intent,
            "count_column": count_column
        }
    
    def _parse_filter(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse filter query with condition extraction"""
        condition = self._extract_filter_condition(query_lower, columns)
        
        if condition:
            col, op, val = condition
            if op == ">":
                pandas_query = f"df[df['{col}'] > {val}]"
            elif op == "<":
                pandas_query = f"df[df['{col}'] < {val}]"
            elif op == "==":
                # Check if value is string or number
                if val.isdigit():
                    pandas_query = f"df[df['{col}'] == {val}]"
                else:
                    pandas_query = f"df[df['{col}'] == '{val}']"
            elif op == "contains":
                pandas_query = f"df[df['{col}'].str.contains('{val}', case=False, na=False)]"
            else:
                pandas_query = "df"
        else:
            # Simple filter - return all for now
            pandas_query = "df"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "filter",
            "intent": intent,
            "condition": condition
        }
    
    def _parse_comparison(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse comparison query"""
        # Extract columns to compare
        col1 = self._extract_column(query_lower, columns)
        
        # For comparison, we'll return descriptive statistics
        if col1:
            pandas_query = f"df['{col1}'].describe()"
        else:
            pandas_query = "df.select_dtypes(include=['number']).describe()"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "comparison",
            "intent": intent
        }
    
    def _parse_trend(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse trend query"""
        # For trends, group by time column if available
        time_columns = [col for col in columns if any(keyword in col.lower() for keyword in ["date", "time", "year", "month", "day"])]
        
        if time_columns:
            time_col = time_columns[0]
            value_col = self._extract_column(query_lower, columns)
            if value_col:
                pandas_query = f"df.groupby('{time_col}')['{value_col}'].sum().reset_index()"
            else:
                pandas_query = f"df.groupby('{time_col}').sum()"
        else:
            pandas_query = "df.select_dtypes(include=['number']).sum()"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "trend",
            "intent": intent
        }
    
    def _parse_statistical(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse statistical analysis query"""
        pandas_query = "df.select_dtypes(include=['number']).describe()"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "statistical",
            "intent": intent
        }
    
    def _parse_simple(self, query: str, query_lower: str, columns: List[str], intent: str) -> Dict:
        """Parse simple selection query"""
        # Try to extract specific columns
        selected_columns = []
        for col in columns:
            if col.lower() in query_lower:
                selected_columns.append(col)
        
        if selected_columns:
            cols_str = "', '".join(selected_columns)
            pandas_query = f"df[['{cols_str}']].head(100)"
        else:
            pandas_query = "df.head(100)"
        
        return {
            "type": "pandas",
            "query": pandas_query,
            "operation": "select",
            "intent": intent
        }
    
    def generate_suggestions(self, query_text: str, results: List[Dict] = None) -> List[str]:
        """Generate intelligent follow-up suggestions"""
        query_lower = query_text.lower()
        suggestions = []
        
        # Context-aware suggestions
        if "top" in query_lower or "highest" in query_lower:
            suggestions.append("Show bottom 10 results")
            suggestions.append("Get average values")
        elif "average" in query_lower or "mean" in query_lower:
            suggestions.append("Show top values")
            suggestions.append("Compare with maximum")
        elif "count" in query_lower:
            suggestions.append("Show detailed breakdown")
            suggestions.append("Group by categories")
        else:
            suggestions.append("Get summary statistics")
            suggestions.append("Show top 10 results")
        
        # Always include export option
        if results and len(results) > 0:
            suggestions.append("Export results")
        
        return suggestions[:4]  # Return top 4 suggestions
    
    def enhance_query(self, query_text: str, schema: Dict) -> str:
        """Enhance query with suggestions for better results"""
        # This can be expanded to use AI/ML models for query enhancement
        enhanced = query_text
        
        # Add context if missing
        if "show" not in query_text.lower() and "display" not in query_text.lower():
            if "top" in query_text.lower() or "bottom" in query_text.lower():
                enhanced = f"Show {query_text}"
        
        return enhanced

