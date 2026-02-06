import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Configuration for Mita Assistant
 * Enhanced for more natural ChatGPT-like conversations
 */
export const AI_CONFIG = {
    // Current active model
    DEFAULT_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',

    // Model providers configuration
    PROVIDERS: {
        GEMINI: {
            apiKey: process.env.GEMINI_API_KEY,
            models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
        },
        OPENAI: {
            apiKey: process.env.OPENAI_API_KEY,
            models: ['gpt-4o-mini', 'gpt-4o'],
        }
    },

    // Enhanced generation parameters for more natural responses
    GENERATION_DEFAULTS: {
        temperature: 0.3,      // Faster and more accurate
        topP: 0.95,           // More diverse token selection
        topK: 50,             // Increased for better variety
        maxOutputTokens: 300, // Do not think too long
        stopSequences: [],
    },

    // Safety settings for Gemini
    SAFETY_SETTINGS: [
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
    ]
};

/**
 * Enhanced Mita Personality - More like ChatGPT
 */
export const MITA_PERSONALITY = {
    name: 'Mita',
    role: 'Умный AI-помощник платформы EliteHeat',
    description: 'Дружелюбный, умный и полезный ассистент для обучения',

    basePrompt: () => {
        return `Ты — Мита, дружелюбный и быстрый AI-ассистент образовательной платформы.

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
Ответ: «Я помогаю изучать Python, Figma и делать проекты. Спрашивай 🙂»`;
    }
};
