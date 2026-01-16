/**
 * Generate AI-powered learning task
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
            return getFallbackTask(params.subject, params.difficulty)
        }

        throw error
    }
}

/**
 * Fallback task generation when backend is unavailable
 */
function getFallbackTask(subject: 'python' | 'figma', difficulty: 'beginner' | 'intermediate' | 'advanced'): GeneratedTask {
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
