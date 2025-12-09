import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { chatAPI, ChatMessage } from '@/api/chat'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const StudentChatPage = () => {
    const user = useAuthStore(state => state.user)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [unreadCount, setUnreadCount] = useState(0)
    const [showChat, setShowChat] = useState(false)

    useEffect(() => {
        if (!user) return

        const unsubscribe = chatAPI.listenToMessages(
            user.id,
            null,
            (msgs) => {
                setMessages(msgs)
                const unread = msgs.filter(m => m.senderId !== user.id && !m.isRead).length
                setUnreadCount(unread)
            }
        )

        chatAPI.markAsRead(user.id, null)

        return () => unsubscribe()
    }, [user])

    const handleSend = async () => {
        if (!newMessage.trim() || !user) return

        await chatAPI.sendMessage(
            user.id,
            user.name,
            'student',
            null,
            'admin',
            newMessage
        )

        setNewMessage('')
        setShowChat(true)
    }

    if (!showChat && messages.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <Card className="p-12">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Нужна помощь?</h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Свяжитесь с ментором и получите ответы на ваши вопросы
                            </p>
                        </div>
                        <Button
                            onClick={() => setShowChat(true)}
                            className="px-8 py-3 text-lg"
                        >
                            💬 Связаться с ментором
                        </Button>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Чат с ментором</h1>
                        <p className="text-sm text-gray-500 mt-1">Задайте вопрос и получите помощь</p>
                    </div>
                    {unreadCount > 0 && (
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                            {unreadCount} новых
                        </span>
                    )}
                </div>

                <Card className="h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-4 rounded-lg ${msg.senderId === user?.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <div className="text-sm font-semibold mb-1">
                                        {msg.senderId === user?.id ? 'Вы' : '👨‍🏫 Admin'}
                                    </div>
                                    <div>{msg.message}</div>
                                    <div className="text-xs mt-2 opacity-70">
                                        {new Date(msg.timestamp?.seconds * 1000).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 py-12">
                                <p className="text-lg mb-4">Начните диалог с ментором</p>
                                <p className="text-sm">Задайте вопрос или попросите помощь</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t dark:border-gray-700">
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Введите сообщение..."
                                className="flex-1"
                            />
                            <Button onClick={handleSend} disabled={!newMessage.trim()}>
                                Отправить
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="mt-4 text-sm text-gray-500 text-center">
                    💡 Ваши сообщения увидят все менторы. Любой из них может ответить.
                </div>
            </div>
        </div>
    )
}
