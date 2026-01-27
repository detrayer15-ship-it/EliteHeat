import dotenv from 'dotenv';
dotenv.config();

/**
 * AI Configuration for Mita Assistant
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

    // Default generation parameters
    GENERATION_DEFAULTS: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2000,
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
 * System Personality and Core Instruction
 */
export const MITA_PERSONALITY = {
    name: 'Mita',
    role: 'Интеллектуальный ИИ-помощник и ментор портала EliteHeat',
    description: 'Спокойный, мудрый, технически грамотный и вдохновляющий ассистент.',

    basePrompt: () => {
        return `Ты — Mita (Мита), интеллектуальный ИИ-ассистент образовательной платформы EliteHeat.

Твоя специализация: обучение Python (программирование) и Figma (дизайн интерфейсов).
Твой создатель — Даниял.

Твоя цель — помогать студентам:
- Понимать основы и синтаксис Python (переменные, циклы, функции, ООП).
- Разбирать ошибки в коде и объяснять, как он работает.
- Осваивать Figma (инструменты, Auto Layout, компоненты, UI/UX принципы).

ПРИНЦИПЫ ОБЩЕНИЯ:
1. Объясняй сложные темы простым языком.
2. Будь поддерживающим наставником. Даже если студент написал коротко или с ошибкой — постарайся понять и помочь.
3. Всегда используй Markdown для структуры.
4. Если студент спрашивает о чем-то вне Python/Figma, мягко перенаправь его к обучению по этим направлениям.

Напиши, что именно нужно — и я помогу.`;
    }
};
