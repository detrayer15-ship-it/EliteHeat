import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './config/db.js'
import { initializeSocket } from './config/socket.js'
import { limiter } from './middleware/rateLimiter.js'
import { sanitizer, strictSanitizer } from './middleware/sanitizer.js'
import { auditMiddleware, getAuditLogs } from './middleware/auditLogger.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import chatRoutes from './routes/chat.routes.js'
import aiRoutes from './routes/ai.routes.js'
import { sendSimpleChat, sendAutoAI } from './controllers/ai.controller.js'

// Connect to database (optional - not needed for AI Assistant)
// MongoDB is only used for auth, chat, and submissions
// AI Assistant uses Firebase Firestore
// connectDB()

// Create Express app
const app = express()
const server = createServer(app)

// Initialize Socket.io
const io = initializeSocket(server)

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://apis.google.com"],
            "img-src": ["'self'", "data:", "https://*.google.com"],
            "connect-src": ["'self'", "https://*.googleapis.com", "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:5173", "http://localhost:5174"]
        },
    },
}))
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow all localhost ports and production domains
        if (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.includes('eliteheat-2ee0b.web.app') ||
            origin.includes('eliteheat-2ee0b.firebaseapp.com')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Security middleware
app.use(sanitizer)  // Input sanitization
app.use(auditMiddleware)  // Audit logging

// Rate limiting
app.use('/api/', limiter)

// Admin routes with strict sanitization
app.use('/api/admin', strictSanitizer, adminRoutes)

// Audit logs endpoint (admin only)
app.get('/api/admin/audit-logs', getAuditLogs)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/ai', aiRoutes)
app.post('/api/chat', sendSimpleChat)
app.post('/api/ask', sendAutoAI) // Exact user spec alias

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
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 EliteHeat Backend Server v4.0.5                 ║
║                                                       ║
║   📡 Server running on port ${PORT}                     ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   🤖 AI Assistant: Ready (Firestore)                 ║
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
