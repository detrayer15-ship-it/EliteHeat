import { db } from '@/config/firebase'
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    onSnapshot
} from 'firebase/firestore'

export interface Appeal {
    id?: string
    studentId: string
    studentName: string
    message: string
    status: 'open' | 'in-progress' | 'resolved'
    createdAt: Date
    respondedBy?: string
    response?: string
    respondedAt?: Date
}

/**
 * Create a new appeal from student to mentors
 */
export const createAppeal = async (
    studentId: string,
    studentName: string,
    message: string
): Promise<{ success: boolean; appealId?: string; message?: string }> => {
    try {
        const appealData = {
            studentId,
            studentName,
            message,
            status: 'open',
            createdAt: Timestamp.now()
        }

        const docRef = await addDoc(collection(db, 'appeals'), appealData)

        return {
            success: true,
            appealId: docRef.id
        }
    } catch (error) {
        console.error('Error creating appeal:', error)
        return {
            success: false,
            message: 'Не удалось создать обращение'
        }
    }
}

/**
 * Get all appeals (for admins)
 */
export const getAllAppeals = async (): Promise<Appeal[]> => {
    try {
        const q = query(
            collection(db, 'appeals'),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            respondedAt: doc.data().respondedAt?.toDate()
        })) as Appeal[]
    } catch (error) {
        console.error('Error getting appeals:', error)
        return []
    }
}

/**
 * Get appeals by student ID
 */
export const getStudentAppeals = async (studentId: string): Promise<Appeal[]> => {
    try {
        const q = query(
            collection(db, 'appeals'),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            respondedAt: doc.data().respondedAt?.toDate()
        })) as Appeal[]
    } catch (error) {
        console.error('Error getting student appeals:', error)
        return []
    }
}

/**
 * Respond to an appeal (admin/teacher)
 */
export const respondToAppeal = async (
    appealId: string,
    response: string,
    respondedBy: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const appealRef = doc(db, 'appeals', appealId)

        await updateDoc(appealRef, {
            response,
            respondedBy,
            respondedAt: Timestamp.now(),
            status: 'resolved'
        })

        return { success: true }
    } catch (error) {
        console.error('Error responding to appeal:', error)
        return {
            success: false,
            message: 'Не удалось отправить ответ'
        }
    }
}

/**
 * Update appeal status
 */
export const updateAppealStatus = async (
    appealId: string,
    status: 'open' | 'in-progress' | 'resolved'
): Promise<{ success: boolean; message?: string }> => {
    try {
        const appealRef = doc(db, 'appeals', appealId)

        await updateDoc(appealRef, {
            status
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating appeal status:', error)
        return {
            success: false,
            message: 'Не удалось обновить статус'
        }
    }
}

/**
 * Subscribe to appeals updates (real-time)
 */
export const subscribeToAppeals = (
    callback: (appeals: Appeal[]) => void
): (() => void) => {
    const q = query(
        collection(db, 'appeals'),
        orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const appeals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            respondedAt: doc.data().respondedAt?.toDate()
        })) as Appeal[]

        callback(appeals)
    })

    return unsubscribe
}
