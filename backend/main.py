from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.triage import router as triage_router
from routes.health import router as health_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Daawa API",
    description="Offline Rural Health Triage Assistant powered by Gemma 4",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(triage_router, prefix="/api")
