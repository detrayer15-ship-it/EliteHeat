import api from './client'

export interface ChatMessage {
    _id: string
    senderId: string
    text: string
    timestamp: string
    read: boolean
}

export interface Chat {
    _id: string
    studentId: string
    adminId: string
    messages: ChatMessage[]
    lastMessageAt?: string
    unreadCount: number
    student?: {
        _id: string
        name: string
        email: string
    }
    admin?: {
        _id: string
        name: string
        email: string
    }
}

export const chatsAPI = {
    // Get my chat(s)
    getMy: async () => {
        const response = await api.get('/chats/my')
        return response.data
    },

    // Get chat by ID
    getById: async (id: string) => {
        const response = await api.get(`/chats/${id}`)
        return response.data
    },

    // Send message
    sendMessage: async (chatId: string, text: string) => {
        const response = await api.post(`/chats/${chatId}/message`, { text })
        return response.data
    },

    // Mark as read (admin)
    markAsRead: async (chatId: string) => {
        const response = await api.put(`/chats/${chatId}/read`)
        return response.data
    }
}
