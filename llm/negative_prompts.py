"""
Enhanced Negative Prompts

Strong negative prompts to prevent weird, distorted, or broken anatomy in generated images.
"""

# 강화된 네거티브 프롬프트 (기괴한 결과 방지)
STRONG_NEGATIVE_PROMPTS = [
    # 기본 품질 문제
    "blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, signature, text",
    
    # 신체 부위 문제
    "extra limbs, missing limbs, floating limbs, mutated hands and fingers, out of frame, mutation, mutated",
    "extra arms, extra legs, disfigured, malformed, mutated, anatomical nonsense, anatomical impossibility",
    "multiple heads, multiple faces, cloned face, gross proportions, malformed limbs",
    "missing arms, missing legs, extra arms, extra legs, mutated hands, fused fingers, too many fingers",
    "long neck, cross-eyed, mutated eyes and pupils, bad anatomy, anatomical impossibility",
    
    # 기타 문제들
    "text, ui, error, cropped, worst quality, low quality, normal quality, jpeg artifacts",
    "signature, watermark, username, blurry, bad proportions, bad anatomy, bad hands",
    "missing fingers, extra digit, fewer digits, fused digits, mutated hands and fingers",
    "long neck, cross-eyed, mutated eyes and pupils, bad anatomy, anatomical impossibility",
    "multiple heads, cloned face, disfigured, gross proportions, malformed, mutated",
    "anatomical nonsense, text, ui, error, cropped, worst quality, low quality",
    "normal quality, jpeg artifacts, signature, watermark, username, blurry"
]

def get_strong_negative_prompt():
    """Get a comprehensive negative prompt to prevent weird results."""
    return ", ".join(STRONG_NEGATIVE_PROMPTS)
