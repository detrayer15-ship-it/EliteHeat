/**
 * Mock AI responses for testing before real Gemini API integration
 */

type AIContext = 'roadmap' | 'prompts' | 'storyboard'

interface MockResponse {
    message: string
    data?: any
}

/**
 * Simulate AI response with delay
 */
export async function mockAIResponse(
    message: string,
    context: AIContext
): Promise<MockResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const lowerMessage = message.toLowerCase()

    // Roadmap context responses
    if (context === 'roadmap') {
        if (lowerMessage.includes('план') || lowerMessage.includes('roadmap')) {
            return {
                message: 'Отлично! Я создал план разработки для вашего проекта.',
                data: {
                    roadmap: [
                        { id: '1', title: 'Описать идею и цели', isCompleted: false, order: 1 },
                        { id: '2', title: 'Выбрать технологический стек', isCompleted: false, order: 2 },
                        { id: '3', title: 'Создать структуру базы данных', isCompleted: false, order: 3 },
                        { id: '4', title: 'Разработать backend API', isCompleted: false, order: 4 },
                        { id: '5', title: 'Создать frontend интерфейс', isCompleted: false, order: 5 },
                        { id: '6', title: 'Протестировать приложение', isCompleted: false, order: 6 },
                        { id: '7', title: 'Подготовить презентацию', isCompleted: false, order: 7 },
                    ]
                }
            }
        }

        if (lowerMessage.includes('задач') || lowerMessage.includes('task')) {
            return {
                message: 'Добавил новую задачу в ваш roadmap!',
                data: {
                    newTask: {
                        id: Date.now().toString(),
                        title: 'Новая задача из AI',
                        isCompleted: false,
                        order: 999
                    }
                }
            }
        }

        if (lowerMessage.includes('прогресс') || lowerMessage.includes('progress')) {
            return {
                message: 'Вы выполнили 3 из 7 задач. Отличная работа! Следующий шаг: создание структуры базы данных.',
            }
        }

        return {
            message: 'Я помогу вам спланировать проект. Попробуйте спросить: "Создай план" или "Какой следующий шаг?"'
        }
    }

    // Prompts context responses
    if (context === 'prompts') {
        if (lowerMessage.includes('промпт') || lowerMessage.includes('prompt')) {
            return {
                message: 'Создал новый промпт для вашего проекта!',
                data: {
                    newPrompt: {
                        id: Date.now().toString(),
                        title: 'Custom Prompt',
                        content: `Act as a Senior Developer.\n\nCreate a detailed implementation for:\n${message}\n\nInclude best practices and error handling.`,
                        category: 'other' as const
                    }
                }
            }
        }

        if (lowerMessage.includes('стек') || lowerMessage.includes('stack')) {
            return {
                message: 'Для вашего проекта рекомендую:\n• Frontend: React + TypeScript\n• Backend: Node.js + Express\n• Database: PostgreSQL\n\nХотите обновить промпты под этот стек?',
                data: {
                    suggestedStack: {
                        frontend: 'React + TypeScript',
                        backend: 'Node.js + Express',
                        db: 'PostgreSQL'
                    }
                }
            }
        }

        if (lowerMessage.includes('база') || lowerMessage.includes('database')) {
            return {
                message: 'Обновил промпт для базы данных с учётом вашего стека!',
            }
        }

        return {
            message: 'Я помогу настроить промпты. Попробуйте: "Создай промпт для авторизации" или "Какой стек выбрать?"'
        }
    }

    // Storyboard context responses
    if (context === 'storyboard') {
        if (lowerMessage.includes('слайд') || lowerMessage.includes('slide')) {
            return {
                message: 'Предлагаю улучшить ваш слайд:\n\n1. Добавьте конкретные цифры\n2. Используйте визуальные примеры\n3. Упростите формулировки',
                data: {
                    suggestions: [
                        'Добавьте статистику или метрики',
                        'Используйте визуальные элементы',
                        'Упростите технический язык'
                    ]
                }
            }
        }

        if (lowerMessage.includes('речь') || lowerMessage.includes('notes')) {
            return {
                message: 'Вот пример заметок для спикера:\n\n"Здравствуйте! Сегодня я представлю проект, который решает проблему... [пауза] Поднимите руку, кто сталкивался с этой проблемой?"',
            }
        }

        if (lowerMessage.includes('защит') || lowerMessage.includes('defense')) {
            return {
                message: '🎯 Симуляция вопроса от жюри:\n\n"Почему вы выбрали именно эту технологию?"\n\nРекомендуемый ответ: Объясните преимущества и альтернативы, которые вы рассматривали.',
            }
        }

        if (lowerMessage.includes('презентац') || lowerMessage.includes('presentation')) {
            return {
                message: 'Создал структуру презентации из 5 слайдов!',
                data: {
                    slides: [
                        {
                            id: '1',
                            order: 1,
                            title: 'Проблема',
                            bullets: ['Описание текущей ситуации', 'Статистика проблемы', 'Почему это важно'],
                            speakerNotes: 'Начните с вопроса к аудитории или шокирующей статистики'
                        },
                        {
                            id: '2',
                            order: 2,
                            title: 'Решение',
                            bullets: ['Наш подход', 'Ключевые преимущества', 'Как это работает'],
                            speakerNotes: 'Покажите демо или скриншоты интерфейса'
                        },
                        {
                            id: '3',
                            order: 3,
                            title: 'Технологии',
                            bullets: ['Frontend стек', 'Backend стек', 'База данных'],
                            speakerNotes: 'Объясните почему выбрали именно эти технологии'
                        },
                        {
                            id: '4',
                            order: 4,
                            title: 'Результаты',
                            bullets: ['Что уже сделано', 'Метрики успеха', 'Отзывы пользователей'],
                            speakerNotes: 'Покажите конкретные цифры и достижения'
                        },
                        {
                            id: '5',
                            order: 5,
                            title: 'Планы',
                            bullets: ['Следующие шаги', 'Долгосрочная стратегия', 'Призыв к действию'],
                            speakerNotes: 'Завершите на позитивной ноте и пригласите к сотрудничеству'
                        },
                    ]
                }
            }
        }

        return {
            message: 'Я помогу с презентацией. Попробуйте: "Улучши слайд 1" или "Симулируй защиту"'
        }
    }

    // Default response
    return {
        message: 'Я готов помочь! Задайте вопрос по текущей вкладке.',
    }
}

