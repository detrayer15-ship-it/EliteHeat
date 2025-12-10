import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { firebaseAuthAPI, UserData } from '@/api/firebase-auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'

interface AuthStore {
    user: UserData | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    register: (email: string, password: string, name: string, city: string, role?: 'student' | 'admin') => Promise<{ success: boolean; message: string }>
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
    logout: () => Promise<void>
    setUser: (user: UserData | null) => void
    updateProfile: (data: Partial<UserData>) => void
    loadUser: () => Promise<void>
    setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            register: async (email: string, password: string, name: string, city: string, role: 'student' | 'admin' = 'student') => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await firebaseAuthAPI.register(email, password, name, city, role)

                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        return { success: true, message: 'Регистрация успешна!' }
                    } else {
                        set({ isLoading: false, error: response.message })
                        return { success: false, message: response.message || 'Ошибка регистрации' }
                    }
                } catch (error: any) {
                    const message = error.message || 'Ошибка регистрации'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await firebaseAuthAPI.login(email, password)

                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        return { success: true, message: 'Вход выполнен успешно!' }
                    }

                    set({ isLoading: false, error: response.message })
                    return { success: false, message: response.message || 'Ошибка входа' }
                } catch (error: any) {
                    const message = error.message || 'Неверный email или пароль'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            logout: async () => {
                try {
                    await firebaseAuthAPI.logout()
                } catch (error) {
                    console.error('Logout error:', error)
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false
                    })
                }
            },

            setUser: (user: UserData | null) => {
                set({
                    user,
                    isAuthenticated: !!user
                })
            },

            updateProfile: (data: Partial<UserData>) => {
                const { user } = get()
                if (!user) return

                const updatedUser = { ...user, ...data }
                set({ user: updatedUser })
            },

            loadUser: async () => {
                onAuthStateChanged(auth, async (firebaseUser) => {
                    if (firebaseUser) {
                        try {
                            const response = await firebaseAuthAPI.getMe()
                            if (response.success && response.data) {
                                set({
                                    user: response.data,
                                    isAuthenticated: true,
                                    isLoading: false
                                })
                            }
                        } catch (error) {
                            set({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false
                            })
                        }
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                    }
                })
            },

            setError: (error: string | null) => {
                set({ error })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user
            })
        }
    )
)
