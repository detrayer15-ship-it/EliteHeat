import api from './client'

export interface RegisterData {
    email: string
    password: string
    name: string
    city: string
    role?: string
}

export interface LoginData {
    email: string
    password: string
}

export const authAPI = {
    // Register
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data)
        return response.data
    },

    // Login
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data)
        return response.data
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    }
}
