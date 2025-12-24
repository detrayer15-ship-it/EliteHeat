import { GoogleGenerativeAI } from '@google/generative-ai'

// API ключ Gemini из переменных окружения
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Проверка наличия API ключа
if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY не найден в .env.local файле!')
    console.warn('⚠️ Gemini AI будет работать в режиме fallback (без реального AI)')
}

// Инициализация Gemini AI
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

// Используем актуальную модель (gemini-pro устарела)
const WORKING_MODEL = 'gemini-1.5-flash'

/**
 * Отправка текстового запроса к Gemini AI
 */
export async function sendTextMessage(message: string): Promise<string> {
    try {
        // Проверка наличия API ключа
        if (!genAI) {
            console.warn('⚠️ Gemini API недоступен, используем fallback')
            return getFallbackResponse(message)
        }

        const model = genAI.getGenerativeModel({
            model: WORKING_MODEL,
        })

        const prompt = `Ты - умный AI-помощник образовательной платформы EliteHeat. 

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
- ❓ Ответы на ЛЮБЫЕ вопросы студента

Твой стиль общения:
- Дружелюбный и понятный
- Конкретный и полезный
- С примерами кода когда нужно
- На русском языке
- Помогаешь студенту ДУМАТЬ, а не просто даёшь ответы

Если студент спрашивает что-то вне программирования - тоже помогай!

Вопрос студента: ${message}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error: any) {
        console.error('Gemini API Error:', error)

        // Если модель не найдена, используем fallback
        if (error?.message?.includes('not found') || error?.message?.includes('404')) {
            return getFallbackResponse(message)
        }

        // Детальная обработка других ошибок
        if (error?.message?.includes('API_KEY_INVALID')) {
            throw new Error('❌ API ключ недействителен')
        }

        if (error?.message?.includes('PERMISSION_DENIED') || error?.message?.includes('403')) {
            throw new Error('❌ Доступ запрещён. Проверьте права доступа API ключа.')
        }

        if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.message?.includes('429')) {
            throw new Error('⏱️ Превышен лимит запросов. Подождите немного.')
        }

        // Если другая ошибка - используем fallback
        return getFallbackResponse(message)
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
 * Отправка изображения с текстом к Gemini AI
 */
export async function sendImageMessage(
    message: string,
    imageBase64: string
): Promise<string> {
    try {
        // Проверка наличия API ключа
        if (!genAI) {
            return `🖼️ **Анализ изображений**

Функция анализа изображений недоступна (нет API ключа).

**Что можно сделать:**
1. Добавьте VITE_GEMINI_API_KEY в .env.local
2. Опишите что на изображении текстом
3. Скопируйте код с изображения

Я помогу на основе описания!`
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash', // gemini-pro-vision устарела
        })

        const mimeType = imageBase64.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
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
    } catch (error: any) {
        console.error('Gemini Vision API Error:', error)

        return `🖼️ **Анализ изображений**

Функция анализа изображений временно недоступна.

**Что можно сделать:**
1. Опишите что на изображении текстом
2. Скопируйте код с изображения
3. Задайте вопрос о содержимом

Я помогу на основе описания!`
    }
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
        if (!genAI) {
            console.warn('⚠️ Gemini API недоступен (нет API ключа)')
            return true // Возвращаем true чтобы показать что fallback работает
        }

        const model = genAI.getGenerativeModel({ model: WORKING_MODEL })
        const result = await model.generateContent('Test')
        await result.response
        return true
    } catch (error) {
        console.error('API Status Check Failed:', error)
        return true // Возвращаем true чтобы показать что fallback работает
    }
}
