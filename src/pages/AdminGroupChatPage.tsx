import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Send, Users, MessageCircle } from 'lucide-react'

interface AdminMessage {
    id: string
    senderId: string
    senderName: string
    message: string
    timestamp: Date
}

export const AdminGroupChatPage = () => {
    const user = useAuthStore((state) => state.user)
    const [messages, setMessages] = useState<AdminMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) return

        // Subscribe to admin group chat messages
        const q = query(
            collection(db, 'adminGroupChat'),
            orderBy('timestamp', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: AdminMessage[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                msgs.push({
                    id: doc.id,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    message: data.message,
                    timestamp: data.timestamp?.toDate() || new Date(),
                })
            })
            setMessages(msgs)
        })

        return () => unsubscribe()
    }, [user])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !user) return

        setLoading(true)
        try {
            await addDoc(collection(db, 'adminGroupChat'), {
                senderId: user.id,
                senderName: user.name,
                message: newMessage.trim(),
                timestamp: Timestamp.now(),
            })

            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Ошибка отправки сообщения')
        } finally {
            setLoading(false)
        }
    }

    if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold mb-2">Доступ запрещён</h2>
                    <p className="text-gray-600">Эта страница доступна только администраторам</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Групповой чат админов
                            </h1>
                            <p className="text-gray-600">Общее обсуждение для всей команды</p>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Chat Messages */}
                    <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                                        <MessageCircle className="w-16 h-16 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Пока нет сообщений</h3>
                                    <p className="text-gray-500">Начните обсуждение с командой!</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isCurrentUser = msg.senderId === user.id

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md ${isCurrentUser
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                    : 'bg-white border-2 border-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {!isCurrentUser && (
                                                <div className="flex items-center gap-2 text-xs font-semibold mb-2 text-purple-600">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                                                        {msg.senderName.charAt(0).toUpperCase()}
                                                    </div>
                                                    {msg.senderName}
                                                </div>
                                            )}
                                            <p className="break-words leading-relaxed">{msg.message}</p>
                                            <div
                                                className={`text-xs mt-2 ${isCurrentUser ? 'text-white/70' : 'text-gray-400'
                                                    }`}
                                            >
                                                {msg.timestamp.toLocaleTimeString('ru-RU', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-6 bg-white">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Напишите сообщение..."
                                disabled={loading}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !newMessage.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Отправить
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                            <MessageCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">ℹ️ О групповом чате</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Все администраторы видят сообщения в реальном времени
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Используйте для координации работы и обсуждения вопросов
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Сообщения сохраняются в базе данных
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Ученики не имеют доступа к этому чату
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
