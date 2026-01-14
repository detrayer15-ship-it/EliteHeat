import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { chatAPI, ChatMessage } from '@/api/chat'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    MessageSquare,
    Send,
    ShieldCheck,
    Headphones,
    Bot,
    User,
    Zap,
    Sparkles,
    ChevronLeft,
    Monitor,
    Smile,
    Paperclip
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

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

    // WELCOME INTERFACE (EMPTY STATE)
    if (!showChat && messages.length === 0) {
        return (
            <div className="min-h-full flex items-center justify-center py-20">
                <ScrollReveal animation="fade">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="relative inline-block group">
                            <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 group-hover:opacity-40 animate-pulse transition-opacity"></div>
                            <div className="w-40 h-40 bg-white rounded-[3rem] border border-indigo-50 shadow-3xl flex items-center justify-center relative z-10 rotate-12 transition-transform group-hover:rotate-0">
                                <MessageSquare className="w-16 h-16 text-indigo-600" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                                <Headphones className="w-4 h-4 text-indigo-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950">Mentor Support Protocol</span>
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-indigo-950 tracking-tighter leading-none italic">
                                Прямая <br />
                                <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Связь</span>
                            </h1>
                            <p className="text-xl text-indigo-950/40 font-medium max-w-xl mx-auto leading-relaxed italic">
                                Возникли трудности или есть вопрос по проекту? Наши менторы готовы помочь вам в реальном времени.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowChat(true)}
                            className="bg-[#0a0a0c] text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 mx-auto hover:bg-indigo-600 transition-all shadow-glow hover:scale-105"
                        >
                            Инициализировать Чат
                            <Zap className="w-4 h-4 text-emerald-400" />
                        </button>
                    </div>
                </ScrollReveal>
            </div>
        )
    }

    return (
        <div className="min-h-full py-2 space-y-10 flex flex-col h-full">
            {/* CINEMATIC CHAT HEADER */}
            <div className="glass-premium rounded-[3rem] p-8 lg:px-12 border border-white shadow-3xl flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#0a0a0c] flex items-center justify-center text-white relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-[20px] opacity-20"></div>
                        <Bot className="w-8 h-8 text-indigo-400" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
                            Менторский Хаб
                            {unreadCount > 0 && (
                                <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    {unreadCount} New
                                </span>
                            )}
                        </h1>
                        <p className="text-indigo-950/40 text-sm font-medium italic">Среднее время ответа: 15 минут</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-indigo-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30">3 Online Mentors</span>
                </div>
            </div>

            {/* CHAT INTERFACE */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8 pb-10">
                {/* MESSAGES HUB */}
                <div className="flex-1 flex flex-col glass-premium rounded-[3.5rem] border border-white shadow-3xl overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scroll">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 italic">
                                <MessageSquare className="w-12 h-12" />
                                <p className="font-medium">Сообщений пока нет. Будьте первым!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.senderId === user?.id
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                                    >
                                        <div className="flex items-center gap-3 mb-2 px-4 text-[9px] font-black uppercase tracking-widest text-indigo-950/30">
                                            {!isMe && <span className="text-indigo-600">Admin Staff</span>}
                                            <span>{new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {isMe && <span className="text-emerald-500">Delivered</span>}
                                        </div>
                                        <div
                                            className={`max-w-[80%] lg:max-w-[60%] p-6 rounded-[2rem] text-lg font-medium shadow-sm relative group ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-white text-indigo-950 rounded-tl-none border border-indigo-50'
                                                }`}
                                        >
                                            {msg.message}
                                            {/* HOVER GLOW */}
                                            <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${isMe ? 'bg-white' : 'bg-indigo-500'}`}></div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* FUTURISTIC INPUT DECK */}
                    <div className="p-8 bg-white/40 border-t border-indigo-50 backdrop-blur-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center gap-3">
                                <button className="p-2 text-indigo-950/30 hover:text-indigo-600 transition-colors"><Smile className="w-5 h-5" /></button>
                                <button className="p-2 text-indigo-950/30 hover:text-indigo-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                            </div>
                            <input
                                className="w-full bg-white border border-indigo-50 rounded-[2rem] p-8 pl-28 pr-40 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all shadow-sm"
                                placeholder="Type your inquiry to the headquarters..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                <button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim()}
                                    className="bg-indigo-600 text-white h-12 px-10 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all hover:bg-indigo-700 shadow-glow group disabled:opacity-30"
                                >
                                    Transmit
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDE HELPER */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-[#0a0a0c] rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Monitor className="w-24 h-24" /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                Protocol Info
                            </div>
                            <h4 className="text-xl font-black tracking-tight italic">Важно знать</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">
                                Ваши сообщения видны дежурному персоналу. История диалога сохраняется для вашего удобства.
                            </p>
                            <div className="pt-4 space-y-3">
                                <div className="flex items-center gap-3 text-white/60 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    Ответ в течение 10-20 мин
                                </div>
                                <div className="flex items-center gap-3 text-white/60 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    Только учебные вопросы
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-premium rounded-[2.5rem] p-8 border border-white shadow-xl space-y-6">
                        <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest text-center">Community Status</h4>
                        <div className="flex justify-center -space-x-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-indigo-50 flex items-center justify-center">
                                    <User className="w-6 h-6 text-indigo-300" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">+24</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    )
}
