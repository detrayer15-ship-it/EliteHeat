import { useState, useEffect, useRef } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { Send, MessageSquare, User } from 'lucide-react'

interface ChatUser {
    id: string
    name: string
    email: string
    lastMessage?: string
    lastMessageTime?: any
    unread?: number
}

interface Message {
    id: string
    text: string
    senderId: string
    senderName: string
    senderRole: 'student' | 'admin'
    participantId: string
    createdAt: any
}

export const SupportChatsPage = () => {
    const { user } = useAuthStore()
    const [chats, setChats] = useState<ChatUser[]>([])
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load all users who have support chats
    useEffect(() => {
        const q = query(collection(db, 'support_chats'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userMap = new Map<string, ChatUser>()

            snapshot.forEach((doc) => {
                const data = doc.data()
                const participantId = data.participantId

                if (!userMap.has(participantId)) {
                    userMap.set(participantId, {
                        id: participantId,
                        name: data.senderRole === 'student' ? data.senderName : userMap.get(participantId)?.name || 'Ученик',
                        email: '',
                        lastMessage: data.text,
                        lastMessageTime: data.createdAt
                    })
                }
            })

            setChats(Array.from(userMap.values()))
        })

        return () => unsubscribe()
    }, [])

    // Load messages for selected chat
    useEffect(() => {
        if (!selectedChat) return

        const q = query(
            collection(db, 'support_chats'),
            where('participantId', '==', selectedChat),
            orderBy('createdAt', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = []
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as Message)
            })
            setMessages(msgs)
        })

        return () => unsubscribe()
    }, [selectedChat])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !user || !selectedChat || loading) return

        setLoading(true)
        try {
            await addDoc(collection(db, 'support_chats'), {
                text: message.trim(),
                senderId: user.id,
                senderName: user.name || 'Поддержка',
                senderRole: 'admin',
                participantId: selectedChat,
                createdAt: serverTimestamp()
            })
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        }
        setLoading(false)
    }

    const selectedUser = chats.find(c => c.id === selectedChat)

    return (
        <div className="h-[calc(100vh-80px)] flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Chat List */}
            <div className="w-80 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-400" />
                        Обращения учеников
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{chats.length} чатов</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Нет обращений</p>
                        </div>
                    )}

                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full p-4 text-left border-b border-white/5 transition-colors ${selectedChat === chat.id ? 'bg-orange-500/10' : 'hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {chat.name?.charAt(0).toUpperCase() || 'У'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{chat.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {!selectedChat ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Выберите чат слева</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                {selectedUser?.name?.charAt(0).toUpperCase() || 'У'}
                            </div>
                            <div>
                                <p className="font-medium text-white">{selectedUser?.name || 'Ученик'}</p>
                                <p className="text-xs text-gray-400">Чат поддержки</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.senderRole === 'admin'
                                                ? 'bg-orange-500 text-white rounded-br-md'
                                                : 'bg-white/10 text-white rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderRole === 'admin' ? 'text-white/60' : 'text-gray-500'
                                            }`}>
                                            {msg.createdAt?.toDate?.()?.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) || '...'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ответить ученику..."
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default SupportChatsPage
