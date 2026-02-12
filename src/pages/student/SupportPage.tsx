import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, query, onSnapshot, serverTimestamp, where, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore'
import { db, isFirestoreBroken, markFirestoreAsBroken } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { Send, HelpCircle, ShieldCheck, CheckCheck, Paperclip, Smile, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export const SupportPage = () => {
    const { user } = useAuthStore()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOffline, setIsOffline] = useState(false)
    const [streamError, setStreamError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Listen to messages in real-time
    useEffect(() => {
        if (!user?.id || isFirestoreBroken()) {
            if (isFirestoreBroken()) setIsOffline(true);
            return;
        }

        setStreamError(null);

        try {
            const q = query(
                collection(db, 'support_chats'),
                where('participantId', '==', user.id)
            )

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs: Message[] = []
                snapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() } as Message)
                })

                const sortedMsgs = msgs.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || a.createdAt?.getTime?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || b.createdAt?.getTime?.() || 0;
                    return timeA - timeB;
                });

                setMessages(sortedMsgs)

                setOptimisticMessages(prev => prev.filter(opt =>
                    !sortedMsgs.some(real => real.text === opt.text && Math.abs((real.createdAt?.toMillis?.() || 0) - (opt.createdAt?.getTime?.() || 0)) < 10000)
                ));
            }, (error: any) => {
                console.error("Support Chat Stream Error:", error);
                setStreamError(error.message);
                if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
                    markFirestoreAsBroken(error);
                    setIsOffline(true);
                }
            })

            return () => unsubscribe()
        } catch (e: any) {
            console.error("Support Chat Setup Error:", e);
            setStreamError(e.message);
            if (e?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(e);
                setIsOffline(true);
            }
        }
    }, [user?.id])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, optimisticMessages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !user || loading || isFirestoreBroken()) return

        const textToSend = message.trim();
        setMessage('');

        const optimisticMsg: Message = {
            id: `temp-${Date.now()}`,
            text: textToSend,
            senderId: user.id,
            senderName: user.name || user.email,
            senderRole: 'student',
            participantId: user.id,
            createdAt: new Date(),
            isOptimistic: true
        };
        setOptimisticMessages(prev => [...prev, optimisticMsg]);

        setLoading(true)
        try {
            await addDoc(collection(db, 'support_chats'), {
                text: textToSend,
                senderId: user.id,
                senderName: user.name || user.email,
                senderRole: 'student',
                participantId: user.id,
                createdAt: serverTimestamp()
            });
        } catch (error: any) {
            console.error('Error sending message:', error)
            setStreamError("Ошибка отправки сообщения. Попробуйте снова.");
            setOptimisticMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setMessage(textToSend);

            if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(error);
                setIsOffline(true);
            }
        }
        setLoading(false)
    }

    const handleDeleteChat = async () => {
        if (!user?.id || isFirestoreBroken() || !window.confirm('Вы уверены, что хотите удалить всю историю переписки?')) return;

        setIsDeleting(true);
        try {
            const q = query(
                collection(db, 'support_chats'),
                where('participantId', '==', user.id)
            );
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);

            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            setMessages([]);
        } catch (error: any) {
            console.error('Error deleting chat:', error);
            alert('Не удалось удалить чат. Попробуйте позже.');
        } finally {
            setIsDeleting(false);
        }
    }

    const allMessages = [...messages, ...optimisticMessages].sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt instanceof Date ? a.createdAt.getTime() : 0);
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt instanceof Date ? b.createdAt.getTime() : 0);
        return timeA - timeB;
    });

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col bg-[#0e1621] relative overflow-hidden font-sans">
            {/* Telegram Header */}
            <div className="h-[60px] px-4 flex items-center gap-3 bg-[#17212b] border-b border-black/20 z-20 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40a7e3] to-[#48b2eb] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[15px] font-bold text-white leading-tight">Служба поддержки</h1>
                    <div className="flex items-center gap-1">
                        <span className={`text-[12px] ${isOffline || streamError ? 'text-red-400' : 'text-[#48b2eb]'}`}>
                            {isOffline ? 'БД отключена' : streamError ? 'Ошибка связи' : 'онлайн'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleDeleteChat}
                    disabled={isDeleting || messages.length === 0}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors disabled:opacity-0"
                    title="Удалить всю историю"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative z-10 bg-[#0e1621]">
                <AnimatePresence initial={false}>
                    {allMessages.length === 0 && !isOffline && !streamError && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <span className="bg-[#182533]/80 px-4 py-1.5 rounded-full text-[13px] text-white/60 font-medium tracking-tight">
                                Напишите сообщение, чтобы начать
                            </span>
                        </div>
                    )}

                    {streamError && (
                        <div className="flex justify-center p-2">
                            <span className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-[11px] text-red-400">
                                {streamError}
                            </span>
                        </div>
                    )}

                    {isOffline && (
                        <div className="flex justify-center p-4">
                            <span className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl text-[12px] text-red-400 text-center max-w-xs">
                                <b>FireShield Active:</b> Система перешла в оффлайн-режим из-за ошибки SDK.
                            </span>
                        </div>
                    )}

                    {allMessages.map((msg) => {
                        const isMine = msg.senderRole === 'student';
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-end gap-2 mb-1 ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isMine && (
                                    <div className="w-8 h-8 rounded-full bg-[#2b5278] flex items-center justify-center text-[10px] text-white font-bold mb-1 shadow-sm">
                                        {msg.senderName?.charAt(0).toUpperCase() || 'П'}
                                    </div>
                                )}

                                <div className={`relative max-w-[85%] px-3 py-1.5 rounded-2xl shadow-sm text-[14px] leading-relaxed
                                    ${isMine
                                        ? 'bg-[#2b5278] text-white rounded-br-sm'
                                        : 'bg-[#182533] text-white rounded-bl-sm border border-white/[0.03]'
                                    } ${msg.isOptimistic ? 'opacity-70' : ''}`}
                                >
                                    {!isMine && (
                                        <p className="text-[11px] font-bold text-[#48b2eb] mb-0.5">Администратор</p>
                                    )}
                                    <div className="flex items-end gap-3 flex-wrap">
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
            <div className="px-4 py-3 bg-[#17212b] border-t border-black/10 z-20">
                <form
                    onSubmit={handleSend}
                    className="max-w-4xl mx-auto flex items-end gap-3"
                >
                    <div className="flex-1 flex items-center bg-[#0e1621] rounded-2xl border border-white/[0.05] p-2 focus-within:border-[#2b5278] transition-all">
                        <button type="button" className="p-2 text-gray-500 hover:text-[#48b2eb] transition-colors">
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
                        <button type="button" className="p-2 text-gray-500 hover:text-[#48b2eb] transition-colors">
                            <Paperclip className="w-6 h-6" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!message.trim() || isOffline}
                        className="w-[50px] h-[50px] bg-[#2b5278] hover:bg-[#34618a] text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20 active:scale-90 shadow-lg flex-shrink-0"
                    >
                        <Send className="w-5 h-5 translate-x-[2px] -translate-y-[1px]" />
                    </button>
                </form>
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

export default SupportPage
