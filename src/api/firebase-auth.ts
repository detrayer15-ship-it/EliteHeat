import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

export interface UserData {
    id: string
    email: string
    name: string
    displayName?: string
    city: string
    role: 'student' | 'admin' | 'developer'
    level?: number
    points?: number
    tasksReviewed?: number
    adminPoints?: number
    teacherRank?: number
    photoURL?: string
    username?: string
    phone?: string
    birthday?: string
    bio?: string
    // Subscription fields
    subscriptionPlan?: 'monthly' | 'yearly' | 'lifetime' | 'family'
    subscriptionStartDate?: Date
    subscriptionEndDate?: Date | null
    subscriptionDaysRemaining?: number
    subscriptionStatus?: 'active' | 'expired' | 'cancelled'
    createdAt: Date
}

export const firebaseAuthAPI = {
    // Register new user
    register: async (
        email: string,
        password: string,
        name: string,
        city: string,
        role: 'student' | 'admin' = 'student',
        subscriptionPlan?: 'monthly' | 'yearly' | 'lifetime' | 'family'
    ) => {
        try {
            // Create auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            const now = Timestamp.now()

            // Create user document in Firestore
            const userData: any = {
                id: user.uid,
                email: user.email!,
                name,
                city,
                role,
                createdAt: now
            }

            // Add subscription fields if plan is selected
            if (subscriptionPlan) {
                const { createSubscriptionInfo } = await import('@/utils/subscriptionUtils')
                const subInfo = createSubscriptionInfo(subscriptionPlan, now.toDate())

                userData.subscriptionPlan = subscriptionPlan
                userData.subscriptionStartDate = now
                userData.subscriptionEndDate = subInfo.endDate ? Timestamp.fromDate(subInfo.endDate) : null
                userData.subscriptionDaysRemaining = subInfo.daysRemaining
                userData.subscriptionStatus = subInfo.status
            }

            // Add admin fields only if role is admin
            if (role === 'admin') {
                userData.level = 1
                userData.points = 0
                userData.tasksReviewed = 0
            }

            await setDoc(doc(db, 'users', user.uid), userData)

            return {
                success: true,
                data: {
                    user: userData,
                    token: await user.getIdToken()
                }
            }
        } catch (error: any) {
            console.error('Firebase Registration Error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            let userMessage = 'Ошибка регистрации'

            if (error.code === 'auth/email-already-in-use') {
                userMessage = 'Этот email уже используется'
            } else if (error.code === 'auth/weak-password') {
                userMessage = 'Пароль должен быть минимум 6 символов'
            } else if (error.code === 'auth/invalid-email') {
                userMessage = 'Неверный формат email'
            } else if (error.code === 'auth/operation-not-allowed') {
                userMessage = 'Email/Password авторизация не включена в Firebase Console'
            }

            return {
                success: false,
                message: userMessage
            }
        }
    },

    // Login user
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (!userDoc.exists()) {
                throw new Error('Данные пользователя не найдены')
            }

            const userData = userDoc.data() as UserData

            return {
                success: true,
                data: {
                    user: userData,
                    token: await user.getIdToken()
                }
            }
        } catch (error: any) {
            console.error('Firebase Login Error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            let userMessage = 'Неверный email или пароль'

            // Обработка специфичных ошибок Firebase Auth
            if (error.code === 'auth/invalid-credential') {
                userMessage = 'Неверный email или пароль. Проверьте правильность введенных данных.'
            } else if (error.code === 'auth/user-not-found') {
                userMessage = 'Пользователь с таким email не найден'
            } else if (error.code === 'auth/wrong-password') {
                userMessage = 'Неверный пароль'
            } else if (error.code === 'auth/invalid-email') {
                userMessage = 'Неверный формат email'
            } else if (error.code === 'auth/user-disabled') {
                userMessage = 'Этот аккаунт был заблокирован'
            } else if (error.code === 'auth/too-many-requests') {
                userMessage = 'Слишком много попыток входа. Попробуйте позже.'
            } else if (error.code === 'auth/network-request-failed') {
                userMessage = 'Ошибка сети. Проверьте подключение к интернету.'
            }

            return {
                success: false,
                message: userMessage
            }
        }
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth)
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Get current user
    getMe: async () => {
        try {
            const user = auth.currentUser
            if (!user) {
                throw new Error('Не авторизован')
            }

            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (!userDoc.exists()) {
                throw new Error('Данные пользователя не найдены')
            }

            return {
                success: true,
                data: userDoc.data() as UserData
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.message
            }
        }
    },

    // Google Sign-In
    signInWithGoogle: async () => {
        try {
            const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
            const provider = new GoogleAuthProvider()
            provider.addScope('profile')
            provider.addScope('email')

            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (!userDoc.exists()) {
                // Create new user document
                const now = Timestamp.now()
                const userData: UserData = {
                    id: user.uid,
                    email: user.email!,
                    name: user.displayName || 'Пользователь',
                    city: 'Не указан',
                    role: 'student' as const,
                    photoURL: user.photoURL || undefined,
                    createdAt: now.toDate()
                }

                await setDoc(doc(db, 'users', user.uid), {
                    ...userData,
                    createdAt: now
                })

                return {
                    success: true,
                    data: {
                        user: userData,
                        token: await user.getIdToken()
                    }
                }
            }

            // Return existing user
            const userData = userDoc.data() as UserData
            return {
                success: true,
                data: {
                    user: userData,
                    token: await user.getIdToken()
                }
            }
        } catch (error: any) {
            // Don't log error if user simply closed the popup
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error('Google Sign-In Error:', error)
            }

            let userMessage = 'Ошибка входа через Google'

            if (error.code === 'auth/popup-closed-by-user') {
                userMessage = 'Вход отменён'
            } else if (error.code === 'auth/popup-blocked') {
                userMessage = 'Всплывающее окно заблокировано браузером'
            }

            return {
                success: false,
                message: userMessage
            }
        }
    },

    // Listen to auth state changes
    onAuthChange: (callback: (user: FirebaseUser | null) => void) => {
        return onAuthStateChanged(auth, callback)
    }
}
