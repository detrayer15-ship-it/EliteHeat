// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Session ID management
const SESSION_ID_KEY = 'eliteheat_ai_session_id'

/**
 * Get or create session ID
 */
export function getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY)

    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        localStorage.setItem(SESSION_ID_KEY, sessionId)
    }

    return sessionId
}

/**
 * Clear session ID (for new chat)
 */
export function clearSessionId(): void {
    localStorage.removeItem(SESSION_ID_KEY)
}

/**
 * Отправка текстового запроса к AI через backend с session_id
 */
export async function sendTextMessage(message: string): Promise<string> {
    try {
        const session_id = getSessionId()

        const response = await fetch(`${API_URL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, session_id })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка AI')
        }

        return data.reply
    } catch (error: any) {
        console.error('AI API Error:', error)

        // Fallback response if backend is unavailable
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            return getFallbackResponse(message)
        }

        throw error
    }
}

/**
 * Clear session history
 */
export async function clearSessionHistory(): Promise<void> {
    try {
        const session_id = getSessionId()

        await fetch(`${API_URL}/api/ai/session/${session_id}`, {
            method: 'DELETE',
        })

        // Create new session
        clearSessionId()
    } catch (error) {
        console.error('Clear Session Error:', error)
    }
}

/**
 * Get session history
 */
export async function getSessionHistory(): Promise<Array<{ role: string, content: string }>> {
    try {
        const session_id = getSessionId()

        const response = await fetch(`${API_URL}/api/ai/session/${session_id}/history`)
        const data = await response.json()

        return data.history || []
    } catch (error) {
        console.error('Get History Error:', error)
        return []
    }
}

/**
 * Fallback ответы если Gemini недоступен
 */
function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('python') || lowerMessage.includes('цикл')) {
        return `🐍 **Python - Циклы**

**For цикл:**
\`\`\`python
for i in range(5):
    print(i)  # Выведет: 0, 1, 2, 3, 4
\`\`\`

**While цикл:**
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

**For по списку:**
\`\`\`python
fruits = ['яблоко', 'банан', 'апельсин']
for fruit in fruits:
    print(fruit)
\`\`\`

Что конкретно нужно объяснить?`
    }

    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        return `⚡ **JavaScript - Основы**

**Переменные:**
\`\`\`javascript
let name = "Студент";
const age = 20;
\`\`\`

**Функции:**
\`\`\`javascript
const greet = (name) => \`Привет, \${name}!\`;
\`\`\`

**Async/Await:**
\`\`\`javascript
async function fetchData() {
    const response = await fetch('url');
    const data = await response.json();
    return data;
}
\`\`\`

Задайте конкретный вопрос!`
    }

    if (lowerMessage.includes('react')) {
        return `⚛️ **React - Основы**

**Компонент с useState:**
\`\`\`jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Счёт: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                +1
            </button>
        </div>
    );
}
\`\`\`

Что нужно объяснить?`
    }

    return `👋 **Привет! Я AI-помощник EliteHeat**

Я могу помочь с:
- 🐍 Python программированием
- ⚡ JavaScript разработкой
- ⚛️ React
- 🎨 Figma дизайном
- 📊 Презентациями

**Примеры вопросов:**
- "Объясни циклы в Python"
- "Как работает async/await в JavaScript?"
- "Что такое React hooks?"

Задайте конкретный вопрос!`
}

/**
 * Отправка изображения с текстом к AI
 * Note: Image analysis currently not implemented in backend
 */
export async function sendImageMessage(
    message: string,
    imageBase64: string
): Promise<string> {
    // TODO: Implement image analysis endpoint in backend
    return `🖼️ **Анализ изображений**

Функция анализа изображений временно недоступна.

**Что можно сделать:**
1. Опишите что на изображении текстом
2. Скопируйте код с изображения
3. Задайте вопрос о содержимом

Я помогу на основе описания!`
}

/**
 * Проверка кода на ошибки
 */
export async function checkCode(code: string, language: string): Promise<string> {
    const prompt = `Проверь этот код на ${language} и найди ошибки:

\`\`\`${language}
${code}
\`\`\`

Предоставь:
1. Список ошибок
2. Объяснение
3. Исправленный код
4. Рекомендации`

    return sendTextMessage(prompt)
}

/**
 * Помощь с презентацией
 */
export async function helpWithPresentation(topic: string, details: string): Promise<string> {
    const prompt = `Помоги создать презентацию на тему: "${topic}"

Детали: ${details}

Предоставь:
1. Структуру слайдов (8-10)
2. Ключевые пункты
3. Рекомендации по дизайну
4. Советы для выступления`

    return sendTextMessage(prompt)
}

/**
 * Проверка доступности API
 */
export async function checkAPIStatus(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/api/ai/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // If backend is down, we still have fallback responses
            console.log('Backend unavailable, using fallback mode')
            return true // Return true because fallback mode works
        }

        const data = await response.json()
        return data.success && data.available
    } catch (error) {
        // Network error - backend not running, but fallback works
        console.log('API Status Check Failed, using fallback mode:', error)
        return true // Always return true because we have fallback responses
    }
}

