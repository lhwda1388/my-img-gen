POSITIVE_PROMPTS = [
    "educational illustration, clean design, professional, informative, clear visual, learning material, educational content, flat design style, modern illustration, corporate learning material, professional diagram, clean vector style, educational infographic, approachable illustration, learning-friendly art, inclusive education visual, modern educational design, clean professional appearance, business-like illustration, formal education style, accessible education visual, inspiring learning atmosphere, positive educational environment, stress-free learning visual, calm and peaceful illustration, relaxed learning environment"
]


def get_positive_prompts():
    """Get a comprehensive positive prompt to prevent weird results."""
    return ", ".join(POSITIVE_PROMPTS)