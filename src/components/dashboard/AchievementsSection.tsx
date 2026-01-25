import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AchievementBadge } from '@/components/gamification/AchievementBadge'

import { useGamificationStore } from '@/store/gamificationStore'

export const AchievementsSection = () => {
    const navigate = useNavigate()
    const { achievements, isLoading } = useGamificationStore()

    if (isLoading) {
        return (
            <div className="dashboard-card animate-pulse h-48 flex items-center justify-center">
                <Crown className="w-8 h-8 text-slate-200" />
            </div>
        )
    }

    return (
        <div className="dashboard-card">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                    <Crown className="w-6 h-6 text-warning-600" />
                    Достижения
                </h3>
                <button
                    onClick={() => navigate('/achievements')}
                    className="text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-800 transition-colors"
                >
                    Все →
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.slice(0, 3).map((achievement) => (
                    <AchievementBadge key={achievement.id} {...achievement} />
                ))}
            </div>
        </div>
    )
}
