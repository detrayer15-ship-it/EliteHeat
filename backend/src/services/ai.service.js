import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, MITA_PERSONALITY } from '../config/ai.config.js';
import { cacheService } from './cache.service.js';
import { contextService } from './context.service.js';

/**
 * Gemini Provider - Enhanced for ChatGPT-like responses
 */
class GeminiProvider {
    constructor(apiKey) {
        this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
    }

    async generateResponse({ model, systemInstruction, history, message, options = {} }) {
        if (!this.genAI) throw new Error('Gemini API key not configured');

        const modelId = model || AI_CONFIG.DEFAULT_MODEL || 'gemini-1.5-flash';

        try {
            const genModel = this.genAI.getGenerativeModel({
                model: modelId,
                generationConfig: {
                    ...AI_CONFIG.GENERATION_DEFAULTS,
                    ...options
                },
                systemInstruction: systemInstruction,
            });

            const chat = genModel.startChat({
                history: history.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                })),
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;

            return {
                text: response.text(),
                usage: {
                    inputTokens: response.usageMetadata?.promptTokenCount || 0,
                    outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
                }
            };
        } catch (error) {
            console.error(`[GEMINI] Model ${modelId} failed:`, error.message);
            throw error;
        }
    }
}

/**
 * Enhanced AI Service v2.0 - With Caching and Context Memory
 */
class AIService {
    constructor() {
        const key = AI_CONFIG.PROVIDERS.GEMINI.apiKey;
        const keyStatus = key ? `Loaded (${key.substring(0, 10)}...)` : 'Not Found';
        console.log(`[MITA AI v2.0] Gemini Key: ${keyStatus}`);
        console.log(`[MITA AI v2.0] Cache: Enabled | Context Memory: Enabled`);

        this.provider = new GeminiProvider(AI_CONFIG.PROVIDERS.GEMINI.apiKey);

        // Quick responses for common greetings (not blocking AI for other questions)
        this.QUICK_RESPONSES = {
            "привет": `👋 **Привет!** Я Мита — твой AI-помощник.

Я могу помочь тебе с:
- 🐍 **Python** — код, ошибки, концепции
- 🎨 **Figma** — дизайн, UI/UX, макеты
- 💻 **Программирование** — любые вопросы

Просто напиши свой вопрос!`,

            "здравствуй": `👋 **Здравствуйте!** Я Мита, ваш AI-ассистент.

Чем могу помочь сегодня?`,

            "кто ты": `Я **Мита** — умный AI-помощник платформы EliteHeat.

Меня создал **Даниял** для помощи в обучении программированию и дизайну.

Я использую технологии Google Gemini для генерации ответов и могу помочь с Python, Figma и многим другим! 🚀`,

            "кто твой создатель": "Моим создателем является **Даниял**. 🙂",
            "кто тебя создал": "Меня создал **Даниял** — разработчик платформы EliteHeat. 👨‍💻",

            "как дела": "У меня всё отлично! 😊 Готова помогать тебе с Python, Figma и программированием. Что тебя интересует?",
            "спасибо": "Пожалуйста! 🌟 Рада была помочь. Если будут ещё вопросы — обращайся!",
            "пока": "До встречи! 👋 Удачи в обучении! Возвращайся, если понадобится помощь.",
            "хай": "👋 Хай! Я Мита. Чем могу помочь?"
        };
    }

