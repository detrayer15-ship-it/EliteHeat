import { Crown, Zap, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RankCardProps {
    currentRank: string
    currentXP: number
    nextRankXP: number
    rankIcon?: React.ReactNode
    rankColor?: string
}

const RANK_DATA = {
    'Новичок': { color: 'from-neutral-400 to-neutral-600', icon: '🌱', nextRank: 'Ученик', xpRequired: 1000 },
    'Ученик': { color: 'from-blue-400 to-blue-600', icon: '📚', nextRank: 'Практик', xpRequired: 2500 },
    'Практик': { color: 'from-purple-400 to-purple-600', icon: '⚡', nextRank: 'Мастер', xpRequired: 5000 },
    'Мастер': { color: 'from-orange-400 to-orange-600', icon: '🔥', nextRank: 'Эксперт', xpRequired: 10000 },
    'Эксперт': { color: 'from-red-400 to-red-600', icon: '💎', nextRank: 'Легенда', xpRequired: 20000 },
    'Легенда': { color: 'from-yellow-400 to-yellow-600', icon: '👑', nextRank: 'Максимум', xpRequired: 50000 },
}

export const RankCard = ({ currentRank, currentXP, nextRankXP, rankIcon, rankColor }: RankCardProps) => {
    const [progress, setProgress] = useState(0)
    const [isLevelingUp, setIsLevelingUp] = useState(false)

    const rankInfo = RANK_DATA[currentRank as keyof typeof RANK_DATA] || RANK_DATA['Новичок']
    const progressPercent = Math.min((currentXP / nextRankXP) * 100, 100)

    useEffect(() => {
        // Анимация заполнения прогресс-бара
        const timer = setTimeout(() => {
            setProgress(progressPercent)
        }, 100)
        return () => clearTimeout(timer)
    }, [progressPercent])

    const handleLevelUp = () => {
        setIsLevelingUp(true)
        setTimeout(() => setIsLevelingUp(false), 600)
    }

    return (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-neutral-100 relative overflow-hidden group hover:shadow-xl transition-all">
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rankInfo.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rankInfo.color} flex items-center justify-center text-3xl shadow-lg ${isLevelingUp ? 'animate-level-up' : ''}`}>
                            {rankIcon || rankInfo.icon}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Ваш ранг</p>
                            <h3 className="text-2xl font-black text-neutral-900">{currentRank}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Опыт</p>
                        <p className="text-2xl font-black text-primary-600">{currentXP.toLocaleString()}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-neutral-600">Прогресс до {rankInfo.nextRank}</span>
                        <span className="font-black text-primary-600">{Math.round(progressPercent)}%</span>
                    </div>

                    <div className="relative h-4 bg-neutral-100 rounded-full overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-30" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)'
                        }}></div>

                        {/* Progress Fill */}
                        <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${rankInfo.color} rounded-full transition-all duration-1000 ease-out shadow-glow`}
                            style={{ width: `${progress}%` }}
                        >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                        <span>{currentXP.toLocaleString()} XP</span>
                        <span>{nextRankXP.toLocaleString()} XP</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-100">
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-5 h-5 text-success-600" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Уровень</p>
                        <p className="text-lg font-black text-neutral-900">12</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center mx-auto mb-2">
                            <Zap className="w-5 h-5 text-warning-600" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Streak</p>
                        <p className="text-lg font-black text-neutral-900">7 дней</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-2">
                            <Crown className="w-5 h-5 text-primary-600" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Место</p>
                        <p className="text-lg font-black text-neutral-900">#24</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    )
}
