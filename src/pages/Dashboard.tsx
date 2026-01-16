import { useEffect, useRef, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
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
    Target,
    ChevronRight,
    Search,
    Globe
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatDaysRemaining, getPlanDisplayName } from '@/utils/subscriptionUtils'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { RealisticEarthGlobe } from '@/components/earth/RealisticEarthGlobe'
import { SocialPulseFeed } from '@/components/dashboard/SocialPulseFeed'
import { CommandCenter } from '@/components/dashboard/CommandCenter'
import { AIPathSuggest } from '@/components/dashboard/AIPathSuggest'
import { PortfolioWidget } from '@/components/dashboard/PortfolioWidget'
import { RankBuff } from '@/components/dashboard/RankBuff'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)
    const [studentCount, setStudentCount] = useState(0)

    const recentProjects = projects.slice(-3).reverse()

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
        <div className="min-h-full py-2 space-y-10 bg-[#f8fafc] relative overflow-hidden">
            {/* Subtle Aesthetic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-white pointer-events-none"></div>
            <div className="absolute top-[500px] left-[-10%] w-[40%] h-[400px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-[-5%] w-[30%] h-[300px] bg-orange-50/30 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 space-y-10">
                {/* 1. HERO SECTION - Welcome + Earth Globe */}
                <ScrollReveal animation="fade">
                    <div className="hero-container bg-[#0a0a0c] border border-white/5 shadow-2xl mt-6">
                        {/* Cinematic Atmospheric Effects */}
                        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>
                        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px]"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] mix-blend-overlay"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-16">
                            <div className="space-y-6 animate-slide-up">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
                                        <Zap className="w-3 h-3 text-orange-500 fill-current" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">EliteHeat Hub v2.5</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                                        {t('welcome')}, <br />
                                        <span className="bg-gradient-to-r from-orange-500 via-blue-400 to-orange-500 bg-clip-text text-transparent italic">
                                            {user?.name || user?.displayName || user?.email?.split('@')[0] || 'Explorer'}
                                        </span>
                                    </h1>
                                    <p className="text-lg text-white/50 font-medium max-w-md leading-relaxed italic">
                                        Твой центр управления обучением и проектами
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 shadow-2xl group transition-all hover:bg-white/10">
                                        <p className="text-[9px] font-black uppercase text-white/30 mb-1 tracking-[0.3em]">Активных студентов</p>
                                        <div className="text-3xl font-black text-white flex items-center gap-3">
                                            <AnimatedCounter end={studentCount} />
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                                        </div>
                                    </div>

                                    {user?.subscriptionPlan && (
                                        <div className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/20 shadow-2xl group hover:scale-105 transition-all">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Crown className="w-4 h-4 text-orange-500" />
                                                <p className="text-[9px] font-black uppercase text-orange-500 tracking-[0.3em]">{getPlanDisplayName(user.subscriptionPlan)}</p>
                                            </div>
                                            <div className="text-2xl font-black text-white">
                                                {formatDaysRemaining(user.subscriptionDaysRemaining ?? 0)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex flex-col items-center justify-center lg:items-end">
                                <RealisticEarthGlobe />
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* 2. QUICK ACTIONS - Command Center */}
                <ScrollReveal animation="slide-up" delay={200}>
                    <CommandCenter />
                </ScrollReveal>

                {/* 3. MAIN CONTENT GRID - Content + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Main Content (3/4) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* AI Path Suggestion */}
                        <ScrollReveal animation="slide-up">
                            <AIPathSuggest />
                        </ScrollReveal>

                        {/* Recent Projects */}
                        {recentProjects.length > 0 && (
                            <ScrollReveal animation="fade" delay={100}>
                                <div className="dashboard-card">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <FolderKanban className="w-6 h-6 text-blue-600" />
                                            {t('activeProjects')}
                                        </h3>
                                        <button onClick={() => navigate('/projects')} className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-colors">{t('viewAll')} →</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                                        {recentProjects.map((project, idx) => (
                                            <div key={project.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group/project cursor-pointer flex flex-col gap-4" onClick={() => navigate(`/projects/${project.id}`)}>
                                                <div className="flex items-start justify-between">
                                                    <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center group-hover/project:bg-blue-600 group-hover/project:text-white transition-colors shadow-sm">
                                                        <FolderKanban className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm">
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                        <span className="text-[9px] font-black text-slate-900">{project.progress}%</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-900 text-sm truncate">{project.title}</h4>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{project.stage}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Продолжить</span>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/project:text-blue-600 group-hover/project:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}
                    </div>

                    {/* Sidebar (1/4) */}
                    <div className="lg:col-span-1 sidebar-sticky">
                        <ScrollReveal animation="slide-right">
                            <RankBuff xp={12450} />
                        </ScrollReveal>
                        <ScrollReveal animation="slide-right" delay={100}>
                            <PortfolioWidget />
                        </ScrollReveal>
                        <ScrollReveal animation="slide-right" delay={200}>
                            <SocialPulseFeed />
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            <ProjectCreationChat />

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(30px) saturate(180%);
                }
                .shadow-glow {
                    box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4);
                }
                .shadow-3xl {
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
                }
                .shadow-4xl {
                    box-shadow: 0 70px 140px -30px rgba(0,0,0,0.6);
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.1); }
                }
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-slide-up {
                    animation: fade-in-scale 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    )
}
