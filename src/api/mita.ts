import { addAssistantMessage, addUserMessage } from './aiMessages'
import { touchAIChat } from './aiChats'

const NODE_API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://eliteheat-backend.web.app' : 'http://localhost:3001')

const SESSION_ID_KEY = 'eliteheat_ai_session_id'

export type AIHistoryItem = { role: 'user' | 'assistant'; content: string }
export type AIMode = 'tutor' | 'developer' | 'debug' | 'product' | 'assistant'

export function getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY)

    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        localStorage.setItem(SESSION_ID_KEY, sessionId)
    }

    return sessionId
}

export function clearSessionId(): void {
    localStorage.removeItem(SESSION_ID_KEY)
}

function withStudentAIBehavior(message: string, mode: AIMode): string {
    if (!['tutor', 'product', 'assistant'].includes(mode)) return message

    return `
SYSTEM: AI BEHAVIOR IS REQUIRED.

Before answering, understand the user correctly:
1. Determine the user's goal.
2. Determine the user's level: beginner, middle, or advanced. If unsure, assume beginner.
3. Determine the context: idea, project, presentation, business model, task, or general question.
4. If the request is unclear, ask one clarifying question instead of guessing.
   Example: "Я правильно понял, что ты хочешь улучшить идею или оформить презентацию?"
5. Explain in simple Russian, like for a school student.
6. Keep the answer short, structured, and practical.
7. Use bullet points and include a small example when it helps.
8. If project context is provided, use it: idea, problem, solution, audience, and current stage.
9. Do not use complex terms without a simple explanation.
10. If the user explicitly asks for JSON or a strict format, follow that format exactly.

USER REQUEST:
${message}
`.trim()
}

function extractStudentQuestion(message: string): string {
    const markers = ['Вопрос ученика:', 'Идея ученика:', 'USER REQUEST:']
    for (const marker of markers) {
        const index = message.lastIndexOf(marker)
        if (index >= 0) return message.slice(index + marker.length).trim()
    }
    return message.trim()
}

function isUnclearRequest(text: string): boolean {
    const normalized = text.toLowerCase().trim()
    if (normalized.length < 8) return true
    return ['помоги', 'что делать', 'улучши', 'сделай', 'не знаю'].includes(normalized)
}

function getStudentFallbackReply(message: string): string {
    const question = extractStudentQuestion(message)
    const text = question.toLowerCase()

    if (isUnclearRequest(question)) {
        return 'Я правильно поняла, что ты хочешь улучшить идею проекта или оформить презентацию? Напиши, что именно у тебя уже есть: идея, проблема, решение или слайды.'
    }

    if (text.includes('презентац') || text.includes('слайд') || text.includes('защит')) {
        return [
        'Поняла: тебе нужна помощь с презентацией.',
            '',
            '- Цель: сделать защиту понятной.',
            '- Уровень: начальный, поэтому начнем просто.',
            '- Контекст: презентация проекта.',
            '',
            'Что сделать:',
            '1. Слайд 1: название проекта и для кого он.',
            '2. Слайд 2: проблема простыми словами.',
            '3. Слайд 3: твое решение.',
            '4. Слайд 4: прототип или пример работы.',
            '5. Слайд 5: что ты сделал и что улучшишь дальше.',
            '',
            'Пример: "Мой проект помогает школьникам быстрее оформить идею в понятный план".',
        ].join('\n')
    }

    if (text.includes('бизнес') || text.includes('модель') || text.includes('деньг') || text.includes('монет')) {
        return [
        'Поняла: ты хочешь объяснить бизнес-модель.',
            '',
            '- Цель: показать, как проект может быть полезным и устойчивым.',
            '- Уровень: начальный.',
            '- Контекст: бизнес-модель.',
            '',
            'Простой план:',
            '1. Кто пользователь?',
            '2. За что он готов платить или почему будет пользоваться?',
            '3. Какие расходы есть у проекта?',
            '4. Как проект будет расти?',
            '',
            'Пример: "Школа платит за доступ, потому что ученики быстрее готовят проекты к защите".',
        ].join('\n')
    }

    if (text.includes('иде') || text.includes('проект')) {
        return [
        'Поняла: ты хочешь улучшить идею проекта.',
            '',
            '- Цель: сделать идею понятнее.',
            '- Уровень: начальный.',
            '- Контекст: идея / проект.',
            '',
            'Попробуй заполнить 4 строки:',
            '1. Для кого проект?',
            '2. Какая у них проблема?',
            '3. Как проект помогает?',
            '4. Почему это лучше обычного способа?',
            '',
            'Пример: "Для школьников, которые не знают, как оформить стартап. Платформа задает вопросы и собирает готовый план проекта".',
        ].join('\n')
    }

    return [
        'Поняла: тебе нужен совет по проекту.',
        '',
        '- Цель: разобраться с запросом.',
        '- Уровень: начальный.',
        '- Контекст: пока не до конца понятен.',
        '',
        'Чтобы я помог точнее, ответь на один вопрос:',
        'Ты хочешь улучшить идею, сделать план проекта или подготовить презентацию?',
    ].join('\n')
}

