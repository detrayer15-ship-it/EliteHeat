/**
 * Предлагает варианты стилей дизайна на основе описания студента
 */
export async function suggestDesignStyles(description: string) {
    // Static fallback as AI is removed
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
}
