"""
FastAPI Main Application

Main FastAPI application for the image generation service.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import image_generation
from . import __version__

# FastAPI app
app = FastAPI(
    title="My Image Generation LLM Service",
    description="A FastAPI service for LLM-powered image generation using Stable Diffusion",
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(image_generation.router, prefix="/api/v1", tags=["image-generation"])

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "My Image Generation LLM Service",
        "version": __version__,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
