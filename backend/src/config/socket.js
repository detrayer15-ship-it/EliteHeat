import { Server } from 'socket.io'
import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'
import Message from '../models/Message.js'

const users = new Map() // userId -> socketId
const typingUsers = new Map() // conversationId -> Set of userIds

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }
    })

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token

            if (!token) {
                return next(new Error('Authentication error'))
            }

            const decoded = verifyToken(token)
            if (!decoded) {
                return next(new Error('Invalid token'))
            }

            const user = await User.findById(decoded.id)
            if (!user || user.isBanned) {
                return next(new Error('User not found or banned'))
            }

            socket.userId = user._id.toString()
            socket.user = user
            next()
        } catch (error) {
            next(new Error('Authentication error'))
        }
    })

    io.on('connection', async (socket) => {
        console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`)

        // Store user socket
        users.set(socket.userId, socket.id)

        // Update user online status
        await User.findByIdAndUpdate(socket.userId, { isOnline: true })

        // Notify others that user is online
        socket.broadcast.emit('user-online', {
            userId: socket.userId,
            name: socket.user.name,
            avatar: socket.user.avatar
        })

        // Join user's personal room
        socket.join(socket.userId)

        // Handle sending message
        socket.on('send-message', async (data) => {
            try {
                const { to, text } = data

                // Create message
                const message = await Message.create({
                    from: socket.userId,
                    to,
                    text
                })

                await message.populate('from', 'name avatar city')
                await message.populate('to', 'name avatar city')

                // Send to recipient if online
                const recipientSocketId = users.get(to)
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('new-message', message)
                }

                // Send back to sender
                socket.emit('message-sent', message)

            } catch (error) {
                socket.emit('error', { message: 'Failed to send message' })
            }
        })

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { to } = data
            const recipientSocketId = users.get(to)

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('user-typing', {
                    userId: socket.userId,
                    name: socket.user.name
                })
            }
        })

        // Handle stop typing
        socket.on('stop-typing', (data) => {
            const { to } = data
            const recipientSocketId = users.get(to)

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('user-stop-typing', {
                    userId: socket.userId
                })
            }
        })

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`❌ User disconnected: ${socket.user.name}`)

            // Remove user from online users
            users.delete(socket.userId)

            // Update user online status
            await User.findByIdAndUpdate(socket.userId, { isOnline: false })

            // Notify others that user is offline
            socket.broadcast.emit('user-offline', {
                userId: socket.userId
            })
        })
    })

    return io
}
