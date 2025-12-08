import express from 'express'
import {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getUnreadCount
} from '../controllers/chat.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

router.get('/conversations', getConversations)
router.get('/messages/:userId', getMessages)
router.post('/messages', sendMessage)
router.put('/messages/:id/read', markAsRead)
router.get('/unread', getUnreadCount)

export default router
