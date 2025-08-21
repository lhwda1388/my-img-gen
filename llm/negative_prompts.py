"""
Enhanced Negative Prompts

Strong negative prompts to prevent weird, distorted, or broken anatomy in generated images.
"""

# 강화된 네거티브 프롬프트 (기괴한 결과 방지)
STRONG_NEGATIVE_PROMPTS = [
    # 기본 품질 문제
    "blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, signature, text",
    
    # 신체 부위 문제 (강화)
    "extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of frame, mutation, mutated",
    "extra arms, extra legs, disfigured, malformed, mutated, anatomical nonsense, anatomical impossibility",
    "multiple heads, multiple faces, cloned face, gross proportions, malformed limbs",
    "missing arms, missing legs, extra arms, extra legs, mutated hands, fused fingers, too many fingers",
    "long neck, cross-eyed, mutated eyes and pupils, bad anatomy, anatomical impossibility",
    "multiple arms, multiple legs, extra hands, extra feet, too many fingers, too many toes",
    "duplicate limbs, cloned limbs, repeated body parts, anatomical duplication, body part multiplication",
    "six fingers, eight fingers, ten fingers, twelve fingers, extra digits, duplicate digits",
    "three arms, four arms, five arms, six arms, multiple arms, arm duplication",
    "three legs, four legs, five legs, six legs, multiple legs, leg duplication",
    "split limbs, forked limbs, branching limbs, Y-shaped limbs, V-shaped limbs",
    "anatomical errors, body part errors, limb errors, appendage errors, extremity errors",
    
    
    # 기타 문제들
    "text, ui, error, cropped, worst quality, low quality, normal quality, jpeg artifacts",
    "signature, watermark, username, blurry, bad proportions, bad anatomy, bad hands",
    "missing fingers, extra digit, fewer digits, fused digits, mutated hands and fingers",
    "long neck, cross-eyed, mutated eyes and pupils, bad anatomy, anatomical impossibility",
    "multiple heads, cloned face, disfigured, gross proportions, malformed, mutated",
    "anatomical nonsense, text, ui, error, cropped, worst quality, low quality",
    "normal quality, jpeg artifacts, signature, watermark, username, blurry",

    # 실사 방지 및 삽화 스타일 유도
    "photorealistic, realistic, photo, photograph, photography, hyperrealistic, hyper-detailed",
    "3D render, 3D model, 3D art, cinema 4D, blender, octane render, unreal engine, ray tracing",
    "skin texture, skin pores, skin details, detailed skin, skin imperfections, wrinkles",
    "high detail, ultra detailed, intricate details, detailed texture, detailed background",
    
    # 삽화 스타일 방해 요소
    "volumetric lighting, subsurface scattering, physically-based rendering, depth of field",
    "bokeh, motion blur, chromatic aberration, lens flare, film grain, high dynamic range",
    "photogrammetry, photoscan, lidar scan, 3D scan, real life, real world"
]

def get_strong_negative_prompt():
    """Get a comprehensive negative prompt to prevent weird results."""
    return ", ".join(STRONG_NEGATIVE_PROMPTS)
