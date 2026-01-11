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

    // Show welcome animation every time
    const [showWelcome, setShowWelcome] = useState(true)
    const [showSpinning, setShowSpinning] = useState(false)
    const [isListening, setIsListening] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const recognitionRef = useRef<any>(null)

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

    // Welcome screen: 5 seconds, then spinning for 2 seconds, then chat (every time)
    useEffect(() => {
        const welcomeTimer = setTimeout(() => {
            setShowWelcome(false)
            setShowSpinning(true)
        }, 5000) // 5 seconds welcome

        const spinningTimer = setTimeout(() => {
            setShowSpinning(false)
        }, 7000) // 5s welcome + 2s spinning = 7s total

        return () => {
            clearTimeout(welcomeTimer)
            clearTimeout(spinningTimer)
        }
    }, [])

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

    // Voice input handlers
    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Голосовой ввод не поддерживается вашим браузером. Используйте Chrome или Edge.')
            return
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.lang = 'ru-RU'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => {
            setIsListening(true)
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current = recognition
        recognition.start()
    }

    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        setIsListening(false)
    }

    // Welcome Screen
    if (showWelcome) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                {/* Animated Background Particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Welcome Content */}
                <div className="relative z-10 text-center animate-fade-in-scale">
                    {/* Ellie Avatar with Glow */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-50 animate-pulse"></div>
                        <div className="relative w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <Sparkles className="w-16 h-16 text-purple-600 animate-bounce" />
                        </div>
                    </div>

                    {/* Greeting Text */}
                    <h1 className="text-6xl font-black text-white mb-4 animate-slide-up">
                        Привет! 👋
                    </h1>
                    <h2 className="text-4xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Я <span className="bg-white text-purple-600 px-4 py-2 rounded-xl">Ellie</span>
                    </h2>
                    <p className="text-2xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        Твой AI помощник в обучении
                    </p>

                    {/* Loading Dots */}
                    <div className="flex items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes fade-in-scale {
                        from {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    @keyframes slide-up {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                    .animate-fade-in-scale {
                        animation: fade-in-scale 1s ease-out;
                    }
                    .animate-slide-up {
                        animation: slide-up 0.8s ease-out backwards;
                    }
                `}</style>
            </div>
        )
    }

    // Spinning Transition Screen
    if (showSpinning) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                {/* Orbiting Particles */}
                <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-4 h-4 bg-white rounded-full opacity-40"
                            style={{
                                left: '50%',
                                top: '50%',
                                animation: `orbit ${2 + i * 0.3}s linear infinite`,
                                animationDelay: `${i * 0.2}s`,
                                transformOrigin: `${100 + i * 30}px center`
                            }}
                        />
                    ))}
                </div>

                {/* Spinning Ellie */}
                <div className="relative z-10">
                    <div className="relative w-40 h-40 mx-auto">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-2 border-4 border-white/20 rounded-full animate-spin-reverse"></div>

                        {/* Center avatar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                                <Sparkles className="w-12 h-12 text-purple-600 animate-spin" />
                            </div>
                        </div>
                    </div>

                    <p className="text-white text-2xl font-bold mt-8 text-center animate-pulse">
                        Загрузка...
                    </p>
                </div>

                <style>{`
                    @keyframes orbit {
                        from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
                        to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes spin-reverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .animate-spin-slow {
                        animation: spin-slow 3s linear infinite;
                    }
                    .animate-spin-reverse {
                        animation: spin-reverse 2s linear infinite;
                    }
                `}</style>
            </div>
        )
    }

    // Main Chat Interface
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 animate-fade-in">
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
                                    {apiStatus === null ? 'Проверка...' : apiStatus ? '🟢 Онлайн' : '🟢 Онлайн (Fallback режим)'}
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
                                    <div className="text-6xl mb-4 animate-bounce">🤖</div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                        Привет! Я Ellie 👋
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-2">
                                        Твой AI помощник в обучении
                                    </p>
                                    <p className="text-gray-500">
                                        Задай мне любой вопрос или выбери тему ниже
                                    </p>
                                </div>

                                {/* Quick Suggestions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {suggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                                            className={`p-6 rounded-xl bg-gradient-to-br ${suggestion.color} text-white text-left hover:shadow-xl transition-all hover:scale-105 transform`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                {suggestion.icon}
                                                <h3 className="font-bold text-lg">{suggestion.title}</h3>
                                            </div>
                                            <p className="text-sm text-white/90">{suggestion.prompt}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-4 rounded-2xl shadow-md ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                : 'bg-white text-gray-900 border-2 border-gray-100'
                                                }`}
                                        >
                                            <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                                {msg.role === 'user' ? (
                                                    <>
                                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">👤</span>
                                                        <span>Вы</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">🤖</span>
                                                        <span className="text-purple-600 font-bold">Ellie</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start animate-slide-in">
                                        <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                <span className="text-sm text-gray-600 ml-2">Думаю...</span>
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
                    <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50">
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
                                className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
                                title="Прикрепить изображение"
                            >
                                <ImageIcon className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Voice Input Button */}
                            <button
                                onClick={isListening ? stopVoiceInput : startVoiceInput}
                                className={`p-3 border-2 rounded-xl transition-all shadow-sm hover:shadow-md ${isListening
                                    ? 'bg-red-500 border-red-600 animate-pulse'
                                    : 'bg-white border-gray-300 hover:border-green-500 hover:bg-green-50'
                                    }`}
                                title={isListening ? 'Остановить запись' : 'Голосовой ввод'}
                            >
                                {isListening ? (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                                        <span className="relative text-white text-xl">🎤</span>
                                    </div>
                                ) : (
                                    <span className="text-xl">🎤</span>
                                )}
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder={isListening ? "Слушаю..." : "Задайте вопрос Ellie..."}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                                disabled={isListening}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:scale-105"
                            >
                                <Send className="w-5 h-5" />
                                Отправить
                            </button>
                        </div>

                        {/* Voice Input Hint */}
                        {isListening && (
                            <div className="mt-3 text-center">
                                <p className="text-sm text-red-600 font-medium animate-pulse">
                                    🔴 Запись... Говорите сейчас
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Советы по использованию:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 🎤 <strong>Голосовой ввод:</strong> Нажмите на микрофон и говорите</li>
                        <li>• 💬 <strong>Конкретные вопросы:</strong> Задавайте детальные вопросы для лучших ответов</li>
                        <li>• 🖼️ <strong>Изображения:</strong> Прикрепляйте скриншоты для анализа</li>
                        <li>• 🧠 <strong>Контекст:</strong> AI помнит всю историю разговора</li>
                    </ul>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}
