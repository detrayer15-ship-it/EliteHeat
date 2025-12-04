import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'
import { generateId } from '@/utils/uuid'

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    users: User[] // Имитация базы данных пользователей

    register: (email: string, password: string, name: string) => { success: boolean; message: string }
    login: (email: string, password: string) => { success: boolean; message: string }
    logout: () => void
    updateProfile: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            users: [], // Хранилище всех зарегистрированных пользователей

            register: (email: string, password: string, name: string) => {
                const { users } = get()

                // Проверка: существует ли пользователь с таким email
                const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
                if (existingUser) {
                    return { success: false, message: 'Пользователь с таким email уже существует' }
                }

                // Валидация
                if (!email || !password || !name) {
                    return { success: false, message: 'Все поля обязательны для заполнения' }
                }

                if (password.length < 6) {
                    return { success: false, message: 'Пароль должен содержать минимум 6 символов' }
                }

                // Создание нового пользователя
                const newUser: User = {
                    id: generateId(),
                    email: email.toLowerCase(),
                    name,
                    password, // В реальном приложении должен быть хеш
                    createdAt: new Date().toISOString(),
                }

                // Сохранение в "базу данных"
                const updatedUsers = [...users, newUser]

                // Автоматический вход после регистрации
                set({
                    users: updatedUsers,
                    user: newUser,
                    isAuthenticated: true,
                })

                return { success: true, message: 'Регистрация успешна!' }
            },

            login: (email: string, password: string) => {
                const { users } = get()

                // Поиск пользователя в "базе данных"
                const user = users.find(
                    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                )

                if (!user) {
                    return { success: false, message: 'Неверный email или пароль' }
                }

                // Вход в систему
                set({
                    user,
                    isAuthenticated: true,
                })

                return { success: true, message: 'Вход выполнен успешно!' }
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                })
            },

            updateProfile: (data: Partial<User>) => {
                const { user, users } = get()
                if (!user) return

                const updatedUser = { ...user, ...data }
                const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)

                set({
                    user: updatedUser,
                    users: updatedUsers,
                })
            },
        }),
        {
            name: 'auth-storage', // Ключ в localStorage
        }
    )
)
