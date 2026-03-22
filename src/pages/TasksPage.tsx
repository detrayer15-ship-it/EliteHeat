import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen, TrendingUp, Award, CheckCircle, Clock, Flame,
    Globe, Gamepad2, Terminal,
    ChevronRight, Code2, FlaskConical, Layers, Lock,
    Search, Filter, PlayCircle, History,
    CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { useAuthStore } from '@/store/authStore'
import { useSubmissionStore } from '@/store/submissionStore'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurriculumByDirection } from '@/data/directionCurriculum'
import type { Module, Lesson } from '@/data/directionCurriculum'

const STORAGE_KEY = 'direction_lessons_completed'

const getCompleted = (): Set<string> =>
    new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

const directionIcons: Record<string, any> = {
    'Веб разработчик': Globe,
    'Roblox': Gamepad2,
    'Python': Terminal,
}

const typeColors = {
    theory: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', glow: 'shadow-blue-500/20' },
    practice: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', glow: 'shadow-amber-500/20' },
    project: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', glow: 'shadow-purple-500/20' },
}

const typeIcons = {
    theory: BookOpen,
    practice: Code2,
    project: FlaskConical,
}

const typeLabels = {
    theory: 'Теория',
    practice: 'Практика',
    project: 'Проект',
}

const moduleGradients = [
    'from-indigo-500 to-blue-600',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
]

