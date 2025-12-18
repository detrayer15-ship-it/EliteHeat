import { useState } from 'react'

interface AICopilotProps {
    activeTab: 'roadmap' | 'prompts' | 'storyboard'
}

export const AICopilot = ({ activeTab }: AICopilotProps) => {
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
    const [input, setInput] = useState('')

    const getAIMode = () => {
        switch (activeTab) {
            case 'roadmap':
                return { icon: '🎯', title: 'Mentor Mode', description: 'Помогаю сформулировать идею и план' }
            case 'prompts':
                return { icon: '🏗️', title: 'Architect Mode', description: 'Генерирую технические промпты' }
            case 'storyboard':
                return { icon: '🎤', title: 'Speaker Coach', description: 'Готовлю презентацию для защиты' }
        }
    }

    const handleSend = () => {
        if (!input.trim()) return

        const userMessage = { role: 'user' as const, content: input }
        setMessages([...messages, userMessage])

        // Mock ответ AI
        let aiResponse = ''
        switch (activeTab) {
            case 'roadmap':
                aiResponse = '🎯 Отличный вопрос! Начни с описания проблемы. Что именно беспокоит твою целевую аудиторию?'
                break
            case 'prompts':
                aiResponse = '🏗️ Хорошо! Я помогу сгенерировать промпт. Какую часть проекта ты хочешь реализовать сейчас?'
                break
            case 'storyboard':
                aiResponse = '🎤 Отлично! Для презентации важно рассказать историю. Начни с проблемы, которую решает твой проект.'
                break
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        }, 500)

        setInput('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    const aiMode = getAIMode()

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* AI Mode Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{aiMode.icon}</span>
                    <div>
                        <h3 className="font-bold text-gray-900">{aiMode.title}</h3>
                        <p className="text-xs text-gray-600">{aiMode.description}</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                        👋 Привет! Я в режиме <strong>{aiMode.title}</strong>.
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        {activeTab === 'roadmap' && 'Помогу сформулировать идею и составить план.'}
                        {activeTab === 'prompts' && 'Сгенерирую качественные промпты для разработки.'}
                        {activeTab === 'storyboard' && 'Подготовлю структуру презентации для защиты.'}
                    </p>
                </div>

                {/* User and AI messages */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`rounded-lg p-3 ${msg.role === 'user'
                                ? 'bg-blue-100 ml-4'
                                : 'bg-gray-100 mr-4'
                            }`}
                    >
                        <p className="text-sm">{msg.content}</p>
                    </div>
                ))}

                {/* Default hints */}
                {messages.length === 0 && (
                    <>
                        {activeTab === 'roadmap' && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-2">💡 Совет:</p>
                                <p className="text-xs text-gray-600">
                                    Начни с описания проблемы, которую решает твой проект.
                                </p>
                            </div>
                        )}

                        {activeTab === 'prompts' && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-2">🏗️ Рекомендация:</p>
                                <p className="text-xs text-gray-600">
                                    Выбери стек технологий, и я адаптирую промпты под него.
                                </p>
                            </div>
                        )}

                        {activeTab === 'storyboard' && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-2">🎤 Подсказка:</p>
                                <p className="text-xs text-gray-600">
                                    Презентация должна быть простой. 5-7 слайдов достаточно.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Спроси AI помощника..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    )
}
