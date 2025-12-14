import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { CheckCircle2, Circle, Download, MessageSquare, Lightbulb, Code, Database, Layout, Presentation, Copy } from 'lucide-react'

export const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const projects = useProjectStore((state) => state.projects)
    const updateProject = useProjectStore((state) => state.updateProject)

    const project = projects.find(p => p.id === projectId)
    const [activeTab, setActiveTab] = useState<'tasks' | 'prompts' | 'presentation' | 'chat'>('tasks')
    const [aiMessage, setAiMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Проект не найден</h1>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Вернуться к проектам
                    </button>
                </div>
            </div>
        )
    }

    const defaultTasks = [
        { id: '1', title: 'Сформировать идею проекта', completed: true },
        { id: '2', title: 'Выбрать технологический стек', completed: true },
        { id: '3', title: 'Сгенерировать промпты для разработки', completed: false },
        { id: '4', title: 'Получить код от AI', completed: false },
        { id: '5', title: 'Запустить MVP', completed: false },
        { id: '6', title: 'Подготовить презентацию', completed: false },
        { id: '7', title: 'Провести тестирование', completed: false },
    ]

    const [tasks, setTasks] = useState(defaultTasks)
    const completedTasks = tasks.filter(t => t.completed).length
    const progress = Math.round((completedTasks / tasks.length) * 100)

    const toggleTask = (taskId: string) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ))
    }

    const handleAIChat = () => {
        if (!aiMessage.trim()) return

        setChatMessages([...chatMessages,
        { role: 'user', content: aiMessage },
        { role: 'ai', content: `Отличный вопрос! Для проекта "${project.title}" я рекомендую: 1) Начать с базовой структуры, 2) Использовать компонентный подход, 3) Добавить тесты. Нужна помощь с конкретным этапом?` }
        ])
        setAiMessage('')
    }

    const prompts = {
        database: `Act as a Senior Database Architect.

Project: ${project.title}
Description: ${project.description || project.title}
Database: Firestore

Task: Create a detailed database schema for this project.
Include:
- Collections and documents
- Data structure
- Indexes for performance
- Security rules
- Sample queries

Use best practices for Firestore.`,

        backend: `Act as a Senior Backend Developer.

Project: ${project.title}
Tech Stack: Firebase
Database: Firestore

Task: Create a RESTful API structure for this project.
Include:
- API endpoints (CRUD operations)
- Request/Response formats
- Authentication/Authorization
- Error handling
- Validation rules

Use Firebase best practices.`,

        frontend: `Act as a Senior Frontend Developer.

Project: ${project.title}
Tech Stack: React + TypeScript

Task: Create component structure for this project.
Include:
- Main components list
- Component hierarchy
- Props interfaces
- State management approach
- Routing structure

Use React + TypeScript best practices.`
    }

    const copyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt)
        alert('Промпт скопирован!')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-blue-600 hover:text-blue-700 mb-4"
                    >
                        ← Назад к проектам
                    </button>

                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                        <p className="text-purple-100 mb-6">{project.description || 'Описание проекта'}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-sm text-purple-100 mb-1">Прогресс</div>
                                <div className="text-3xl font-bold">{progress}%</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-sm text-purple-100 mb-1">Задач выполнено</div>
                                <div className="text-3xl font-bold">{completedTasks} / {tasks.length}</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-sm text-purple-100 mb-1">Статус</div>
                                <div className="text-xl font-bold">
                                    {progress === 100 ? '✅ Завершён' : progress > 0 ? '🟡 В процессе' : '⚪ Не начат'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-xl mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'tasks'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <CheckCircle2 className="w-5 h-5 inline mr-2" />
                            Задачи
                        </button>
                        <button
                            onClick={() => setActiveTab('prompts')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'prompts'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Code className="w-5 h-5 inline mr-2" />
                            Промпты
                        </button>
                        <button
                            onClick={() => setActiveTab('presentation')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'presentation'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Presentation className="w-5 h-5 inline mr-2" />
                            Презентация
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'chat'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MessageSquare className="w-5 h-5 inline mr-2" />
                            AI Помощник
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Tasks Tab */}
                        {activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-6">Чеклист разработки</h2>
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${task.completed
                                            ? 'bg-green-50 border-2 border-green-200'
                                            : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400" />
                                        )}
                                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Prompts Tab */}
                        {activeTab === 'prompts' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Промпты для разработки</h2>

                                {/* Database Prompt */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Database className="w-6 h-6 text-blue-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Database Schema</h3>
                                        </div>
                                        <button
                                            onClick={() => copyPrompt(prompts.database)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Копировать
                                        </button>
                                    </div>
                                    <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                                        {prompts.database}
                                    </pre>
                                </div>

                                {/* Backend Prompt */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Code className="w-6 h-6 text-purple-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Backend API</h3>
                                        </div>
                                        <button
                                            onClick={() => copyPrompt(prompts.backend)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Копировать
                                        </button>
                                    </div>
                                    <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                                        {prompts.backend}
                                    </pre>
                                </div>

                                {/* Frontend Prompt */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Layout className="w-6 h-6 text-green-600" />
                                            <h3 className="text-xl font-bold text-gray-900">Frontend Components</h3>
                                        </div>
                                        <button
                                            onClick={() => copyPrompt(prompts.frontend)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Копировать
                                        </button>
                                    </div>
                                    <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                                        {prompts.frontend}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Presentation Tab */}
                        {activeTab === 'presentation' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Презентация проекта</h2>
                                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                                        <Download className="w-5 h-5" />
                                        Экспорт в PDF
                                    </button>
                                </div>

                                {/* Slide 1 */}
                                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-12 text-white shadow-2xl">
                                    <h3 className="text-3xl font-bold mb-4">Проблема</h3>
                                    <p className="text-xl text-red-100">
                                        Опишите проблему, которую решает ваш проект
                                    </p>
                                </div>

                                {/* Slide 2 */}
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-12 text-white shadow-2xl">
                                    <h3 className="text-3xl font-bold mb-4">Решение</h3>
                                    <p className="text-xl text-blue-100 mb-6">
                                        Покажите как ваше решение помогает пользователям
                                    </p>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                        <h4 className="font-bold text-xl mb-3">Основной функционал:</h4>
                                        <ul className="space-y-2">
                                            <li>• Функция 1</li>
                                            <li>• Функция 2</li>
                                            <li>• Функция 3</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Slide 3 */}
                                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-12 text-white shadow-2xl">
                                    <h3 className="text-3xl font-bold mb-6">Технологии</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                            <div className="text-sm text-purple-100 mb-1">Frontend</div>
                                            <div className="font-bold">React + TypeScript</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                            <div className="text-sm text-purple-100 mb-1">Backend</div>
                                            <div className="font-bold">Firebase</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                            <div className="text-sm text-purple-100 mb-1">Database</div>
                                            <div className="font-bold">Firestore</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Chat Tab */}
                        {activeTab === 'chat' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">🎯 AI Помощник проекта</h2>

                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Я могу помочь вам:</h3>
                                            <ul className="space-y-1 text-gray-700">
                                                <li>• Спланировать следующие шаги разработки</li>
                                                <li>• Предложить архитектуру проекта</li>
                                                <li>• Помочь с выбором технологий</li>
                                                <li>• Сгенерировать код и промпты</li>
                                                <li>• Ответить на вопросы по проекту</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="bg-gray-50 rounded-xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto space-y-4">
                                    {chatMessages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-12">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p>Задайте вопрос AI помощнику</p>
                                        </div>
                                    ) : (
                                        chatMessages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user'
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white border-2 border-gray-200'
                                                        }`}
                                                >
                                                    <div className="text-sm font-medium mb-1">
                                                        {msg.role === 'user' ? 'Вы' : '🤖 AI Помощник'}
                                                    </div>
                                                    <div>{msg.content}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Chat Input */}
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={aiMessage}
                                        onChange={(e) => setAiMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                                        placeholder="Задайте вопрос AI помощнику..."
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleAIChat}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
