from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, connections, query, history, subscription, export, ai_insights, team, api_keys, nlp_enhancement

app = FastAPI(title="Data Visualizer & Analyzer Tool API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(connections.router, prefix="/connections", tags=["Connections"])
app.include_router(query.router, prefix="/query", tags=["Query"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(subscription.router, prefix="/subscription", tags=["Subscription"])
app.include_router(export.router, prefix="/export", tags=["Export"])
app.include_router(ai_insights.router, prefix="/ai", tags=["AI Insights"])
app.include_router(team.router, prefix="/team", tags=["Team Collaboration"])
app.include_router(api_keys.router, prefix="/api-keys", tags=["API Keys"])
app.include_router(nlp_enhancement.router, prefix="/nlp", tags=["NLP Enhancement"])

@app.get("/")
def root():
    return {"message": "Data Visualizer & Analyzer Tool API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8888)

