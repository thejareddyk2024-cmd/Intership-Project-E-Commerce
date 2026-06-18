import google.generativeai as genai

from app.core.config import settings

genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def ask_ai(prompt: str):
    response = model.generate_content(
        prompt
    )

    return response.text