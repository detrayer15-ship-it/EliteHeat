/**
 * Context Service for EliteHeat
 * Manages conversation history and context memory for AI sessions
 */

class ContextService {
    constructor() {
        this.sessions = new Map();
        this.maxHistoryLength = 20; // Max messages per session
        this.sessionTTL = 60 * 60 * 1000; // 1 hour session lifetime

        // Cleanup old sessions every 15 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 15 * 60 * 1000);

        console.log('[CONTEXT] Service initialized');
    }

    /**
     * Get or create session
     */
    getSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                history: [],
                topics: new Set(),
                createdAt: Date.now(),
                lastActivity: Date.now(),
                messageCount: 0
            });
        }

        const session = this.sessions.get(sessionId);
        session.lastActivity = Date.now();

        return session;
    }

    /**
     * Add message to session history
     */
    addMessage(sessionId, role, content) {
        const session = this.getSession(sessionId);

        session.history.push({
            role,
            content,
            timestamp: Date.now()
        });

        session.messageCount++;

        // Extract and track topics
        this.extractTopics(session, content);

        // Trim history if too long (keep context manageable)
        if (session.history.length > this.maxHistoryLength) {
            // Keep first 2 messages (context) and last N messages
            const first = session.history.slice(0, 2);
            const recent = session.history.slice(-this.maxHistoryLength + 2);
            session.history = [...first, ...recent];
        }

        return session;
    }

    /**
     * Extract topics from message for context awareness
     */
    extractTopics(session, content) {
        const lowerContent = content.toLowerCase();

        const topicKeywords = {
            'python': ['python', 'питон', 'пайтон', 'код', 'программ', 'функци', 'класс', 'переменн'],
            'figma': ['figma', 'фигма', 'дизайн', 'ui', 'ux', 'интерфейс', 'макет', 'прототип'],
            'web': ['html', 'css', 'javascript', 'js', 'веб', 'сайт', 'страниц'],
            'database': ['база данных', 'sql', 'mongodb', 'firebase', 'firestore'],
            'api': ['api', 'rest', 'запрос', 'endpoint', 'сервер']
        };

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(kw => lowerContent.includes(kw))) {
                session.topics.add(topic);
            }
        }
    }

    /**
     * Get formatted history for AI
     */
    getHistoryForAI(sessionId, maxMessages = 10) {
        const session = this.sessions.get(sessionId);

        if (!session || session.history.length === 0) {
            return [];
        }

        // Return last N messages in AI-compatible format
        return session.history.slice(-maxMessages).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    }

    /**
     * Build context summary for better AI responses
     */
    getContextSummary(sessionId) {
        const session = this.sessions.get(sessionId);

        if (!session) {
            return null;
        }

        const topics = Array.from(session.topics);

        if (topics.length === 0) {
            return null;
        }

        const topicNames = {
            'python': 'Python',
            'figma': 'Figma/дизайн',
            'web': 'веб-разработка',
            'database': 'базы данных',
            'api': 'API/серверы'
        };

        const topicList = topics.map(t => topicNames[t] || t).join(', ');

        return `[Контекст сессии: обсуждаемые темы — ${topicList}. Сообщений: ${session.messageCount}]`;
    }

    /**
     * Clear session
     */
    clearSession(sessionId) {
        this.sessions.delete(sessionId);
        console.log(`[CONTEXT] Session ${sessionId} cleared`);
    }

    /**
     * Cleanup expired sessions
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastActivity > this.sessionTTL) {
                this.sessions.delete(sessionId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`[CONTEXT] Cleanup: removed ${cleaned} expired sessions`);
        }
    }

    /**
     * Get session statistics
     */
    getStats() {
        return {
            activeSessions: this.sessions.size,
            sessionTTL: this.sessionTTL,
            maxHistoryLength: this.maxHistoryLength
        };
    }

    /**
     * Destroy service
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.sessions.clear();
    }
}

export const contextService = new ContextService();
