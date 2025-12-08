import api from './client'

export const adminAPI = {
    // Get all users
    getUsers: async (params?: { role?: string; city?: string; search?: string; page?: number }) => {
        const response = await api.get('/admin/users', { params })
        return response.data
    },

    // Get all admins
    getAdmins: async () => {
        const response = await api.get('/admin/admins')
        return response.data
    },

    // Get user by ID
    getUserById: async (id: string) => {
        const response = await api.get(`/admin/users/${id}`)
        return response.data
    },

    // Update user
    updateUser: async (id: string, data: any) => {
        const response = await api.put(`/admin/users/${id}`, data)
        return response.data
    },

    // Ban/unban user
    banUser: async (id: string) => {
        const response = await api.put(`/admin/users/${id}/ban`)
        return response.data
    },

    // Delete user
    deleteUser: async (id: string) => {
        const response = await api.delete(`/admin/users/${id}`)
        return response.data
    },

    // Get IP history
    getIPHistory: async (id: string) => {
        const response = await api.get(`/admin/users/${id}/ip`)
        return response.data
    },

    // Change role
    changeRole: async (id: string, role: 'student' | 'admin') => {
        const response = await api.put(`/admin/users/${id}/role`, { role })
        return response.data
    }
}