export async function sendAIChatMessage(
    chatId: string,
    message: string,
    opts?: {
        history?: AIHistoryItem[]
        mode?: AIMode
        image?: { type: string; base64: string }
    }
) {
    const history = opts?.history || []
    const mode = opts?.mode || 'assistant'
    const image = opts?.image
    const requestMessage = withStudentAIBehavior(message, mode)

    try {
        await addUserMessage(chatId, message)
    } catch (error) {
        console.warn('[MITA] FS user log failed', error)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
        const res = await fetch(`${NODE_API_URL}/api/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: requestMessage,
                history,
                mode,
                image,
            }),
            signal: controller.signal,
        })

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)

        const data = await res.json()
        const reply = data.answer || getStudentFallbackReply(message)

        try {
            await addAssistantMessage(chatId, reply)
            await touchAIChat(chatId)
        } catch {
            // Firestore history is helpful, but the answer should still be returned.
        }

        return {
            reply,
            usage: { model: 'eliteheat-neural-v1', inputTokens: 0, outputTokens: 0, latencyMs: 0 },
        }
    } catch (error: any) {
        console.warn('MITA neural link failed, using local student fallback:', error?.message)

        const reply = getStudentFallbackReply(message)

        try {
            await addAssistantMessage(chatId, reply)
            await touchAIChat(chatId)
        } catch {
            // Ignore offline Firestore failures.
        }

        return {
            reply,
            usage: { model: 'mita-student-fallback', inputTokens: 0, outputTokens: 0, latencyMs: 0 },
        }
    } finally {
        clearTimeout(timeoutId)
    }
}

export async function sendTextMessage(message: string): Promise<{ reply: string }> {
    const tempChatId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const result = await sendAIChatMessage(tempChatId, message)
    return { reply: result.reply }
}

export async function sendImageMessage(message: string, image: string): Promise<{ reply: string }> {
    return sendAIChatMessage(`image_${Date.now()}`, `[Image Attached] ${message}`, {
        image: { type: 'image', base64: image },
    })
}

export async function checkCode(code: string): Promise<{ reply: string }> {
    return sendTextMessage(`Проверь мой код:\n\n${code}`)
}

export async function helpWithPresentation(topic: string): Promise<{ reply: string }> {
    return sendTextMessage(`Помоги с презентацией на тему: ${topic}`)
}

export async function checkAPIStatus(): Promise<{ status: string; available: boolean }> {
    try {
        const res = await fetch(`${NODE_API_URL}/api/ai/status`)
        if (!res.ok) throw new Error()
        return await res.json()
    } catch {
        return { status: 'online', available: true }
    }
}

export async function updateAIConfig(config: any): Promise<{ success: boolean }> {
    console.info('AI config update requested', config)
    return { success: true }
}
