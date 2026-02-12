import OpenAI from "openai";

let client;

function getClient() {
    if (!client) {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("[OPENAI-SIMPLE] No API key found in process.env!");
        }
        client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return client;
}

/**
 * Simplified AI interaction for diagnostics and basic chat.
 * Direct implementation of the user's "Gold Standard".
 */
export async function askAI(message) {
    console.log("[OPENAI-SIMPLE] Sending message (Mita Auto-Responder)...");

    try {
        const client = getClient();
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
Ты — Мита, интеллектуальный наставник EliteHeat.

ЖЁСТКИЕ ПРАВИЛА:
1. ДАВАЙ ПРЯМЫЕ ОТВЕТЫ. Никаких «подсказок» или общих фраз. Если человек спрашивает — дай решение.
2. ТЕМАТИКА: Только Python и Figma.
3. КОД: Всегда проверяй код на ошибки и давай исправленный вариант.
4. СТИЛЬ: Лаконично, по делу, на «ты». Без воды.
`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.4,
            max_tokens: 700
        });

        console.log("[OPENAI-SIMPLE] Response received");
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.warn("[OPENAI-SIMPLE] Error (Falling back to local answer):", error.message);
        return localAutoAnswer(message);
    }
}

/**
 * Local fallback for Python/Figma topics when API is offline.
 */
function localAutoAnswer(message) {
    const text = message.toLowerCase();

    // PYTHON
    if (text.includes("python")) {
        return `
Python — это популярный язык программирования.

Чаще всего его используют для:
- обучения программированию
- создания сайтов
- автоматизации
- анализа данных

Чтобы начать:
1. Скачай Python с https://python.org
2. Установи
3. Напиши первый код: print("Hello, world!")
`.trim();
    }

    // FIGMA
    if (text.includes("figma")) {
        return `
Figma — это онлайн-инструмент для дизайна интерфейсов.

В Figma можно:
- создавать макеты сайтов и приложений
- работать в команде онлайн
- делать кнопки, формы, интерфейсы

Скачать Figma можно на официальном сайте:
https://www.figma.com/downloads
`.trim();
    }

    // НЕ ПО ТЕМЕ
    return "Я отвечаю только на вопросы по Python и Figma.";
}
