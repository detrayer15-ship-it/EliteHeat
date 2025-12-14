import { useState, useEffect } from 'react'
import { Send, Sparkles, Code, Bug, Lightbulb, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sendTextMessage } from '@/api/gemini'
import type { Project } from '@/types/project'

interface AIAssistantPanelProps {
    project: Project
    currentFile: string
    currentCode?: string
}

export const AIAssistantPanel = ({ project, currentFile, currentCode = '' }: AIAssistantPanelProps) => {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
        {
            role: 'assistant',
            content: `👋 Привет! Я твой AI-помощник.\n\nЯ помогу с:\n• Написанием кода\n• Поиском ошибок\n• Объяснением концепций\n• Оптимизацией кода\n\nЗадай вопрос!`
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const quickActions = [
        {
            icon: Code,
            label: 'Сгенерировать код',
            prompt: `Создай компонент для ${project.title}`,
            color: 'purple'
        },
        {
            icon: Bug,
            label: 'Найти ошибки',
            prompt: 'Проверь код на ошибки',
            color: 'red'
        },
        {
            icon: Lightbulb,
            label: 'Улучшить код',
            prompt: 'Как улучшить этот код?',
            color: 'yellow'
        },
        {
            icon: Zap,
            label: 'Объяснить код',
            prompt: 'Объясни что делает этот код',
            color: 'blue'
        },
    ]

    const handleSend = async (message?: string) => {
        const userMessage = message || input.trim()
        if (!userMessage || isLoading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            // Формируем контекст для AI
            const contextPrompt = `Ты - опытный программист-наставник.

Проект: ${project.title}
Описание: ${project.description}
Технологии: ${project.techStack?.frontend}, ${project.techStack?.backend}

Текущий файл: ${currentFile}
${currentCode ? `\nКод файла:\n\`\`\`\n${currentCode}\n\`\`\`\n` : ''}

Вопрос студента: ${userMessage}

Дай конкретный и полезный ответ. Если нужно показать код, используй примеры.`

            const response = await sendTextMessage(contextPrompt)

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response
            }])
        } catch (error) {
            console.error('AI Error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Извините, произошла ошибка. Попробуйте ещё раз.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickAction = (prompt: string) => {
        handleSend(prompt)
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#3e3e42] bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-semibold text-gray-200">AI Assistant</h3>
                </div>
                <p className="text-xs text-gray-400">
                    Файл: {currentFile.split('/').pop()}
                </p>
            </div>

            {/* Quick Actions */}
            <div className="px-3 py-2 border-b border-[#3e3e42] space-y-2">
                {quickActions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleQuickAction(action.prompt)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${action.color === 'purple' ? 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-300' :
                            action.color === 'red' ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300' :
                                'bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-300'
                            }`}
                    >
                        <action.icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}>
                            <span className="text-white text-xs font-bold">
                                {msg.role === 'user' ? 'U' : 'AI'}
                            </span>
                        </div>
                        <div className={`flex-1 rounded-lg p-3 text-xs ${msg.role === 'user'
                            ? 'bg-green-900/30 text-green-100'
                            : 'bg-purple-900/30 text-purple-100'
                            }`}>
                            <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1 rounded-lg p-3 bg-purple-900/30">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#3e3e42] bg-[#2d2d30]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Спроси AI..."
                        className="flex-1 px-3 py-2 bg-[#3c3c3c] border border-[#3e3e42] rounded text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="px-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        size="sm"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
