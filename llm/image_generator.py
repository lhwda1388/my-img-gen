"""
Image Generator Module

A reusable class for Stable Diffusion image generation.
"""

import torch
from PIL import Image
import requests
from io import BytesIO
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, StableDiffusionXLPipeline
from typing import List, Tuple, Optional, Dict, Any
from datetime import datetime


class StableDiffusionGenerator:
    """A class for generating images using Stable Diffusion."""
    
    def __init__(self, model_id: str = "runwayml/stable-diffusion-v1-5", lora_weights: Optional[str] = None):
        """Initialize the generator with a model."""
        self.model_id = model_id
        self.device, self.num_steps = self._get_device_info()
        self.text_pipe = None
        self.img2img_pipe = None
        self.is_sdxl = "xl" in model_id.lower()
        self.lora_weights = lora_weights or "modamsko/lora-sdxl-flatillustration"
        
    def _get_device_info(self) -> Tuple[str, int]:
        """Get device information and optimal inference steps."""
        device = "cuda" if torch.cuda.is_available() else "cpu"
        num_steps = 20 if device == "cuda" else 10
        return device, num_steps
    
    def _load_pipeline(self, pipeline_class):
        """Load pipeline with appropriate settings for CPU/GPU."""
        if torch.cuda.is_available():
            print("✅ CUDA available, using GPU")
            pipe = pipeline_class.from_pretrained(
                self.model_id,
                torch_dtype=torch.float16,
                use_safetensors=True,
                safety_checker=None  # NSFW 필터 비활성화
            )
        else:
            print("⚠️  CUDA not available, using CPU")
            pipe = pipeline_class.from_pretrained(
                self.model_id,
                use_safetensors=True,
                safety_checker=None  # NSFW 필터 비활성화
            )
        
        # Move to device after loading
        pipe = pipe.to(self.device)
        
        # LoRA 가중치 로드 (PEFT 백엔드가 있는 경우에만)
        if self.lora_weights:
            try:
                pipe.load_lora_weights(self.lora_weights)
                print(f"✅ LoRA weights loaded: {self.lora_weights}")
            except Exception as e:
                print(f"⚠️  LoRA weights loading failed: {e}")
                print("Continuing without LoRA weights...")
        else:
            print("ℹ️  No LoRA weights specified, using base model")
        
        return pipe
    
    def load_text_pipeline(self):
        """Load text-to-image pipeline."""
        if self.text_pipe is None:
            if self.is_sdxl:
                self.text_pipe = self._load_pipeline(StableDiffusionXLPipeline)
            else:
                self.text_pipe = self._load_pipeline(StableDiffusionPipeline)
            self.text_pipe = self.text_pipe.to(self.device)
        return self.text_pipe
    
    def load_img2img_pipeline(self):
        """Load image-to-image pipeline."""
        if self.img2img_pipe is None:
            if self.is_sdxl:
                # SDXL doesn't have img2img pipeline, use text-to-image
                self.img2img_pipe = self.load_text_pipeline()
            else:
                self.img2img_pipe = self._load_pipeline(StableDiffusionImg2ImgPipeline)
            self.img2img_pipe = self.img2img_pipe.to(self.device)
        return self.img2img_pipe
    
    def generate_text_to_image(
        self, 
        prompt: str, 
        filename: str,
        height: int = 512,
        width: int = 512,
        guidance_scale: float = 7.5,
        num_inference_steps: Optional[int] = None,
        negative_prompt: Optional[str] = None
    ) -> Image.Image:
        """Generate image from text prompt."""
        pipe = self.load_text_pipeline()
        
        if num_inference_steps is None:
            num_inference_steps = self.num_steps
            
        print(f"📝 Generating: '{prompt}'")
        
        # SDXL 모델은 다른 파라미터를 사용
        if self.is_sdxl:
            # SDXL은 기본적으로 1024x1024 해상도 사용
            height = max(height, 1024)
            width = max(width, 1024)
            
            # SDXL 파라미터 준비
            sdxl_params = {
                "prompt": prompt,
                "height": height,
                "width": width,
                "guidance_scale": guidance_scale,
                "num_inference_steps": num_inference_steps,
                "original_size": (height, width),
                "crops_coords_top": 0,
                "crops_coords_left": 0,
                "target_size": (height, width)
            }
            
            # 네거티브 프롬프트 추가
            if negative_prompt:
                sdxl_params["negative_prompt"] = negative_prompt
            
            image = pipe(**sdxl_params).images[0]
        else:
            # 일반 Stable Diffusion 파라미터 준비
            params = {
                "prompt": prompt,
                "height": height,
                "width": width,
                "guidance_scale": guidance_scale,
                "num_inference_steps": num_inference_steps
            }
            
            # 네거티브 프롬프트 추가
            if negative_prompt:
                params["negative_prompt"] = negative_prompt
            
            image = pipe(**params).images[0]
        
        image.save(filename)
        print(f"✅ Saved as: {filename}")
        
        return image
    
    def generate_image_to_image(
        self,
        prompt: str,
        input_image: Image.Image,
        filename: str,
        strength: float = 0.75,
        guidance_scale: float = 7.5,
        num_inference_steps: Optional[int] = None,
        negative_prompt: Optional[str] = None
    ) -> Image.Image:
        """Generate image from input image and prompt."""
        
        pipe = self.load_img2img_pipeline()
        
        if num_inference_steps is None:
            num_inference_steps = self.num_steps
            
        print(f"📝 Transforming: '{prompt}'")
        
        # 파라미터 준비
        params = {
            "prompt": prompt,
            "image": input_image,
            "strength": strength,
            "guidance_scale": guidance_scale,
            "num_inference_steps": num_inference_steps
        }
        
        # 네거티브 프롬프트 추가
        if negative_prompt:
            params["negative_prompt"] = negative_prompt
        
        image = pipe(**params).images[0]
        
        image.save(filename)
        print(f"✅ Saved as: {filename}")
        
        return image
    
    def download_image(self, url: str) -> Image.Image:
        """Download image from URL."""
        response = requests.get(url)
        return Image.open(BytesIO(response.content)).convert("RGB")
    
    def create_test_image(self, size: Tuple[int, int] = (512, 512), color: str = 'red') -> Image.Image:
        """Create a test image with specified color."""
        return Image.new('RGB', size, color=color)
    
    def batch_generate_text_to_image(
        self, 
        prompts: List[str], 
        base_filename: str = "text_to_img",
        **kwargs
    ) -> List[Image.Image]:
        """Generate multiple images from text prompts."""
        images = []
        for i, prompt in enumerate(prompts):
            filename = f"{base_filename}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{i+1}.png"
            image = self.generate_text_to_image(prompt, filename, **kwargs)
            images.append(image)
        return images
    
    def batch_generate_image_to_image(
        self,
        prompts: List[str],
        input_image: Image.Image,
        base_filename: str = "img_to_img",
        **kwargs
    ) -> List[Image.Image]:
        """Generate multiple images from input image and prompts."""
        images = []
        for i, prompt in enumerate(prompts):
            filename = f"{base_filename}_{i+1}.png"
            image = self.generate_image_to_image(prompt, input_image, filename, **kwargs)
            images.append(image)
        return images


def create_generator(model_id: str = "runwayml/stable-diffusion-v1-5", lora_weights: Optional[str] = None) -> StableDiffusionGenerator:
    """Factory function to create a generator instance."""
    return StableDiffusionGenerator(model_id, lora_weights)
