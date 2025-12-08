import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'
import { authAPI } from '@/api/auth'
import { socketService } from '@/services/socket'

interface AuthStore {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    register: (email: string, password: string, name: string, city: string, role?: string) => Promise<{ success: boolean; message: string }>
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
    logout: () => Promise<void>
    updateProfile: (data: Partial<User>) => void
    loadUser: () => Promise<void>
    setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            register: async (email: string, password: string, name: string, city: string, role?: string) => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await authAPI.register({ email, password, name, city, role })

                    if (response.success) {
                        const { user, token } = response.data

                        // Save token and user
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', JSON.stringify(user))

                        // Connect socket
                        socketService.connect(token)

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        return { success: true, message: 'Регистрация успешна' }
                    } else {
                        set({ isLoading: false, error: response.message })
                        return { success: false, message: response.message || 'Ошибка регистрации' }
                    }
                } catch (error: any) {
                    const message = error.response?.data?.message || error.message || 'Ошибка регистрации'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await authAPI.login({ email, password })

                    if (response.success) {
                        const { user, token } = response.data

                        // Save token and user
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', JSON.stringify(user))

                        // Connect socket
                        socketService.connect(token)

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        return { success: true, message: 'Вход выполнен успешно!' }
                    }

                    return { success: false, message: response.message || 'Ошибка входа' }
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Неверный email или пароль'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            logout: async () => {
                try {
                    await authAPI.logout()
                } catch (error) {
                    console.error('Logout error:', error)
                }

                // Disconnect socket
                socketService.disconnect()

                // Clear storage
                localStorage.removeItem('token')
                localStorage.removeItem('user')

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                })
            },

            updateProfile: (data: Partial<User>) => {
                const { user } = get()
                if (!user) return

                const updatedUser = { ...user, ...data }
                set({ user: updatedUser })
                localStorage.setItem('user', JSON.stringify(updatedUser))
            },

            loadUser: async () => {
                const token = localStorage.getItem('token')
                const savedUser = localStorage.getItem('user')

                if (!token) {
                    set({ isAuthenticated: false, isLoading: false })
                    return
                }

                // Try to restore from localStorage first
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser)
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        })

                        // Connect socket
                        socketService.connect(token)

                        // Verify token in background
                        authAPI.getMe().then(response => {
                            if (response.success) {
                                set({ user: response.data })
                                localStorage.setItem('user', JSON.stringify(response.data))
                            }
                        }).catch(() => {
                            // Token invalid, logout
                            localStorage.removeItem('token')
                            localStorage.removeItem('user')
                            set({ user: null, token: null, isAuthenticated: false })
                        })

                        return
                    } catch (e) {
                        console.error('Error parsing saved user:', e)
                    }
                }

                // Fallback: fetch from API
                try {
                    set({ isLoading: true })

                    const response = await authAPI.getMe()

                    if (response.success) {
                        localStorage.setItem('user', JSON.stringify(response.data))

                        // Connect socket
                        socketService.connect(token)

                        set({
                            user: response.data,
                            token,
                            isAuthenticated: true,
                            isLoading: false
                        })
                    }
                } catch (error) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false
                    })
                }
            },

            setError: (error: string | null) => {
                set({ error })
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user
            })
        }
    )
)
