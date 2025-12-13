import { GoogleGenerativeAI } from '@google/generative-ai'

// API ключ Gemini
const API_KEY = 'AIzaSyCjZ6u_7uG128pM-9Y1u0MNN3ulk6xmMuo'

// Инициализация Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY)

// Конфигурация модели
const modelConfig = {
    model: 'gemini-1.5-flash',
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
}

/**
 * Отправка текстового запроса к Gemini AI
 */
export async function sendTextMessage(message: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel(modelConfig)

        const prompt = `Ты - AI-помощник образовательной платформы EliteHeat. 
Твоя задача - помогать студентам с обучением.

Ты можешь помочь с:
- Объяснением концепций программирования (Python, JavaScript, HTML, CSS)
- Проверкой кода и поиском ошибок
- Советами по дизайну в Figma
- Решением задач и заданий
- Созданием презентаций
- Объяснением сложных тем простым языком

Отвечай на русском языке, будь дружелюбным и понятным.

Вопрос студента: ${message}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Gemini API Error:', error)
        throw new Error('Не удалось получить ответ от AI. Проверьте API ключ и подключение к интернету.')
    }
}

/**
 * Отправка изображения с текстом к Gemini AI
 */
export async function sendImageMessage(
    message: string,
    imageBase64: string
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel(modelConfig)

        // Определяем MIME тип изображения
        const mimeType = imageBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg'

        // Убираем префикс data:image/...;base64,
        const base64Data = imageBase64.split(',')[1]

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        }

        const prompt = message || `Проанализируй это изображение детально:

1. Если это код - найди все ошибки и предложи исправления
2. Если это дизайн - дай рекомендации по улучшению
3. Если это задание или задача - помоги решить её пошагово
4. Если это скриншот ошибки - объясни причину и как исправить

Отвечай на русском языке подробно и понятно.`

        const result = await model.generateContent([prompt, imagePart])
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Gemini Vision API Error:', error)
        throw new Error('Не удалось проанализировать изображение. Попробуйте другое изображение или проверьте подключение.')
    }
}

/**
 * Проверка кода на ошибки
 */
export async function checkCode(code: string, language: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel(modelConfig)

        const prompt = `Ты - эксперт по программированию. Проверь этот код на ${language} и найди все ошибки.

Код:
\`\`\`${language}
${code}
\`\`\`

Предоставь:
1. Список всех найденных ошибок
2. Объяснение каждой ошибки
3. Исправленный код
4. Рекомендации по улучшению

Отвечай на русском языке.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Code Check Error:', error)
        throw new Error('Не удалось проверить код. Попробуйте позже.')
    }
}

/**
 * Помощь с презентацией
 */
export async function helpWithPresentation(topic: string, details: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel(modelConfig)

        const prompt = `Помоги создать структуру презентации на тему: "${topic}"

Дополнительная информация: ${details}

Предоставь:
1. Структуру слайдов (8-10 слайдов)
2. Ключевые пункты для каждого слайда
3. Рекомендации по дизайну
4. Советы для выступления

Отвечай на русском языке.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Presentation Help Error:', error)
        throw new Error('Не удалось помочь с презентацией. Попробуйте позже.')
    }
}

/**
 * Проверка доступности API
 */
export async function checkAPIStatus(): Promise<boolean> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent('Test')
        await result.response
        return true
    } catch (error) {
        console.error('API Status Check Failed:', error)
        return false
    }
}
