import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import {
    Trophy,
    Target,
    TrendingUp,
    Award,
    Zap,
    Sparkles,
    Calendar,
    Activity,
    ChevronRight,
    Star
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { useAuthStore } from '@/store/authStore'
import { getCurriculumByDirection } from '@/data/directionCurriculum'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'direction_lessons_completed'

export const ProgressTrackerPage = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()

    const user = useAuthStore(s => s.user)
    const selectedDirection = user?.selectedDirection || 'Веб разработчик'
    const curriculum = getCurriculumByDirection(selectedDirection)

    // Прогресс по курсу
    const courseStats = useMemo(() => {
        const completedLessons = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const completedSet = new Set(completedLessons)

        const allLessons = curriculum?.modules.flatMap(m => m.lessons) || []
        const completedCount = allLessons.filter(l => completedSet.has(l.id)).length
        const totalCount = allLessons.length
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

        const modulesProgress = curriculum?.modules.map(m => {
            const modCompleted = m.lessons.filter(l => completedSet.has(l.id)).length
            return {
                id: m.id,
                title: m.title,
                index: m.index,
                completed: modCompleted,
                total: m.lessons.length,
                pct: Math.round((modCompleted / m.lessons.length) * 100)
            }
        }) || []

        return { completedCount, totalCount, progress, modulesProgress }
    }, [curriculum])

    // Навыки (динамические на основе модулей)
    const categories = useMemo(() => {
        const mods = courseStats.modulesProgress
        if (mods.length === 0) return []

        return mods.slice(0, 3).map((m, i) => {
            const mainColors = [
                'from-indigo-500 to-blue-600',
                'from-emerald-500 to-teal-500',
                'from-orange-500 to-amber-500'
            ]
            const icons = ['💻', '🧠', '🛠️']
            return {
                name: m.title,
                level: m.pct,
                icon: icons[i % icons.length],
                color: mainColors[i % mainColors.length],
                points: m.completed * 100
            }
        })
    }, [courseStats.modulesProgress])

    return (
        <div className="min-h-full py-4 space-y-10">
            {/* ── HEADER ── */}
            <ScrollReveal animation="fade">
                <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 lg:p-16 border border-white/5">
                    {/* Background decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -ml-10 -mb-10" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Ваш путь к успеху</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                                Трекер <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Прогресса</span>
                            </h1>
                            <p className="text-white/40 text-lg font-medium max-w-md">
                                Здесь собраны все твои достижения и статистика. Продолжай в том же духе!
                            </p>
                        </div>

                        {/* Global Progress Circle */}
                        <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
                            <div className="relative w-24 h-24">
                                <svg className="rotate-[-90deg] w-24 h-24" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <motion.circle
                                        cx="50" cy="50" r="45" fill="none"
                                        stroke="url(#grad)" strokeWidth="8"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "0 283" }}
                                        animate={{ strokeDasharray: `${2.83 * courseStats.progress} 283` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="100%" stopColor="#22d3ee" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">{courseStats.progress}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Общий прогресс</p>
                                <p className="text-3xl font-black text-white">
                                    {courseStats.completedCount} <span className="text-white/20 text-lg">/ {courseStats.totalCount}</span>
                                </p>
                                <p className="text-[11px] text-white/40 font-medium mt-1">уроков завершено</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* ── KEY METRICS ── */}
            <ScrollReveal animation="slide-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Мой уровень', value: Math.floor(courseStats.completedCount / 5) + 1, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Опыт (XP)', value: courseStats.completedCount * 150, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Проектов', value: projects.length, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Дней в обучении', value: 12, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
                                <m.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                                <p className="text-2xl font-black text-slate-900 leading-none mt-1">
                                    <AnimatedCounter end={m.value} />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="progress-main-grid">
                {/* Left: Modules Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <ScrollReveal animation="slide-up">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Прогресс по модулям</h2>
                                </div>
                                <button onClick={() => navigate('/tasks')} className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-700 transition-colors">
                                    Все уроки <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseStats.modulesProgress.map((mod) => (
                                    <div key={mod.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-indigo-50/30 transition-colors group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-black text-slate-200">#{mod.index}</span>
                                                <h4 className="font-black text-slate-800 tracking-tight truncate max-w-[140px]">{mod.title}</h4>
                                            </div>
                                            <span className="text-xs font-black text-indigo-600">{mod.pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${mod.pct}%` }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Модуль {mod.index}</span>
                                            <span>{mod.completed} / {mod.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Tip of the day */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 flex items-center gap-8 relative overflow-hidden shadow-xl shadow-indigo-100">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white mb-1">Совет дня</h3>
                                <p className="text-white/60 text-sm font-medium italic">
                                    "Ваш текущий прогресс ({courseStats.progress}%) впечатляет! Попробуйте сегодня закрепить пройденный материал в разделе практики."
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right: Skills & Goals */}
                <div className="space-y-6">
                    <ScrollReveal animation="slide-left">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Навыки</h3>
                            </div>

                            <div className="space-y-6">
                                {categories.map((cat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{cat.icon}</span>
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{cat.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-indigo-600">{cat.level}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cat.level}%` }}
                                                className={`h-full bg-gradient-to-r ${cat.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Звание: Эксперт</span>
                                </div>
                                <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                                    Профессиональный рост
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Achievement Card */}
                    <ScrollReveal animation="slide-left" delay={200}>
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/5 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Award className="w-10 h-10 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]" />
                                </div>
                                <h4 className="text-xl font-black text-white italic tracking-tighter">На пути к сертификату</h4>
                                <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                                    Заверши курс на 100%, чтобы получить официальное подтверждение своих знаний от EliteHeat.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/tasks')}
                                    className="w-full bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-xl shadow-white/5"
                                >
                                    Продолжить путь
                                </motion.button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    )
}
