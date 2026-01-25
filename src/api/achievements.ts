import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    Timestamp,
    increment
} from 'firebase/firestore'
import { db } from '@/config/firebase'

export interface UserAchievement {
    id: string
    title: string
    description: string
    icon: string
    isUnlocked: boolean
    progress: number
    maxProgress: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlockedAt?: Date
}

export const achievementsAPI = {
    // Get all achievements for a user
    getUserAchievements: async (userId: string) => {
        try {
            const achievementsRef = collection(db, 'users', userId, 'achievements')
            const snapshot = await getDocs(achievementsRef)

            return snapshot.docs.map(doc => ({
                ...doc.data(),
                unlockedAt: doc.data().unlockedAt?.toDate()
            })) as UserAchievement[]
        } catch (error) {
            console.error('Error fetching achievements:', error)
            return []
        }
    },

    // Update achievement progress or unlock
    updateAchievementProgress: async (userId: string, achievementId: string, progress: number, maxProgress: number) => {
        try {
            const achievementRef = doc(db, 'users', userId, 'achievements', achievementId)
            const achievementDoc = await getDoc(achievementRef)

            const isUnlocked = progress >= maxProgress
            const now = Timestamp.now()

            const data: any = {
                progress,
                maxProgress,
                updatedAt: now
            }

            if (isUnlocked && (!achievementDoc.exists() || !achievementDoc.data()?.isUnlocked)) {
                data.isUnlocked = true
                data.unlockedAt = now

                // Also increment user points if we want to tie achievements to rank
                const userRef = doc(db, 'users', userId)
                await updateDoc(userRef, {
                    points: increment(100) // Default 100 points for achievement
                })
            }

            await setDoc(achievementRef, data, { merge: true })
            return { success: true }
        } catch (error) {
            console.error('Error updating achievement:', error)
            return { success: false }
        }
    }
}
