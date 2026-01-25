import { useState, useRef, useEffect } from 'react'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useAIContext } from '@/store/aiContextStore'
import { clearSessionHistory } from '@/api/gemini'
import {
    Sparkles,
    Image as ImageIcon,
    Trash2,
    Send,
    Music,
    Mic,
    MoreHorizontal,
    Zap,
    Bot,
    Code,
    BookOpen,
    Lightbulb
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
    const [selectedImage] = useState<string | null>(null)
    const [selectedAudio] = useState<string | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(true)
    const [userName] = useState<string>('')
    const [isListening, setIsListening] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const audioInputRef = useRef<HTMLInputElement>(null)
    const recognitionRef = useRef<any>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const initChat = async () => {
            if (!currentConversation) {
                try {
                    await startConversation('AI Assistant Chat')
                } catch (err) {
                    console.error('Failed to auto-start chat:', err)
                }
            }
        }
        initChat()
    }, [currentConversation, startConversation])

    // Умные предложения
    const suggestions = [
        {
            icon: <Code className="w-5 h-5" />,
            title: 'Development',
            prompt: 'Помоги мне написать функцию на JavaScript для...',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            title: 'Knowledge',
            prompt: 'Объясни простыми словами, что такое...',
            color: 'from-purple-500 to-pink-600'
        },
        {
            icon: <Lightbulb className="w-5 h-5" />,
            title: 'Creative',
            prompt: 'Предложи идеи для моего проекта...',
            color: 'from-amber-400 to-orange-600'
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: 'Optimization',
            prompt: 'Как оптимизировать этот код?',
            color: 'from-emerald-400 to-teal-600'
        }
    ]

    const handleSend = async () => {
        if (!input.trim() && !selectedImage && !selectedAudio) return

        const currentInput = input
        setInput('')
        setShowSuggestions(false)

        await sendMessage(currentInput)
    }

    const handleSuggestionClick = (prompt: string) => {
        setInput(prompt)
        setShowSuggestions(false)
    }

    const handleNewChat = async () => {
        try {
            await clearSessionHistory()
            clearConversation()
            await startConversation('New AI Chat')
            setShowSuggestions(true)
        } catch (err) {
            console.error('Failed to start new chat:', err)
        }
    }

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Голосовой ввод не поддерживается.')
            return
        }
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'ru-RU'
        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event: any) => setInput(event.results[0][0].transcript)
        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)
        recognitionRef.current = recognition
        recognition.start()
    }

    const stopVoiceInput = () => {
        recognitionRef.current?.stop()
        setIsListening(false)
    }

    return (
        <div className="min-h-full py-1 flex flex-col gap-2 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between px-4 py-1">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-[#0a0a0c] border border-white/5 flex items-center justify-center group/av">
                            <Bot className="w-6 h-6 text-indigo-400 group-hover/av:scale-110 transition-transform" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-indigo-950 tracking-tighter leading-none">Mita OS <span className="text-indigo-600/30 text-xs font-serif lowercase italic ml-1">v4.0.2</span></h1>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-950/40 mt-1">
                            <span className="flex items-center gap-1"><Zap className="w-2 h-2 text-yellow-500 fill-current" /> Neural Core Active</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-indigo-200"></span>
                            <span>{userName || 'Global Guest'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleNewChat}
                        className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-sm hover:shadow-md transition-all text-indigo-950/40 hover:text-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-sm hover:shadow-md transition-all text-indigo-950/40 hover:text-indigo-600">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-[2rem] border border-white shadow-3xl overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none relative">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-6 max-w-xl mx-auto py-4">
                            <div className="text-center space-y-2">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                    <Sparkles className="w-7 h-7 animate-pulse" />
                                </div>
                                <h2 className="text-xl font-black text-indigo-950">Система готова.</h2>
                                <p className="text-xs text-indigo-900/40 font-medium">С чего начнем обучение сегодня?</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg: any, i: number) => (
                            <AIMessage
                                key={i}
                                content={msg.content}
                                role={msg.role as 'user' | 'assistant'}
                                userName={userName || undefined}
                            />
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start animate-fade-in pl-2">
                            <div className="flex gap-4 items-center bg-indigo-50/50 px-6 py-3 rounded-full border border-indigo-100">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Mita thinking</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                <div className="p-4 border-t border-indigo-50 bg-white/40">
                    <div className="max-w-3xl mx-auto">
                        <div className={`p-2 pl-4 rounded-2xl bg-white shadow-xl border border-indigo-50 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10`}>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => audioInputRef.current?.click()}
                                    className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all"
                                >
                                    <Music className="w-4 h-4" />
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder={isListening ? "Listening..." : "Ask Mita..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-indigo-950 font-medium placeholder:text-indigo-900/20 py-2"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                disabled={isListening}
                            />

                            <div className="flex items-center gap-2 pr-1">
                                <button
                                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                                    className={`p-3 rounded-xl transition-all ${isListening ? 'bg-indigo-600 text-white animate-pulse' : 'bg-indigo-50 text-indigo-400 hover:text-indigo-600'}`}
                                >
                                    <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-glow disabled:opacity-30 disabled:shadow-none transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <input type="file" ref={imageInputRef} className="hidden" />
            <input type="file" ref={audioInputRef} className="hidden" />

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .shadow-3xl {
                    box-shadow: 0 40px 90px -20px rgba(0, 0, 0, 0.1);
                }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce { animation: bounce 0.6s infinite; }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
            `}</style>
        </div>
    )
}
