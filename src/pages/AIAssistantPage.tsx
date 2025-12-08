import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useChatStore } from '@/store/chatStore'

export const AIAssistantPage = () => {
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const sessions = useChatStore((state) => state.sessions)
    const currentSessionId = useChatStore((state) => state.currentSessionId)
    const currentSession = useChatStore((state) => state.getCurrentSession())
    const isLoading = useChatStore((state) => state.isLoading)
    const createSession = useChatStore((state) => state.createSession)
    const sendMessage = useChatStore((state) => state.sendMessage)
    const setCurrentSession = useChatStore((state) => state.setCurrentSession)
    const deleteSession = useChatStore((state) => state.deleteSession)

    useEffect(() => {
        // Создаем первую сессию если её нет
        if (sessions.length === 0) {
            createSession('Первый чат')
        }
    }, [sessions.length, createSession])

    useEffect(() => {
        // Автоскролл к последнему сообщению
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentSession?.messages])

    const handleSend = async () => {
        if (!inputMessage.trim() || isLoading) return

        await sendMessage(inputMessage)
        setInputMessage('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4">
            {/* Sidebar with chat history */}
            <div className="w-64 flex-shrink-0 space-y-2">
                <Button
                    onClick={() => createSession()}
                    className="w-full"
                >
                    ➕ Новый чат
                </Button>

                <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`p-3 rounded-lg cursor-pointer transition-smooth ${session.id === currentSessionId
                                    ? 'bg-primary text-white'
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                            onClick={() => setCurrentSession(session.id)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium truncate flex-1">
                                    {session.title}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteSession(session.id)
                                    }}
                                    className="ml-2 text-xs opacity-70 hover:opacity-100"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                                {session.messages.length} сообщений
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Card className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-ai-blue rounded-full flex items-center justify-center text-2xl">
                            🤖
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text">AI Помощник</h1>
                            <p className="text-sm text-gray-600">Ваш персональный помощник по программированию</p>
                        </div>
                    </div>
                </Card>

                {/* Messages */}
                <Card className="flex-1 overflow-y-auto mb-4 p-4">
                    {currentSession?.messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-xl font-semibold mb-2">Начните разговор</h3>
                                <p className="text-gray-600 mb-4">
                                    Задайте любой вопрос по программированию, и я помогу вам!
                                </p>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <button
                                        onClick={() => setInputMessage('Как написать функцию на Python?')}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth text-left"
                                    >
                                        💡 Как написать функцию на Python?
                                    </button>
                                    <button
                                        onClick={() => setInputMessage('Объясни что такое переменные')}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth text-left"
                                    >
                                        📚 Объясни что такое переменные
                                    </button>
                                    <button
                                        onClick={() => setInputMessage('Помоги с моим кодом')}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth text-left"
                                    >
                                        🔧 Помоги с моим кодом
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentSession?.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-4 rounded-lg ${message.role === 'user'
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-text'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                        <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 p-4 rounded-lg">
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
                    )}
                </Card>

                {/* Input */}
                <div className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Напишите ваш вопрос..."
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputMessage.trim() || isLoading}
                    >
                        {isLoading ? '⏳' : '📤'} Отправить
                    </Button>
                </div>
            </div>
        </div>
    )
}
