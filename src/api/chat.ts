import api from './client'

export const chatAPI = {
    // Get conversations
    getConversations: async () => {
        const response = await api.get('/chat/conversations')
        return response.data
    },

    // Get messages with user
    getMessages: async (userId: string, page = 1) => {
        const response = await api.get(`/chat/messages/${userId}`, {
            params: { page }
        })
        return response.data
    },

    // Send message
    sendMessage: async (to: string, text: string) => {
        const response = await api.post('/chat/messages', { to, text })
        return response.data
    },

    // Mark as read
    markAsRead: async (messageId: string) => {
        const response = await api.put(`/chat/messages/${messageId}/read`)
        return response.data
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get('/chat/unread')
        return response.data
    }
}
