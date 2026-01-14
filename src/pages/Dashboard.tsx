import { useEffect, useRef, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { ProjectCreationChat } from '@/components/project/ProjectCreationChat'
import { AIAvatar } from '@/components/ui/AIAvatar'
import {
    Sparkles,
    FolderKanban,
    BookOpen,
    TrendingUp,
    Bot,
    Crown,
    ArrowUpRight,
    Zap,
    Target
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatDaysRemaining, getPlanDisplayName } from '@/utils/subscriptionUtils'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { RealisticEarthGlobe } from '@/components/earth/RealisticEarthGlobe'
export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [studentCount, setStudentCount] = useState(0)

    const recentProjects = projects.slice(-3).reverse()

    // Cities with student data - Kazakhstan cities (for Earth visualization)
    const cities = [
        { name: 'Aktau', lat: 43.65, lon: 51.2, color: '#fbbf24' },
        { name: 'Almaty', lat: 43.25, lon: 76.95, color: '#22c55e' },
        { name: 'Astana', lat: 51.17, lon: 71.47, color: '#3b82f6' },
    ]

    // Animated student counter
    useEffect(() => {
        const target = 243
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setStudentCount(target)
                clearInterval(timer)
            } else {
                setStudentCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-full py-2 space-y-10">
            <ScrollReveal animation="fade">
                {/* HERO AREA */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] shadow-2xl border border-white/20">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000"></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 lg:p-16">
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/25 shadow-xl">
                                    <Zap className="w-4 h-4 text-yellow-300 fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">System: Optimized</span>
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
                                    Привет, <br />
                                    <span className="bg-gradient-to-r from-yellow-200 via-white to-cyan-200 bg-clip-text text-transparent italic">
                                        {user?.name || user?.displayName || user?.email?.split('@')[0] || 'Explorer'}
                                    </span>
                                </h1>
                                <p className="text-xl text-indigo-100/90 font-medium max-w-md leading-relaxed">
                                    Добро пожаловать в командный центр твоего успеха.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-5">
                                <div className="glass-card px-8 py-5 rounded-[2rem] border border-white/30 shadow-2xl group transition-all">
                                    <p className="text-[10px] font-black uppercase text-indigo-200/60 mb-1 tracking-[0.2em]">Active Students</p>
                                    <div className="text-4xl font-black text-white flex items-center gap-3">
                                        <AnimatedCounter end={studentCount} />
                                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_15px_#4ade80]"></div>
                                    </div>
                                </div>

                                {user?.subscriptionPlan && (
                                    <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-amber-400/40 shadow-2xl group hover:scale-105 transition-all">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Crown className="w-4 h-4 text-amber-400" />
                                            <p className="text-[10px] font-black uppercase text-amber-200 tracking-[0.2em]">{getPlanDisplayName(user.subscriptionPlan)}</p>
                                        </div>
                                        <div className="text-2xl font-black text-white">
                                            {formatDaysRemaining(user.subscriptionDaysRemaining ?? 0)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
                            <div className="relative z-10">
                                <RealisticEarthGlobe />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* AI & STATS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ScrollReveal animation="slide-left" delay={200} className="lg:col-span-2">
                    <div className="glass-premium h-full rounded-[2.5rem] overflow-hidden border border-white/60 shadow-xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] -z-10"></div>
                        <div className="flex flex-col md:flex-row items-center gap-12 p-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                                <div className="relative z-10 group-hover:scale-110 transition-transform duration-700">
                                    <AIAvatar size={200} state="idle" />
                                </div>
                                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl animate-float-smooth border border-indigo-50">
                                    <Sparkles className="w-8 h-8 text-indigo-600" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-3">
                                    <h2 className="text-4xl font-black text-indigo-950 flex items-center gap-4">
                                        Мита
                                        <span className="text-xl bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full animate-pulse">Online</span>
                                    </h2>
                                    <p className="text-lg text-indigo-900/60 font-medium leading-relaxed">
                                        Твой персональный наставник. Спрашивай о чем угодно — от исправления багов до выбора карьерного пути.
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/ai-assistant')}
                                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-glow hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Консультация с Митой
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation="slide-right" delay={400}>
                    <div className="glass-premium h-full rounded-[2.5rem] p-5 flex flex-col gap-5">
                        <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex items-center justify-between text-white">
                                <div className="space-y-1">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Success Rate</p>
                                    <p className="text-5xl font-black">
                                        <AnimatedCounter end={98} suffix="%" />
                                    </p>
                                </div>
                                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-2xl border border-white/20">
                                    <Target className="w-10 h-10" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 gap-5">
                            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-7 border border-white/60 hover:bg-white transition-all cursor-pointer group" onClick={() => navigate('/progress')}>
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-2xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform border border-cyan-100">
                                        <TrendingUp className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">XP Points</p>
                                        <p className="text-2xl font-black text-indigo-950">12,450</p>
                                    </div>
                                    <ArrowUpRight className="w-6 h-6 text-indigo-200 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* PROJECT SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ScrollReveal animation="scale" delay={500}>
                    <ProjectCreationChat />
                </ScrollReveal>

                <div className="space-y-10">
                    {recentProjects.length > 0 && (
                        <ScrollReveal animation="fade" delay={600}>
                            <div className="glass-premium rounded-[3rem] p-12 shadow-2xl border border-white/60">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-3xl font-black text-indigo-950 flex items-center gap-4">
                                        <FolderKanban className="w-8 h-8 text-indigo-600" />
                                        Проекты
                                    </h3>
                                    <button onClick={() => navigate('/projects')} className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-800 transition-colors">Workspace →</button>
                                </div>
                                <div className="space-y-6">
                                    {recentProjects.map((project, idx) => (
                                        <div
                                            key={project.id}
                                            className="group bg-white/40 hover:bg-white p-8 rounded-[2rem] transition-all duration-500 cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-xl flex items-center gap-8"
                                            onClick={() => project.externalUrl && window.open(project.externalUrl, '_blank')}
                                            style={{ animation: 'fade-in-scale 0.5s ease-out forwards', animationDelay: `${idx * 0.15}s` }}
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-50 to-indigo-100 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                                🚀
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-black text-indigo-950 truncate">{project.title}</h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black uppercase text-indigo-600">Active</div>
                                                    <span className="text-xs text-indigo-900/40 font-bold">{project.progress}% completed</span>
                                                </div>
                                                <div className="mt-4 w-full bg-indigo-100/50 rounded-full h-2 overflow-hidden border border-indigo-50/50">
                                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${project.progress}%` }}></div>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-8 h-8 text-indigo-100 group-hover:text-indigo-600 transition-all border border-indigo-50 rounded-full p-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </div>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(30px) saturate(180%);
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                }
                .shadow-glow {
                    box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4);
                }
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    )
}
