import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
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
 * OpenAI Provider - Battle-tested and stable
 */
class OpenAIProvider {
    constructor(apiKey) {
        this.client = apiKey ? new OpenAI({ apiKey }) : null;
    }

    async generateResponse({ model, systemInstruction, history, message, options = {} }) {
        if (!this.client) throw new Error('OpenAI API key not configured');

        const modelId = model || AI_CONFIG.DEFAULT_MODEL || 'gpt-4o-mini';

        try {
            const response = await this.client.chat.completions.create({
                model: modelId,
                messages: [
                    { role: 'system', content: systemInstruction },
                    ...history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ],
                temperature: options.temperature || AI_CONFIG.GENERATION_DEFAULTS.temperature,
                max_tokens: options.maxOutputTokens || AI_CONFIG.GENERATION_DEFAULTS.maxOutputTokens,
            });

            return {
                text: response.choices[0].message.content,
                usage: {
                    inputTokens: response.usage?.prompt_tokens || 0,
                    outputTokens: response.usage?.completion_tokens || 0,
                }
            };
        } catch (error) {
            console.error(`[OPENAI] Model ${modelId} failed:`, error.message);
            throw error;
        }
    }
}

/**
 * Enhanced AI Service v2.0 - With Caching and Context Memory
 */
class AIService {
    constructor() {
        this.initialize();

        // Quick responses for common greetings (not blocking AI for other questions)
        this.QUICK_RESPONSES = {
            "привет": `Привет! Я Мита 🙂 Чем помочь? Python или Figma?`,
            "дай ответ": "Хорошо. Напиши вопрос — отвечу сразу.",
            "ответь": "Хорошо. Напиши вопрос — отвечу сразу.",
            "помоги": "Привет! Я Мита 🙂 Чем помочь? Могу подсказать по Python или Figma.",
            "что ты умеешь": "Я помогаю изучать Python, Figma и делать проекты. Спрашивай 🙂",
            "кто ты": "Я Мита — дружелюбный AI-помощник образовательной платформы. 🙂",
            "как дела": "Всё отлично 🙂 Хочешь заняться Python или Figma?",
            "спасибо": "Всегда рада помочь! 🌟",
            "пока": "До встречи! 👋 Удачи в обучении!",
            "привет!": "Привет! Я Мита 🙂 Чем помочь? Python или Figma?",
            "хай": "Привет! Чем могу помочь?"
        };
    }

    /**
     * Initialize or re-initialize providers based on current config
     */
    initialize() {
        this.providers = [];
        const geminiKey = AI_CONFIG.PROVIDERS.GEMINI.apiKey;
        const openaiKey = AI_CONFIG.PROVIDERS.OPENAI.apiKey;

        // Load all available providers
        // We ignore placeholder keys like 'sk-xxxx'
        if (openaiKey && !openaiKey.includes('sk-xxxx')) {
            console.log(`[MITA AI] OpenAI Provider Registered`);
            this.providers.push({ name: 'openai', instance: new OpenAIProvider(openaiKey) });
        }

        if (geminiKey && !geminiKey.includes('AIzaSy')) { // Basic check for real key or we can just trust it
            // Actually the user has a real-looking key starting with AIzaSy
        }

        if (geminiKey) {
            console.log(`[MITA AI] Gemini Provider Registered`);
            this.providers.push({ name: 'gemini', instance: new GeminiProvider(geminiKey) });
        }

        if (this.providers.length === 0) {
            console.warn(`[MITA AI] No AI Providers configured! Fallbacks will be used.`);
        }
    }

    /**
     * Hot-reloading of AI keys and models
     */
    reinitialize() {
        console.log(`[MITA AI] Re-initializing providers...`);
        this.initialize();
    }

    /**
     * Main chat method - Enhanced with multi-provider fallback
     */
    async chat({
        message,
        history = [],
        mode = 'tutor',
        sessionId = null,
        model = AI_CONFIG.DEFAULT_MODEL,
        options = {},
        requestId = 'internal'
    }) {
        const startTime = Date.now();
        const lowerMessage = message.toLowerCase().trim();

        // 1. Check quick responses first (fast & free)
        for (const [key, text] of Object.entries(this.QUICK_RESPONSES)) {
            if (lowerMessage === key || lowerMessage === key + '!') {
                return {
                    success: true,
                    reply: text,
                    cached: true,
                    usage: { model: 'quick-response', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime }
                };
            }
        }

        // 2. Try available providers in order (Chain of Command)
        for (const providerEntry of this.providers) {
            try {
                console.log(`[AI][${requestId}] Trying ${providerEntry.name}...`);

                let systemInstruction = MITA_PERSONALITY.basePrompt(mode);
                const contextSummary = options.context ? `\n\nContext: ${options.context}` : '';
                if (contextSummary) systemInstruction += contextSummary;

                const result = await providerEntry.instance.generateResponse({
                    model: providerEntry.name === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash',
                    systemInstruction,
                    history,
                    message,
                    requestId
                });

                return {
                    ...result,
                    success: true,
                    requestId
                };
            } catch (error) {
                console.error(`[AI][${requestId}] ${providerEntry.name} failed:`, error.message);
                // Continue to next provider in loop
            }
        }

        // 3. Absolute Fallback if everything else failed
        console.warn(`[AI][${requestId}] All providers failed or none available. Using hard fallback.`);
        return {
            success: true,
            reply: this.getFallbackResponse(message),
            cached: false,
            isFallback: true,
            usage: { model: 'hard-fallback', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime },
            requestId
        };
    }
    /**
     * Intelligent fallback when AI is unavailable
     */
    getFallbackResponse(message) {
        return `👋 **Я Мита, твой напарник по обучению!**

Извини, сейчас у меня временные трудности с подключением к «мозговому центру» (AI-серверу).

**Что можно сделать сейчас:**
1. Попробуй повторить вопрос через минуту.
2. Проверь интернет-соединение.
3. Если ты изучаешь **Python** или **Figma**, загляни в официальную документацию — там много полезного!

Я скоро вернусь в строй и отвечу на все вопросы! 🚀`;
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
