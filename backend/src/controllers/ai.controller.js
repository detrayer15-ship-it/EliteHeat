import dotenv from 'dotenv';
import crypto from 'crypto';
import { aiService } from '../services/ai.service.js';
import { AI_CONFIG } from '../config/ai.config.js';

dotenv.config();

/**
 * Mita Ultra-Kernel v5.0 (Final Edition)
 * Zero dependencies, high-performance educational engine.
 */

export const sendAIChatMessage = async (req, res) => {
    const requestId = crypto.randomUUID();
    try {
        const { message, history, mode = 'tutor' } = req.body;
        // Truncate message for logging to protect privacy/reduce noise
        const logMsg = message ? (message.substring(0, 40) + (message.length > 40 ? '...' : '')) : 'empty';
        console.log(`[AI][${requestId}] Processing: ${logMsg}`);

        // Use the real AI service for high-quality responses
        const result = await aiService.chat({
            message,
            history: history || [],
            mode,
            requestId // Pass through for nested logging
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
 * checkAIStatus - Unified status check for any configured provider
 */
export const checkAIStatus = async (req, res) => {
    const requestId = crypto.randomUUID();
    const geminiKey = process.env.GEMINI_API_KEY || AI_CONFIG.PROVIDERS.GEMINI.apiKey;
    const openaiKey = process.env.OPENAI_API_KEY || AI_CONFIG.PROVIDERS.OPENAI.apiKey;

    const isOnline = !!(openaiKey || geminiKey);

    console.log(`[AI][${requestId}] Status Check: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

    res.json({
        success: true,
        status: isOnline ? 'online' : 'offline',
        available: isOnline,
        provider: openaiKey ? 'openai' : (geminiKey ? 'gemini' : 'none'),
        requestId
    });
};

/**
 * updateAIConfig - Update keys for multiple providers and hot-reload
 */
export const updateAIConfig = async (req, res) => {
    const requestId = crypto.randomUUID();
    try {
        const { geminiKey, openaiKey, model } = req.body;

        if (geminiKey) AI_CONFIG.PROVIDERS.GEMINI.apiKey = geminiKey;
        if (openaiKey) AI_CONFIG.PROVIDERS.OPENAI.apiKey = openaiKey;
        if (model) AI_CONFIG.DEFAULT_MODEL = model;

        // Re-initialize service with new keys
        aiService.reinitialize();

        console.log(`[AI][${requestId}] Neural Configuration Updated & Hot-Reloaded`);

        res.json({
            success: true,
            message: 'Configuration updated and services re-initialized',
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
