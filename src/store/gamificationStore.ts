import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { achievementsAPI, UserAchievement } from '@/api/achievements'
import { useAuthStore } from './authStore'

interface GamificationState {
    achievements: UserAchievement[]
    totalPoints: number
    isLoading: boolean
    lastUnlocked: UserAchievement | null

    // Actions
    fetchAchievements: (userId: string) => Promise<void>
    updateProgress: (achievementId: string, currentProgress: number, maxProgress: number) => Promise<void>
    unlockAchievement: (achievementId: string) => Promise<void>
    getAchievement: (id: string) => UserAchievement | undefined
    clearLastUnlocked: () => void
}

const DEFAULT_ACHIEVEMENTS: UserAchievement[] = [
    {
        id: 'first-login',
        title: 'Первое касание',
        description: 'Ваш первый вход в систему EliteHeat',
        icon: '⚡',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
        rarity: 'common'
    },
    {
        id: 'chat-explorer',
        title: 'Собеседник ИИ',
        description: 'Задайте 5 вопросов ИИ-наставнику',
        icon: '💬',
        isUnlocked: false,
        progress: 0,
        maxProgress: 5,
        rarity: 'common'
    },
    {
        id: 'project-creator',
        title: 'Архитектор будущего',
        description: 'Создайте свой первый учебный проект',
        icon: '🚀',
        isUnlocked: false,
        progress: 0,
        maxProgress: 1,
        rarity: 'rare'
    }
]

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            achievements: DEFAULT_ACHIEVEMENTS,
            totalPoints: 0,
            isLoading: false,
            lastUnlocked: null,

            fetchAchievements: async (userId: string) => {
                set({ isLoading: true })
                const serverAchievements = await achievementsAPI.getUserAchievements(userId)

                const merged = DEFAULT_ACHIEVEMENTS.map(def => {
                    const server = serverAchievements.find(s => s.id === def.id)
                    return server ? { ...def, ...server } : def
                })

                set({ achievements: merged, isLoading: false })
            },

            updateProgress: async (achievementId: string, currentProgress: number, maxProgress: number) => {
                const user = useAuthStore.getState().user
                if (!user) return

                const achBefore = get().achievements.find(a => a.id === achievementId)

                await achievementsAPI.updateAchievementProgress(user.id, achievementId, currentProgress, maxProgress)

                const isNowUnlocked = currentProgress >= maxProgress
                const newlyUnlocked = isNowUnlocked && (!achBefore || !achBefore.isUnlocked)

                const achievements = get().achievements.map(a =>
                    a.id === achievementId
                        ? { ...a, progress: currentProgress, isUnlocked: isNowUnlocked, unlockedAt: isNowUnlocked ? new Date() : undefined }
                        : a
                )

                set({
                    achievements,
                    lastUnlocked: newlyUnlocked ? achievements.find(a => a.id === achievementId) || null : get().lastUnlocked
                })
            },

            unlockAchievement: async (achievementId: string) => {
                const ach = get().achievements.find(a => a.id === achievementId)
                if (ach && !ach.isUnlocked) {
                    await get().updateProgress(achievementId, ach.maxProgress, ach.maxProgress)
                }
            },

            getAchievement: (id: string) => {
                return get().achievements.find(a => a.id === id)
            },

            clearLastUnlocked: () => {
                set({ lastUnlocked: null })
            }
        }),
        {
            name: 'gamification-storage'
        }
    )
)
