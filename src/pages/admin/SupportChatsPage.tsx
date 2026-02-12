import { useState, useEffect, useRef } from 'react'
import { collection, query, onSnapshot, addDoc, serverTimestamp, where, getDocs, writeBatch } from 'firebase/firestore'
import { db, isFirestoreBroken, markFirestoreAsBroken } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { Send, MessageSquare, ShieldCheck, Search, Filter, CheckCheck, Smile, Paperclip, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    isOptimistic?: boolean
}

export const SupportChatsPage = () => {
    const { user } = useAuthStore()
    const [chats, setChats] = useState<ChatUser[]>([])
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOffline, setIsOffline] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Load all users who have support chats (List View)
    useEffect(() => {
        if (isFirestoreBroken()) {
            setIsOffline(true);
            return;
        }

        try {
            const q = query(collection(db, 'support_chats'))

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userMap = new Map<string, ChatUser>()

                snapshot.forEach((doc) => {
                    const data = doc.data()
                    const participantId = data.participantId

                    if (participantId) {
                        const existing = userMap.get(participantId);
                        const msgTime = data.createdAt?.toMillis?.() || 0;
                        const existingTime = existing?.lastMessageTime?.toMillis?.() || 0;

                        if (!existing || msgTime > existingTime) {
                            userMap.set(participantId, {
                                id: participantId,
                                name: data.senderRole === 'student' ? data.senderName : (existing?.name || data.senderName || 'Ученик'),
                                email: '',
                                lastMessage: data.text,
                                lastMessageTime: data.createdAt
                            })
                        }
                    }
                })

                const sortedChats = Array.from(userMap.values()).sort((a, b) => {
                    return (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0);
                });

                setChats(sortedChats)
            }, (err: any) => {
                console.error("Admin List Stream Error:", err);
                if (err?.message?.includes('INTERNAL ASSERTION FAILED')) {
                    markFirestoreAsBroken(err);
                    setIsOffline(true);
                }
            })

            return () => unsubscribe()
        } catch (e: any) {
            console.error("Admin List Setup Error:", e);
            if (e?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(e);
                setIsOffline(true);
            }
        }
    }, [])

    // Load messages for selected chat (Detailed View)
    useEffect(() => {
        if (!selectedChat || isFirestoreBroken()) return

        setError(null);
        try {
            const q = query(
                collection(db, 'support_chats'),
                where('participantId', '==', selectedChat)
            )

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs: Message[] = []
                snapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() } as Message)
                })

                const sortedMsgs = msgs.sort((a, b) => {
                    return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0);
                });

                setMessages(sortedMsgs)

                setOptimisticMessages(prev => prev.filter(opt =>
                    !sortedMsgs.some(real => real.text === opt.text && Math.abs((real.createdAt?.toMillis?.() || 0) - (opt.createdAt?.getTime?.() || 0)) < 10000)
                ));
            }, (err: any) => {
                console.error("Admin Detail Stream Error:", err);
                setError(err.message);
                if (err?.message?.includes('INTERNAL ASSERTION FAILED')) {
                    markFirestoreAsBroken(err);
                    setIsOffline(true);
                }
            })

            return () => unsubscribe()
        } catch (e: any) {
            setError(e.message);
            if (e?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(e);
                setIsOffline(true);
            }
        }
    }, [selectedChat])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, optimisticMessages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !user?.id || !selectedChat || loading || isFirestoreBroken()) return

        const textToSend = message.trim();
        setMessage('');

        const optimisticMsg: Message = {
            id: `opt-${Date.now()}`,
            text: textToSend,
            senderId: user.id,
            senderName: user.name || 'Поддержка',
            senderRole: 'admin',
            participantId: selectedChat,
            createdAt: new Date(),
            isOptimistic: true
        };
        setOptimisticMessages(prev => [...prev, optimisticMsg]);

        setLoading(true)
        try {
            await addDoc(collection(db, 'support_chats'), {
                text: textToSend,
                senderId: user.id,
                senderName: user.name || 'Поддержка',
                senderRole: 'admin',
                participantId: selectedChat,
                createdAt: serverTimestamp()
            })
        } catch (err: any) {
            console.error('Error sending message:', err)
            setOptimisticMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setMessage(textToSend);
            setError("Не удалось отправить сообщение.");
            if (err?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(err);
                setIsOffline(true);
            }
        }
        setLoading(false)
    }

    const handleDeleteChat = async (participantId: string) => {
        if (isFirestoreBroken() || !window.confirm('Вы уверены, что хотите удалить всю переписку с этим пользователем?')) return;

        setIsDeleting(true);
        try {
            const q = query(
                collection(db, 'support_chats'),
                where('participantId', '==', participantId)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);

            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            if (selectedChat === participantId) {
                setSelectedChat(null);
                setMessages([]);
            }
        } catch (error: any) {
            console.error('Error deleting chat:', error);
            alert('Не удалось удалить чат. Попробуйте позже.');
        } finally {
            setIsDeleting(false);
        }
    }

    const selectedUser = chats.find(c => c.id === selectedChat)
    const allMessages = [...messages, ...optimisticMessages].sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return timeA - timeB;
    });

    return (
        <div className="h-[calc(100vh-80px)] flex bg-[#0e1621] overflow-hidden font-sans">
            {/* Dialogs Sidebar */}
            <div className="w-[300px] lg:w-[350px] border-r border-black/20 flex flex-col bg-[#17212b] z-20">
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2b5278] flex items-center justify-center text-white">
                            <Filter className="w-5 h-5 opacity-40" />
                        </div>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-[#0e1621] border-none rounded-xl py-2 pl-10 pr-4 text-[14px] text-white placeholder-white/20 focus:ring-1 focus:ring-[#2b5278] transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
                    {chats.map((chat) => {
                        const isSelected = selectedChat === chat.id;
                        return (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`w-full p-3 text-left rounded-xl group transition-all duration-200 relative
                                    ${isSelected
                                        ? 'bg-[#2b5278] text-white shadow-lg'
                                        : 'hover:bg-[#202b36] text-white/60'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm
                                        ${isSelected
                                            ? 'bg-[#17212b] text-white border border-white/10'
                                            : 'bg-gradient-to-br from-[#40a7e3] to-[#48b2eb] text-white'}`}>
                                        {chat.name?.charAt(0).toUpperCase() || 'У'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-[14px] font-bold truncate ${isSelected ? 'text-white' : 'text-white'}`}>
                                                {chat.name}
                                            </p>
                                            <span className={`text-[11px] font-medium opacity-40`}>
                                                {chat.lastMessageTime?.toDate?.()?.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) || ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-[13px] truncate ${isSelected ? 'text-white/70' : 'opacity-40'}`}>
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col relative bg-[#0e1621]">
                {!selectedChat ? (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="bg-[#182533]/80 px-5 py-2 rounded-full text-[14px] text-white/50 font-medium tracking-tight">
                            Выберите чат
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Telegram Header */}
                        <div className="h-[60px] px-6 flex items-center justify-between bg-[#17212b] border-b border-black/20 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40a7e3] to-[#48b2eb] flex items-center justify-center text-white font-bold text-lg">
                                    {selectedUser?.name?.charAt(0).toUpperCase() || 'У'}
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[15px] font-bold text-white">{selectedUser?.name || 'Ученик'}</p>
                                    <p className="text-[12px] text-[#48b2eb]">онлайн</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteChat(selectedChat)}
                                disabled={isDeleting}
                                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                                title="Удалить переписку"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-2 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {allMessages.map((msg) => {
                                    const isMine = msg.senderRole === 'admin';
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`flex items-end gap-2 mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`relative max-w-[80%] px-3 py-1.5 rounded-2xl shadow-sm text-[14px] leading-relaxed
                                                ${isMine
                                                    ? 'bg-[#2b5278] text-white rounded-br-sm'
                                                    : 'bg-[#182533] text-white rounded-bl-sm border border-white/[0.03]'
                                                } ${msg.isOptimistic ? 'opacity-60' : ''}`}
                                            >
                                                <div className="flex items-end gap-4 flex-wrap">
                                                    <p className="pb-1 text-white/90 whitespace-pre-wrap break-words">{msg.text}</p>
                                                    <div className="flex items-center gap-1 text-[10px] text-white/40 mb-[-2px] ml-auto">
                                                        {msg.createdAt?.toDate?.()?.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                                                            || (msg.createdAt instanceof Date ? msg.createdAt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) : '..:..')}
                                                        {isMine && (
                                                            <div className="flex items-center ml-0.5">
                                                                {msg.isOptimistic ? (
                                                                    <div className="w-2 h-2 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                                                                ) : (
                                                                    <CheckCheck className="w-3.5 h-3.5 text-[#48b2eb]" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Telegram Input Bar */}
                        <div className="px-4 py-3 bg-[#17212b] border-t border-black/10 z-10">
                            {error && <div className="text-[10px] text-red-400 text-center mb-2">{error}</div>}
                            <form
                                onSubmit={handleSend}
                                className="max-w-4xl mx-auto flex items-end gap-3"
                            >
                                <div className="flex-1 flex items-center bg-[#0e1621] rounded-2xl border border-white/[0.05] p-2 focus-within:border-[#2b5278] transition-all">
                                    <button type="button" className="p-2 text-gray-500 hover:text-[#48b2eb]">
                                        <Smile className="w-6 h-6" />
                                    </button>
                                    <textarea
                                        rows={1}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend(e as any);
                                            }
                                        }}
                                        placeholder="Сообщение..."
                                        className="flex-1 bg-transparent border-none px-2 py-2 text-white placeholder-gray-500 text-[14px] focus:ring-0 resize-none min-h-[40px] max-h-[120px]"
                                    />
                                    <button type="button" className="p-2 text-gray-500 hover:text-[#48b2eb]">
                                        <Paperclip className="w-6 h-6" />
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isOffline}
                                    className="w-[50px] h-[50px] bg-[#2b5278] hover:bg-[#34618a] text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20 active:scale-90 shadow-md flex-shrink-0"
                                >
                                    <Send className="w-5 h-5 translate-x-[2px] -translate-y-[1px]" />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    )
}

export default SupportChatsPage
