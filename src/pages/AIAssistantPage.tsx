import { useState, useRef, useEffect } from 'react'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useAIContext } from '@/store/aiContextStore'
import { clearSessionId } from '@/api/mita'
import { voiceService } from '@/utils/voiceSynthesis'
import {
    Sparkles,
    Trash2,
    Send,
    Mic,
    Bot,
    Zap,
    Paperclip,
    X,
    ImageIcon
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
    const [isListening, setIsListening] = useState(false)
    const [selectedImage, setSelectedImage] = useState<{ file: File, preview: string, base64: string } | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
        if ((!input.trim() && !selectedImage) || isLoading) return

        const currentInput = input
        const currentImage = selectedImage ? { type: selectedImage.file.type, base64: selectedImage.base64 } : undefined

        setInput('')
        setSelectedImage(null)

        await sendMessage(currentInput || (currentImage ? 'Анализируй это изображение' : ''), currentImage)
        inputRef.current?.focus()
    }

    const handleNewChat = async () => {
        try {
            await clearSessionId()
            clearConversation()
            await startConversation('New Chat')
        } catch (err) {
            console.error('Failed to start new chat:', err)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой (макс. 5МБ)')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1]
            setSelectedImage({
                file,
                preview: URL.createObjectURL(file),
                base64
            })
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        if (selectedImage?.preview) {
            URL.revokeObjectURL(selectedImage.preview)
        }
        setSelectedImage(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
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
                        <button
                            onClick={() => voiceService.playGreetingSequence()}
                            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                            title="Послушать приветствие Миты"
                        >
                            <Bot className="w-6 h-6 text-white" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            Мита
                            <span className="text-xs font-medium text-slate-400">AI</span>
                        </h1>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                            <Zap className="w-3 h-3" />
                            <span>Активна</span>
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
                                <button
                                    onClick={() => voiceService.playGreetingSequence()}
                                    className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto hover:scale-110 transition-transform active:scale-95 shadow-sm"
                                    title="Поздороваться с Митой"
                                >
                                    <Sparkles className="w-8 h-8 text-indigo-500" />
                                </button>
                                <h2 className="text-xl font-bold text-slate-900">Привет! Я Мита — твой личный наставник 👋</h2>
                                <p className="text-sm text-slate-400">
                                    Чем помочь тебе сегодня? Мы можем разобрать **Python** или **Figma**!
                                    Спрашивай про переменные, код, дизайн-системы или присылай скриншоты.
                                </p>
                                <button
                                    onClick={() => voiceService.playGreetingSequence()}
                                    className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-600 transition-all active:scale-95"
                                >
                                    Послушать приветствие
                                </button>
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

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    {/* Image Perspective Preview */}
                    {selectedImage && (
                        <div className="mb-3 flex items-center gap-3">
                            <div className="relative group">
                                <img
                                    src={selectedImage.preview}
                                    className="w-16 h-16 object-cover rounded-xl border-2 border-indigo-500 shadow-sm"
                                    alt="Preview"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Визуальный контекст</p>
                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{selectedImage.file.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                            title="Прикрепить изображение"
                        >
                            <Paperclip className="w-4 h-4" />
                        </button>

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
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-300 mt-2">
                        Мита использует Vision AI для анализа изображений
                    </p>
                </div>
            </div>
        </div>
    )
}