export const TasksPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)
    const mySubmissions = useSubmissionStore(s => s.getMySubmissions())
    const selectedDirection = user?.selectedDirection || 'Веб разработчик'

    const [completed] = useState<Set<string>>(getCompleted)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'all' | 'theory' | 'practice' | 'project'>('all')
    const [activeModule, setActiveModule] = useState<number>(1)

    const curriculum = useMemo(() => getCurriculumByDirection(selectedDirection), [selectedDirection])

    useEffect(() => {
        if (!curriculum) return
        const next = curriculum.modules.flatMap(m => m.lessons).find(l => !completed.has(l.id))
        if (next) {
            setActiveModule(next.moduleIndex)
        }
    }, [curriculum, completed])
    const CurrentIcon = directionIcons[selectedDirection] || Globe

    const allLessons: Lesson[] = useMemo(
        () => curriculum?.modules.flatMap(m => m.lessons) ?? [],
        [curriculum]
    )

    const completedCount = allLessons.filter(l => completed.has(l.id)).length
    const totalCount = allLessons.length
    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const nextLesson = useMemo(() => allLessons.find(l => !completed.has(l.id)), [allLessons, completed])

    // Filter lessons
    const filteredModules = useMemo(() => {
        if (!curriculum) return []
        return curriculum.modules.map(mod => ({
            ...mod,
            lessons: mod.lessons.filter(l => {
                const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesTab = activeTab === 'all' || l.type === activeTab
                return matchesSearch && matchesTab
            })
        })).filter(mod => mod.lessons.length > 0)
    }, [curriculum, searchQuery, activeTab])

    const getSubmissionStatus = (lessonId: string) => {
        const sub = mySubmissions.find(s => s.taskId === lessonId)
        if (!sub) return null
        return sub.status
    }

    const StatusBadge = ({ status }: { status: string }) => {
        const configs: Record<string, { label: string, color: string, icon: any }> = {
            pending: { label: 'На проверке', color: 'text-amber-500 bg-amber-50', icon: Clock },
            approved: { label: 'Принято', color: 'text-emerald-500 bg-emerald-50', icon: CheckCircle2 },
            rejected: { label: 'Нужны правки', color: 'text-rose-500 bg-rose-50', icon: AlertCircle },
        }
        const config = configs[status]
        if (!config) return null
        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/10 ${config.color}`}>
                <config.icon className="w-3 h-3" />
                {config.label}
            </div>
        )
    }

    if (!curriculum) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-indigo-200" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Направление не выбрано</h2>
                <button onClick={() => navigate('/choose-direction')} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest text-[10px]">Выбрать путь</button>
            </div>
        )
    }

    return (
        <div className="min-h-full py-4 space-y-8">
            {/* Header / Hero */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[70%] bg-indigo-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/15 rounded-full blur-[100px]" />

                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                        <div className="space-y-6 max-w-2xl">
                            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full">
                                <CurrentIcon className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{selectedDirection}</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-[0.9]">
                                Программа <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">Обучения</span>
                            </h1>
                            <p className="text-white/40 text-lg font-medium leading-relaxed italic">
                                {totalCount} уроков в {curriculum.modules.length} модулях. Твой путь к мастерству в {selectedDirection}.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                    <p className="text-3xl font-black text-white leading-none">{progressPct}%</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Прогресс обучения</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[140px]">
                                    <p className="text-3xl font-black text-white leading-none tabular-nums">{completedCount}/{totalCount}</p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Уроков пройдено</p>
                                </div>
                                {nextLesson && (
                                    <button
                                        onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-4 flex items-center gap-4 transition-all shadow-xl group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Продолжить</p>
                                            <p className="font-bold text-sm truncate max-w-[150px]">{nextLesson.title}</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2rem] p-6 space-y-4 w-full xl:w-80">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Поиск урока..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'theory', 'practice', 'project'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {tab === 'all' ? 'Все' : typeLabels[tab]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Sidebar: Modules */}
                <div className="hidden lg:block space-y-3">
                    <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Модули курса</h3>
                    {curriculum.modules.map((mod, idx) => {
                        const isActive = activeModule === mod.index
                        const modCompleted = mod.lessons.filter(l => completed.has(l.id)).length
                        const modPct = Math.round((modCompleted / mod.lessons.length) * 100)
                        const grad = moduleGradients[idx % moduleGradients.length]

                        return (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModule(mod.index)}
                                className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-4 group ${isActive ? 'bg-white border-slate-200 shadow-xl scale-[1.02]' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md`}>
                                    {mod.index}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-black text-sm truncate ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{mod.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1 bg-slate-200/50 rounded-full overflow-hidden">
                                            <div className={`h-full bg-gradient-to-r ${grad} rounded-full`} style={{ width: `${modPct}%` }} />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">{modCompleted}/{mod.lessons.length}</span>
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-all ${isActive ? 'text-indigo-500' : 'text-slate-300'}`} />
                            </button>
                        )
                    })}
                </div>

                {/* Lessons Display Area */}
                <div className="lg:col-span-3 space-y-6">
                    {filteredModules.length > 0 ? (
                        filteredModules.filter(m => activeModule === 0 || m.index === activeModule || searchQuery).map((mod, mIdx) => (
                            <div key={mod.id} className="space-y-4">
                                {!searchQuery && (
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-slate-200">#0{mod.index}</span>
                                            <h2 className="text-xl font-black text-slate-900 leading-tight">{mod.title}</h2>
                                        </div>
                                        <div className="h-[2px] flex-1 mx-6 bg-slate-100 rounded-full hidden md:block" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mod.lessons.length} уроков</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mod.lessons.map((lesson, lIdx) => {
                                        const isDone = completed.has(lesson.id)
                                        const subStatus = getSubmissionStatus(lesson.id)
                                        const tc = typeColors[lesson.type]
                                        const TIcon = typeIcons[lesson.type]

                                        return (
                                            <motion.button
                                                key={lesson.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: lIdx * 0.05 }}
                                                onClick={() => navigate(`/direction-lesson/${lesson.id}`)}
                                                className={`group flex items-start gap-5 p-6 rounded-[2rem] border-2 transition-all text-left bg-white
                                                    ${isDone ? 'border-emerald-50 hover:border-emerald-100 hover:shadow-emerald-100/30 shadow-lg shadow-emerald-50/20' : 'border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 shadow-md shadow-slate-200/20'}
                                                `}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-md ${isDone ? 'bg-emerald-50 text-emerald-500' : `${tc.bg} ${tc.text} ${tc.glow}`}`}>
                                                    {isDone ? <CheckCircle2 className="w-8 h-8" /> : <TIcon className="w-8 h-8" />}
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <div className="flex items-center flex-wrap gap-2 mb-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-current/10 ${tc.bg} ${tc.text}`}>
                                                            {typeLabels[lesson.type]}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{lesson.duration}</span>
                                                        {subStatus && <StatusBadge status={subStatus} />}
                                                    </div>
                                                    <h4 className={`text-lg font-black leading-tight mb-2 group-hover:text-indigo-700 transition-colors ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                                                        {lesson.description}
                                                    </p>
                                                </div>
                                                <div className="self-center p-2 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-lg">
                                <Search className="w-10 h-10 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Ничего не найдено</h3>
                                <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">Попробуй изменить поисковый запрос <br />или сменить фильтры.</p>
                            </div>
                            <button onClick={() => { setSearchQuery(''); setActiveTab('all') }} className="px-10 py-3 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[9px] rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Сбросить всё</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: Certificates & Support */}
            <ScrollReveal animation="slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 flex items-center gap-8 shadow-2xl shadow-indigo-100/50 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 group-hover:rotate-12 transition-transform">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">Карьера в IT</h3>
                            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">Завершите все модули направления «{selectedDirection}», чтобы получить элитный сертификат EliteEdu.</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 flex items-center gap-8 shadow-2xl group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                            <History className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">История успеха</h3>
                            <p className="text-white/30 text-sm font-medium leading-relaxed max-w-sm">Отслеживайте каждый шаг своего прогресса. Ваша история обучения сохраняется навсегда.</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

