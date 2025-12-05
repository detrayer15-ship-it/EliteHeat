export interface User {
    id: string
    email: string
    name: string
    password: string
    role?: 'student' | 'admin'
    points?: number
    level?: number
    streak?: number
    achievements?: string[]
    createdAt: string
    avatar?: string
    bio?: string
    address?: string
    age?: number
    birthday?: string
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
}
