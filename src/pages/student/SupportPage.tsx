import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, query, onSnapshot, serverTimestamp, where, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore'
import { db, isFirestoreBroken, markFirestoreAsBroken } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { Send, HelpCircle, ShieldCheck, CheckCheck, Paperclip, Smile, Trash2, Sparkles, Terminal, MessageCircle, Calendar, Users, MessageSquare, TrendingUp, BookOpen, LayoutDashboard, Settings, Terminal as DeveloperIcon } from 'lucide-react'
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

    const quickActions = [
        { id: 'payment', text: 'Проблема с оплатой', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        { id: 'access', text: 'Нет доступа к курсу', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        { id: 'tech', text: 'Техническая ошибка', icon: <Terminal className="w-4 h-4 text-indigo-400" /> },
    ]

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

    const handleSend = async (text: string) => {
        if (!text.trim() || !user || loading || isFirestoreBroken()) return

        const optimisticMsg: Message = {
            id: `temp-${Date.now()}`,
            text: text,
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
                text: text,
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

            if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(error);
                setIsOffline(true);
            }
        }
        setLoading(false)
    }

    const deleteHistory = async () => {
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
        <div className="h-[calc(100vh-80px)] flex flex-col bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[80px] pointer-events-none -z-10" />

            {/* Header */}
            <div className="h-[72px] px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-100 z-20 shadow-sm relative">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Центр поддержки</h1>
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isOffline || streamError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                            <span className={`text-xs font-bold uppercase tracking-widest ${isOffline || streamError ? 'text-red-400' : 'text-slate-400'}`}>
                                {isOffline ? 'Offline' : streamError ? 'Connection Error' : 'Online'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={deleteHistory}
                        disabled={isDeleting || messages.length === 0}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0"
                        title="Очистить историю"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Elite Support</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 custom-scrollbar relative z-10 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-6">
                    {allMessages.length === 0 && !isOffline && !streamError && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                                <MessageCircle className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 mb-2">Добро пожаловать!</h2>
                            <p className="text-slate-400 max-w-[280px] text-sm font-medium leading-relaxed">
                                Мы всегда на связи. Опишите вашу проблему или воспользуйтесь быстрыми ответами ниже.
                            </p>
                        </motion.div>
                    )}

                    {isOffline && (
                        <div className="flex justify-center">
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 max-w-sm">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-red-600" />
                                </div>
                                <p className="text-xs text-red-600 leading-relaxed font-medium">
                                    <b>FireShield Active:</b> Система перешла в оффлайн-режим. Сообщения не будут отправлены.
                                </p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {allMessages.map((msg, idx) => {
                            const isMine = msg.senderRole === 'student';
                            const showAvatar = idx === 0 || allMessages[idx - 1].senderId !== msg.senderId;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {!isMine && showAvatar && (
                                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[10px] text-indigo-600 font-black flex-shrink-0 mb-1">
                                            {msg.senderName?.charAt(0).toUpperCase() || 'P'}
                                        </div>
                                    )}
                                    {!isMine && !showAvatar && <div className="w-8 flex-shrink-0" />}

                                    <div className={`relative max-w-[80%] group ${isMine ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                                            ${isMine
                                                ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-none shadow-indigo-100'
                                                : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                                            } ${msg.isOptimistic ? 'opacity-70 grayscale-[0.3]' : ''}`}
                                        >
                                            {!isMine && showAvatar && (
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Поддержка</p>
                                            )}
                                            <p className="whitespace-pre-wrap break-words font-medium">{msg.text}</p>
                                        </div>

                                        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <span className="text-[10px] font-bold text-slate-300">
                                                {msg.createdAt?.toDate?.()?.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                                                    || (msg.createdAt instanceof Date ? msg.createdAt.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) : '..:..')}
                                            </span>
                                            {isMine && (
                                                <div className="flex items-center">
                                                    {msg.isOptimistic ? (
                                                        <div className="w-2.5 h-2.5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                                                    ) : (
                                                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input Area */}
            <div className="px-6 pb-8 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-20">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Quick Actions */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {quickActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleSend(action.text)}
                                disabled={loading || isOffline}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-indigo-50 transition-all text-xs font-black text-slate-600 whitespace-nowrap active:scale-95 disabled:opacity-50"
                            >
                                {action.icon}
                                {action.text}
                            </button>
                        ))}
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(message); setMessage(''); }}
                        className="flex items-end gap-3"
                    >
                        <div className="flex-1 flex items-center bg-white rounded-2xl border border-slate-100 p-2 focus-within:ring-2 ring-indigo-500/10 focus-within:border-indigo-300 transition-all shadow-sm">
                            <button type="button" className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                                <Smile className="w-5 h-5" />
                            </button>
                            <textarea
                                rows={1}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(message);
                                        setMessage('');
                                    }
                                }}
                                placeholder="Опишите вашу проблему..."
                                className="flex-1 bg-transparent border-none px-3 py-2 text-slate-700 placeholder-slate-400 text-sm focus:ring-0 resize-none min-h-[44px] max-h-[140px] font-medium"
                            />
                            <button type="button" className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
                                <Paperclip className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!message.trim() || loading || isOffline}
                            className="w-[52px] h-[52px] bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-[1.25rem] flex items-center justify-center transition-all disabled:opacity-20 active:scale-95 shadow-lg shadow-indigo-100 flex-shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.2); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}

export default SupportPage
