import api from './client'

export interface Submission {
    _id: string
    studentId: string
    taskTitle: string
    description: string
    fileUrl?: string
    status: 'pending' | 'approved' | 'rejected'
    reviewedBy?: string
    reviewComment?: string
    pointsEarned: number
    createdAt: string
    updatedAt: string
    student?: {
        _id: string
        name: string
        email: string
    }
}

export const submissionsAPI = {
    // Submit assignment (student)
    submit: async (data: { taskTitle: string; description: string; fileUrl?: string }) => {
        const response = await api.post('/submissions', data)
        return response.data
    },

    // Get all submissions (admin)
    getAll: async (status?: string) => {
        const response = await api.get('/submissions', {
            params: { status }
        })
        return response.data
    },

    // Get my submissions (student)
    getMy: async () => {
        const response = await api.get('/submissions/my')
        return response.data
    },

    // Review submission (admin)
    review: async (id: string, data: { status: 'approved' | 'rejected'; comment: string; pointsEarned?: number }) => {
        const response = await api.put(`/submissions/${id}/review`, data)
        return response.data
    }
}
