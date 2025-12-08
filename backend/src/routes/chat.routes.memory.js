import express from 'express'
import { getMyChat, getChatById, sendMessage, markAsRead } from '../controllers/chat.controller.memory.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Get my chat(s)
router.get('/my', getMyChat)

// Get specific chat
router.get('/:id', getChatById)

// Send message
router.post('/:id/message', sendMessage)

// Mark as read (admin)
router.put('/:id/read', markAsRead)

export default router
