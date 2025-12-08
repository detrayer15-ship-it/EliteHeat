import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class SocketService {
    private socket: Socket | null = null

    connect(token: string) {
        if (this.socket?.connected) return

        this.socket = io(SOCKET_URL, {
            auth: { token }
        })

        this.socket.on('connect', () => {
            console.log('✅ Socket connected')
        })

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected')
        })

        this.socket.on('error', (error) => {
            console.error('Socket error:', error)
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    // Send message
    sendMessage(to: string, text: string) {
        this.socket?.emit('send-message', { to, text })
    }

    // Typing indicators
    startTyping(to: string) {
        this.socket?.emit('typing', { to })
    }

    stopTyping(to: string) {
        this.socket?.emit('stop-typing', { to })
    }

    // Listen for events
    onNewMessage(callback: (message: any) => void) {
        this.socket?.on('new-message', callback)
    }

    onMessageSent(callback: (message: any) => void) {
        this.socket?.on('message-sent', callback)
    }

    onUserOnline(callback: (data: any) => void) {
        this.socket?.on('user-online', callback)
    }

    onUserOffline(callback: (data: any) => void) {
        this.socket?.on('user-offline', callback)
    }

    onUserTyping(callback: (data: any) => void) {
        this.socket?.on('user-typing', callback)
    }

    onUserStopTyping(callback: (data: any) => void) {
        this.socket?.on('user-stop-typing', callback)
    }

    // Remove listeners
    off(event: string) {
        this.socket?.off(event)
    }
}

export const socketService = new SocketService()
