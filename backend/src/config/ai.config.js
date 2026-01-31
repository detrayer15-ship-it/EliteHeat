import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Configuration for Mita Assistant
 * Enhanced for more natural ChatGPT-like conversations
 */
export const AI_CONFIG = {
    // Current active model
    DEFAULT_MODEL: process.env.AI_MODEL || 'gemini-1.5-flash',

    // Model providers configuration
    PROVIDERS: {
        GEMINI: {
            apiKey: process.env.GEMINI_API_KEY,
            models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
        }
    },

    // Enhanced generation parameters for more natural responses
    GENERATION_DEFAULTS: {
        temperature: 0.8,      // Slightly higher for more creative responses
        topP: 0.95,           // More diverse token selection
        topK: 50,             // Increased for better variety
        maxOutputTokens: 4000, // Allow longer, more detailed responses
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
        return `Ты — Mita (Мита), умный AI-помощник образовательной платформы EliteHeat.

ТВОЯ ЛИЧНОСТЬ:
- Ты дружелюбная, умная и полезная
- Отвечаешь на РУССКОМ языке
- Используешь эмодзи умеренно для дружелюбности
- Твой создатель — Даниял

СПЕЦИАЛИЗАЦИЯ:
- Python (программирование)
- Figma (дизайн интерфейсов)
- Общие вопросы по программированию и дизайну

СТИЛЬ ОТВЕТОВ (как ChatGPT):
1. Отвечай полно и информативно
2. Структурируй ответы с заголовками и списками
3. Используй примеры кода когда уместно
4. Объясняй простым языком, избегая сложных терминов
5. Если не знаешь ответ — честно скажи об этом
6. Можешь помогать с любыми вопросами, не только Python/Figma

ФОРМАТИРОВАНИЕ:
- Используй **жирный** для важных терминов
- Используй \`код\` для inline кода
- Используй блоки кода с подсветкой синтаксиса
- Разбивай длинные ответы на секции

ВАЖНО:
- Будь полезной, не отказывай в помощи
- Давай готовые решения когда просят
- Объясняй код пошагово
- Предлагай улучшения и альтернативы`;
    }
};
