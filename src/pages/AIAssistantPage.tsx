import { useState, useRef, useEffect } from 'react'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useAIContext } from '@/store/aiContextStore'
import { clearSessionHistory, checkAIStatus } from '@/api/gemini'
import {
    Sparkles,
    Trash2,
    Send,
    Mic,
    Bot,
    Zap
} from 'lucide-react'
import { AIMessage } from '@/components/ai/AIMessage'

export const AIAssistantPage = () => {
    const {
        messages,
        sendMessage,
        isLoading,
        error
    } = useAIAssistant({
        page: 'ai-assistant'
    })

    const { currentConversation, startConversation, clearConversation } = useAIContext()

    const [input, setInput] = useState('')
    const [aiStatus, setAiStatus] = useState({ available: true, status: 'online' })
    const [isListening, setIsListening] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Check AI status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await checkAIStatus()
                setAiStatus(status)
            } catch (e) {
                setAiStatus({ available: true, status: 'online' })
            }
        }
        fetchStatus()
        const interval = setInterval(fetchStatus, 60000)
        return () => clearInterval(interval)
    }, [])

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initialize chat
    useEffect(() => {
        const initChat = async () => {
            if (!currentConversation) {
                try {
                    await startConversation('AI Chat')
                } catch (err) {
                    console.error('Failed to start chat:', err)
                }
            }
        }
        initChat()
    }, [currentConversation, startConversation])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const currentInput = input
        setInput('')
        await sendMessage(currentInput)
        inputRef.current?.focus()
    }

    const handleNewChat = async () => {
        try {
            await clearSessionHistory()
            clearConversation()
            await startConversation('New Chat')
        } catch (err) {
            console.error('Failed to start new chat:', err)
        }
    }

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Голосовой ввод не поддерживается')
            return
        }
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'ru-RU'
        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event: any) => {
            setInput(event.results[0][0].transcript)
            setIsListening(false)
        }
        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        recognitionRef.current = recognition
        recognition.start()
    }

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${aiStatus.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            Мита
                            <span className="text-xs font-medium text-slate-400">AI</span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Zap className={`w-3 h-3 ${aiStatus.available ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <span>{aiStatus.available ? 'Онлайн' : 'Оффлайн'}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleNewChat}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Новый чат"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-6 max-w-md mx-auto py-8">
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                                    <Sparkles className="w-8 h-8 text-indigo-500" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Привет! Я Мита 👋</h2>
                                <p className="text-sm text-slate-400">
                                    Твой AI-помощник для изучения Python и Figma.
                                    Спрашивай что угодно!
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg: any, i: number) => (
                            <AIMessage
                                key={i}
                                content={msg.content}
                                role={msg.role as 'user' | 'assistant'}
                            />
                        ))
                    )}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-xs font-medium text-slate-400">Мита думает...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={isListening ? "Говорите..." : "Напишите сообщение..."}
                            className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none text-sm text-slate-900 placeholder:text-slate-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            disabled={isListening}
                        />

                        <button
                            onClick={startVoiceInput}
                            className={`p-2.5 rounded-xl transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-100 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50'
                                }`}
                        >
                            <Mic className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-300 mt-2">
                        Мита использует AI для генерации ответов
                    </p>
                </div>
            </div>
        </div>
    )
}
