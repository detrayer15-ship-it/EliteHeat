import { getAIChatMessages, addUserMessage, addAssistantMessage } from './aiMessages'
import { touchAIChat } from './aiChats'
// import type { ChatMode } from './aiChats'

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://eliteheat-backend.web.app' : 'http://localhost:3000')

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

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.reply || data.error || `Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        return data.reply;
    } catch (error: any) {
        // Fallback response if backend is unavailable or connection refused
        if (
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('NetworkError') ||
            error.name === 'TypeError'
        ) {
            return getFallbackResponse(message);
        }

        throw error;
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
 * AI Usage metadata interface
 */
export interface AIUsage {
    model: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
}

/**
 * Send AI chat message with history from Firestore (NEW)
 * This is the new way to send messages - uses Firestore for persistence
 */
export async function sendAIChatMessage(
    chatId: string,
    message: string
): Promise<{ reply: string; usage: AIUsage }> {
    try {
        // 1. Add user message to Firestore
        await addUserMessage(chatId, message)

        // 2. Get chat history from Firestore
        const messages = await getAIChatMessages(chatId)

        // Convert to history format for backend (last 25 messages)
        const history = messages.slice(-25).map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        // 3. Call backend with history
        const response = await fetch(`${API_URL}/api/ai/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.reply || data.error || 'Ошибка AI')
        }

        // 4. Add assistant response to Firestore
        await addAssistantMessage(chatId, data.reply, data.usage)

        // 5. Update chat's updatedAt timestamp
        await touchAIChat(chatId)

        return {
            reply: data.reply,
            usage: data.usage || { model: 'gemini-1.5-flash', inputTokens: 0, outputTokens: 0, latencyMs: 0 }
        }

    } catch (error: any) {
        console.error('AI Chat Message Error (Backend connection failure):', error)

        // Fallback response if backend is unavailable
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'TypeError') {
            const fallbackReply = getFallbackResponse(message)
            await addAssistantMessage(chatId, fallbackReply)
            await touchAIChat(chatId)
            return {
                reply: fallbackReply,
                usage: { model: 'fallback-error', inputTokens: 0, outputTokens: 0, latencyMs: 0 }
            }
        }

        throw error
    }
}

/**
 * Fallback ответы если Gemini недоступен
 */
