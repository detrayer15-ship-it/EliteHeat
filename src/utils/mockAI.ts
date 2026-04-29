export type MockAiTab = 'roadmap' | 'prompts' | 'storyboard'

/**
 * Lightweight local mock used by project sidebars.
 * Keeps the UI functional even when real AI is unavailable.
 */
export async function mockAIResponse(message: string, tab: MockAiTab) {
    const text = message.toLowerCase()

    const canned = {
        roadmap: [
            'Давай разобьём задачу на 3–5 шагов и выберем следующий конкретный шаг.',
            'Опиши, что уже сделано, и я предложу короткий roadmap на неделю.'
        ],
        prompts: [
            'Скажи стек (frontend/backend/db) — и я соберу тебе хороший промпт под эту часть.',
            'Могу оптимизировать промпт: цель → входные данные → ограничения → формат ответа.'
        ],
        storyboard: [
            'Для защиты проекта: проблема → решение → демо → метрики → планы. Хочешь структуру на 6–8 слайдов?',
            'Скажи, что на слайде, и я предложу, как усилить смысл и подачу.'
        ]
    } as const

    const pick = (arr: readonly string[]) => arr[Math.floor(Math.random() * arr.length)]

    if (text.includes('roadmap') || text.includes('план') || text.includes('шаг')) {
        return { message: canned.roadmap[0] }
    }
    if (text.includes('промпт') || text.includes('prompt') || text.includes('стек')) {
        return { message: canned.prompts[0] }
    }
    if (text.includes('презентац') || text.includes('защит') || text.includes('слайд')) {
        return { message: canned.storyboard[0] }
    }

    return { message: pick(canned[tab]) }
}

