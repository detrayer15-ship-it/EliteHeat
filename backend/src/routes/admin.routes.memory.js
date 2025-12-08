import express from 'express'
import { getAdminStats, getAllUsers, getUserById, addPoints } from '../controllers/admin.controller.memory.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Admin stats
router.get('/stats', getAdminStats)

// User management
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)

// Points system
router.post('/add-points', addPoints)

export default router
