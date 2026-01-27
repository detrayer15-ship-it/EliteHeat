import dotenv from 'dotenv';
import { aiService } from '../services/ai.service.js';

dotenv.config();

/**
 * Mita Ultra-Kernel v5.0 (Final Edition)
 * Zero dependencies, high-performance educational engine.
 */
// EXPERT_KNOWLEDGE removed as we now use real AI service

export const sendAIChatMessage = async (req, res) => {
    try {
        const { message, history, mode = 'tutor' } = req.body;
        console.log(`[MITA OS v5.0] Processing: ${message.substring(0, 30)}...`);

        // Use the real AI service for high-quality responses
        const result = await aiService.chat({
            message,
            history: history || [],
            mode
        });

        res.json(result);

    } catch (error) {
        console.error('sendAIChatMessage Error:', error);
        res.json({
            success: true,
            reply: "Извините, сейчас я немного занята. Пожалуйста, попробуйте написать через минуту!",
            usage: { model: 'emergency-fallback', inputTokens: 0, outputTokens: 0, latencyMs: 0 }
        });
    }
};

/**
 * LEGACY - session-based endpoint support
 */
export const sendAIMessage = async (req, res) => {
    try {
        const { message } = req.body;

        const result = await aiService.chat({
            message,
            history: [] // Legacy doesn't send history in the same format
        });

        res.json(result);
    } catch (error) {
        res.json({
            success: true,
            reply: "Извините, сейчас я немного занята. Попробуйте написать позже!"
        });
    }
};

export const clearSession = async (req, res) => res.json({ success: true });
export const getSessionHistory = async (req, res) => res.json({ success: true, history: [] });
/**
 * updateAIConfig - Focus only on Gemini
 */
export const updateAIConfig = async (req, res) => {
    try {
        const { geminiKey, model } = req.body;

        if (geminiKey) {
            AI_CONFIG.PROVIDERS.GEMINI.apiKey = geminiKey;
            aiService.providers.gemini.genAI = new (await import('@google/generative-ai')).GoogleGenerativeAI(geminiKey);
        }

        if (model) {
            AI_CONFIG.DEFAULT_MODEL = model;
        }

        console.log(`[MITA OS] Neural Configuration Updated`);

        res.json({
            success: true,
            message: 'Configuration updated successfully'
        });
    } catch (error) {
        console.error('updateAIConfig Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update configuration'
        });
    }
};

/**
 * checkAIStatus - Simple online/offline check
 */
export const checkAIStatus = async (req, res) => {
    const isOnline = !!(process.env.GEMINI_API_KEY || AI_CONFIG.PROVIDERS.GEMINI.apiKey);
    res.json({
        success: true,
        status: isOnline ? 'online' : 'offline',
        available: isOnline
    });
};
