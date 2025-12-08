import express from 'express'
import { register, login, getMe, logout } from '../controllers/auth.controller.memory.js'
import { protect } from '../middleware/auth.js'
import { trackIP } from '../middleware/ipTracker.js'
// Temporarily disabled rate limiter for testing
// import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', trackIP, register)
router.post('/login', trackIP, login)
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

export default router
