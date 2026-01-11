import express from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { initializeSocket } from './config/socket.js'
import { limiter } from './middleware/rateLimiter.js'

// Routes - using memory versions
import authRoutes from './routes/auth.routes.memory.js'
import adminRoutes from './routes/admin.routes.memory.js'
import submissionsRoutes from './routes/submissions.routes.memory.js'
import chatRoutes from './routes/chat.routes.memory.js'
import aiRoutes from './routes/ai.routes.js'

// Load env vars
dotenv.config()

console.log('🚀 Starting EliteHeat Backend (In-Memory Mode)...')
console.log('⚠️  Using in-memory storage - data will be lost on restart')
console.log('💡 To use MongoDB, create .env file with MONGODB_URI')

// Create Express app
const app = express()
const server = createServer(app)

// Initialize Socket.io
const io = initializeSocket(server)

// Middleware
app.use(helmet())
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true)

        // Allow all localhost origins
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true)
        }

        callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use('/api/', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/submissions', submissionsRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running (In-Memory Mode)',
        mode: 'memory',
        timestamp: new Date().toISOString()
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
})

// Start server
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 EliteHeat Backend Server (IN-MEMORY MODE)       ║
║                                                       ║
║   📡 Server running on port ${PORT}                     ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   💾 Database: In-Memory (temporary)                 ║
║   🔌 Socket.io: Active                               ║
║                                                       ║
║   ⚠️  Data will be lost on restart!                  ║
║   💡 Set up MongoDB for persistent storage           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`)
    server.close(() => process.exit(1))
})

export default app
