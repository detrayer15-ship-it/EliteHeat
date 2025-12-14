import { useState } from 'react'
import { Send, Sparkles, Target, Wrench, Presentation, Loader2 } from 'lucide-react'
import type { Project } from '@/types/project'
import { mockAIResponse } from '@/utils/mockAI'

interface AiSidebarProps {
    activeTab: 'roadmap' | 'prompts' | 'storyboard'
    project: Project
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export const AiSidebar = ({ activeTab, project }: AiSidebarProps) => {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return

        const userMessage = message.trim()
        setMessage('')

        // Add user message
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            // Get AI response
            const response = await mockAIResponse(userMessage, activeTab)

            // Add AI response
            setChatHistory(prev => [...prev, { role: 'assistant', content: response.message }])
        } catch (error) {
            console.error('Mock AI Error:', error)
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: 'Произошла ошибка. Попробуйте ещё раз.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickAction = async (action: string) => {
        setIsLoading(true)
        setChatHistory(prev => [...prev, { role: 'user', content: action }])

        try {
            const response = await mockAIResponse(action, activeTab)
            setChatHistory(prev => [...prev, { role: 'assistant', content: response.message }])
        } catch (error) {
            console.error('Mock AI Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getContent = () => {
        switch (activeTab) {
            case 'roadmap':
                return {
                    icon: <Target className="w-6 h-6" />,
                    title: '🎯 Project Mentor',
                    description: 'Помогу спланировать следующие шаги и структурировать работу над проектом',
                    actions: [
                        { label: 'Анализ прогресса', action: 'Проанализируй мой прогресс' },
                        { label: 'Предложить следующий шаг', action: 'Какой следующий шаг?' },
                        { label: 'Сгенерировать roadmap', action: 'Создай roadmap' },
                    ]
                }
            case 'prompts':
                return {
                    icon: <Wrench className="w-6 h-6" />,
                    title: '🛠️ Tech Architect',
                    description: 'Помогу настроить промпты под ваш технологический стек',
                    currentStack: project.techStack,
                    actions: [
                        { label: 'Предложить стек', action: 'Какой стек выбрать?' },
                        { label: 'Создать промпт', action: 'Создай промпт для базы данных' },
                        { label: 'Оптимизировать промпты', action: 'Оптимизируй промпты' },
                    ]
                }
            case 'storyboard':
                return {
                    icon: <Presentation className="w-6 h-6" />,
                    title: '🎤 Presentation Coach',
                    description: 'Помогу подготовить убедительную презентацию для защиты проекта',
                    actions: [
                        { label: 'Симуляция защиты', action: 'Симулируй вопрос от жюри' },
                        { label: 'Улучшить слайд', action: 'Как улучшить слайд 1?' },
                        { label: 'Создать презентацию', action: 'Создай структуру презентации' },
                    ]
                }
        }
    }

    const content = getContent()

    return (
        <div className="sticky top-24 space-y-4">
            {/* AI Mode Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {content.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{content.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    {content.description}
                </p>

                {/* Current Stack (for prompts tab) */}
                {content.currentStack && (
                    <div className="mb-4 p-3 bg-white rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-2">Текущий стек:</p>
                        <div className="space-y-1 text-sm">
                            <p>• Frontend: {content.currentStack.frontend || 'Не указан'}</p>
                            <p>• Backend: {content.currentStack.backend || 'Не указан'}</p>
                            <p>• DB: {content.currentStack.db || 'Не указан'}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="space-y-2">
                    {content.actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickAction(action.action)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">AI Чат</h4>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Mock Mode
                    </span>
                </div>

                {/* Chat History */}
                {chatHistory.length > 0 && (
                    <div className="mb-3 max-h-64 overflow-y-auto space-y-2">
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded text-xs ${msg.role === 'user'
                                        ? 'bg-purple-100 text-purple-900 ml-4'
                                        : 'bg-gray-100 text-gray-900 mr-4'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                AI думает...
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Задайте вопрос..."
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center">
                    💡 Mock AI для тестирования
                </p>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Информация о проекте</h4>
                <div className="space-y-2 text-xs text-gray-600">
                    <p><span className="font-medium">Название:</span> {project.title}</p>
                    <p><span className="font-medium">Тип:</span> {project.type || 'Не указан'}</p>
                    <p><span className="font-medium">Прогресс:</span> {project.progress || 0}%</p>
                </div>
            </div>
        </div>
    )
}
