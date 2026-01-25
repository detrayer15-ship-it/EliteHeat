import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, MITA_PERSONALITY } from '../config/ai.config.js';

/**
 * Base AI Provider Class
 */
class AIProvider {
    async generateResponse(params) {
        throw new Error('Method generateResponse must be implemented');
    }
}

/**
 * Gemini Provider Implementation
 */
class GeminiProvider extends AIProvider {
    constructor(apiKey) {
        super();
        this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
    }

    async generateResponse({ model, systemInstruction, history, message, options = {} }) {
        if (!this.genAI) throw new Error('Gemini API key not configured');

        const genModel = this.genAI.getGenerativeModel({
            model: model || AI_CONFIG.DEFAULT_MODEL,
            generationConfig: {
                ...AI_CONFIG.GENERATION_DEFAULTS,
                ...options
            },
            systemInstruction: systemInstruction,
            safetySettings: AI_CONFIG.SAFETY_SETTINGS.map(s => ({
                category: s.category,
                threshold: s.threshold
            }))
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
    }
}

/**
 * AI Service Facade
 */
class AIService {
    constructor() {
        this.providers = {
            gemini: new GeminiProvider(AI_CONFIG.PROVIDERS.GEMINI.apiKey),
            // openai: new OpenAIProvider(AI_CONFIG.PROVIDERS.OPENAI.apiKey) // Future expansion
        };
    }

    /**
     * Get provider by model name
     */
    getProvider(model) {
        if (model?.startsWith('gpt') || AI_CONFIG.PROVIDERS.OPENAI.models.includes(model)) {
            return this.providers.openai;
        }
        return this.providers.gemini;
    }

    /**
     * Main method to generate AI response
     */
    async chat({
        message,
        history = [],
        mode = 'tutor',
        model = AI_CONFIG.DEFAULT_MODEL,
        options = {}
    }) {
        try {
            const provider = this.getProvider(model);
            const systemInstruction = MITA_PERSONALITY.basePrompt(mode);

            // Add custom instructions based on options
            let finalSystemInstruction = systemInstruction;
            if (options.style === 'brief') {
                finalSystemInstruction += '\n\nОТВЕТЬ МАКСИМАЛЬНО КРАТКО.';
            } else if (options.style === 'detailed') {
                finalSystemInstruction += '\n\nДАЙ РАЗВЕРНУТЫЙ И ПОДРОБНЫЙ ОТВЕТ.';
            }

            if (options.format === 'steps') {
                finalSystemInstruction += '\n\nРАЗБЕЙ ОТВЕТ НА ПОШАГОВУЮ ИНСТРУКЦИЮ.';
            }

            const startTime = Date.now();
            const result = await provider.generateResponse({
                model,
                systemInstruction: finalSystemInstruction,
                history,
                message,
                options
            });

            // Validation: check for empty or too short responses
            if (!result.text || result.text.trim().length < 2) {
                console.warn('AI returned empty or too short response');
                return {
                    success: true,
                    reply: "Извините, я не смогла сформулировать ответ. Попробуйте перефразировать ваш вопрос, я обязательно постараюсь помочь!",
                    usage: { model, ...result.usage, latencyMs: Date.now() - startTime }
                };
            }

            return {
                success: true,
                reply: result.text,
                usage: {
                    model,
                    ...result.usage,
                    latencyMs: Date.now() - startTime
                }
            };
        } catch (error) {
            console.error('AIService Error:', error);

            // Check for specific API errors
            const isRateLimit = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
            const isApiKey = error.message?.includes('API_KEY_INVALID');

            let errorMessage = "Извините, у меня возникли временные трудности с подключением к нейросети.";

            if (isRateLimit) {
                errorMessage = "Я получила слишком много запросов сразу. Пожалуйста, подождите минутку, и я снова буду готова отвечать!";
            } else if (isApiKey) {
                errorMessage = "Упс, кажется, у меня возникли проблемы с конфигурацией (API Key). Пожалуйста, сообщите администратору.";
            }

            return {
                success: false,
                error: error.message,
                reply: errorMessage
            };
        }
    }

    /**
     * Emergency fallback for catastrophic failures
     */
    getEmergencyFallback(message) {
        return "Извините, у меня возникли временные трудности с подключением к нейросети. Пожалуйста, попробуйте повторить ваш вопрос чуть позже. Я обязательно помогу вам!";
    }
}

export const aiService = new AIService();
