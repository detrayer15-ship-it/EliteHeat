import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

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
        if (!user || user.role !== 'admin') return

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

    if (!user || user.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещён</h2>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 page-transition">
            {/* Заголовок */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-2">
                    👥 Групповой чат админов
                </h1>
                <p className="text-gray-600">Общее обсуждение для всех администраторов</p>
            </div>

            {/* Чат */}
            <Card className="h-[600px] flex flex-col">
                {/* Сообщения */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            <div className="text-4xl mb-2">💬</div>
                            <p>Пока нет сообщений</p>
                            <p className="text-sm">Начните обсуждение!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isCurrentUser = msg.senderId === user.id

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${isCurrentUser
                                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                                            }`}
                                    >
                                        {!isCurrentUser && (
                                            <div className="text-xs font-semibold mb-1 opacity-75">
                                                👑 {msg.senderName}
                                            </div>
                                        )}
                                        <p className="break-words">{msg.message}</p>
                                        <div
                                            className={`text-xs mt-1 ${isCurrentUser ? 'text-white/70' : 'text-gray-500'
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

                {/* Форма отправки */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                    <div className="flex gap-3">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Напишите сообщение..."
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button type="submit" loading={loading} disabled={!newMessage.trim()}>
                            📤 Отправить
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Информация */}
            <Card>
                <h2 className="text-xl font-bold mb-4">ℹ️ О групповом чате</h2>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• Все администраторы видят сообщения в реальном времени</p>
                    <p>• Используйте этот чат для координации работы и обсуждения вопросов</p>
                    <p>• Сообщения сохраняются в базе данных</p>
                    <p>• Ученики не имеют доступа к этому чату</p>
                </div>
            </Card>
        </div>
    )
}
