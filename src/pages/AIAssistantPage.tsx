import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    image?: string
}

type AttachmentType = 'pdf' | 'presentation' | 'text' | 'image' | null

// Инициализация Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCjZ6u_7uG128pM-9Y1u0MNN3ulk6xmMuo')

export const AIAssistantPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Привет! Я ваш AI-помощник EliteHeat. Могу помочь с:\n\n📚 Объяснением материала курсов\n💻 Проверкой кода и поиском ошибок\n🎨 Анализом дизайна и презентаций\n📄 Работой с документами\n🖼️ Анализом изображений\n\nЗагрузите файл или задайте вопрос!',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [attachmentType, setAttachmentType] = useState<AttachmentType>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input || 'Проанализируй это изображение',
            timestamp: new Date(),
            image: selectedImage || undefined
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            let result
            if (selectedImage) {
                // Если есть изображение, отправляем его вместе с текстом
                const imagePart = {
                    inlineData: {
                        data: selectedImage.split(',')[1],
                        mimeType: 'image/jpeg'
                    }
                }

                const prompt = input || 'Проанализируй это изображение. Если это код - найди ошибки. Если это дизайн - дай рекомендации. Если это задание - помоги его решить.'
                result = await model.generateContent([prompt, imagePart])
            } else {
                // Только текст
                const prompt = `Ты - AI-помощник образовательной платформы EliteHeat. Помогай студентам с:
- Объяснением концепций программирования (Python, JavaScript)
- Проверкой кода и поиском ошибок
- Советами по дизайну в Figma
- Решением задач и заданий
- Созданием презентаций

Вопрос студента: ${input}`

                result = await model.generateContent(prompt)
            }

            const response = await result.response
            const text = response.text()

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: text,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            setSelectedImage(null)
        } catch (error) {
            console.error('AI Error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Извините, произошла ошибка. Попробуйте еще раз или проверьте API ключ Gemini.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleAttachment = (type: AttachmentType) => {
        setAttachmentType(type)
        if (type === 'pdf' || type === 'presentation') {
            fileInputRef.current?.click()
        } else if (type === 'image') {
            imageInputRef.current?.click()
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: `📎 Загружен файл: ${file.name}\n\nФункция анализа PDF и презентаций будет добавлена в следующем обновлении.`,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, userMessage])
        }
        setAttachmentType(null)
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

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                        ✨
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">AI Помощник EliteHeat</h1>
                        <p className="text-sm text-gray-500">Powered by Google Gemini</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                                    ✨
                                </div>
                            )}
                            <div
                                className={`max-w-2xl rounded-2xl px-5 py-3 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-800'
                                    }`}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Uploaded"
                                        className="rounded-lg mb-3 max-w-full h-auto max-h-64 object-contain"
                                    />
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
                                    👤
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white">
                                ✨
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    {/* Selected Image Preview */}
                    {selectedImage && (
                        <div className="mb-3 relative inline-block">
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="rounded-lg max-h-32 object-contain border-2 border-blue-500"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Attachment Buttons */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                        <button
                            onClick={() => handleAttachment('image')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm font-medium text-blue-700"
                        >
                            <span className="text-lg">🖼️</span>
                            <span>Изображение</span>
                        </button>
                        <button
                            onClick={() => handleAttachment('pdf')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                        >
                            <span className="text-lg">📄</span>
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleAttachment('presentation')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                        >
                            <span className="text-lg">📊</span>
                            <span>Презентация</span>
                        </button>
                    </div>

                    {/* Input Field */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Задайте вопрос, загрузите код для проверки или изображение для анализа..."
                                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 resize-none min-h-[56px] max-h-[200px]"
                                rows={1}
                            />
                        </div>
                        <Button
                            onClick={handleSend}
                            disabled={(!input.trim() && !selectedImage) || isLoading}
                            className="h-14 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                        >
                            <span className="text-xl">↑</span>
                        </Button>
                    </div>

                    {/* Hidden file inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={attachmentType === 'pdf' ? '.pdf' : '.ppt,.pptx,.key'}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    <p className="text-xs text-gray-500 text-center mt-3">
                        AI может делать ошибки. Проверяйте важную информацию.
                    </p>
                </div>
            </div>
        </div>
    )
}
