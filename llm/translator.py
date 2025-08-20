from transformers import pipeline


translator = pipeline("translation", model="Helsinki-NLP/opus-mt-ko-en")




def translate_text(text: str) -> str:
    return translator(text, max_length=256)[0]['translation_text']



if __name__ == "__main__":
    print(translate_text("안녕하세요"))