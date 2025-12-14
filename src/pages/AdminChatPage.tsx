import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { chatAPI, ChatMessage } from '@/api/chat'
import { adminAPI } from '@/api/firestore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface User {
    id: string
    name: string
    email: string
    role: string
}


export const AdminChatPage = () => {
    const user = useAuthStore(state => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        if (!selectedUser || !user) return

        const unsubscribe = chatAPI.listenToMessages(
            user.id,
            selectedUser.id,
            (msgs) => setMessages(msgs)
        )

        chatAPI.markAsRead(user.id, selectedUser.id)

        return () => unsubscribe()
    }, [selectedUser, user])

    const loadUsers = async () => {
        const result = await adminAPI.getUsers()
        if (result.success) {
            const filtered = (result.data as User[]).filter(u => u.role === 'student')
            setUsers(filtered)
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() || !user || !selectedUser) return

        await chatAPI.sendMessage(
            user.id,
            user.name,
            'admin',
            selectedUser.id,
            selectedUser.role as 'student' | 'admin',
            newMessage
        )

        setNewMessage('')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Чаты</h1>

            <div className="grid grid-cols-12 gap-4 h-[600px]">
                {/* Sidebar */}
                <div className="col-span-4 flex flex-col">
                    {/* Header */}
                    <div className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                        <h2 className="text-xl font-bold">Ученики</h2>
                        <p className="text-sm text-green-100">Выберите ученика для чата</p>
                    </div>

                    {/* User list */}
                    <Card className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {users.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => setSelectedUser(u)}
                                    className={`p-3 rounded cursor-pointer transition ${selectedUser?.id === u.id
                                        ? 'bg-blue-100 dark:bg-blue-900'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="font-semibold">{u.name}</div>
                                    <div className="text-sm text-gray-500">{u.email}</div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    Нет пользователей
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Chat window */}
                <div className="col-span-8 flex flex-col">
                    {selectedUser ? (
                        <>
                            <Card className="p-4 mb-4">
                                <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                            </Card>

                            <Card className="flex-1 overflow-y-auto p-4 mb-4">
                                <div className="space-y-4">
                                    {messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === user?.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            >
                                                <div className="text-sm font-semibold mb-1">{msg.senderName}</div>
                                                <div>{msg.message}</div>
                                                <div className="text-xs mt-1 opacity-70">
                                                    {new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString('ru-RU')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="text-center text-gray-500 py-8">
                                            Нет сообщений. Начните диалог!
                                        </div>
                                    )}
                                </div>
                            </Card>

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
                        </>
                    ) : (
                        <Card className="flex-1 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">Выберите пользователя для начала чата</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
