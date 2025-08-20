"""
FastAPI Application for Stable Diffusion Image Generation

A FastAPI-based service for generating images using Stable Diffusion models.
"""

import os
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from PIL import Image
import io
from fastapi.responses import FileResponse

from image_generator import create_generator
from translator import translate_text
from negative_prompts import get_strong_negative_prompt


# Pydantic models
class TextToImageRequest(BaseModel):
    prompt: str
    height: int = 512
    width: int = 512
    guidance_scale: float = 12.0
    num_inference_steps: int = 20
    use_translation: bool = True
    model_id: str = "stabilityai/stable-diffusion-xl-base-1.0"

class GenerationResponse(BaseModel):
    success: bool
    message: str
    image_paths: List[str] = []


# FastAPI app
app = FastAPI(
    title="Stable Diffusion Image Generator",
    description="A FastAPI service for generating images using Stable Diffusion",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Stable Diffusion Image Generator API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "text_to_image": "/generate/text-to-image",
            "image_to_image": "/generate/image-to-image",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/generate/text-to-image", response_model=GenerationResponse)
async def text_to_image(request: TextToImageRequest):

    try:
        # Translate prompt if requested
        prompt = request.prompt
        if request.use_translation:
            prompt = translate_text(request.prompt)
            print(f"🌐 번역된 프롬프트: {prompt}")
        
        # Create generator
        generator = create_generator(request.model_id)
        
        # Get negative prompt
        negative_prompt = get_strong_negative_prompt()
        print(f"🛡️ 강화된 네거티브 프롬프트 사용")
        
        # Generate image
        image = generator.generate_text_to_image(
            prompt=prompt,
            filename=f"text_to_img_{os.getpid()}.png",
            height=request.height,
            width=request.width,
            guidance_scale=request.guidance_scale,
            num_inference_steps=request.num_inference_steps,
            negative_prompt=negative_prompt
        )
        
        return GenerationResponse(
            success=True,
            message="Image generated successfully",
            image_paths=[f"text_to_img_{os.getpid()}.png"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")


@app.post("/generate/image-to-image", response_model=GenerationResponse)
async def image_to_image(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    use_translation: bool = Form(True),
    strength: float = Form(0.75),
    guidance_scale: float = Form(12.0),
    num_inference_steps: int = Form(20),
    model_id: str = Form("stabilityai/stable-diffusion-xl-base-1.0")
):

    try:
        # Validate image file
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and convert image
        image_data = await image.read()
        input_image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Translate prompt if requested
        final_prompt = prompt
        if use_translation:
            final_prompt = translate_text(prompt)
            print(f"🌐 번역된 프롬프트: {final_prompt}")
        
        # Create generator
        generator = create_generator(model_id)
        
        # Get negative prompt
        negative_prompt = get_strong_negative_prompt()
        print(f"🛡️ 강화된 네거티브 프롬프트 사용")
        
        # Generate image
        image = generator.generate_image_to_image(
            prompt=final_prompt,
            input_image=input_image,
            filename=f"img_to_img_{os.getpid()}.png",
            strength=strength,
            guidance_scale=guidance_scale,
            num_inference_steps=num_inference_steps,
            negative_prompt=negative_prompt
        )
        
        return GenerationResponse(
            success=True,
            message="Image transformed successfully",
            image_paths=[f"img_to_img_{os.getpid()}.png"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image transformation failed: {str(e)}")


@app.get('/image/{image_path}')
async def get_image_path(image_path: str): 
    return FileResponse(f"{image_path}")



@app.get("/models")
async def get_available_models():
    """Get list of available models."""
    models = [
        {
            "id": "runwayml/stable-diffusion-v1-5",
            "name": "Stable Diffusion v1.5",
            "description": "Standard Stable Diffusion model",
            "size": "4GB"
        },
        {
            "id": "stabilityai/stable-diffusion-2-1",
            "name": "Stable Diffusion v2.1",
            "description": "Improved quality Stable Diffusion model",
            "size": "4GB"
        },
        {
            "id": "stabilityai/stable-diffusion-xl-base-1.0",
            "name": "Stable Diffusion XL",
            "description": "High quality XL model (requires more memory)",
            "size": "6GB"
        }
    ]
    return {"models": models}


def main():
    """Main function to run the FastAPI application."""
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print("🚀 Starting Stable Diffusion Image Generator API...")
    print(f"📡 Server will be available at: http://{host}:{port}")
    print(f"📚 API Documentation: http://{host}:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )


if __name__ == "__main__":
    main()
