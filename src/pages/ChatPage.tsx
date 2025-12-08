import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { chatAPI } from '@/api/chat'
import { socketService } from '@/services/socket'

interface Message {
    _id: string
    from: {
        _id: string
        name: string
        avatar?: string
        city: string
    }
    to: {
        _id: string
        name: string
        avatar?: string
        city: string
    }
    text: string
    isRead: boolean
    createdAt: string
}

interface Conversation {
    _id: string
    participants: Array<{
        _id: string
        name: string
        avatar?: string
        city: string
        isOnline: boolean
    }>
    lastMessage?: Message
    updatedAt: string
}

export const ChatPage = () => {
    const user = useAuthStore((state) => state.user)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load conversations
    useEffect(() => {
        loadConversations()
    }, [])

    // Setup socket listeners
    useEffect(() => {
        socketService.onNewMessage((message: Message) => {
            if (selectedChat === message.from._id) {
                setMessages((prev) => [...prev, message])
                scrollToBottom()
            }
            loadConversations()
        })

        socketService.onMessageSent((message: Message) => {
            setMessages((prev) => [...prev, message])
            scrollToBottom()
        })

        socketService.onUserOnline((data) => {
            setOnlineUsers((prev) => new Set([...prev, data.userId]))
        })

        socketService.onUserOffline((data) => {
            setOnlineUsers((prev) => {
                const newSet = new Set(prev)
                newSet.delete(data.userId)
                return newSet
            })
        })

        socketService.onUserTyping((data) => {
            if (selectedChat === data.userId) {
                setIsTyping(true)
            }
        })

        socketService.onUserStopTyping((data) => {
            if (selectedChat === data.userId) {
                setIsTyping(false)
            }
        })

        return () => {
            socketService.off('new-message')
            socketService.off('message-sent')
            socketService.off('user-online')
            socketService.off('user-offline')
            socketService.off('user-typing')
            socketService.off('user-stop-typing')
        }
    }, [selectedChat])

    // Load messages when chat selected
    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat)
        }
    }, [selectedChat])

    const loadConversations = async () => {
        try {
            const response = await chatAPI.getConversations()
            if (response.success) {
                setConversations(response.data)
            }
        } catch (error) {
            console.error('Failed to load conversations:', error)
        }
    }

    const loadMessages = async (userId: string) => {
        try {
            const response = await chatAPI.getMessages(userId)
            if (response.success) {
                setMessages(response.data.messages)
                scrollToBottom()
            }
        } catch (error) {
            console.error('Failed to load messages:', error)
        }
    }

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return

        socketService.sendMessage(selectedChat, newMessage)
        setNewMessage('')
        socketService.stopTyping(selectedChat)
    }

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)

        if (selectedChat && e.target.value) {
            socketService.startTyping(selectedChat)
        } else if (selectedChat) {
            socketService.stopTyping(selectedChat)
        }
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    const getOtherUser = (conv: Conversation) => {
        return conv.participants.find(p => p._id !== user?.id)
    }

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4">
            {/* Conversations List */}
            <Card className="w-80 flex flex-col">
                <h2 className="text-xl font-bold mb-4">💬 Чаты</h2>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {conversations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">💬</div>
                            <p>Нет чатов</p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = getOtherUser(conv)
                            if (!otherUser) return null

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedChat(otherUser._id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-smooth ${selectedChat === otherUser._id
                                            ? 'bg-primary/10 border-2 border-primary'
                                            : 'hover:bg-gray-50 border-2 border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                                                {otherUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            {onlineUsers.has(otherUser._id) && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">{otherUser.name}</div>
                                            <div className="text-xs text-gray-500">📍 {otherUser.city}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </Card>

            {/* Messages */}
            <Card className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="border-b pb-4 mb-4">
                            {(() => {
                                const conv = conversations.find(c =>
                                    c.participants.some(p => p._id === selectedChat)
                                )
                                const otherUser = conv ? getOtherUser(conv) : null

                                return otherUser ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                                            {otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{otherUser.name}</div>
                                            <div className="text-sm text-gray-500">
                                                📍 {otherUser.city} • {onlineUsers.has(otherUser._id) ? '🟢 Онлайн' : '⚫ Оффлайн'}
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            })()}
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                            {messages.map((message) => {
                                const isMyMessage = message.from._id === user?.id

                                return (
                                    <div
                                        key={message._id}
                                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                                            <div
                                                className={`p-3 rounded-lg ${isMyMessage
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-text'
                                                    }`}
                                            >
                                                <div className="text-sm mb-1">{message.text}</div>
                                                <div className={`text-xs ${isMyMessage ? 'text-white/70' : 'text-gray-500'}`}>
                                                    {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-text p-3 rounded-lg">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Напишите сообщение..."
                                className="flex-1"
                            />
                            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                Отправить
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-lg">Выберите чат для начала общения</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
