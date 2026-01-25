import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { ProjectCreationChat } from '@/components/project/ProjectCreationChat'
import {
    Sparkles,
    FolderKanban,
    TrendingUp,
    Crown,
    Target,
    ChevronRight,
    Code
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatDaysRemaining, getPlanDisplayName } from '@/utils/subscriptionUtils'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { RealisticEarthGlobe } from '@/components/earth/RealisticEarthGlobe'
import { RankCard } from '@/components/dashboard/RankCard'
import { RankBuff } from '@/components/dashboard/RankBuff'

import { useGamificationStore } from '@/store/gamificationStore'

import { NextStepBlock } from '@/components/dashboard/NextStepBlock'
import { AIRecommendationCard } from '@/components/dashboard/AIRecommendationCard'
import { SkillProgressSection } from '@/components/dashboard/SkillProgressSection'
import { DashboardRightSidebar } from '@/components/dashboard/DashboardRightSidebar'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)
    const [studentCount, setStudentCount] = useState(0)

    const { totalPoints, fetchAchievements, unlockAchievement, getAchievement } = useGamificationStore()

    const recentProjects = projects.slice(-3).reverse()

    useEffect(() => {
        if (user?.id) {
            fetchAchievements(user.id).then(() => {
                const firstLoginAch = getAchievement('first-login')
                if (firstLoginAch && !firstLoginAch.isUnlocked) {
                    unlockAchievement('first-login')
                }
            })
        }

        const targetCount = 243
        const duration = 2000
        const steps = 60
        const increment = targetCount / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= targetCount) {
                setStudentCount(targetCount)
                clearInterval(timer)
            } else {
                setStudentCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [user?.id, fetchAchievements, unlockAchievement, getAchievement])

    return (
        <div className="min-h-full py-2 space-y-10 bg-[#f8fafc] relative overflow-hidden">
            {/* Subtle Aesthetic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-white pointer-events-none"></div>
            <div className="absolute top-[500px] left-[-10%] w-[40%] h-[400px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-[-5%] w-[30%] h-[300px] bg-orange-50/30 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 space-y-10">
                {/* 1. HERO SECTION - Welcome + Earth Globe */}
                <ScrollReveal animation="fade">
                    <div className="hero-container relative bg-[#060608] border border-white/5 shadow-4xl mt-6 overflow-hidden h-[60vh] max-h-[580px] min-h-[450px] flex items-center rounded-[3rem]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[130px] animate-pulse-slow pointer-events-none"></div>
                        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
                            <div className="neural-line" style={{ top: '25%' }}></div>
                            <div className="neural-line" style={{ top: '50%', animationDelay: '2s' }}></div>
                            <div className="neural-line" style={{ top: '75%', animationDelay: '4s' }}></div>
                        </div>
                        <div className="absolute inset-0 bg-[#060608] opacity-50"></div>

                        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 lg:p-[40px_50px]">
                            <div className="space-y-6 animate-slide-up">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 bg-white/[0.03] backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <Sparkles className="w-2.5 h-2.5 text-blue-400 animate-pulse" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-400/80">Neural Matrix v4.0</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-[52px] font-black text-white leading-[1.1] tracking-tighter">
                                        Welcome,<br />
                                        <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400 bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">
                                            {user?.name || user?.displayName || user?.email?.split('@')[0] || 'Explorer'}
                                        </span>
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                        <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
                                            XP: {totalPoints} | Rank: {totalPoints > 10000 ? 'Architect' : 'Practitioner'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-w-sm">
                                    <div className="bg-white/[0.03] backdrop-blur-2xl p-[14px_20px] rounded-3xl border border-white/10 shadow-3xl hover:bg-white/[0.06] transition-all group">
                                        <p className="text-[8px] font-black uppercase text-white/30 mb-1 tracking-widest leading-none">Global Students</p>
                                        <div className="flex items-end justify-between">
                                            <div className="text-2xl font-black text-white tracking-tighter leading-none">
                                                <AnimatedCounter end={studentCount} />
                                            </div>
                                            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <Target className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                    {user?.subscriptionPlan && (
                                        <div className="bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-2xl p-[14px_20px] rounded-3xl border border-orange-500/20 shadow-3xl hover:border-orange-500/40 transition-all">
                                            <p className="text-[8px] font-black uppercase text-orange-500/50 mb-1 tracking-widest leading-none truncate">{getPlanDisplayName(user.subscriptionPlan)} Status</p>
                                            <div className="flex items-end justify-between">
                                                <div className="text-xl font-black text-white leading-none">
                                                    {formatDaysRemaining(user.subscriptionDaysRemaining ?? 0)}
                                                </div>
                                                <Crown className="w-4 h-4 text-orange-500 mb-0.5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex items-center justify-center group scale-90 lg:scale-100">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] scale-75 group-hover:scale-90 transition-transform duration-1000"></div>
                                <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                                    <RealisticEarthGlobe />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* 2. PROACTIVE GUIDANCE - Next Move */}
                <ScrollReveal animation="slide-up">
                    <NextStepBlock />
                </ScrollReveal>

                {/* 3. MAIN DASHBOARD CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
                    {/* Primary Content Track (75%) */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* AI & Skill Progress Row */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            <ScrollReveal animation="slide-up">
                                <AIRecommendationCard />
                            </ScrollReveal>
                            <ScrollReveal animation="slide-up" delay={100}>
                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl h-full flex flex-col justify-center">
                                    <RankBuff />
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Project Showcase (Real Data only) */}
                        <ScrollReveal animation="fade">
                            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                                            <FolderKanban className="w-6 h-6 text-blue-600" />
                                            Активные Проекты
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Проекты в разработке</p>
                                    </div>
                                    <button onClick={() => navigate('/projects')} className="bg-slate-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">Все проекты</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.length > 0 ? projects.map((project) => (
                                        <div key={project.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100/60 hover:bg-white hover:shadow-2xl transition-all duration-500 group/project cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center group-hover/project:bg-blue-600 group-hover/project:text-white transition-all shadow-md">
                                                    <Code className="w-6 h-6" />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-blue-50 text-[9px] font-black uppercase text-blue-600 border border-blue-100">
                                                    {project.progress}%
                                                </div>
                                            </div>
                                            <div className="space-y-2 mb-6">
                                                <h4 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{project.title}</h4>
                                                <p className="text-xs text-slate-400 font-medium line-clamp-2">{project.description || 'Работа над архитектурой решения.'}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                                                {project.techStack ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{project.techStack.frontend}</span>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{project.techStack.backend}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{project.category || 'Standard'} / {project.type || 'App'}</span>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 py-20 text-center space-y-4">
                                            <p className="text-slate-400 font-medium italic">У вас пока нет активных проектов.</p>
                                            <button onClick={() => navigate('/projects')} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Создать проект</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Awareness Sidebar */}
                    <div className="lg:col-span-1 space-y-10 sidebar-sticky">
                        <DashboardRightSidebar />
                        <ScrollReveal animation="slide-right" delay={200}>
                            <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100/50 overflow-hidden bg-white">
                                <RankCard
                                    currentRank="Практик"
                                    currentXP={useGamificationStore.getState().totalPoints}
                                    nextRankXP={15000}
                                />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            <ProjectCreationChat />

            <style>{`
                .hero-container { border-radius: 3rem; overflow: hidden; }
                @media (min-width: 1024px) { .hero-container { border-radius: 4.5rem; } }

                .neural-line {
                    position: absolute;
                    background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.4), transparent);
                    height: 1px;
                    width: 100%;
                    animation: moveLine 8s linear infinite;
                    pointer-events: none;
                    z-index: 5;
                }

                @keyframes moveLine {
                    0% { transform: translateX(-100%) translateY(0); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateX(100%) translateY(0); opacity: 0; }
                }

                .shadow-4xl {
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5), 0 0 60px rgba(79, 70, 229, 0.1);
                }

                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.1); }
                }

                .bg-neuro-glow {
                    background: radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%);
                }

                .animate-slide-up {
                    animation: fade-in-scale 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }

                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95) translateY(30px); filter: blur(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                }
            `}</style>
        </div>
    )
}

export default Dashboard
