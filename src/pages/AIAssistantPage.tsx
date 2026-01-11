import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useAIContext } from '@/store/aiContextStore'
import { useProjectStore } from '@/store/projectStore'
import { sendImageMessage, checkAPIStatus, clearSessionHistory } from '@/api/gemini'
import { Sparkles, Image as ImageIcon, Lightbulb, Code, BookOpen, Zap, Trash2, Send } from 'lucide-react'

export const AIAssistantPage = () => {
    const { messages, sendMessage, isLoading } = useAIAssistant({
        page: 'ai-assistant'
    })

    const { currentConversation, startConversation, clearConversation } = useAIContext()
    const projects = useProjectStore((state) => state.projects)

    const [input, setInput] = useState('')
    const [apiStatus, setApiStatus] = useState<boolean | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        checkAPIStatus().then(setApiStatus)
    }, [])

    useEffect(() => {
        if (!currentConversation) {
            startConversation('AI Assistant Chat')
        }
    }, [currentConversation, startConversation])

    // Умные предложения на основе контекста
    const suggestions = [
        {
            icon: <Code className="w-5 h-5" />,
            title: 'Помощь с кодом',
            prompt: 'Помоги мне написать функцию на JavaScript для...',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: 'Объясни концепцию',
            prompt: 'Объясни простыми словами, что такое...',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: 'Идеи для проекта',
            prompt: 'Предложи идеи для моего проекта...',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: 'Оптимизация',
            prompt: 'Как оптимизировать этот код?',
            color: 'from-green-500 to-emerald-500'
        }
    ]

    // Контекстные предложения на основе проектов
    const contextSuggestions = projects.length > 0 ? [
        `Помоги с проектом "${projects[0].title}"`,
        'Какие технологии лучше использовать?',
        'Как структурировать код?',
        'Предложи архитектуру проекта'
    ] : [
        'Как начать изучать программирование?',
        'Какой язык программирования выбрать?',
        'Что такое React?',
        'Как работает Firebase?'
    ]

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return

        try {
            if (selectedImage) {
                await sendImageMessage(selectedImage, input || 'Что на этом изображении?')
                setSelectedImage(null)
            } else {
                // Добавляем контекст проекта если есть
                let contextualPrompt = input
                if (projects.length > 0) {
                    const projectContext = `Контекст: Я работаю над проектом "${projects[0].title}". ${input}`
                    contextualPrompt = projectContext
                }

                await sendMessage(contextualPrompt)
            }

            setInput('')
            setShowSuggestions(false)
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const handleSuggestionClick = (prompt: string) => {
        setInput(prompt)
        setShowSuggestions(false)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setSelectedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleNewChat = async () => {
        // Clear backend session
        await clearSessionHistory()

        // Clear frontend state
        clearConversation()
        startConversation('New AI Chat')
        setShowSuggestions(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Ellie
                                </h1>
                                <p className="text-gray-600">
                                    {apiStatus === null ? 'Проверка...' : apiStatus ? '🟢 Онлайн' : '🔴 Оффлайн'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleNewChat}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Очистить диалог
                        </button>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Messages */}
                    <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 && showSuggestions ? (
                            <div className="space-y-6">
                                {/* Welcome */}
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">🤖</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Привет! Я Ellie, твой AI помощник
                                    </h2>
                                    <p className="text-gray-600">
                                        Задай мне любой вопрос или выбери один из вариантов ниже
                                    </p>
                                </div>

                                {/* Quick Suggestions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                                            className={`p-6 rounded-xl bg-gradient-to-br ${suggestion.color} text-white text-left hover:shadow-xl transition-all hover:scale-105`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                {suggestion.icon}
                                                <h3 className="font-bold text-lg">{suggestion.title}</h3>
                                            </div>
                                            <p className="text-sm text-white/90">{suggestion.prompt}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Context Suggestions */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                                        Популярные вопросы:
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {contextSuggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-4 py-3 bg-white rounded-lg text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-2 border-gray-200 hover:border-purple-300"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <div className="text-sm font-medium mb-1">
                                                {msg.role === 'user' ? 'Вы' : '🤖 Ellie'}
                                            </div>
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 p-4 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="px-6 py-3 bg-purple-50 border-t border-purple-200">
                            <div className="flex items-center gap-3">
                                <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                                <span className="text-sm text-gray-700">Изображение прикреплено</span>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="ml-auto p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex gap-3">
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
                                title="Прикрепить изображение"
                            >
                                <ImageIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Задайте вопрос Ellie..."
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Советы по использованию:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Задавайте конкретные вопросы для лучших ответов</li>
                        <li>• Можете прикреплять изображения для анализа</li>
                        <li>• AI помнит контекст разговора</li>
                        <li>• Используйте готовые промпты из раздела "Проекты"</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
