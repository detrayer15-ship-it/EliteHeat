import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const WORKING_MODEL = 'gemini-1.5-flash';

// Session storage (in-memory for MVP)
const sessions = new Map();
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const MAX_HISTORY_LENGTH = 30;

// Rate limiting
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

/**
 * System prompt for Ellie AI Assistant
 */
const SYSTEM_PROMPT = `Ты — Ellie, AI-помощник образовательной платформы EliteHeat.

Твоя задача:
— помогать ученикам, учителям и администраторам
— отвечать простыми и понятными словами
— если вопрос касается сайта — объясняй как им пользоваться
— если вопрос общий — отвечай как обычный AI
— если ты не знаешь точный ответ — скажи честно и предложи вариант решения

Ты эксперт во всех областях и можешь помочь с:
- 💻 Программирование (Python, JavaScript, HTML, CSS, React, Node.js, любые языки)
- 🎨 Дизайн (Figma, UI/UX, графический дизайн)
- 📊 Анализ данных и математика
- 🌐 Веб-разработка (frontend, backend, базы данных)
- 📱 Мобильная разработка
- 🤖 Искусственный интеллект и машинное обучение
- 📝 Написание текстов и презентаций
- 🔧 Отладка кода и поиск ошибок
- 💡 Генерация идей для проектов
- 📚 Объяснение любых концепций простым языком

Правила ответов:
1. Если вопрос из 1-2 слов — попроси уточнение
2. Структурируй ответ: короткий ответ → пояснение → что делать дальше
3. Если вопрос неясен — задай 1 уточняющий вопрос
4. Если просят взлом/мошенничество/вред — откажи и предложи безопасное решение

Не используй сложные термины без объяснения.
Отвечай кратко, но полезно.
Всегда на русском языке.`;

/**
 * Generation config for better responses
 */
const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1500,
};

/**
 * Safety settings - block only high-risk content
 */
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

/**
 * Clean old sessions
 */
function cleanOldSessions() {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
            sessions.delete(sessionId);
            console.log(`🗑️ Cleaned session: ${sessionId}`);
        }
    }
}

/**
 * Check rate limit
 */
function checkRateLimit(sessionId) {
    const now = Date.now();
    const limit = rateLimits.get(sessionId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    if (now > limit.resetTime) {
        limit.count = 1;
        limit.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
        limit.count++;
    }

    rateLimits.set(sessionId, limit);
    return limit.count <= MAX_REQUESTS_PER_WINDOW;
}

/**
 * Get or create session
 */
function getSession(sessionId) {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            history: [],
            lastActivity: Date.now(),
        });
        console.log(`✨ Created new session: ${sessionId}`);
    }

    const session = sessions.get(sessionId);
    session.lastActivity = Date.now();
    return session;
}

/**
 * Fallback responses when AI is unavailable
 */
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
        return 'Привет! Я Ellie, AI-помощник EliteHeat. К сожалению, сейчас я работаю в ограниченном режиме. Попробуйте позже!';
    }

    if (lowerMessage.includes('помощь') || lowerMessage.includes('помоги')) {
        return 'Я готова помочь! Но сейчас работаю в ограниченном режиме. Пожалуйста, попробуйте задать вопрос позже.';
    }

    if (lowerMessage.includes('python') || lowerMessage.includes('программирование')) {
        return 'Python - отличный язык для начинающих! Циклы в Python используют конструкции for и while. Например:\n\nfor i in range(10):\n    print(i)\n\nЭто выведет числа от 0 до 9.';
    }

    if (lowerMessage.includes('react') || lowerMessage.includes('javascript')) {
        return 'React - популярная библиотека для создания пользовательских интерфейсов. Основные концепции: компоненты, props, state, hooks. Начните с изучения функциональных компонентов и хука useState!';
    }

    return 'Извините, сейчас AI работает в ограниченном режиме. Ваш вопрос принят, но полный ответ будет доступен позже. Попробуйте обновить страницу через несколько минут.';
}

/**
 * Send message to AI and get response with history
 */
export const sendAIMessage = async (req, res) => {
    try {
        const { message, session_id } = req.body;

        // Validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Сообщение обязательно'
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Сообщение слишком длинное (максимум 5000 символов)'
            });
        }

        if (!session_id) {
            return res.status(400).json({
                success: false,
                error: 'session_id обязателен'
            });
        }

        // Rate limiting
        if (!checkRateLimit(session_id)) {
            return res.status(429).json({
                success: false,
                error: 'Слишком много запросов. Подождите минуту.'
            });
        }

        // Clean old sessions periodically
        if (Math.random() < 0.1) {
            cleanOldSessions();
        }

        // Check if API is available
        if (!genAI) {
            console.warn('⚠️ Gemini API недоступен, используем fallback');
            return res.json({
                success: true,
                reply: getFallbackResponse(message),
                session_id
            });
        }

        // Get session and history
        const session = getSession(session_id);

        // Build history for Gemini
        const history = session.history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // Generate AI response with history
        const model = genAI.getGenerativeModel({
            model: WORKING_MODEL,
            generationConfig,
            safetySettings,
            systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const aiReply = response.text();

        // Save to history
        session.history.push({ role: 'user', content: message });
        session.history.push({ role: 'model', content: aiReply });

        // Limit history length
        if (session.history.length > MAX_HISTORY_LENGTH) {
            session.history = session.history.slice(-MAX_HISTORY_LENGTH);
        }

        // Log request
        console.log(`💬 Session ${session_id}: ${message.substring(0, 50)}... -> ${aiReply.substring(0, 50)}...`);

        res.json({
            success: true,
            reply: aiReply,
            session_id
        });

    } catch (error) {
        console.error('AI Controller Error:', error);

        // Handle specific errors
        if (error?.message?.includes('API_KEY_INVALID')) {
            return res.status(500).json({
                success: false,
                error: 'Ошибка конфигурации API'
            });
        }

        if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.message?.includes('429')) {
            return res.status(429).json({
                success: false,
                error: 'Превышен лимит запросов. Попробуйте позже.'
            });
        }

        // Fallback response for other errors
        res.json({
            success: true,
            reply: getFallbackResponse(req.body.message),
            session_id: req.body.session_id
        });
    }
};

/**
 * Clear session history
 */
export const clearSession = async (req, res) => {
    try {
        const { session_id } = req.params;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                error: 'session_id обязателен'
            });
        }

        sessions.delete(session_id);
        console.log(`🗑️ Cleared session: ${session_id}`);

        res.json({
            success: true,
            message: 'История диалога очищена'
        });
    } catch (error) {
        console.error('Clear Session Error:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при очистке сессии'
        });
    }
};

/**
 * Get session history
 */
export const getSessionHistory = async (req, res) => {
    try {
        const { session_id } = req.params;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                error: 'session_id обязателен'
            });
        }

        const session = sessions.get(session_id);

        if (!session) {
            return res.json({
                success: true,
                history: []
            });
        }

        res.json({
            success: true,
            history: session.history
        });
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при получении истории'
        });
    }
};

/**
 * Check AI API status
 */
export const checkAIStatus = async (req, res) => {
    try {
        if (!genAI) {
            return res.json({
                success: true,
                status: 'offline',
                message: 'AI недоступен'
            });
        }

        // Quick test
        const model = genAI.getGenerativeModel({ model: WORKING_MODEL });
        await model.generateContent('test');

        res.json({
            success: true,
            status: 'online',
            message: 'AI работает'
        });
    } catch (error) {
        res.json({
            success: true,
            status: 'offline',
            message: 'AI временно недоступен'
        });
    }
};
