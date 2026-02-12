import crypto from 'crypto';
import { aiService } from '../services/ai.service.js';
import { askAI } from '../services/simple-ai.service.js';
import { autoReply } from '../services/auto-reply.service.js';
import { AI_CONFIG } from '../config/ai.config.js';

// dotenv is already configured in server.js

/**
 * Mita Ultra-Kernel v5.0 (Final Edition)
 * Zero dependencies, high-performance educational engine.
 */

export const sendAIChatMessage = async (req, res) => {
    const requestId = crypto.randomUUID();
    console.log(`[DEBUG][${requestId}] PAYLOAD:`, JSON.stringify(req.body, null, 2));
    try {
        const { message, history, mode = 'tutor', image = null } = req.body;
        // Truncate message for logging
        const logMsg = message ? (message.substring(0, 40) + (message.length > 40 ? '...' : '')) : 'empty';
        console.log(`[AI][${requestId}] Processing message (image=${!!image})`);

        // Use the real AI service for high-quality responses
        const result = await aiService.chat({
            message,
            history: history || [],
            image,
            mode,
            requestId
        });

        res.json({
            ...result,
            requestId
        });

    } catch (error) {
        console.error(`[AI][${requestId}] Request failed:`, error);
        res.status(500).json({
            success: false,
            error: 'AI_SERVICE_ERROR',
            message: "Извините, сейчас я немного занята. Пожалуйста, попробуйте написать через минуту!",
            requestId
        });
    }
};

/**
 * SIMPLE CHAT (Gold Standard Bridge)
 */
export const sendSimpleChat = async (req, res) => {
    const { message } = req.body;
    console.log("[DEBUG] SIMPLE-PAYLOAD:", req.body);

    if (!message || !message.trim()) {
        return res.json({
            role: "assistant",
            content: "Сообщение пустое."
        });
    }

    try {
        const answer = await askAI(message);
        res.json({
            role: "assistant",
            content: answer,
            success: true
        });
    } catch (err) {
        console.error("[SIMPLE-AI ERROR]", err);
        res.json({
            role: "assistant",
            content: "Ошибка подключения к ИИ (Simple Bridge).",
            error: err.message
        });
    }
};

/**
 * LEGACY - session-based endpoint support
 */
export const sendAIMessage = async (req, res) => {
    const requestId = crypto.randomUUID();
    try {
        const { message } = req.body;
        const logMsg = message ? (message.substring(0, 40) + (message.length > 40 ? '...' : '')) : 'empty';
        console.log(`[AI-LEGACY][${requestId}] Processing: ${logMsg}`);

        const result = await aiService.chat({
            message,
            history: [],
            requestId
        });

        res.json({
            ...result,
            requestId
        });
    } catch (error) {
        console.error(`[AI-LEGACY][${requestId}] Request failed:`, error);
        res.status(500).json({
            success: false,
            error: 'LEGACY_AI_ERROR',
            message: "Извините, сейчас я немного занята. Попробуйте написать позже!",
            requestId
        });
    }
};

export const clearSession = async (req, res) => res.json({ success: true });
export const getSessionHistory = async (req, res) => res.json({ success: true, history: [] });

/**
 * checkAIStatus - Hybrid status check
 */
export const checkAIStatus = async (req, res) => {
    const requestId = crypto.randomUUID();
    const openaiKey = process.env.OPENAI_API_KEY || AI_CONFIG.PROVIDERS.OPENAI.apiKey;
    const geminiKey = process.env.GEMINI_API_KEY || AI_CONFIG.PROVIDERS.GEMINI.apiKey;

    const isOnline = !!(openaiKey || geminiKey);
    const registered = aiService.providers.map(p => p.name);

    console.log(`[AI][${requestId}] Status Check: ${isOnline ? 'ONLINE' : 'OFFLINE'} (${registered.join(', ')})`);

    res.json({
        success: true,
        status: isOnline ? 'online' : 'offline',
        available: isOnline,
        providers: registered,
        primary: registered[0] || 'none',
        requestId
    });
};

/**
 * updateAIConfig - Simplified for OpenAI only
 */
export const updateAIConfig = async (req, res) => {
    const requestId = crypto.randomUUID();
    try {
        const { openaiKey, model } = req.body;

        if (openaiKey) AI_CONFIG.PROVIDERS.OPENAI.apiKey = openaiKey;
        if (model) AI_CONFIG.DEFAULT_MODEL = model;

        // Re-initialize service
        aiService.reinitialize();

        res.json({
            success: true,
            message: 'OpenAI Configuration updated',
            requestId
        });
    } catch (error) {
        console.error(`[AI][${requestId}] Config update failed:`, error);
        res.status(500).json({
            success: false,
            error: 'CONFIG_UPDATE_FAILED',
            requestId
        });
    }
};

/**
 * AUTO-AI (Exact user spec: wrote -> received answer)
 * Guaranteed to never return an error status, always an answer.
 */
export const sendAutoAI = async (req, res) => {
    const { message, history = [], image = null, mode = 'assistant' } = req.body;
    const requestId = crypto.randomUUID();

    if (!message || !message.trim()) {
        return res.json({ answer: "Напиши сообщение." });
    }

    try {
        console.log(`[AUTO-AI][${requestId}] Routing through main AIService...`);

        // Use the high-quality main AI service instead of a simple bridge
        const result = await aiService.chat({
            message,
            history,
            image,
            mode,
            requestId
        });

        res.json({
            answer: result.reply,
            success: true,
            requestId
        });
    } catch (e) {
        console.error(`[AUTO-AI][${requestId}] Critical Failure:`, e);
        res.json({
            answer: "Извините, сейчас я немного занята. Попробуйте написать через минуту!",
            success: false,
            requestId
        });
    }
};
