import { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, BookOpen, ArrowRight, Target, Crown,
    Calendar, Globe, Gamepad2, Terminal, Bot,
    ChevronRight, Zap, Award, Code2, PlayCircle,
    CheckCircle, Clock, Flame, Star, Bell, MessageSquare,
    Sparkles, LayoutDashboard, Send, Loader2, BrainCircuit
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getCurriculumByDirection } from '@/data/directionCurriculum'
import { directionIcons, directionGradients } from '@/utils/directionUtils'
import { sendAIChatMessage } from '@/api/mita'
import { createAIChat, getUserAIChats } from '@/api/aiChats'
import { subscribeToAIChatMessages, AIMessage } from '@/api/aiMessages'

const STORAGE_KEY = 'direction_lessons_completed'

export const Dashboard = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { loadTasks } = useTaskStore()
    const [timeGreeting, setTimeGreeting] = useState('')
    const [sessionTime, setSessionTime] = useState({ start: '14:00', end: '16:00' })

    // MITA AI Mini Chat state
    const [mitaMessages, setMitaMessages] = useState<AIMessage[]>([])
    const [mitaInput, setMitaInput] = useState('')
    const [mitaLoading, setMitaLoading] = useState(false)
    const [mitaChatId, setMitaChatId] = useState<string | null>(null)
    const mitaEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const sessionRef = doc(db, 'site_settings', 'session')
        const unsub = onSnapshot(sessionRef, (snap: any) => {
            if (snap.exists()) {
                const data = snap.data()
                setSessionTime({ start: data.startTime || '14:00', end: data.endTime || '16:00' })
            }
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'developer' || user?.role === 'teacher') {
            navigate('/admin')
        }
    }, [user, navigate])

    useEffect(() => {
        loadTasks()
        const h = new Date().getHours()
        if (h < 6) setTimeGreeting('Доброй ночи')
        else if (h < 12) setTimeGreeting('Доброе утро')
        else if (h < 18) setTimeGreeting('Добрый день')
        else setTimeGreeting('Добрый вечер')
    }, [loadTasks])

    // Initialize MITA chat
    useEffect(() => {
        const initMitaChat = async () => {
            if (!user) return
            try {
                const chats = await getUserAIChats()
                if (chats.length > 0) {
                    setMitaChatId(chats[0].id)
                } else {
                    const newChat = await createAIChat('Dashboard Chat')
                    setMitaChatId(newChat.id)
                }
            } catch (e) {
                console.warn('[MITA Dashboard] Chat init failed', e)
            }
        }
        initMitaChat()
    }, [user])

    // Subscribe to MITA messages
    useEffect(() => {
        if (!mitaChatId) return
        const unsub = subscribeToAIChatMessages(mitaChatId, (msgs) => {
            setMitaMessages(msgs.slice(-20)) // keep last 20 for performance
        })
        return () => unsub()
    }, [mitaChatId])

    // Auto-scroll MITA chat
    useEffect(() => {
        mitaEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mitaMessages, mitaLoading])

    const handleMitaSend = async () => {
        if (!mitaInput.trim() || !mitaChatId || mitaLoading) return
        const msg = mitaInput
        setMitaInput('')
        setMitaLoading(true)
        try {
            await sendAIChatMessage(mitaChatId, msg)
        } catch (e) {
            console.error('[MITA Dashboard] Send failed', e)
        } finally {
            setMitaLoading(false)
        }
    }

    const selectedDirection = user?.selectedDirection || 'Веб разработчик'
    const curriculum = getCurriculumByDirection(selectedDirection)
    const CurrentIcon = directionIcons[selectedDirection] || Globe
    const currentGradient = directionGradients[selectedDirection] || 'from-indigo-600 to-blue-600'

    const { completedCount, totalCount, progressPct, nextLesson } = useMemo(() => {
        const completedSet = new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
        const allLessons = curriculum?.modules.flatMap(m => m.lessons) || []
        const completed = allLessons.filter(l => completedSet.has(l.id)).length
        const total = allLessons.length
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0
        const next = allLessons.find(l => !completedSet.has(l.id)) || null
        return { completedCount: completed, totalCount: total, progressPct: pct, nextLesson: next }
    }, [curriculum])

    const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'Студент'

    const quickNav = [
        { icon: PlayCircle, label: 'Урок', desc: nextLesson?.title || 'Продолжить', path: nextLesson ? `/direction-lesson/${nextLesson.id}` : '/tasks', accent: 'from-violet-500 to-fuchsia-600', glow: 'shadow-violet-500/20', bg: 'bg-violet-50 dark:bg-violet-500/10', ic: 'text-violet-600 dark:text-violet-400' },
        { icon: Bot, label: 'MITA', desc: 'ИИ‑помощник', path: '/student/ai-chat', accent: 'from-indigo-500 to-blue-600', glow: 'shadow-indigo-500/20', bg: 'bg-indigo-50 dark:bg-indigo-500/10', ic: 'text-indigo-600 dark:text-indigo-400' },
        { icon: LayoutDashboard, label: 'Программа', desc: `${completedCount} / ${totalCount} уроков`, path: '/tasks', accent: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/20', bg: 'bg-blue-50 dark:bg-blue-500/10', ic: 'text-blue-600 dark:text-blue-400' },
        { icon: TrendingUp, label: 'Прогресс', desc: 'Твои достижения', path: '/progress', accent: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20', bg: 'bg-orange-50 dark:bg-orange-500/10', ic: 'text-orange-600 dark:text-orange-400' },
    ]

    const modules = curriculum?.modules || []

    return (
        <div className="min-h-full space-y-8 pb-12 pt-4 relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
                <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* ── Hero Banner ── */}
            <ScrollReveal animation="fade">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0F24] border border-white/10 shadow-2xl group">
                    {/* Hero Ambient glows */}
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] group-hover:bg-indigo-500/40 transition-colors duration-700" />
                    <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-violet-700/30 rounded-full blur-[100px] group-hover:bg-violet-600/40 transition-colors duration-700" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/15 rounded-full blur-[100px]" />

                    {/* Mesh texture */}
                    <div
                        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                    />

                    <div className="relative z-10 p-8 lg:p-14">
                        <div className="flex flex-col xl:flex-row xl:items-center gap-10">
                            {/* Left: greeting + direction */}
                            <div className="flex-1 space-y-8">
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                    <div className="relative flex items-center justify-center w-3 h-3">
                                        <span className="absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" />
                                        <span className="relative inline-flex w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">Платформа активна</span>
                                </div>

                                <div>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2"
                                    >
                                        {timeGreeting},
                                    </motion.p>
                                    <motion.h1 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight"
                                    >
                                        {userName}
                                        <span className="inline-block animate-bounce-subtle ml-3">👋</span>
                                    </motion.h1>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-white/60 font-medium mt-4 max-w-lg text-lg leading-relaxed"
                                    >
                                        Готов к новым свершениям? Твой путь к мастерству в {selectedDirection} ждет тебя.
                                    </motion.p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentGradient} bg-opacity-20 border border-white/10 px-6 py-3 rounded-2xl shadow-lg backdrop-blur-md`}>
                                        <CurrentIcon className="w-5 h-5 text-white" />
                                        <span className="text-sm font-black text-white uppercase tracking-widest">{selectedDirection}</span>
                                    </div>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(nextLesson ? `/direction-lesson/${nextLesson.id}` : '/tasks')}
                                        className={`inline-flex items-center gap-3 bg-white text-slate-900 font-black px-8 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] text-sm uppercase tracking-widest transition-all`}
                                    >
                                        <PlayCircle className="w-5 h-5 text-indigo-600" />
                                        {nextLesson ? 'Продолжить' : 'Начать'}
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Right: stats circle + progress */}
                            <div className="flex flex-col sm:flex-row xl:flex-col gap-4 xl:min-w-[320px]">
                                {/* Circular progress */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-6 flex items-center gap-6 flex-1 xl:flex-none shadow-xl relative overflow-hidden"
                                >
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full" />
                                    <div className="relative w-24 h-24 shrink-0">
                                        <svg className="rotate-[-90deg] w-24 h-24" viewBox="0 0 72 72">
                                            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            <motion.circle
                                                initial={{ strokeDasharray: "0 188.5" }}
                                                animate={{ strokeDasharray: `${188.5 * progressPct / 100} 188.5` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="36" cy="36" r="30" fill="none"
                                                stroke="url(#prog)" strokeWidth="8"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#818cf8" />
                                                    <stop offset="100%" stopColor="#38bdf8" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl font-black text-white">{progressPct}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Прогресс</p>
                                        <p className="text-3xl font-black text-white leading-none">{completedCount}<span className="text-white/30 text-lg font-bold"> / {totalCount}</span></p>
                                        <p className="text-[11px] text-white/40 font-bold mt-2 uppercase tracking-wider">Уроков</p>
                                    </div>
                                </motion.div>

                                <div className="flex gap-4">
                                    {/* Streak / subscription */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[1.5rem] p-5 flex flex-col justify-center gap-3 flex-1 shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                            {user?.subscriptionPlan ? <Crown className="w-5 h-5 text-white" /> : <Flame className="w-5 h-5 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">{user?.subscriptionPlan ? 'Подписка' : 'Серия'}</p>
                                            <p className="text-lg font-black text-white">{user?.subscriptionPlan || 'Активна'}</p>
                                        </div>
                                    </motion.div>

                                    {/* Global Session Time */}
                                    <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[1.5rem] p-5 flex flex-col justify-center gap-3 flex-1 shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">Занятие</p>
                                            <p className="text-lg font-black text-white tabular-nums tracking-tight">{sessionTime.start}-{sessionTime.end}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* ── Quick Nav Cards ── */}
            <ScrollReveal animation="slide-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {quickNav.map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 p-6 xl:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${item.glow} backdrop-blur-xl`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${item.accent} opacity-5 group-hover:opacity-20 blur-2xl transition-all duration-500`} />
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.accent} p-[1.5px] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-800 flex items-center justify-center">
                                        <item.icon className={`w-6 h-6 ${item.ic}`} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1.5 leading-tight">{item.label}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="mt-6 flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>Перейти</span>
                                    <ArrowRight className={`w-3.5 h-3.5 ${item.ic} group-hover:translate-x-1.5 transition-transform`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ScrollReveal>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: curriculum modules */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Course banner */}
                    <ScrollReveal animation="fade">
                        <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${currentGradient} p-8 lg:p-10 shadow-2xl`}>
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[60px] -ml-20 -mb-20" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                                        <Code2 className="w-3.5 h-3.5 text-white/80" />
                                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Текущий курс</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">{curriculum?.title}</h2>
                                    <p className="text-white/70 text-sm font-medium mb-8 max-w-lg">
                                        {modules.length} модулей · {totalCount} уроков · Полное погружение в профессию
                                    </p>
                                    {/* Progress bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[11px] font-black text-white/60 uppercase tracking-widest">
                                            <span>Общий прогресс</span>
                                            <span>{completedCount} из {totalCount}</span>
                                        </div>
                                        <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                                className="h-full bg-white rounded-full relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-4 md:items-end shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/tasks')}
                                        className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                                    >
                                        <BookOpen className="w-4 h-4" /> Программа
                                    </motion.button>
                                    {nextLesson && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                            className="bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full md:w-auto"
                                        >
                                            <PlayCircle className="w-5 h-5 text-indigo-600" /> Вперёд
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Modules list */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-xl overflow-hidden backdrop-blur-xl">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white text-lg">Модули курса</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Программа обучения</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full"
                                >
                                    Все <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-700/50 p-2">
                                {modules.map((mod, i) => {
                                    const colors = [
                                        'from-violet-500 to-indigo-600',
                                        'from-blue-500 to-cyan-600',
                                        'from-emerald-500 to-teal-600',
                                        'from-orange-500 to-amber-600',
                                        'from-rose-500 to-pink-600',
                                    ]
                                    const col = colors[i % colors.length]
                                    return (
                                        <motion.button
                                            key={mod.id}
                                            whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.03)' }}
                                            onClick={() => navigate('/tasks')}
                                            className="w-full flex items-center gap-5 p-5 rounded-2xl text-left group transition-colors"
                                        >
                                            <div className={`w-14 h-14 rounded-[1.25rem] bg-gradient-to-br ${col} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                                <span className="text-white font-black text-xl">{mod.index}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Модуль {mod.index}</p>
                                                <h4 className="font-black text-slate-900 dark:text-white text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{mod.title}</h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><BookOpen className="w-3 h-3" /> {mod.lessons.length} уроков</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {i === 0 && progressPct > 0 && progressPct < 100 && (
                                                    <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                                        В процессе
                                                    </span>
                                                )}
                                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors">
                                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Achievement teaser */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                            <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-colors duration-700"></div>
                            
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(250,204,21,0.3)] relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <Award className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left relative z-10">
                                <h3 className="font-black text-white text-2xl mb-2 tracking-tight">Получи сертификат</h3>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">Заверши все {totalCount} уроков направления «{selectedDirection}» и получи профессиональный сертификат EliteHeat, подтверждающий твои навыки.</p>
                            </div>
                            <div className="flex flex-col items-center gap-2 shrink-0 bg-white/5 border border-white/10 backdrop-blur px-6 py-4 rounded-2xl relative z-10">
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
                                <span className="text-sm font-black text-white">{progressPct}%</span>
                                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Готово</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Next lesson */}
                    {nextLesson && (
                        <ScrollReveal animation="slide-left">
                            <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-xl overflow-hidden backdrop-blur-xl relative group">
                                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${currentGradient}`} />
                                <div className="p-6 border-b border-slate-50 dark:border-slate-700/50 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest">Следующий шаг</h4>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start gap-5 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentGradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <PlayCircle className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="min-w-0 pt-1">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Урок {nextLesson.lessonIndex}</p>
                                            <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-2">{nextLesson.title}</h4>
                                            <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{nextLesson.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                        className={`w-full bg-gradient-to-r ${currentGradient} text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden`}
                                    >
                                        <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                                        <PlayCircle className="w-5 h-5" /> Продолжить обучение
                                    </motion.button>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* ── MITA AI Assistant Widget ── */}
                    <ScrollReveal animation="slide-left">
                        <div className="bg-[#0A0F24] rounded-[2.5rem] border border-indigo-500/20 shadow-xl overflow-hidden relative group">
                            {/* Glow */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-500" />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-violet-600/15 rounded-full blur-[50px] pointer-events-none" />

                            {/* Header */}
                            <div className="relative z-10 p-5 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <BrainCircuit className="w-5 h-5 text-white" />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0A0F24] animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm flex items-center gap-2">
                                            MITA
                                            <span className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">AI</span>
                                        </h4>
                                        <p className="text-[10px] text-white/40 font-medium">Твой ИИ-наставник</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/student/ai-chat')}
                                    className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                >
                                    Открыть <ArrowRight className="w-3 h-3" />
                                </motion.button>
                            </div>

                            {/* Messages */}
                            <div className="relative z-10 h-64 overflow-y-auto p-4 space-y-3 mita-scroll">
                                {mitaMessages.length === 0 && !mitaLoading && (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-3">
                                            <Bot className="w-7 h-7 text-indigo-400" />
                                        </div>
                                        <p className="text-white/50 text-sm font-bold mb-1">Привет, {userName}!</p>
                                        <p className="text-white/30 text-xs font-medium max-w-[200px] leading-relaxed">Задай мне вопрос прямо здесь — помогу с Python, Figma и веб-разработкой</p>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {mitaMessages.map((msg) => {
                                        const isUser = msg.role === 'user'
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                                                    isUser
                                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                                        : 'bg-white/8 border border-white/10 text-white/90 rounded-bl-sm'
                                                }`}>
                                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>

                                {mitaLoading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="bg-white/8 border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                            <span className="text-white/50 text-sm font-medium">MITA думает...</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={mitaEndRef} />
                            </div>

                            {/* Input */}
                            <div className="relative z-10 p-4 border-t border-white/10 bg-black/20">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={mitaInput}
                                        onChange={(e) => setMitaInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleMitaSend()}
                                        placeholder="Спроси MITA..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                        disabled={mitaLoading}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleMitaSend}
                                        disabled={!mitaInput.trim() || mitaLoading}
                                        className="w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Notifications */}
                    <ScrollReveal animation="slide-left">
                        <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-xl overflow-hidden backdrop-blur-xl">
                            <div className="p-6 border-b border-slate-50 dark:border-slate-700/50 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest">Уведомления</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                {[
                                    { text: 'Проверьте материалы на сегодня', time: '10 мин назад', color: 'bg-indigo-50 dark:bg-indigo-500/10', iconColor: 'text-indigo-600 dark:text-indigo-400' },
                                    { text: 'Добро пожаловать в EliteHeat!', time: '1 час назад', color: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                                ].map((n, i) => (
                                    <motion.div whileHover={{ x: 4 }} key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${n.color}`}>
                                            <MessageSquare className={`w-4 h-4 ${n.iconColor}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{n.text}</p>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{n.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Tip card */}
                    <ScrollReveal animation="slide-left">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 shadow-xl hover:shadow-2xl transition-shadow group">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                        <Sparkles className="w-5 h-5 text-yellow-300" />
                                    </div>
                                    <span className="text-[11px] font-black text-white/90 uppercase tracking-widest">Совет дня</span>
                                </div>
                                <p className="text-white font-bold text-base leading-relaxed">
                                    Практика каждый день — ключ к мастерству. Даже 30 минут кодинга в день дадут невероятный результат через месяц.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
            
            {/* Custom Animations inline just in case */}
            <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                .mita-scroll::-webkit-scrollbar { width: 4px; }
                .mita-scroll::-webkit-scrollbar-track { background: transparent; }
                .mita-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .mita-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    )
}

export default Dashboard
