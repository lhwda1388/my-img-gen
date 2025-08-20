from PIL import Image
from image_generator import create_generator
from translator import translate_text


def text_to_image():
    print("🎨 Testing Text-to-Image Generation")
    print("=" * 50)
    
    # Create generator
    generator = create_generator('stabilityai/stable-diffusion-xl-base-1.0')
    
    # Test prompts
    prompt = input("Enter a prompt: ")
    prompt = translate_text(prompt)
    prompts = [prompt]
        
    # Generate images
    images = generator.batch_generate_text_to_image(
        prompts, 
        base_filename="text_to_img"
    )
    
    print(f"\n✅ Generated {len(images)} images successfully!")


def image_to_image():
    print("\n🎨 Testing Image-to-Image Generation")
    print("=" * 50)
    
    # Create generator with better model
    generator = create_generator("stabilityai/stable-diffusion-2-1")
    
    # Create test input image
    # test_image = generator.create_test_image(color='blue')
    # test_image.save("input_image.png")
    source_img = Image.open("source_img.png")
    print("📸 Created test input image: input_image.png")
    prompt = input("Enter a prompt: ")
    prompt = translate_text(prompt)
    prompts = [prompt]
    
    # Generate images
    images = generator.batch_generate_image_to_image(
        prompts,
        source_img,
        base_filename="img_to_img"
    )
    
    print(f"\n✅ Generated {len(images)} transformed images successfully!")



def main():
    """Main function to run all tests."""
    print("🎨 Refactored Stable Diffusion Test Suite")
    print("=" * 60)
    
    try:
        # Run tests
        text_to_image()
        # image_to_image()
        
        
        print("\n" + "=" * 60)
        print("🎉tests completed successfully!")

    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
