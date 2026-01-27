import express from 'express';
import { body } from 'express-validator';
import { sendAIMessage, sendAIChatMessage, clearSession, getSessionHistory, checkAIStatus, updateAIConfig } from '../controllers/ai.controller.js';
import { generateTask } from '../controllers/ai.controller.generateTask.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Rate limiting middleware
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

const rateLimit = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    if (now > userLimit.resetTime) {
        userLimit.count = 1;
        userLimit.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
        userLimit.count++;
    }

    rateLimitMap.set(ip, userLimit);

    if (userLimit.count > MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            error: 'Слишком много запросов. Попробуйте позже.'
        });
    }

    next();
};

/**
 * POST /api/ai/chat/message (NEW - Firestore-based)
 * Send message to AI with history from frontend
 */
router.post(
    '/chat/message',
    rateLimit,
    [
        body('message')
            .trim()
            .notEmpty()
            .withMessage('Сообщение обязательно')
            .isLength({ max: 5000 })
            .withMessage('Сообщение слишком длинное'),
        body('history')
            .isArray()
            .withMessage('История должна быть массивом'),
        body('mode')
            .optional()
            .isIn(['tutor', 'developer', 'debug', 'product'])
            .withMessage('Неверный режим')
    ],
    validate,
    sendAIChatMessage
);

/**
 * POST /api/ai/chat (LEGACY - session-based)
 * Send message to AI
 */
router.post(
    '/chat',
    rateLimit,
    [
        body('message')
            .trim()
            .notEmpty()
            .withMessage('Сообщение обязательно')
            .isLength({ max: 5000 })
            .withMessage('Сообщение слишком длинное'),
        body('session_id')
            .trim()
            .notEmpty()
            .withMessage('session_id обязателен')
    ],
    validate,
    sendAIMessage
);

/**
 * DELETE /api/ai/session/:session_id
 * Clear session history
 */
router.delete('/session/:session_id', clearSession);

/**
 * GET /api/ai/session/:session_id/history
 * Get session history
 */
router.get('/session/:session_id/history', getSessionHistory);

/**
 * GET /api/ai/status
 * Check AI status
 */
router.get('/status', checkAIStatus);

/**
 * POST /api/ai/config
 * Update AI configuration (keys/model)
 */
router.post('/config', updateAIConfig);

/**
 * POST /api/ai/generate-task
 * Generate AI-powered learning task
 */
router.post(
    '/generate-task',
    rateLimit,
    [
        body('subject')
            .isIn(['python', 'figma'])
            .withMessage('subject должен быть "python" или "figma"'),
        body('difficulty')
            .isIn(['beginner', 'intermediate', 'advanced'])
            .withMessage('difficulty должен быть "beginner", "intermediate" или "advanced"')
    ],
    validate,
    generateTask
);

export default router;
