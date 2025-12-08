import api from './client'

export const adminAPI = {
    // Get admin stats (level, points, progress)
    getStats: async () => {
        const response = await api.get('/admin/stats')
        return response.data
    },

    // Get all users (admin only)
    getAllUsers: async () => {
        const response = await api.get('/admin/users')
        return response.data
    },

    // Get user by ID
    getUserById: async (id: string) => {
        const response = await api.get(`/admin/users/${id}`)
        return response.data
    },

    // Add points to admin
    addPoints: async (points: number, reason: string) => {
        const response = await api.post('/admin/add-points', { points, reason })
        return response.data
    }
}