/**
 * Generate roadmap based on project idea
 */
export async function mockGenerateRoadmap(projectIdea: string) {
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
        roadmap: [
            { id: '1', title: 'Сформулировать идею и цели', isCompleted: false, order: 1 },
            { id: '2', title: 'Исследовать конкурентов', isCompleted: false, order: 2 },
            { id: '3', title: 'Выбрать технологический стек', isCompleted: false, order: 3 },
            { id: '4', title: 'Спроектировать базу данных', isCompleted: false, order: 4 },
            { id: '5', title: 'Создать MVP backend', isCompleted: false, order: 5 },
            { id: '6', title: 'Разработать UI/UX', isCompleted: false, order: 6 },
            { id: '7', title: 'Протестировать и задеплоить', isCompleted: false, order: 7 },
        ],
        essence: `Проект направлен на решение проблемы, описанной в: "${projectIdea.slice(0, 100)}..."`,
        goal: 'Создать работающий MVP и защитить проект',
        painPoint: 'Пользователи сталкиваются с проблемой, которую решает этот проект'
    }
}

/**
 * Generate prompts based on tech stack
 */
export async function mockGeneratePrompts(techStack: any, description: string) {
    await new Promise(resolve => setTimeout(resolve, 1200))

    return {
        prompts: [
            {
                id: '1',
                title: 'Database Schema',
                category: 'database' as const,
                content: `Act as a Senior Database Architect.

Project: ${description}
Database: ${techStack?.db || 'PostgreSQL'}

Create a normalized database schema with:
- User management
- Core business logic tables
- Relationships and constraints
- Indexes for performance`
            },
            {
                id: '2',
                title: 'Backend API',
                category: 'backend' as const,
                content: `Act as a Senior Backend Developer.

Tech Stack: ${techStack?.backend || 'Node.js'}
Database: ${techStack?.db || 'PostgreSQL'}

Create RESTful API with:
- Authentication endpoints
- CRUD operations
- Input validation
- Error handling
- API documentation`
            },
            {
                id: '3',
                title: 'Frontend Components',
                category: 'frontend' as const,
                content: `Act as a Senior Frontend Developer.

Tech Stack: ${techStack?.frontend || 'React'}

Create component structure:
- Layout components
- Feature components
- Shared UI components
- State management
- Routing`
            },
        ]
    }
}

/**
 * Generate presentation slides
 */
export async function mockGenerateSlides(projectData: any) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
        slides: [
            {
                id: '1',
                order: 1,
                title: 'Проблема',
                bullets: [
                    projectData.problem || 'Описание проблемы',
                    'Кто сталкивается с этой проблемой',
                    'Почему существующие решения не работают'
                ],
                speakerNotes: 'Начните с реальной истории или статистики. Установите эмоциональную связь с аудиторией.'
            },
            {
                id: '2',
                order: 2,
                title: 'Наше решение',
                bullets: [
                    projectData.solution || 'Описание решения',
                    'Ключевые преимущества',
                    'Как это работает'
                ],
                speakerNotes: 'Покажите демо или скриншоты. Объясните простым языком.'
            },
            {
                id: '3',
                order: 3,
                title: 'Технологии',
                bullets: [
                    `Frontend: ${projectData.techStack?.frontend || 'React'}`,
                    `Backend: ${projectData.techStack?.backend || 'Node.js'}`,
                    `Database: ${projectData.techStack?.db || 'PostgreSQL'}`
                ],
                speakerNotes: 'Объясните ПОЧЕМУ выбрали эти технологии. Упомяните альтернативы.'
            },
            {
                id: '4',
                order: 4,
                title: 'Демонстрация',
                bullets: [
                    'Основной функционал',
                    'Пользовательский интерфейс',
                    'Уникальные возможности'
                ],
                speakerNotes: 'Проведите live demo. Подготовьте запасной план (видео) на случай технических проблем.'
            },
            {
                id: '5',
                order: 5,
                title: 'Результаты и планы',
                bullets: [
                    'Что уже реализовано',
                    'Метрики и достижения',
                    'Дальнейшее развитие'
                ],
                speakerNotes: 'Завершите на позитивной ноте. Покажите амбициозные, но реалистичные планы.'
            },
        ]
    }
}
