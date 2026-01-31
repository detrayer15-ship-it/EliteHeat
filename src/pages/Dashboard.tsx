import { useEffect, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { ProjectCreationChat } from '@/components/project/ProjectCreationChat'
import {
    Sparkles,
    FolderKanban,
    TrendingUp,
    Code,
    Bot,
    BookOpen,
    Trophy,
    ArrowRight,
    Zap,
    Target
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { ScrollReveal } from '@/components/ScrollReveal'
import { RankCard } from '@/components/dashboard/RankCard'
import { RankBuff } from '@/components/dashboard/RankBuff'
import { useGamificationStore } from '@/store/gamificationStore'
import { AIRecommendationCard } from '@/components/dashboard/AIRecommendationCard'
import { DashboardRightSidebar } from '@/components/dashboard/DashboardRightSidebar'
import { LevelUpModal } from '@/components/gamification/LevelUpModal'
import { getRankByPoints, getNextRank, defaultRanks } from '@/utils/ranks'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)

    const { totalPoints, fetchAchievements, unlockAchievement, getAchievement } = useGamificationStore()

    const [showLevelUp, setShowLevelUp] = useState(false)
    const [prevPoints, setPrevPoints] = useState(totalPoints)

    const currentRank = getRankByPoints(totalPoints)
    const nextRank = getNextRank(totalPoints)

    useEffect(() => {
        if (totalPoints > prevPoints) {
            const oldRank = getRankByPoints(prevPoints)
            if (currentRank.id !== oldRank.id) {
                setShowLevelUp(true)
            }
            setPrevPoints(totalPoints)
        }
    }, [totalPoints, prevPoints, currentRank.id])

    useEffect(() => {
        if (user?.id) {
            fetchAchievements(user.id).then(() => {
                const firstLoginAch = getAchievement('first-login')
                if (firstLoginAch && !firstLoginAch.isUnlocked) {
                    unlockAchievement('first-login')
                }
            })
        }
    }, [user?.id, fetchAchievements, unlockAchievement, getAchievement])

    // Quick Actions
    const quickActions = [
        {
            icon: Bot,
            label: 'AI Ассистент',
            desc: 'Спросить Миту',
            path: '/ai-assistant',
            color: 'from-indigo-500 to-blue-600',
            iconColor: 'text-indigo-500'
        },
        {
            icon: BookOpen,
            label: 'Уроки',
            desc: 'Продолжить обучение',
            path: '/tasks',
            color: 'from-emerald-500 to-teal-600',
            iconColor: 'text-emerald-500'
        },
        {
            icon: FolderKanban,
            label: 'Проекты',
            desc: 'Мои проекты',
            path: '/projects',
            color: 'from-orange-500 to-amber-600',
            iconColor: 'text-orange-500'
        },
        {
            icon: TrendingUp,
            label: 'Прогресс',
            desc: 'Статистика',
            path: '/progress',
            color: 'from-purple-500 to-pink-600',
            iconColor: 'text-purple-500'
        },
    ]

    return (
        <div className="min-h-full py-4 space-y-8 relative">
            {/* Welcome Header */}
            <ScrollReveal animation="fade">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Welcome text */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-white">
                                    Привет, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                                        {user?.name || user?.displayName || user?.email?.split('@')[0] || 'Студент'}
                                    </span>! 👋
                                </h1>
                                <p className="text-white/50 text-sm max-w-md">
                                    Готовы к новым достижениям? Ваш прогресс впечатляет!
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 min-w-[100px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase">XP</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{totalPoints}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 min-w-[100px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trophy className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase">Ранг</span>
                                    </div>
                                    <p className="text-lg font-black text-white flex items-center gap-2">
                                        <span>{currentRank.icon}</span>
                                        <span className="text-sm">{currentRank.name}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Quick Actions */}
            <ScrollReveal animation="slide-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 text-left"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{action.label}</h3>
                            <p className="text-xs text-slate-400">{action.desc}</p>
                        </button>
                    ))}
                </div>
            </ScrollReveal>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Card */}
                    <ScrollReveal animation="slide-up">
                        <AIRecommendationCard />
                    </ScrollReveal>

                    {/* Projects */}
                    <ScrollReveal animation="fade">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <FolderKanban className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Мои проекты</h3>
                                        <p className="text-xs text-slate-400">{projects.length} проектов</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/projects')}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Все <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {projects.length > 0 ? (
                                <div className="space-y-3">
                                    {projects.slice(0, 3).map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <Code className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-900 truncate">{project.title}</h4>
                                                <p className="text-xs text-slate-400">{project.category || 'Проект'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500">{project.progress}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <FolderKanban className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 mb-4">У вас пока нет проектов</p>
                                    <button
                                        onClick={() => navigate('/projects')}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Создать проект
                                    </button>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Rank Progress */}
                    <ScrollReveal animation="slide-up">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <RankBuff />
                        </div>
                    </ScrollReveal>
                </div>

                {/* Right Column - 1/3 */}
                <div className="space-y-8">
                    <DashboardRightSidebar />
                    <ScrollReveal animation="slide-right">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-white">
                            <RankCard
                                currentRank={currentRank.name}
                                currentXP={totalPoints}
                                nextRankXP={nextRank?.minPoints || totalPoints}
                                rankIcon={currentRank.icon}
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <LevelUpModal
                isOpen={showLevelUp}
                onClose={() => setShowLevelUp(false)}
                level={defaultRanks.indexOf(currentRank) + 1}
                rankName={currentRank.name}
                rankIcon={currentRank.icon}
            />

            <ProjectCreationChat />
        </div>
    )
}

export default Dashboard
