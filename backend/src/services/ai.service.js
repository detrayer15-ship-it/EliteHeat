import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, MITA_PERSONALITY } from '../config/ai.config.js';
import { cacheService } from './cache.service.js';
import { contextService } from './context.service.js';

/**
 * OpenAI Provider - Battle-tested and stable (Gold Standard)
 */
class OpenAIProvider {
    constructor(apiKey) {
        this.client = apiKey ? new OpenAI({ apiKey }) : null;
        console.log(`[OPENAI] Provider initialized: ${apiKey ? 'API key present' : 'NO API KEY'}`);
    }

    async generateResponse({ models, systemInstruction, history, message, image, requestId }) {
        if (!this.client) throw new Error('OpenAI API key not configured');

        const modelList = models || AI_CONFIG.PROVIDERS.OPENAI.models;
        let lastError = null;

        for (const modelId of modelList) {
            console.log(`[OPENAI][${requestId}] Trying model: ${modelId}`);
            try {
                let userContent;
                if (image && image.base64) {
                    console.log(`[OPENAI][${requestId}] Sending with Vision Context`);
                    userContent = [
                        { type: 'text', text: message },
                        {
                            type: 'image_url',
                            image_url: { url: `data:${image.type};base64,${image.base64}` }
                        }
                    ];
                } else {
                    userContent = message;
                }

                const response = await this.client.chat.completions.create({
                    model: modelId,
                    messages: [
                        { role: 'system', content: systemInstruction },
                        ...history.map(msg => ({
                            role: msg.role === 'user' ? 'user' : 'assistant',
                            content: msg.content
                        })),
                        { role: 'user', content: userContent }
                    ],
                    temperature: 0.7,
                    max_tokens: 2048,
                });

                console.log(`[OPENAI][${requestId}] Response received successfully from ${modelId}!`);
                return {
                    text: response.choices[0].message.content,
                    usage: {
                        inputTokens: response.usage?.prompt_tokens || 0,
                        outputTokens: response.usage?.completion_tokens || 0,
                    }
                };
            } catch (error) {
                console.error(`[OPENAI][${requestId}] ${modelId} FAILED:`, error.message);
                lastError = error;
                if (error.message.includes('quota') || error.message.includes('429')) {
                    console.warn(`[OPENAI] Quota exceeded for ${modelId}. Trying next model/provider...`);
                    continue;
                }
                continue;
            }
        }
        throw lastError || new Error('All OpenAI models failed');
    }
}

/**
 * Gemini Provider - High speed and large context (The Silver Shield)
 */
class GeminiProvider {
    constructor(apiKey) {
        this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
        console.log(`[GEMINI] Provider initialized: ${apiKey ? 'API key present' : 'NO API KEY'}`);
    }

    async generateResponse({ models, systemInstruction, history, message, image, requestId }) {
        if (!this.genAI) throw new Error('Gemini API key not configured');

        const modelList = models || AI_CONFIG.PROVIDERS.GEMINI.models;
        let lastError = null;

        for (const modelId of modelList) {
            console.log(`[GEMINI][${requestId}] Trying model: ${modelId}`);
            try {
                // Fix: Pass systemInstruction as a Part object for better compatibility
                const model = this.genAI.getGenerativeModel({
                    model: modelId,
                    systemInstruction: {
                        role: 'system',
                        parts: [{ text: systemInstruction }]
                    }
                });

                const chat = model.startChat({
                    history: history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }))
                });

                let response;
                if (image && image.base64) {
                    console.log(`[GEMINI][${requestId}] Sending with Vision Content (Parts)`);
                    const parts = [
                        { text: message },
                        {
                            inlineData: {
                                data: image.base64,
                                mimeType: image.type
                            }
                        }
                    ];
                    response = await model.generateContent(parts);
                } else {
                    response = await chat.sendMessage(message);
                }

                // Get result text safely
                const result = await response.response;
                const responseText = result.text();

                console.log(`[GEMINI][${requestId}] Response received successfully from ${modelId}!`);

                return {
                    text: responseText,
                    usage: {
                        inputTokens: result.usageMetadata?.promptTokenCount || 0,
                        outputTokens: result.usageMetadata?.candidatesTokenCount || 0,
                    }
                };
            } catch (error) {
                console.error(`[GEMINI][${requestId}] ${modelId} FAILED:`, error.message);
                lastError = error;
                continue;
            }
        }
        throw lastError || new Error('All Gemini models failed');
    }
}

/**
 * Enhanced AI Service v8.0 - Gemini 2.0 Priority (Hybrid Resilience)
 */
class AIService {
    constructor() {
        this.providers = [];
        this.reinitialize();
    }

    /**
     * Initialize providers based on current config (Gemini Priority)
     */
    initialize() {
        this.providers = [];
        const openaiKey = AI_CONFIG.PROVIDERS.OPENAI.apiKey;
        const geminiKey = AI_CONFIG.PROVIDERS.GEMINI.apiKey;

        // Gemini 2.0 is now the primary engine
        if (geminiKey && !geminiKey.includes('AIza')) {
            console.log(`[MITA AI] Gemini 2.0 Provider Registered (Primary)`);
            this.providers.push({ name: 'gemini', instance: new GeminiProvider(geminiKey) });
        }

        if (openaiKey && !openaiKey.includes('sk-xxxx')) {
            console.log(`[MITA AI] OpenAI Provider Registered (Fallback)`);
            this.providers.push({ name: 'openai', instance: new OpenAIProvider(openaiKey) });
        }

        if (this.providers.length === 0) {
            console.warn(`[MITA AI] No AI providers configured! Fallbacks will be used.`);
        }
    }

