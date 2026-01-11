import express from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './config/db.js'
import { initializeSocket } from './config/socket.js'
import { limiter } from './middleware/rateLimiter.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import chatRoutes from './routes/chat.routes.js'
import aiRoutes from './routes/ai.routes.js'

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Create Express app
const app = express()
const server = createServer(app)

// Initialize Socket.io
const io = initializeSocket(server)

// Middleware
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use('/api/', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
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
║   🚀 EliteHeat Backend Server                        ║
║                                                       ║
║   📡 Server running on port ${PORT}                     ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   💾 Database: Connected                             ║
║   🔌 Socket.io: Active                               ║
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
