import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { Send, HelpCircle } from 'lucide-react'

interface Message {
    id: string
    text: string
    senderId: string
    senderName: string
    senderRole: 'student' | 'admin'
    createdAt: any
}

export const SupportPage = () => {
    const { user } = useAuthStore()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Listen to messages in real-time
    useEffect(() => {
        if (!user?.id) return

        const q = query(
            collection(db, 'support_chats'),
            where('participantId', '==', user.id),
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
    }, [user?.id])

    // Scroll to bottom when new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !user || loading) return

        setLoading(true)
        try {
            await addDoc(collection(db, 'support_chats'), {
                text: message.trim(),
                senderId: user.id,
                senderName: user.name || user.email,
                senderRole: 'student',
                participantId: user.id,
                createdAt: serverTimestamp()
            })
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        }
        setLoading(false)
    }

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Служба поддержки</h1>
                    <p className="text-xs text-gray-400">Напишите нам, мы ответим!</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Онлайн</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HelpCircle className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400">Напишите сообщение чтобы начать чат</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.senderRole === 'student'
                                    ? 'bg-orange-500 text-white rounded-br-md'
                                    : 'bg-white/10 text-white rounded-bl-md'
                                }`}
                        >
                            {msg.senderRole === 'admin' && (
                                <p className="text-xs text-orange-400 font-medium mb-1">Поддержка</p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.senderRole === 'student' ? 'text-white/60' : 'text-gray-500'
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
                        placeholder="Напишите сообщение..."
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="px-5 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SupportPage
