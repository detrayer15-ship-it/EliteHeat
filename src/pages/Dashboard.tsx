import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    TrendingUp, BookOpen, ArrowRight, Target, Crown,
    Calendar, Globe, Gamepad2, Terminal,
    ChevronRight, Zap, Award, Code2, PlayCircle,
    CheckCircle, Clock, Flame, Star, Bell, MessageSquare
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getCurriculumByDirection } from '@/data/directionCurriculum'
import { directionIcons, directionGradients } from '@/utils/directionUtils'

const STORAGE_KEY = 'direction_lessons_completed'

export const Dashboard = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { tasks, loadTasks } = useTaskStore()
    const [timeGreeting, setTimeGreeting] = useState('')
    const [sessionTime, setSessionTime] = useState({ start: '14:00', end: '16:00' })

    useEffect(() => {
        // Fetch global session time
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

    const selectedDirection = user?.selectedDirection || 'Веб разработчик'
    const curriculum = getCurriculumByDirection(selectedDirection)
    const CurrentIcon = directionIcons[selectedDirection] || Globe
    const currentGradient = directionGradients[selectedDirection] || 'from-indigo-600 to-blue-600'

    // Progress calculation
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
        { icon: PlayCircle, label: 'Продолжить урок', desc: nextLesson?.title || 'Модуль 1', path: nextLesson ? `/direction-lesson/${nextLesson.id}` : '/tasks', accent: 'from-violet-500 to-indigo-600', glow: 'shadow-violet-500/30', bg: 'bg-violet-50', ic: 'text-violet-600' },
        { icon: BookOpen, label: 'Программа курса', desc: `${completedCount} из ${totalCount} уроков`, path: '/tasks', accent: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/30', bg: 'bg-blue-50', ic: 'text-blue-600' },
        { icon: Calendar, label: 'Расписание', desc: 'Занятия с преподавателем', path: '/student/schedule', accent: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/30', bg: 'bg-emerald-50', ic: 'text-emerald-600' },
        { icon: TrendingUp, label: 'Статистика', desc: 'Прогресс и достижения', path: '/progress', accent: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/30', bg: 'bg-orange-50', ic: 'text-orange-600' },
    ]

    const modules = curriculum?.modules || []

    return (
        <div className="min-h-full space-y-6 pb-8">

            {/* ── Hero Banner ── */}
            <ScrollReveal animation="fade">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0c0e1a]">
                    {/* Ambient glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/25 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-violet-700/20 rounded-full blur-[100px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-600/10 rounded-full blur-[80px]" />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <div className="relative z-10 p-8 lg:p-12">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                            {/* Left: greeting + direction */}
                            <div className="flex-1 space-y-6">
                                {/* Online badge */}
                                <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">EliteHeat · Система активна</span>
                                </div>

                                <div>
                                    <p className="text-white/40 text-sm font-semibold mb-1">{timeGreeting},</p>
                                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[0.95] tracking-tighter">
                                        {userName}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400"> 🚀</span>
                                    </h1>
                                    <p className="text-white/35 font-medium mt-3 max-w-md leading-relaxed">
                                        Готов прокачивать навыки? Продолжаем твой путь в мире IT.
                                    </p>
                                </div>

                                {/* Direction chip */}
                                <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentGradient} bg-opacity-20 border border-white/10 px-5 py-2.5 rounded-2xl`}>
                                    <CurrentIcon className="w-4 h-4 text-white" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">{selectedDirection}</span>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate(nextLesson ? `/direction-lesson/${nextLesson.id}` : '/tasks')}
                                    className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentGradient} text-white font-black px-7 py-4 rounded-2xl shadow-xl text-sm uppercase tracking-widest transition-all`}
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    {nextLesson ? 'Продолжить обучение' : 'Начать обучение'}
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Right: stats circle + progress */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:min-w-[280px]">
                                {/* Circular progress */}
                                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-7 flex items-center gap-6 flex-1 lg:flex-none">
                                    <div className="relative w-20 h-20 shrink-0">
                                        <svg className="rotate-[-90deg] w-20 h-20" viewBox="0 0 72 72">
                                            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                            <circle
                                                cx="36" cy="36" r="30" fill="none"
                                                stroke="url(#prog)" strokeWidth="6"
                                                strokeLinecap="round"
                                                strokeDasharray={`${188.5 * progressPct / 100} 188.5`}
                                            />
                                            <defs>
                                                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#818cf8" />
                                                    <stop offset="100%" stopColor="#38bdf8" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-black text-white">{progressPct}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Прогресс курса</p>
                                        <p className="text-2xl font-black text-white">{completedCount}<span className="text-white/30 text-sm font-medium"> / {totalCount}</span></p>
                                        <p className="text-[11px] text-white/30 font-medium mt-0.5">уроков пройдено</p>
                                    </div>
                                </div>

                                {/* Streak / subscription */}
                                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-5 flex items-center gap-4 flex-1 lg:flex-none">
                                    <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                                        {user?.subscriptionPlan ? <Crown className="w-5 h-5 text-orange-400" /> : <Flame className="w-5 h-5 text-orange-400" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{user?.subscriptionPlan ? 'Подписка' : 'Серия'}</p>
                                        <p className="text-lg font-black text-white">{user?.subscriptionPlan || 'Активна'}</p>
                                    </div>
                                </div>

                                {/* Global Session Time Display */}
                                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-5 flex items-center gap-4 flex-1 lg:flex-none">
                                    <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Текущее занятие</p>
                                        <p className="text-lg font-black text-white tabular-nums">{sessionTime.start} — {sessionTime.end}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* ── Quick Nav Cards ── */}
            <ScrollReveal animation="slide-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickNav.map((item, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(item.path)}
                            className={`group bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-lg hover:shadow-2xl ${item.glow} transition-all duration-400 text-left relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-5 rounded-full -mr-8 -mt-8 transition-opacity duration-500`} />
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className={`w-6 h-6 ${item.ic}`} />
                            </div>
                            <h3 className="font-black text-slate-900 text-sm mb-1 leading-tight">{item.label}</h3>
                            <p className="text-xs text-slate-400 font-medium leading-snug line-clamp-2">{item.desc}</p>
                            <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>Открыть</span>
                                <ChevronRight className={`w-3 h-3 ${item.ic}`} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </ScrollReveal>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: curriculum modules */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course banner */}
                    <ScrollReveal animation="fade">
                        <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${currentGradient} p-8 shadow-2xl`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[60px] -ml-10 -mb-10" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1 rounded-full mb-4 border border-white/10">
                                        <Code2 className="w-3 h-3 text-white/70" />
                                        <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Мой курс</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">{curriculum?.title}</h2>
                                    <p className="text-white/60 text-sm font-medium mb-5">
                                        {modules.length} модулей · {totalCount} уроков · Сертификат по завершению
                                    </p>
                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                                            <span>Прогресс</span>
                                            <span>{completedCount} / {totalCount}</span>
                                        </div>
                                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                                className="h-full bg-white/80 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col gap-3 md:items-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => navigate('/tasks')}
                                        className="bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur text-white font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-2xl transition-all flex items-center gap-2"
                                    >
                                        <BookOpen className="w-4 h-4" /> Вся программа
                                    </motion.button>
                                    {nextLesson && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                            className="bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-xl"
                                        >
                                            <PlayCircle className="w-4 h-4 text-indigo-600" /> Продолжить
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Modules list */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <Target className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-base">Модули курса</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/tasks')}
                                    className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
                                >
                                    Все <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
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
                                            whileHover={{ backgroundColor: 'rgba(238,242,255,0.5)' }}
                                            onClick={() => navigate('/tasks')}
                                            className="w-full flex items-center gap-4 px-6 py-4 text-left group transition-colors"
                                        >
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${col} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                                                <span className="text-white font-black text-sm">{mod.index}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Модуль {mod.index}</p>
                                                <h4 className="font-black text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">{mod.title}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{mod.lessons.length} уроков</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {i === 0 && progressPct > 0 && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                        В процессе
                                                    </span>
                                                )}
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Achievement teaser */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-7 flex flex-col sm:flex-row items-center gap-6 border border-slate-700/50">
                            <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-400/20">
                                <Award className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-black text-white text-lg mb-1">Получи сертификат</h3>
                                <p className="text-slate-400 text-sm font-medium">Завершите все {totalCount} уроков направления «{selectedDirection}» и получите профессиональный сертификат EliteHeat.</p>
                            </div>
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-xs font-black text-white/60">{progressPct}% готово</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right sidebar */}
                <div className="space-y-5">
                    {/* Next lesson */}
                    {nextLesson && (
                        <ScrollReveal animation="slide-left">
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
                                <div className="p-5 border-b border-slate-50 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Следующий урок</h4>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentGradient} flex items-center justify-center shrink-0 shadow-md`}>
                                            <PlayCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Урок {nextLesson.lessonIndex}</p>
                                            <h4 className="font-black text-slate-900 text-sm leading-tight">{nextLesson.title}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] text-slate-400 font-medium">{nextLesson.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                        className={`w-full bg-gradient-to-r ${currentGradient} text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all`}
                                    >
                                        <PlayCircle className="w-4 h-4" /> Начать урок
                                    </motion.button>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}



                    {/* Notifications */}
                    <ScrollReveal animation="slide-left">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
                            <div className="p-5 border-b border-slate-50 flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-blue-600" />
                                </div>
                                <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Уведомления</h4>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { text: 'Проверьте уроки на сегодня', time: '10 мин назад', color: 'bg-indigo-50 text-indigo-600' },
                                    { text: 'Добро пожаловать в EliteHeat!', time: '1 час назад', color: 'bg-emerald-50 text-emerald-600' },
                                ].map((n, i) => (
                                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${n.color}`}>
                                            <MessageSquare className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{n.text}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Tip card */}
                    <ScrollReveal animation="slide-left">
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-6 shadow-xl shadow-indigo-500/25">
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-yellow-300" />
                                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Совет дня</span>
                                </div>
                                <p className="text-white font-bold text-sm leading-relaxed opacity-90">
                                    Практика каждый день — ключ к мастерству. Даже 30 минут кодинга в день дадут результат через месяц.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <style>{`
                .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4,0,0.6,1) infinite; }
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(1.08); }
                }
            `}</style>
        </div>
    )
}

export default Dashboard