    /**
     * Hot-reloading of API keys
     */
    reinitialize() {
        this.providers = [];
        const openaiKey = process.env.OPENAI_API_KEY || AI_CONFIG.PROVIDERS.OPENAI.apiKey;
        const geminiKey = process.env.GEMINI_API_KEY || AI_CONFIG.PROVIDERS.GEMINI.apiKey;

        if (geminiKey && geminiKey.length > 10) {
            this.providers.push({ name: 'gemini', instance: new GeminiProvider(geminiKey) });
        }

        if (openaiKey && !openaiKey.includes('sk-xxxx')) {
            this.providers.push({ name: 'openai', instance: new OpenAIProvider(openaiKey) });
        }

        console.log(`[AI] Service re-initialized with ${this.providers.length} providers (Gemini Primary).`);
    }

    /**
     * Detect user intent for precise mode selection (v6.0 - Vision aware)
     */
    detectIntent(message, hasImage) {
        const low = message.toLowerCase().trim();

        // Priority: Vision > Code > Tutor > Direct
        if (hasImage) return 'VISION';

        const codeKeywords = ['код', 'пример', 'напиши', 'реализация', 'разработчик', 'функци', 'клас'];
        const tutorKeywords = ['почему', 'объясни', 'расскажи', 'подробно', 'как работает', 'разбери'];
        const directKeywords = ['где', 'как', 'что', 'сколько', 'можно ли', 'найди', 'ссылк'];

        const hasCode = codeKeywords.some(k => low.includes(k));
        const hasTutor = tutorKeywords.some(k => low.includes(k));
        const hasDirect = directKeywords.some(k => low.includes(k));

        if (hasCode && hasTutor) return 'CODE_EXPLAIN';
        if (hasCode) return 'CODE';
        if (hasTutor) return 'TUTOR';

        return 'DIRECT'; // Default for everything else
    }

    /**
     * Main chat method - v6.0 Visual Assistant
     */
    async chat({
        message,
        history = [],
        image = null,
        mode = null,
        requestId = 'internal'
    }) {
        const startTime = Date.now();
        const errors = [];

        // 1. Available providers check
        if (this.providers.length === 0) {
            return {
                success: true,
                reply: this.getFallbackResponse(message, 'NO_PROVIDERS_CONFIGURED'),
                isFallback: true,
                usage: { model: 'hard-fallback', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime },
                requestId
            };
        }

        // 2. Intent Classification
        const intent = mode?.toUpperCase() || this.detectIntent(message, !!image);
        console.log(`[MITA][${requestId}] intent=${intent} vision=${!!image}`);

        // Inject mode-specific instruction (v6.0 Vision & Self-Correction)
        const intentInstructions = {
            'DIRECT': 'РЕЖИМ: DIRECT. Давай краткий, но полный и готовый ответ сразу.',
            'TUTOR': 'РЕЖИМ: TUTOR. Давай готовое решение и подробно объясняй, как оно работает. Не ограничивайся подсказками.',
            'CODE': 'РЕЖИМ: CODE. Дай исправленный или новый код в блоке и кратко поясни логику решения.',
            'CODE_EXPLAIN': 'РЕЖИМ: CODE_EXPLAIN. Проведи подробный разбор кода и исправь ошибки, если они есть.',
            'VISION': 'РЕЖИМ: VISION. Тщательно проанализируй изображение. Если это ошибка в коде — дай исправленный код. Если это дизайн в Figma — дай конкретные советы по улучшению (цвета, шрифты, анимация).'
        };

        const instruction = intentInstructions[intent] || intentInstructions['DIRECT'];
        const augmentedMessage = `${instruction}\n\nВОПРОС: ${message}`;

        // 3. Chain of Command
        for (const providerEntry of this.providers) {
            try {
                console.log(`[AI][${requestId}] Trying ${providerEntry.name}...`);

                let systemInstruction = MITA_PERSONALITY.basePrompt(intent.toLowerCase());

                const result = await providerEntry.instance.generateResponse({
                    models: providerEntry.name === 'openai' ? AI_CONFIG.PROVIDERS.OPENAI.models : AI_CONFIG.PROVIDERS.GEMINI.models,
                    systemInstruction,
                    history,
                    message: augmentedMessage,
                    image,
                    requestId
                });

                let cleanReply = result.text.replace(/РЕЖИМ:.*?\n\n/gi, '').trim();

                return {
                    reply: cleanReply,
                    usage: result.usage,
                    success: true,
                    requestId,
                    intent,
                    provider: providerEntry.name,
                    isVision: !!image
                };
            } catch (error) {
                console.error(`[AI][${requestId}] ${providerEntry.name} failed:`, error.message);
                errors.push(`${providerEntry.name}: ${error.message}`);
                // Continue to next provider in loop
            }
        }

        // 4. Absolute Fallback
        console.warn(`[AI][${requestId}] All providers failed. Errors:`, errors.join(' | '));
        return {
            success: true,
            reply: this.getFallbackResponse(message, errors.join('\n')),
            isFallback: true,
            usage: { model: 'hard-fallback', inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime },
            requestId,
            intent,
            debugErrors: errors
        };
    }

    /**
     * Intelligent fallback when AI is unavailable
     */
    getFallbackResponse(message, errorHint = '') {
        const debugInfo = process.env.NODE_ENV === 'development' ? `\n\n*(Debug: ${errorHint})*` : '';

        return `👋 **Я Мита, твой напарник по обучению!**

Извини, сейчас у меня временные трудности с подключением к «мозговому центру» (AI-серверу).

**Что можно сделать сейчас:**
1. Попробуй повторить вопрос через минуту.
2. Проверь интернет-соединение.
3. Если ты изучаешь **Python** или **Figma**, загляни в официальную документацию — там много полезного!

Я скоро вернусь в строй и отвечу на все вопросы! 🚀${debugInfo}`;
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
