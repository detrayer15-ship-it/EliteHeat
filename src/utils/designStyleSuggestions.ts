import { sendTextMessage } from '@/api/gemini'

/**
 * Предлагает варианты стилей дизайна на основе описания студента
 */
export async function suggestDesignStyles(description: string) {
    const prompt = `Студент описал проект: "${description}"

Предложи 3 варианта стиля дизайна в JSON формате:

{
  "detectedStyle": "Обнаруженный стиль из описания",
  "suggestions": [
    {
      "name": "Название стиля",
      "description": "Краткое описание",
      "colors": ["#hex1", "#hex2", "#hex3"],
      "mood": "Настроение",
      "examples": "Примеры (Apple, Google и т.д.)"
    }
  ]
}

Верни только JSON, без markdown.`

    try {
        const response = await sendTextMessage(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        // Fallback
        return {
            detectedStyle: "Современный",
            suggestions: [
                {
                    name: "Минимализм",
                    description: "Чистый и простой дизайн",
                    colors: ["#FFFFFF", "#000000", "#4A90E2"],
                    mood: "Профессиональный",
                    examples: "Apple, Notion"
                },
                {
                    name: "Яркий и современный",
                    description: "Градиенты и живые цвета",
                    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
                    mood: "Энергичный",
                    examples: "Spotify, Instagram"
                },
                {
                    name: "Тёмная тема",
                    description: "Элегантный тёмный интерфейс",
                    colors: ["#1A1A2E", "#16213E", "#0F3460"],
                    mood: "Современный",
                    examples: "GitHub, Discord"
                }
            ]
        }
    } catch (error) {
        console.error('Design style suggestion error:', error)
        return null
    }
}
