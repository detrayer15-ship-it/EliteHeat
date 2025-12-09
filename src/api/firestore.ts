import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Admin API
export const adminAPI = {
    // Get admin stats
    getStats: async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId))
            if (!userDoc.exists()) {
                throw new Error('User not found')
            }

            const userData = userDoc.data()

            // Get all users count
            const usersSnapshot = await getDocs(collection(db, 'users'))
            const totalUsers = usersSnapshot.size

            const students = usersSnapshot.docs.filter(doc => doc.data().role === 'student').length
            const admins = usersSnapshot.docs.filter(doc => doc.data().role === 'admin').length

            return {
                success: true,
                data: {
                    level: userData.level || 1,
                    points: userData.points || 0,
                    tasksReviewed: userData.tasksReviewed || 0,
                    totalUsers,
                    students,
                    admins
                }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Get all users
    getUsers: async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'))
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            return {
                success: true,
                data: users
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Add points to admin
    addPoints: async (userId: string, points: number) => {
        try {
            const userRef = doc(db, 'users', userId)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                throw new Error('User not found')
            }

            const currentPoints = userDoc.data().points || 0
            const newPoints = currentPoints + points

            // Calculate level based on points
            let level = 1
            if (newPoints >= 1000) level = 5
            else if (newPoints >= 600) level = 4
            else if (newPoints >= 300) level = 3
            else if (newPoints >= 100) level = 2

            await updateDoc(userRef, {
                points: newPoints,
                level
            })

            return {
                success: true,
                data: { points: newPoints, level }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

// Submissions API
export const submissionsAPI = {
    // Create submission
    create: async (studentId: string, taskTitle: string, description: string, fileUrl?: string) => {
        try {
            const submissionRef = doc(collection(db, 'submissions'))
            await setDoc(submissionRef, {
                studentId,
                taskTitle,
                description,
                fileUrl: fileUrl || null,
                status: 'pending',
                reviewedBy: null,
                reviewComment: null,
                createdAt: Timestamp.now()
            })

            return {
                success: true,
                data: { id: submissionRef.id }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Get all submissions (admin)
    getAll: async () => {
        try {
            const submissionsSnapshot = await getDocs(
                query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))
            )

            const submissions = await Promise.all(
                submissionsSnapshot.docs.map(async (docSnapshot) => {
                    const data = docSnapshot.data()

                    // Get student info
                    const studentDoc = await getDoc(doc(db, 'users', data.studentId))
                    const studentData = studentDoc.data()

                    return {
                        id: docSnapshot.id,
                        ...data,
                        student: {
                            name: studentData?.name,
                            email: studentData?.email
                        }
                    }
                })
            )

            return {
                success: true,
                data: submissions
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Review submission
    review: async (submissionId: string, adminId: string, status: 'approved' | 'rejected', comment: string) => {
        try {
            const submissionRef = doc(db, 'submissions', submissionId)

            await updateDoc(submissionRef, {
                status,
                reviewedBy: adminId,
                reviewComment: comment,
                reviewedAt: Timestamp.now()
            })

            // Add points to admin
            const points = status === 'approved' ? 10 : 5
            await adminAPI.addPoints(adminId, points)

            return {
                success: true
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

// Chats API
export const chatsAPI = {
    // Get or create chat
    getOrCreate: async (studentId: string, adminId: string) => {
        try {
            // Try to find existing chat
            const chatsSnapshot = await getDocs(
                query(
                    collection(db, 'chats'),
                    where('studentId', '==', studentId),
                    where('adminId', '==', adminId)
                )
            )

            if (!chatsSnapshot.empty) {
                const chatDoc = chatsSnapshot.docs[0]
                return {
                    success: true,
                    data: {
                        id: chatDoc.id,
                        ...chatDoc.data()
                    }
                }
            }

            // Create new chat
            const chatRef = doc(collection(db, 'chats'))
            await setDoc(chatRef, {
                studentId,
                adminId,
                messages: [],
                createdAt: Timestamp.now(),
                lastMessageAt: Timestamp.now()
            })

            return {
                success: true,
                data: {
                    id: chatRef.id,
                    studentId,
                    adminId,
                    messages: []
                }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Send message
    sendMessage: async (chatId: string, senderId: string, text: string) => {
        try {
            const chatRef = doc(db, 'chats', chatId)
            const chatDoc = await getDoc(chatRef)

            if (!chatDoc.exists()) {
                throw new Error('Chat not found')
            }

            const messages = chatDoc.data().messages || []
            messages.push({
                senderId,
                text,
                timestamp: Timestamp.now(),
                read: false
            })

            await updateDoc(chatRef, {
                messages,
                lastMessageAt: Timestamp.now()
            })

            return {
                success: true
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}
