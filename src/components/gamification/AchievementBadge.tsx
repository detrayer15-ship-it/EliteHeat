import { Check, Lock } from 'lucide-react'
import { useState } from 'react'

interface AchievementBadgeProps {
    id: string
    title: string
    description: string
    icon: string
    isUnlocked: boolean
    progress?: number
    maxProgress?: number
    rarity?: 'common' | 'rare' | 'epic' | 'legendary'
    unlockedAt?: Date
}

const RARITY_STYLES = {
    common: {
        gradient: 'from-neutral-400 to-neutral-600',
        glow: 'shadow-neutral-500/20',
        border: 'border-neutral-300',
    },
    rare: {
        gradient: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-500/30',
        border: 'border-blue-300',
    },
    epic: {
        gradient: 'from-purple-400 to-purple-600',
        glow: 'shadow-purple-500/40',
        border: 'border-purple-300',
    },
    legendary: {
        gradient: 'from-yellow-400 to-orange-600',
        glow: 'shadow-yellow-500/50',
        border: 'border-yellow-300',
    },
}

export const AchievementBadge = ({
    title,
    description,
    icon,
    isUnlocked,
    progress = 0,
    maxProgress = 100,
    rarity = 'common',
    unlockedAt,
}: AchievementBadgeProps) => {
    const [isAnimating, setIsAnimating] = useState(false)
    const styles = RARITY_STYLES[rarity]
    const progressPercent = maxProgress > 0 ? (progress / maxProgress) * 100 : 0

    const handleUnlock = () => {
        if (isUnlocked) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 800)
        }
    }

    return (
        <div
            className={`relative group cursor-pointer transition-all duration-300 ${isUnlocked ? 'hover:scale-105' : 'opacity-60'
                }`}
            onClick={handleUnlock}
        >
            {/* Card Container */}
            <div
                className={`bg-white rounded-2xl p-6 border-2 ${isUnlocked ? styles.border : 'border-neutral-200'
                    } ${isUnlocked ? styles.glow : ''} ${isUnlocked ? 'shadow-lg' : 'shadow-sm'
                    } transition-all overflow-hidden`}
            >
                {/* Background Pattern for Unlocked */}
                {isUnlocked && (
                    <div className="absolute inset-0 opacity-5">
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`}
                        ></div>
                    </div>
                )}

                {/* Unlock Animation Overlay */}
                {isAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 animate-achievement-unlock z-20"></div>
                )}

                <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${isUnlocked
                                    ? `bg-gradient-to-br ${styles.gradient} shadow-lg ${isAnimating ? 'animate-achievement-unlock' : ''}`
                                    : 'bg-neutral-100'
                                } transition-all`}
                        >
                            {isUnlocked ? icon : <Lock className="w-8 h-8 text-neutral-400" />}
                        </div>

                        {/* Rarity Badge */}
                        {isUnlocked && (
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r ${styles.gradient} text-white shadow-md`}
                            >
                                {rarity}
                            </div>
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="mb-4">
                        <h4 className="text-lg font-black text-neutral-900 mb-1">
                            {isUnlocked ? title : '???'}
                        </h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            {isUnlocked ? description : 'Достижение заблокировано'}
                        </p>
                    </div>

                    {/* Progress Bar (if not fully unlocked) */}
                    {!isUnlocked && maxProgress > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                                <span>Прогресс</span>
                                <span>
                                    {progress} / {maxProgress}
                                </span>
                            </div>
                            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${styles.gradient} transition-all duration-500`}
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Unlocked Status */}
                    {isUnlocked && (
                        <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                            <div className="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-neutral-600">
                                {unlockedAt
                                    ? `Разблокировано ${new Date(unlockedAt).toLocaleDateString('ru-RU')}`
                                    : 'Разблокировано'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Glow Effect on Hover (Unlocked Only) */}
                {isUnlocked && (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}
                    ></div>
                )}
            </div>

            {/* Floating Sparkles for Legendary */}
            {isUnlocked && rarity === 'legendary' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-badge-glow"></div>
            )}
        </div>
    )
}
