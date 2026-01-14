import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { useNavigate } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import {
    Trophy,
    Target,
    CheckCircle2,
    Clock,
    TrendingUp,
    Award,
    Zap,
    Sparkles,
    Calendar,
    Flame,
    BarChart3,
    Activity
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const ProgressTrackerPage = () => {
    const projects = useProjectStore((state) => state.projects)
    const tasks = useTaskStore((state) => state.tasks)
    const navigate = useNavigate()

    // Динамический расчёт навыков
    const skills = useMemo(() => {
        const pythonLessons = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')
        const figmaLessons = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')

        const pythonCompleted = Object.values(pythonLessons).filter(Boolean).length
        const pythonProgress = Math.round((pythonCompleted / 15) * 100)

        const figmaCompleted = Object.values(figmaLessons).filter(Boolean).length
        const figmaProgress = Math.round((figmaCompleted / 17) * 100)

        const completedProjectTasks = tasks.filter(t => t.completed).length
        const totalProjectTasks = tasks.length
        const dataWorkProgress = totalProjectTasks > 0
            ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
            : 0

        return [
            { name: 'Python Engineering', level: pythonProgress, icon: '🐍', color: 'from-blue-500 to-indigo-600', xp: pythonCompleted * 150 },
            { name: 'Visual Design', level: figmaProgress, icon: '🎨', color: 'from-purple-500 to-pink-600', xp: figmaCompleted * 200 },
            { name: 'Data Management', level: dataWorkProgress, icon: '📊', color: 'from-emerald-400 to-teal-600', xp: completedProjectTasks * 100 },
        ]
    }, [tasks])

    // Статистика
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.stage === 'completed' || p.status === 'completed').length
    const inProgressProjects = totalProjects - completedProjects

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Задачи с дедлайнами
    const tasksWithDeadlines = tasks.filter(t => t.deadline && !t.completed)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdueTasks = tasksWithDeadlines.filter(t => {
        const deadline = new Date(t.deadline!)
        deadline.setHours(0, 0, 0, 0)
        return deadline < today
    })

    const upcomingTasks = tasksWithDeadlines.filter(t => {
        const deadline = new Date(t.deadline!)
        deadline.setHours(0, 0, 0, 0)
        const threeDaysFromNow = new Date(today)
        threeDaysFromNow.setDate(today.getDate() + 3)
        return deadline >= today && deadline <= threeDaysFromNow
    })

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline)
        const diffTime = date.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return `Просрочено на ${Math.abs(diffDays)} дн.`
        if (diffDays === 0) return 'Сегодня'
        if (diffDays === 1) return 'Завтра'
        return `Через ${diffDays} дн.`
    }

    const getSkillLevel = (level: number) => {
        if (level >= 80) return { text: 'Expert', color: 'text-emerald-500' }
        if (level >= 60) return { text: 'Advanced', color: 'text-blue-500' }
        if (level >= 40) return { text: 'Intermediate', color: 'text-purple-500' }
        return { text: 'Novice', color: 'text-indigo-400/60' }
    }

    return (
        <div className="min-h-full py-2 space-y-12 group/page">
            <ScrollReveal animation="fade">
                {/* HERO HUB */}
                <div className="relative overflow-hidden bg-[#0a0a0c] rounded-[3rem] p-12 lg:p-20 shadow-3xl">
                    {/* Background Energy */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow animation-delay-3000"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                            <Activity className="w-[800px] h-[800px] text-white" />
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Performance • Analytics Engine</span>
                                </div>
                                <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
                                    Статистика <br />
                                    <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Успеха</span>
                                </h1>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-white/40">
                                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <Target className="w-4 h-4" /> Global Completion
                                    </span>
                                    <span className="text-2xl font-black text-white italic">
                                        <AnimatedCounter end={overallProgress} suffix="%" />
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                                        style={{ width: `${overallProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-white/30 italic">Выполнил {completedTasks} из {totalTasks} поставленных целей за этот период.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { count: completedProjects, label: 'Masters Accomplished', icon: <Trophy />, color: 'text-yellow-500', bg: 'bg-yellow-500/5' },
                                { count: totalTasks, label: 'Task Throughput', icon: <CheckCircle2 />, color: 'text-indigo-400', bg: 'bg-indigo-400/5' },
                                { count: overdueTasks.length, label: 'System Alerts', icon: <Clock />, color: 'text-red-500', bg: 'bg-red-500/5' },
                                { count: upcomingTasks.length, label: 'Peak Deadlines', icon: <Flame />, color: 'text-orange-500', bg: 'bg-orange-500/5' },
                            ].map((stat, idx) => (
                                <div key={idx} className={`${stat.bg} p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group cursor-default`}>
                                    <div className={`${stat.color} mb-4 transform group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                                    <div className="text-4xl font-black text-white mb-1">
                                        <AnimatedCounter end={stat.count} />
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-white/20 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* SKILLS ARCHITECTURE */}
            <div className="space-y-8">
                <ScrollReveal animation="slide-up">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-3xl font-black text-indigo-950 flex items-center gap-4">
                            <Award className="w-8 h-8 text-indigo-600" />
                            Архитектура Навыков
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Sync Active</span>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {skills.map((skill, idx) => {
                        const levelInfo = getSkillLevel(skill.level)
                        return (
                            <ScrollReveal key={skill.name} animation="scale" delay={idx * 150}>
                                <div className="glass-premium p-10 rounded-[3rem] border border-white/60 shadow-xl group hover:scale-[1.05] transition-all duration-700 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${skill.color} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`}></div>

                                    <div className="flex items-start justify-between mb-8">
                                        <div className="p-5 bg-white shadow-xl rounded-3xl border border-indigo-50 text-3xl group-hover:scale-110 transition-transform group-hover:rotate-6">
                                            {skill.icon}
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-black uppercase tracking-widest ${levelInfo.color}`}>{levelInfo.text}</div>
                                            <div className="text-2xl font-black text-indigo-950 italic">Rank #{idx + 1}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight">{skill.name}</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Mastery Level</span>
                                                <span className="text-lg font-black text-indigo-950">{skill.level}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-indigo-50 rounded-full overflow-hidden p-[2px] border border-indigo-100/50">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${skill.level}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-indigo-50/50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase text-indigo-300">Experience Points</span>
                                                <span className="text-sm font-black text-indigo-600">
                                                    <AnimatedCounter end={skill.xp} suffix=" XP" />
                                                </span>
                                            </div>
                                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-400 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>

            {/* CRITICAL ALERTS & SCHEDULE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Upcoming */}
                <ScrollReveal animation="slide-left" delay={400}>
                    <div className="glass-premium p-12 rounded-[3.5rem] border border-white/60 shadow-2xl relative overflow-hidden h-full">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-indigo-950 flex items-center gap-4">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                                Приоритетные
                            </h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Next 72 Hours</span>
                        </div>

                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-6">
                                {upcomingTasks.map((task) => (
                                    <div key={task.id} className="group bg-white/40 hover:bg-white p-8 rounded-[2rem] transition-all duration-500 border border-transparent hover:border-indigo-100 hover:shadow-xl flex items-center gap-8">
                                        <div className="w-16 h-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-orange-500 border border-orange-100 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-indigo-950 uppercase text-xs tracking-tight">{task.category}</h4>
                                            <p className="text-lg font-black text-indigo-900 truncate">{task.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="px-5 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-glow">
                                                {formatDeadline(task.deadline!)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center opacity-30">
                                <div className="text-6xl mb-4">✨</div>
                                <p className="font-bold text-indigo-900">Все чисто! Нет срочных задач.</p>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* Overdue */}
                <ScrollReveal animation="slide-right" delay={600}>
                    <div className="glass-premium p-12 rounded-[3.5rem] border border-white/60 shadow-2xl relative overflow-hidden h-full">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-red-600 flex items-center gap-4">
                                <Zap className="w-8 h-8 fill-current" />
                                Системные Сбои
                            </h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-300">Overdue Protocol</span>
                        </div>

                        {overdueTasks.length > 0 ? (
                            <div className="space-y-6">
                                {overdueTasks.map((task) => (
                                    <div key={task.id} className="group bg-red-50/20 hover:bg-red-50/40 p-8 rounded-[2rem] transition-all duration-500 border border-red-100 shadow-xl flex items-center gap-8 animate-pulse-subtle">
                                        <div className="w-16 h-16 bg-red-100 rounded-[1.5rem] flex items-center justify-center text-red-600 border border-red-200 group-hover:scale-110 transition-transform">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-red-950 uppercase text-xs tracking-tight">{task.category}</h4>
                                            <p className="text-lg font-black text-red-900 truncate">{task.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-200 px-3 py-1 rounded-lg">Critical Delay</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-glow hover:bg-red-700 transition-all">
                                    Исправить все ошибки →
                                </button>
                            </div>
                        ) : (
                            <div className="py-20 text-center opacity-30 text-emerald-600">
                                <div className="text-6xl mb-4">🛡️</div>
                                <p className="font-bold">Все системы работают в штатном режиме.</p>
                            </div>
                        )}
                    </div>
                </ScrollReveal>
            </div>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .shadow-glow {
                    box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4);
                }
                .shadow-3xl {
                    box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.5);
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 3s infinite;
                }
            `}</style>
        </div>
    )
}