function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase()
    let baseReply = ''

    const responses: Record<string, string> = {
        react: `🚀 **React & Frontend**
        
Я помогу с React! Это мощная библиотека для создания интерфейсов.
• **Компоненты**: Разбивай UI на независимые части.
• **Состояние**: Используй useState для хранения данных.
• **События**: Обрабатывай клики и ввод через onClick/onChange.

Я готова подсказать по базовым вещам в React!`,

        python: `🐍 **Python - Основы**
        
Python — идеальный язык для начала.
• **Типы**: int, str, list — твои строительные блоки.
• **Циклы**: for i in range(5) поможет повторить действия.
• **Функции**: def create_app() — способ организовать код.

Я помогу разобраться с переменными, циклами, функциями и ООП. Что именно разобрать?`,

        javascript: `⚡ **JavaScript - Сила веба**
        
JS делает сайты интерактивными.
• **Переменные**: let и const.
• **Условия**: if / else для логики.
• **Функции**: Стрелочные функции () => {} очень удобны.

Я могу подсказать по синтаксису и основным концепциям.`,

        html: `🌐 **HTML - Каркас сайта**
        
• **Теги**: <div>, <h1>, <p> — основа всего.
• **Атрибуты**: class и id для стилизации.
• **Структура**: Всегда начинай с <!DOCTYPE html>.`,

        css: `🎨 **CSS - Дизайн**
        
• **Селекторы**: Находи элементы по классу .button или тегу body.
• **Отступы**: padding(внутри) и margin(снаружи).
• **Цвета**: Используй hex или rgb.`,

        figma: `🎨 **Figma - Дизайн интерфейсов**

Я помогу освоить Figma:
• Как пользоваться инструментами и слоями.
• Что такое UI и UX.
• Как делать кнопки, карточки и формы.
• Работа с Auto Layout и компонентами.
• Сетки, выравнивание, цвета и типографика.`,

        git: `📂 **Git - Контроль версий**
        
• **commit**: Сохраняй "снимки" кода.
• **branch**: Делай фичи отдельно от основного кода.
• **merge**: Соединяй наработки воедино.`,

        "привет": `🌟 **Здравствуйте! Я интеллектуальный ассистент образовательной платформы.**

Я помогаю в освоении **Python** (программирование) и **Figma** (дизайн интерфейсов). 🚀

Я создана для объяснения сложных тем простым языком и поддержки на всех этапах обучения — от начального уровня до продвинутого.

🐍 **Помощь по Python:**
• Понять основы и синтаксис
• Разобраться с переменными, условиями и циклами
• Изучить функции, массивы и структуры данных
• Понять классы и ООП
• Проверить ваш код и найти ошибки

🎨 **Помощь по Figma:**
• Понять, как пользоваться инструментами
• Разобраться в UI/UX дизайне
• Создать интерфейс сайта или приложения
• Сделать кнопки, карточки, формы
• Освоить Auto Layout и компоненты

Вы можете написать вопрос своими словами, например: *«Объясни циклы в Python»* или *«Как сделать кнопку в Figma?»*.

Напишите, что именно нужно — и я помогу! ✨`,
        "как дела": "У меня всё отлично, я на страже твоего обучения! Как твои успехи?",
        "кто твой создатель": "Моим создателем является Даниял.",
        "кто тебя создал": "Моим создателем является Даниял.",
        "что ты умеешь": "Я помогаю изучать программирование на Python и дизайн интерфейсов в Figma.",
        "ты учитель": "Я виртуальный образовательный ассистент.",
        "помоги": "Конечно. Напишите, что именно нужно.",
        "я новичок": "Отлично! Начнем с основ. Python или Figma?",
        "я ничего не понимаю": "Не переживайте. Объясню максимально просто.",
        "что такое python": "Это язык программирования, простой для изучения.",
        "что такое переменная": "Это имя, которое хранит значение.",
        "что такое цикл": "Это повторение действий.",
        "что такое функция": "Это блок кода, который выполняет задачу.",
        "что делает if": "Проверяет условие.",
        "что такое список": "Это набор значений в одном объекте.",
        "ошибка в коде": "Пришлите код — помогу найти проблему.",
        "как начать": "Установите Python и попробуйте print(\"Hello\").",
        "что такое алгоритм": "Это последовательность шагов для решения задачи.",
        "что такое ооп": "Это программирование с использованием классов и объектов.",
        "как сделать игру": "Начните с логики и условий.",
        "как работать с файлами": "Используется функция open().",
        "что такое цикл for": "Цикл для перебора элементов.",
        "что такое while": "Цикл, работающий пока условие истинно.",
        "что такое словарь": "Структура данных «ключ-значение».",
        "что такое figma": "Это программа для создания дизайна интерфейсов.",
        "как сделать кнопку": "Нарисуйте прямоугольник и добавьте текст.",
        "что такое auto layout": "Инструмент для адаптивного расположения элементов.",
        "что такое компонент": "Повторно используемый элемент дизайна.",
        "что такое ui": "Внешний вид интерфейса.",
        "что такое ux": "Удобство использования.",
        "как выровнять элементы": "Используйте инструменты Align.",
        "что такое фрейм": "Рабочая область экрана.",
        "как выбрать цвет": "Используйте цветовую панель.",
        "что такое сетка": "Помогает выравнивать элементы.",
        "дай задание": "Вот практика по теме.",
        "проверь код": "Пришлите его.",
        "объясни проще": "Сейчас объясню максимально просто.",
        "я сделал ошибку": "Ошибки — часть обучения.",
        "сложно": "Разберем по шагам.",
        "быстрее": "Дам краткое объяснение.",
        "медленно": "Подробно объясню каждый шаг.",
        "у меня не получается": "Это нормально, вы учитесь.",
        "я устал": "Сделайте перерыв и продолжим.",
        "это трудно": "С практикой станет легче."
    }

    // Pattern matching
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            baseReply = value
            break
        }
    }

    if (!baseReply) {
        baseReply = `👋 **Я Мита, твой напарник в мире кода и дизайна!**

Я получила твой вопрос: "${message}".

К сожалению, сейчас я не могу дать развернутый ответ на этот конкретный вопрос, так как я сосредоточена на обучении **Python** и **Figma**.

**Я всегда готова помочь тебе с:**
• Основами программирования и синтаксисом **Python**.
• Разбором ошибок в коде и его улучшением.
• Созданием интерфейсов и инструментов в **Figma**.
• Принципами **UI/UX** дизайна.

Просто спроси меня об одной из этих тем, и мы продолжим обучение! 🚀`
    }

    return baseReply
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

