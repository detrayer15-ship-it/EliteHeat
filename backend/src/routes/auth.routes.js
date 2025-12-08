import express from 'express'
import { register, login, getMe, logout } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'
import { trackIP } from '../middleware/ipTracker.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', trackIP, authLimiter, register)
router.post('/login', trackIP, authLimiter, login)
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

export default router
