from transformers import M2M100ForConditionalGeneration, M2M100Tokenizer


model_name = 'facebook/m2m100_418M'
tokenizer = M2M100Tokenizer.from_pretrained(model_name)
model = M2M100ForConditionalGeneration.from_pretrained(model_name)



def translate_text(text: str) -> str:
    tokenizer.src_lang = "ko"
    encoded = tokenizer(text, return_tensors="pt")

    generated_tokens = model.generate(
    **encoded,
    forced_bos_token_id=tokenizer.get_lang_id("en")   # 번역할 언어
    )

    translation = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    print(f"🌐 번역: '{text}' → '{translation}'")
    return translation



if __name__ == "__main__":
    print(translate_text("털색만 검정색으로 바꿔줘"))