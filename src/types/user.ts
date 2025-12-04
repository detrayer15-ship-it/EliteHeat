export interface User {
    id: string
    email: string
    name: string
    password: string
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
