import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useAIContext } from '@/store/aiContextStore'
import { useProjectStore } from '@/store/projectStore'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { sendTextMessage } from '@/api/gemini'
import { useGamificationStore } from '@/store/gamificationStore'


export const ProjectCreationChat = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [projectContext, setProjectContext] = useState<any>(null)
    const [suggestedNames, setSuggestedNames] = useState<string[]>([])
    const [selectedName, setSelectedName] = useState<string | null>(null)
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    // Gamification store
    const { unlockAchievement, getAchievement } = useGamificationStore()

    // Подключаем AI Context для синхронизации
    const { addMessage: addToGlobalContext, shareContextToAssistant } = useAIContext()

    // Подключаем projectStore для локального сохранения
    const { createProject: createLocalProject } = useProjectStore()

    const initialMessage = `Привет, ${user?.name || 'друг'} 👋

Я помогу тебе создать проект! Опиши свою идею, и я:
1. Создам структуру проекта
2. Сгенерирую промпты для разработки
3. Подготовлю roadmap
4. Настрою AI-помощника

Например: "Хочу создать приложение для изучения английского языка"

💡 Важно: Я генерирую качественные ПРОМПТЫ, которые ты копируешь и используешь в ChatGPT/Claude/DeepSeek. Наша платформа = Архитектор и тренер, а не IDE.`

    const analyzeWithAI = async (idea: string): Promise<any> => {
        try {
            const analysisPrompt = `Ты - эксперт по созданию технических заданий для проектов.

Идея студента: "${idea}"

Проанализируй идею и верни JSON (только JSON, без markdown):
{
  "title": "Краткое название проекта (2-4 слова)",
  "type": "app" | "site" | "mvp",
  "description": "Подробное описание (1-2 предложения)",
  "problem": "Какую проблему решает",
  "solution": "Как решает проблему",
  "audience": "Целевая аудитория",
  "techStack": {
    "frontend": "Рекомендуемый фронтенд",
    "backend": "Рекомендуемый бэкенд",
    "db": "Рекомендуемая БД"
  },
  "features": ["Функция 1", "Функция 2", "Функция 3"],
  "needsClarification": false
}`

            const response = await sendTextMessage(analysisPrompt)

            // Пытаемся извлечь JSON из ответа
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }

            // Если AI не вернул JSON, создаём базовую структуру
            return {
                title: idea.slice(0, 50),
                type: 'app',
                description: idea,
                problem: 'Будет определено',
                solution: idea,
                audience: 'Целевая аудитория',
                techStack: {
                    frontend: 'React + TypeScript',
                    backend: 'Firebase',
                    db: 'Firestore'
                },
                features: ['Основной функционал'],
                needsClarification: idea.length < 20
            }
        } catch (error) {
            console.error('AI Analysis Error:', error)
            // Fallback на простой анализ
            return {
                title: idea.slice(0, 50),
                type: 'app',
                description: idea,
                problem: 'Будет определено',
                solution: idea,
                audience: 'Целевая аудитория',
                techStack: {
                    frontend: 'React + TypeScript',
                    backend: 'Firebase',
                    db: 'Firestore'
                },
                features: ['Основной функционал'],
                needsClarification: idea.length < 20
            }
        }
    }

    const generateProjectNames = async (idea: string, type: string): Promise<string[]> => {
        try {
            const namePrompt = `Сгенерируй 3 креативных названия для проекта типа "${type}".

Описание проекта: "${idea}"

Требования к названиям:
- Короткие (1-3 слова)
- Запоминающиеся
- Отражают суть проекта
- Могут быть на английском или русском

Верни только JSON массив из 3 названий:
["Название 1", "Название 2", "Название 3"]`

            const response = await sendTextMessage(namePrompt)

            // Пытаемся извлечь JSON массив
            const jsonMatch = response.match(/\[[\s\S]*?\]/)
            if (jsonMatch) {
                const names = JSON.parse(jsonMatch[0])
                if (Array.isArray(names) && names.length === 3) {
                    return names
                }
            }

            // Fallback названия
            return [
                `${type === 'app' ? 'App' : type === 'site' ? 'Site' : 'MVP'} Pro`,
                `Smart ${type === 'app' ? 'Solution' : 'Platform'}`,
                `${type === 'app' ? 'Quick' : 'Easy'}${type === 'app' ? 'App' : 'Web'}`
            ]
        } catch (error) {
            console.error('Name Generation Error:', error)
            return [
                `${type === 'app' ? 'App' : type === 'site' ? 'Site' : 'MVP'} Pro`,
                `Smart ${type === 'app' ? 'Solution' : 'Platform'}`,
                `${type === 'app' ? 'Quick' : 'Easy'}${type === 'app' ? 'App' : 'Web'}`
            ]
        }
    }

    const createProject = async (analysis: any) => {
        try {
            setIsLoading(true)

            const projectData = {
                userId: user?.id || '',
                title: analysis.title,
                type: analysis.type,
                description: analysis.description,
                problem: analysis.problem,
                solution: analysis.solution,
                audience: analysis.audience,
                goal: `Создать ${analysis.type === 'app' ? 'приложение' : analysis.type === 'site' ? 'сайт' : 'MVP'}`,
                stage: 'idea' as const,
                status: 'active' as const,
                progress: 0,
                tasks: [],
                techStack: analysis.techStack,
                roadmap: [
                    { id: '1', title: 'Сформировать идею проекта', isCompleted: true, order: 1 },
                    { id: '2', title: 'Выбрать технологический стек', isCompleted: true, order: 2 },
                    { id: '3', title: 'Сгенерировать промпты для разработки', isCompleted: false, order: 3 },
                    { id: '4', title: 'Получить код от AI', isCompleted: false, order: 4 },
                    { id: '5', title: 'Запустить MVP', isCompleted: false, order: 5 },
                    { id: '6', title: 'Подготовить презентацию', isCompleted: false, order: 6 },
                    { id: '7', title: 'Провести тестирование', isCompleted: false, order: 7 },
                ],
                slides: [
                    {
                        id: '1',
                        order: 1,
                        title: 'Проблема',
                        bullets: [analysis.problem],
                        speakerNotes: 'Объясните проблему, которую решает ваш проект'
                    },
                    {
                        id: '2',
                        order: 2,
                        title: 'Решение',
                        bullets: analysis.features || [analysis.solution],
                        speakerNotes: 'Покажите как ваше решение помогает пользователям'
                    },
                    {
                        id: '3',
                        order: 3,
                        title: 'Технологии',
                        bullets: [
                            `Frontend: ${analysis.techStack.frontend}`,
                            `Backend: ${analysis.techStack.backend}`,
                            `Database: ${analysis.techStack.db}`
                        ],
                        speakerNotes: 'Объясните выбор технологий'
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            const docRef = await addDoc(collection(db, 'projects'), projectData)

            // Сохраняем также в локальное хранилище
            createLocalProject({ ...projectData, id: docRef.id })

            // Achievement: Project Creator
            const projectCreator = getAchievement('project-creator')
            if (projectCreator && !projectCreator.isUnlocked) {
                unlockAchievement('project-creator')
            }

            const successMsg = `✅ Отлично! Проект "${analysis.title}" создан!

📊 Что я подготовил:
• Roadmap с 7 этапами
• Технологический стек
• Промпты для разработки
• Структуру презентации

Переношу тебя в рабочее пространство проекта...`

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: successMsg
            }])

            // Синхронизируем с глобальным контекстом и передаём в AI Assistant
            addToGlobalContext({
                role: 'assistant',
                content: successMsg,
                context: {
                    page: 'dashboard',
                    projectId: docRef.id,
                    projectTitle: analysis.title
                }
            })

            // Делимся контекстом проекта с AI Assistant
            shareContextToAssistant(docRef.id, {
                title: analysis.title,
                techStack: analysis.techStack,
                description: analysis.description
            })

            setTimeout(() => {
                navigate(`/projects/${docRef.id}`)
            }, 2000)

        } catch (error) {
            console.error('Error creating project:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Ошибка при создании проекта. Попробуй ещё раз.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])

        // Синхронизируем с глобальным контекстом
        addToGlobalContext({
            role: 'user',
            content: userMessage,
            context: { page: 'dashboard', action: 'project-creation' }
        })

        setIsLoading(true)

        // Анализируем с помощью AI
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: '🤔 Анализирую твою идею...'
        }])

        const analysis = await analyzeWithAI(userMessage)

        if (analysis.needsClarification) {
            const clarificationMsg = `Мне нужно больше информации.\n\nОпиши подробнее:\n• Кто будет пользоваться?\n• Какую проблему решаем?\n• Какие основные функции нужны?`

            setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: clarificationMsg
                }
                return newMessages
            })

            // Синхронизируем с глобальным контекстом
            addToGlobalContext({
                role: 'assistant',
                content: clarificationMsg,
                context: { page: 'dashboard' }
            })

            setIsLoading(false)
            return
        }

        // Показываем анализ и генерируем названия
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: '🎨 Генерирую варианты названий для проекта...'
        }])

        // Генерируем названия
        const names = await generateProjectNames(userMessage, analysis.type)
        setSuggestedNames(names)
        setProjectContext(analysis)

        const namesMsg = `✨ Отлично! Вот что я понял:

📝 **Тип:** ${analysis.type === 'app' ? 'Приложение' : analysis.type === 'site' ? 'Сайт' : 'MVP'}

**Проблема:** ${analysis.problem}
**Решение:** ${analysis.solution}
**Аудитория:** ${analysis.audience}

**Технологии:**
• Frontend: ${analysis.techStack.frontend}
• Backend: ${analysis.techStack.backend}
• Database: ${analysis.techStack.db}

🎯 **Выбери название проекта из предложенных вариантов:**`

        setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: namesMsg
            }
            return newMessages
        })

        // Синхронизируем с глобальным контекстом
        addToGlobalContext({
            role: 'assistant',
            content: namesMsg,
            context: { page: 'dashboard', projectAnalysis: analysis }
        })

        setIsLoading(false)
    }

    const handleNameSelection = async (name: string) => {
        if (!projectContext) return

        setSelectedName(name)
        setIsLoading(true)

        // Обновляем анализ с выбранным названием
        const updatedAnalysis = { ...projectContext, title: name }

        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Отлично! Создаю проект "${name}"...`
        }])

        await createProject(updatedAnalysis)
        setSuggestedNames([])
        setSelectedName(null)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 rounded-xl p-6 border-2 border-purple-300 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Создать проект через AI
                    </h2>
                    <p className="text-xs text-gray-600">Опишите идею, AI создаст всё остальное</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-white rounded-lg p-4 mb-4 min-h-[250px] max-h-[450px] overflow-y-auto space-y-4 shadow-inner">
                {/* Initial Message */}
                <div className="flex gap-3 animate-fade-in">
                    <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg rounded-tl-none p-4 max-w-[85%] border border-purple-200">
                        <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{initialMessage}</p>
                    </div>
                </div>

                {/* Messages */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}>
                            <span className="text-white text-sm font-bold">
                                {msg.role === 'user' ? user?.name?.[0]?.toUpperCase() || 'U' : 'AI'}
                            </span>
                        </div>
                        <div className={`rounded-lg p-4 max-w-[85%] border ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 rounded-tr-none border-green-200'
                            : 'bg-gradient-to-r from-purple-50 to-blue-50 rounded-tl-none border-purple-200'
                            }`}>
                            <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {/* Loading */}
                {isLoading && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg rounded-tl-none p-4 border border-purple-200">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Name suggestions */}
                {!isLoading && suggestedNames.length > 0 && (
                    <div className="flex flex-col gap-2 p-4 bg-purple-50 rounded-xl border border-purple-200 animate-fade-in">
                        <p className="text-sm font-semibold text-purple-700 mb-2">Выберите название:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {suggestedNames.map((name, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleNameSelection(name)}
                                    className="p-3 text-sm font-medium bg-white border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-gray-800 shadow-sm hover:shadow-md transform hover:scale-105"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            {!suggestedNames.length && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Например: Хочу создать приложение для обучения программированию..."
                        className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            )}

            {suggestedNames.length > 0 && (
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            setSuggestedNames([])
                            setMessages(prev => [...prev, { role: 'assistant', content: 'Хорошо, давай попробуем другое описание. О чем твой проект?' }])
                        }}
                        className="text-sm text-purple-600 hover:underline font-medium"
                    >
                        Сгенерировать другие названия
                    </button>
                </div>
            )}

            <p className="text-xs text-gray-600 mt-3 text-center">
                ✨ AI проанализирует идею и создаст полную структуру проекта
            </p>
        </div>
    )
}
