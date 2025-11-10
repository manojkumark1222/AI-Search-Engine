from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./data_analyzer.db"
    
    # JWT Settings
    secret_key: str = "your-secret-key-change-this-in-production-please-use-a-strong-random-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # OpenAI API (optional, for advanced NLP)
    openai_api_key: str = ""
    
    # CORS
    cors_origins: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