/**
 * Generate AI-powered learning task
 */
export interface GeneratedTask {
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    subject: 'python' | 'figma'
    hints: string[]
    estimatedTime: number
}

export async function generateTask(params: {
    subject: 'python' | 'figma'
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    userLevel?: number
    completedTopics?: string[]
}): Promise<GeneratedTask> {
    try {
        const response = await fetch(`${API_URL}/api/ai/generate-task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка генерации задачи')
        }

        return data.task
    } catch (error: any) {
        console.error('Task Generation Error:', error)

        // Fallback task if backend is unavailable
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            return getTaskFallback(params.subject, params.difficulty)
        }

        throw error
    }
}

/**
 * Fallback task generation when backend is unavailable
 */
function getTaskFallback(subject: 'python' | 'figma', difficulty: 'beginner' | 'intermediate' | 'advanced'): GeneratedTask {
    const pythonTasks = {
        beginner: {
            title: 'Калькулятор базовых операций',
            description: 'Создай программу-калькулятор, которая умеет складывать, вычитать, умножать и делить два числа. Программа должна запрашивать у пользователя числа и операцию.',
            hints: [
                'Используй функцию input() для получения данных от пользователя',
                'Преобразуй строки в числа с помощью int() или float()',
                'Используй условные операторы if/elif/else для выбора операции'
            ],
            estimatedTime: 30
        },
        intermediate: {
            title: 'Анализатор текста',
            description: 'Напиши программу, которая анализирует текст: подсчитывает количество слов, символов, предложений и находит самое длинное слово.',
            hints: [
                'Используй метод split() для разделения текста на слова',
                'Метод len() поможет подсчитать длину',
                'Для поиска самого длинного слова используй функцию max() с параметром key'
            ],
            estimatedTime: 45
        },
        advanced: {
            title: 'Менеджер задач с JSON',
            description: 'Создай консольное приложение для управления задачами с сохранением в JSON файл. Функции: добавление, удаление, просмотр, отметка выполненных задач.',
            hints: [
                'Используй модуль json для работы с файлами',
                'Создай класс Task для представления задачи',
                'Реализуй функции CRUD (Create, Read, Update, Delete)'
            ],
            estimatedTime: 90
        }
    }

    const figmaTasks = {
        beginner: {
            title: 'Дизайн визитной карточки',
            description: 'Создай дизайн современной визитной карточки размером 90x50мм. Используй Auto Layout для правильного расположения элементов.',
            hints: [
                'Начни с создания Frame нужного размера',
                'Используй Auto Layout для выравнивания текста',
                'Добавь контрастные цвета для читаемости'
            ],
            estimatedTime: 40
        },
        intermediate: {
            title: 'Мобильное приложение - Экран входа',
            description: 'Спроектируй экран входа для мобильного приложения с полями email/пароль, кнопкой входа и ссылкой на регистрацию. Размер: 375x812px (iPhone).',
            hints: [
                'Используй компоненты для повторяющихся элементов',
                'Примени constraints для адаптивности',
                'Добавь состояния для кнопки (normal, hover, pressed)'
            ],
            estimatedTime: 60
        },
        advanced: {
            title: 'Дизайн-система для веб-приложения',
            description: 'Создай базовую дизайн-систему: цветовая палитра, типографика, компоненты кнопок (3 варианта), поля ввода, карточки.',
            hints: [
                'Создай отдельную страницу для стилей',
                'Используй Styles для цветов и текста',
                'Все компоненты должны быть вариантами (Variants)'
            ],
            estimatedTime: 120
        }
    }

    const tasks = subject === 'python' ? pythonTasks : figmaTasks
    const task = tasks[difficulty]

    return {
        ...task,
        difficulty,
        subject
    }
}

/**
 * Update AI Configuration (Backend)
 */
export async function updateAIConfig(config: {
    geminiKey?: string
    openaiKey?: string
    deepseekKey?: string
    model?: string
}) {
    try {
        const response = await fetch(`${API_URL}/api/ai/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        })

        if (!response.ok) throw new Error('Failed to update AI config')
        return await response.json()
    } catch (error) {
        console.error('Error updating AI config:', error)
        throw error
    }
}

/**
 * Check AI Cluster Status
 */
export async function checkAIStatus() {
    try {
        const response = await fetch(`${API_URL}/api/ai/status`)
        if (!response.ok) throw new Error('Status check failed')
        return await response.json()
    } catch (error) {
        return { success: false, available: false, status: 'offline' }
    }
}