    /**
     * Main chat method - Enhanced with caching and context
     */
    async chat({
        message,
        history = [],
        mode = 'tutor',
        sessionId = null,
        model = AI_CONFIG.DEFAULT_MODEL,
        options = {}
    }) {
        const startTime = Date.now();
        const lowerMessage = message.toLowerCase().trim();

        // 1. Check quick responses only for exact greetings
        for (const [key, text] of Object.entries(this.QUICK_RESPONSES)) {
            if (lowerMessage === key || lowerMessage === key + '!') {
                // Track in context if session exists
                if (sessionId) {
                    contextService.addMessage(sessionId, 'user', message);
                    contextService.addMessage(sessionId, 'assistant', text);
                }

                return {
                    success: true,
                    reply: text,
                    cached: false,
                    usage: { model: 'quick-response', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime }
                };
            }
        }

        // 2. Check cache for repeated questions
        if (cacheService.shouldCache(message)) {
            const cachedResponse = cacheService.get(message, mode);
            if (cachedResponse) {
                // Track in context if session exists
                if (sessionId) {
                    contextService.addMessage(sessionId, 'user', message);
                    contextService.addMessage(sessionId, 'assistant', cachedResponse);
                }

                return {
                    success: true,
                    reply: cachedResponse,
                    cached: true,
                    usage: { model: 'cache', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime }
                };
            }
        }

        // 3. Build enhanced context if session exists
        let enhancedHistory = history;
        let contextSummary = null;

        if (sessionId) {
            // Add user message to context
            contextService.addMessage(sessionId, 'user', message);

            // Get context-aware history
            enhancedHistory = contextService.getHistoryForAI(sessionId, 10);
            contextSummary = contextService.getContextSummary(sessionId);
        }

        // 4. Use Gemini AI for generating response
        try {
            let systemInstruction = MITA_PERSONALITY.basePrompt(mode);

            // Add context summary if available
            if (contextSummary) {
                systemInstruction = `${systemInstruction}\n\n${contextSummary}`;
            }

            const result = await this.provider.generateResponse({
                model,
                systemInstruction,
                history: enhancedHistory,
                message,
                options
            });

            const responseText = result.text;

            // Cache the response if appropriate
            if (cacheService.shouldCache(message)) {
                cacheService.set(message, responseText, mode);
            }

            // Track in context if session exists
            if (sessionId) {
                contextService.addMessage(sessionId, 'assistant', responseText);
            }

            return {
                success: true,
                reply: responseText,
                cached: false,
                usage: {
                    model,
                    ...result.usage,
                    latencyMs: Date.now() - startTime
                }
            };
        } catch (error) {
            console.error('AIService Error:', error);

            const isRateLimit = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit) {
                return {
                    success: true,
                    reply: "⏳ Подождите немного, я обрабатываю много запросов. Попробуйте через минуту!",
                    cached: false
                };
            }

            // Fallback for connection errors
            return {
                success: true,
                reply: this.getFallbackResponse(message),
                cached: false
            };
        }
    }

    /**
     * Intelligent fallback when AI is unavailable
     */
    getFallbackResponse(message) {
        const lower = message.toLowerCase();

        if (lower.includes('python') || lower.includes('код') || lower.includes('программ')) {
            return `🐍 **Python — отличный выбор!**

К сожалению, сейчас я не могу дать полный ответ (проблемы с подключением).

**Пока можете:**
1. Посмотреть документацию: [python.org](https://python.org)
2. Попробовать снова через минуту
3. Сформулировать вопрос конкретнее

Я скоро вернусь! 🔄`;
        }

        if (lower.includes('figma') || lower.includes('дизайн') || lower.includes('ui') || lower.includes('ux')) {
            return `🎨 **Figma — мощный инструмент!**

Сейчас у меня временные трудности с подключением.

**Полезные ресурсы:**
1. [Figma Help](https://help.figma.com)
2. [Figma Community](https://figma.com/community)

Попробуйте спросить снова через минуту! 🔄`;
        }

        if (lower.includes('html') || lower.includes('css') || lower.includes('javascript') || lower.includes('веб')) {
            return `🌐 **Веб-разработка — важная тема!**

Сейчас у меня временные трудности с подключением.

**Полезные ресурсы:**
1. [MDN Web Docs](https://developer.mozilla.org)
2. [W3Schools](https://w3schools.com)

Попробуйте спросить снова через минуту! 🔄`;
        }

        return `🔄 **Временные трудности**

Извините, сейчас у меня проблемы с подключением к AI-серверу.

Попробуйте:
1. Повторить вопрос через минуту
2. Обновить страницу
3. Проверить интернет-соединение

Я обычно отвечаю на вопросы о Python и Figma очень хорошо! 🚀`;
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return cacheService.getStats();
    }

    /**
     * Get context statistics
     */
    getContextStats() {
        return contextService.getStats();
    }

    /**
     * Clear session context
     */
    clearSessionContext(sessionId) {
        contextService.clearSession(sessionId);
    }
}

export const aiService = new AIService();
