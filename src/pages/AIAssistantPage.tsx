import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useAIContext } from '@/store/aiContextStore'
import { useProjectStore } from '@/store/projectStore'
import { sendImageMessage, checkAPIStatus, clearSessionHistory } from '@/api/gemini'
import {
    Sparkles,
    Image as ImageIcon,
    Lightbulb,
    Code,
    BookOpen,
    Zap,
    Trash2,
    Send,
    Music,
    Volume2,
    VolumeX,
    Mic,
    MoreHorizontal,
    ChevronRight,
    Search,
    Bot,
    User
} from 'lucide-react'
import { voiceService, MITA_PHRASES } from '@/utils/voiceSynthesis'
import { ScrollReveal } from '@/components/ScrollReveal'

export const AIAssistantPage = () => {
    const { messages, sendMessage, isLoading } = useAIAssistant({
        page: 'ai-assistant'
    })

    const { currentConversation, startConversation, clearConversation } = useAIContext()
    const projects = useProjectStore((state) => state.projects)

    const [input, setInput] = useState('')
    const [apiStatus, setApiStatus] = useState<boolean | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedAudio, setSelectedAudio] = useState<string | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(true)

    const [welcomeStep, setWelcomeStep] = useState<'consent' | 'greeting' | 'name-question' | 'final-greeting' | 'chat'>('consent')
    const [userName, setUserName] = useState('')
    const [tempName, setTempName] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(false) // Start with consent dialog
    const [isSpeaking, setIsSpeaking] = useState(false)

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

        try {
            if (selectedImage) {
                await sendImageMessage(selectedImage, input || 'Что на этом изображении?')
                setSelectedImage(null)
            } else if (selectedAudio) {
                await sendMessage(`[Аудио файл загружен] ${input || 'Пожалуйста, обработайте это аудио'}`)
                setSelectedAudio(null)
            } else {
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
            reader.onloadend = () => setSelectedImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setSelectedAudio(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleNewChat = async () => {
        await clearSessionHistory()
        clearConversation()
        startConversation('New AI Chat')
        setShowSuggestions(true)
    }

    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Голосовой ввод не поддерживается вашим браузером.')
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

    useEffect(() => {
        if (welcomeStep === 'greeting') {
            const startFlow = async () => {
                try {
                    setIsSpeaking(true)
                    await voiceService.playGreeting()
                    setIsSpeaking(false)
                    // Wait 1 second, then change text and play second audio
                    setTimeout(async () => {
                        setWelcomeStep('name-question')
                        // Play second audio
                        try {
                            setIsSpeaking(true)
                            await voiceService.playAskName()
                            setIsSpeaking(false)
                        } catch (err) {
                            setIsSpeaking(false)
                        }
                    }, 1000)
                    // Transition to name-question is now handled inside the 1s timeout above
                } catch (error) {
                    setIsSpeaking(false)
                    console.error('Voice playback failed:', error)
                    // Continue after 2 seconds if something fails
                    setTimeout(() => {
                        setWelcomeStep('name-question')
                    }, 2000)
                }
            }
            startFlow()
        }
    }, [welcomeStep])

    const handleVoiceConsent = (consent: boolean) => {
        setVoiceEnabled(consent)
        if (consent) {
            setWelcomeStep('greeting')
        } else {
            setWelcomeStep('name-question')
        }
    }

    const handleNameSubmit = async () => {
        if (tempName.trim()) {
            setUserName(tempName)
            setWelcomeStep('final-greeting')

            if (voiceEnabled) {
                setTimeout(async () => {
                    try {
                        setIsSpeaking(true)
                        await voiceService.playNiceToMeet()
                        setIsSpeaking(false)
                    } catch (error) {
                        setIsSpeaking(false)
                        // Fallback to TTS
                        try {
                            await voiceService.speak(MITA_PHRASES.niceToMeet)
                        } catch (err) {
                            console.error('Voice playback failed:', err)
                        }
                    }
                }, 500)
            }

            setTimeout(() => setWelcomeStep('chat'), 3500)
        }
    }

    const LivingOrb = ({ speaking = false }: { speaking?: boolean }) => (
        <div className="relative group/orb">
            <div className={`absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 group-hover/orb:opacity-40 transition-opacity ${speaking ? 'animate-pulse' : ''}`}></div>
            <div className={`w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 relative flex items-center justify-center overflow-hidden border border-white/20 shadow-2xl ${speaking ? 'animate-speaking-orb' : 'animate-float'}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-30 animate-spin-slow bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
                <Sparkles className="w-16 h-16 text-white relative z-10 animate-pulse" />
                {speaking && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-1 h-8 bg-white/60 rounded-full animate-voice-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    if (welcomeStep !== 'chat') {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-600/5 rounded-full blur-[150px] animate-pulse-slow animation-delay-3000"></div>
                </div>

                <div className="relative z-10 text-center space-y-16 max-w-4xl px-8">
                    <div className="flex justify-center">
                        <LivingOrb speaking={isSpeaking} />
                    </div>

                    {welcomeStep === 'consent' && (
                        <div className="space-y-8 animate-fade-in">
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                                Хотите, чтобы Мита заговорила?
                            </h1>
                            <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto">
                                Включите голосовое приветствие для лучшего опыта
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                                <button
                                    onClick={() => handleVoiceConsent(true)}
                                    className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:shadow-2xl hover:scale-105 transition-all"
                                >
                                    Да, включить голос
                                </button>
                                <button
                                    onClick={() => handleVoiceConsent(false)}
                                    className="px-8 sm:px-12 py-4 sm:py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white/20 transition-all"
                                >
                                    Нет, без голоса
                                </button>
                            </div>
                        </div>
                    )}

                    {['greeting', 'name-question', 'final-greeting'].includes(welcomeStep) && (
                        <div className="space-y-8">
                            <h1 className="text-6xl font-black text-white tracking-tighter">
                                {welcomeStep === 'greeting' && "Привет, я Мита"}
                                {welcomeStep === 'name-question' && "Как тебя зовут?"}
                                {welcomeStep === 'final-greeting' && `Рада знакомству, ${userName}!`}
                            </h1>
                            {welcomeStep === 'name-question' && (
                                <div className="max-w-md mx-auto relative group">
                                    <input
                                        type="text"
                                        placeholder="Введи имя..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-2xl text-white font-medium focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all text-center"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleNameSubmit}
                                        className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-lg"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-center gap-1.5 py-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce animation-delay-200"></div>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce animation-delay-400"></div>
                            </div>
                        </div>
                    )}
                </div>

                <style>{`
                    .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.6); }
                    @keyframes voice-bar {
                        0%, 100% { height: 10%; }
                        50% { height: 60%; }
                    }
                    .animate-voice-bar { animation: voice-bar 0.8s ease-in-out infinite; }
                    @keyframes speaking-orb {
                        0%, 100% { transform: scale(1); filter: brightness(1); }
                        50% { transform: scale(1.15); filter: brightness(1.2); }
                    }
                    .animate-speaking-orb { animation: speaking-orb 0.5s ease-in-out infinite; }
                `}</style>
            </div>
        )
    }

    return (
        <div className="min-h-full py-2 flex flex-col gap-8 h-[calc(100vh-140px)]">
            {/* Header Hub */}
            <div className="flex items-end justify-between px-4">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#0a0a0c] border border-white/5 flex items-center justify-center group/av">
                            <Bot className="w-10 h-10 text-indigo-400 group-hover/av:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#eef2ff] shadow-sm"></div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-indigo-950 tracking-tighter">Mita OS <span className="text-indigo-600/30 font-serif lowercase italic ml-2">v4.0.2</span></h1>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-950/40">
                            <span className="flex items-center gap-1.5 italic"><Zap className="w-3 h-3 text-yellow-500 fill-current" /> Neural Core Active</span>
                            <span className="w-1 h-1 rounded-full bg-indigo-200"></span>
                            <span>{userName || 'Global Guest'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleNewChat}
                        className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-md transition-all text-indigo-950/40 hover:text-red-500"
                        title="Clear Memory"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-md transition-all text-indigo-950/40 hover:text-indigo-600">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Frame */}
            <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white shadow-3xl overflow-hidden flex flex-col relative">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-none relative">
                    {messages.length === 0 && showSuggestions ? (
                        <div className="h-full flex flex-col items-center justify-center gap-12 max-w-2xl mx-auto opacity-0 animate-fade-in animation-fill-mode-forwards">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-600">
                                    <Sparkles className="w-10 h-10 animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-black text-indigo-950">Система готова.</h2>
                                <p className="text-indigo-900/40 font-medium">Я готова анализировать твои данные, писать код или создавать дизайн проекты. С чего начнем?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(s.prompt)}
                                        className="glass-premium p-6 rounded-[2rem] border border-white group hover:scale-[1.02] transition-all text-left"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform`}>
                                            {s.icon}
                                        </div>
                                        <h4 className="font-black text-indigo-950 text-xs uppercase tracking-widest mb-1">{s.title}</h4>
                                        <p className="text-[11px] text-indigo-900/40 line-clamp-1 italic">{s.prompt}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-slide-in`}>
                                <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#0a0a0c] text-indigo-400'}`}>
                                        {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                    </div>
                                    <div className={`p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none'
                                        : 'bg-white border border-indigo-50 text-indigo-950 rounded-tl-none'
                                        }`}>
                                        {msg.role === 'user' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                        )}
                                        <div className="text-sm font-black uppercase tracking-widest mb-3 opacity-30 italic">
                                            {msg.role === 'user' ? (userName || 'Pilot') : 'Mita Engine'}
                                        </div>
                                        <div className="text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex gap-6 items-center bg-indigo-50/50 px-8 py-5 rounded-full border border-indigo-100">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce animation-delay-200"></div>
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce animation-delay-400"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Core Processing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Advanced Input Deck */}
                <div className="p-8 lg:p-10 border-t border-indigo-50 bg-white/40">
                    <div className="max-w-4xl mx-auto">
                        {(selectedImage || selectedAudio) && (
                            <div className="mb-6 flex animate-slide-up">
                                <div className="relative group">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Attachment" className="w-20 h-20 rounded-2xl object-cover shadow-2xl border-4 border-white" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-2xl border-4 border-white"><Music className="w-8 h-8" /></div>
                                    )}
                                    <button
                                        onClick={() => { setSelectedImage(null); setSelectedAudio(null) }}
                                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={`p-4 rounded-[2.5rem] bg-white shadow-2xl border border-indigo-50 flex items-center gap-4 transition-all focus-within:shadow-indigo-500/10 focus-within:border-indigo-200 ${isListening ? 'ring-4 ring-indigo-500/20 shadow-none' : ''}`}>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="p-4 rounded-[1.5rem] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all hover:scale-105"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => audioInputRef.current?.click()}
                                    className="p-4 rounded-[1.5rem] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all hover:scale-105"
                                >
                                    <Music className="w-5 h-5" />
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder={isListening ? "Listening to your thoughts..." : "Send a prompt to Mita OS..."}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-indigo-950 font-medium placeholder:text-indigo-900/20"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                disabled={isListening}
                            />

                            <div className="flex items-center gap-4 pr-2">
                                <button
                                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                                    className={`p-4 rounded-[1.5rem] transition-all transform ${isListening ? 'bg-indigo-600 text-white animate-pulse scale-110' : 'bg-indigo-50 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || (!input.trim() && !selectedImage && !selectedAudio)}
                                    className="p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.8rem] shadow-glow disabled:opacity-30 disabled:shadow-none hover:scale-105 transition-all"
                                >
                                    <Send className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Inputs */}
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <input type="file" ref={audioInputRef} onChange={handleAudioUpload} accept="audio/*" className="hidden" />

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .shadow-3xl {
                    box-shadow: 0 40px 90px -20px rgba(0, 0, 0, 0.15);
                }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer { animation: shimmer 3s infinite; }
            `}</style>
        </div>
    )
}
