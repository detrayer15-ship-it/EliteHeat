"""
Mita AI Service - Python Edition (FastAPI)
Upgrade v5.0 based on Technical Specification
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# 1. Load environment variables
print("✅ app.py loading...")
load_dotenv()

# 2. Setup OpenAI (GPT-4o-mini)
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    print("❌ ERROR: OPENAI_API_KEY NOT FOUND in .env or environment")
    client = None
else:
    print("🔑 OpenAI API Key detected")
    client = OpenAI(api_key=API_KEY)

SYSTEM_PROMPT = """
Ты — Мита, дружелюбный и быстрый AI-ассистент образовательной платформы.

ВАЖНЫЕ ПРАВИЛА:
- Всегда отвечай на любое сообщение пользователя, даже если оно короткое.
- Понимай простые слова: «привет», «ответь», «дай ответ», «помоги».
- Если сообщение короткое или неясное — отвечай просто и уточняй.
- Не отказывай пользователю.

ТЕМАТИКА ПЛАТФОРМЫ:
- Основное обучение: Python, Figma, создание проектов.
- Если вопрос НЕ по теме — ответь кратко и мягко переведи разговор к обучению.

СТИЛЬ:
- Отвечай быстро.
- Пиши простыми словами.
- Без длинных рассуждений.
- Если пользователь просит «кратко» — отвечай кратко.
- Если просит «сразу ответ» — дай ответ сразу.

ПРИМЕРЫ:
Пользователь: «привет»
Ответ: «Привет! Я Мита 🙂 Чем помочь? Python или Figma?»

Пользователь: «дай ответ»
Ответ: «Хорошо. Напиши вопрос — отвечу сразу.»

Пользователь: «что ты умеешь»
Ответ: «Я помогаю изучать Python, Figma и делать проекты. Спрашивай 🙂»
"""

# 3. FastAPI Initialization
app = FastAPI(title="Mita AI Service")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for reliability
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []

class ChatResponse(BaseModel):
    reply: str
    success: bool = True
    provider: str = "python"
    usage: dict = {"model": "gpt-4o-mini", "inputTokens": 0, "outputTokens": 0, "latencyMs": 0}

# 5. Logic
MAX_RETRIES = 2

def mita_response(user_message: str, history: list[Message] = None) -> dict:
    if not client:
        return {"reply": "Ошибка: OpenAI API ключ не настроен.", "success": False}
        
    if not user_message or len(user_message.strip()) < 1:
        return {"reply": "Пожалуйста, напиши вопрос.", "success": False}

    # 0. SHORT_INPUTS - Fast response without AI
    SHORT_INPUTS = {
        "привет": "Привет! Я Мита 🙂 Чем помочь? Python или Figma?",
        "дай ответ": "Хорошо. Напиши вопрос — отвечу сразу.",
        "ответь": "Хорошо. Напиши вопрос — отвечу сразу.",
        "помоги": "Привет! Я Мита 🙂 Чем помочь? Могу подсказать по Python или Figma.",
        "что ты умеешь": "Я помогаю изучать Python, Figma и делать проекты. Спрашивай 🙂",
        "как дела": "Всё отлично 🙂 Хочешь заняться Python или Figma?",
        "спасибо": "Всегда рада помочь! 🌟",
        "пока": "До встречи! 👋 Удачи в обучении!"
    }
    
    msg_clean = user_message.lower().strip().replace("!", "").replace("?", "")
    if msg_clean in SHORT_INPUTS:
        return {
            "reply": SHORT_INPUTS[msg_clean],
            "success": True,
            "provider": "python",
            "usage": {"model": "short-response", "inputTokens": 0, "outputTokens": 0, "latencyMs": 0}
        }

    import time
    start_time = time.time()
    
    # Construct messages array
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add history
    if history:
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})
            
    # Add current message
    messages.append({"role": "user", "content": user_message})

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.3, # faster and more precise
                max_tokens=300   # shorter responses
            )
            
            reply = response.choices[0].message.content
            if not reply:
                raise ValueError("Empty response from OpenAI")
            
            latency = int((time.time() - start_time) * 1000)
            
            return {
                "reply": reply.strip(),
                "success": True,
                "provider": "python",
                "usage": {
                    "model": "gpt-4o-mini",
                    "inputTokens": response.usage.prompt_tokens,
                    "outputTokens": response.usage.completion_tokens,
                    "latencyMs": latency
                }
            }

        except Exception as e:
            print(f"⚠️ OpenAI error (attempt {attempt}/{MAX_RETRIES}): {repr(e)}")
            if attempt < MAX_RETRIES:
                time.sleep(1)
            else:
                return {
                    "reply": "Извини, сейчас я временно не могу ответить. Попробуй позже.",
                    "success": False,
                    "provider": "python"
                }

    return {"reply": "Извини, произошла ошибка.", "success": False, "provider": "python"}

# 6. Endpoints
@app.post("/chat", response_model=ChatResponse)
@app.post("/api/ai/chat", response_model=ChatResponse)
@app.post("/api/ai/chat/message", response_model=ChatResponse)
async def chat(data: ChatRequest):
    result = mita_response(data.message, data.history)
    return result

@app.get("/api/health")
@app.get("/health")
async def health():
    is_ready = bool(os.getenv("OPENAI_API_KEY"))
    return {
        "success": True,
        "status": "online" if is_ready else "offline",
        "service": "Mita AI Python (FastAPI + OpenAI)",
        "version": "6.0.0"
    }

@app.get("/api/ai/status")
async def status():
    return {
        "success": True,
        "status": "online",
        "available": True
    }

print("🚀 Mita AI backend loaded (Ready for connections)")


