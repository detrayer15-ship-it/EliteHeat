import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'
import User from '../models/User.js'

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        })
            .populate('participants', 'name avatar city isOnline')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })

        res.json({
            success: true,
            data: conversations
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения чатов'
        })
    }
}

// @desc    Get messages with user
// @route   GET /api/chat/messages/:userId
// @access  Private
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params
        const { page = 1, limit = 50 } = req.query

        const messages = await Message.find({
            $or: [
                { from: req.user.id, to: userId },
                { from: userId, to: req.user.id }
            ]
        })
            .populate('from', 'name avatar city')
            .populate('to', 'name avatar city')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        const count = await Message.countDocuments({
            $or: [
                { from: req.user.id, to: userId },
                { from: userId, to: req.user.id }
            ]
        })

        res.json({
            success: true,
            data: {
                messages: messages.reverse(),
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения сообщений'
        })
    }
}

// @desc    Send message
// @route   POST /api/chat/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { to, text } = req.body

        // Check if recipient exists
        const recipient = await User.findById(to)
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: 'Получатель не найден'
            })
        }

        // Create message
        const message = await Message.create({
            from: req.user.id,
            to,
            text
        })

        await message.populate('from', 'name avatar city')
        await message.populate('to', 'name avatar city')

        // Update or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, to] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, to],
                lastMessage: message._id
            })
        } else {
            conversation.lastMessage = message._id
            conversation.updatedAt = new Date()
            await conversation.save()
        }

        res.status(201).json({
            success: true,
            data: message
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка отправки сообщения'
        })
    }
}

// @desc    Mark message as read
// @route   PUT /api/chat/messages/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Сообщение не найдено'
            })
        }

        // Only recipient can mark as read
        if (message.to.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Нет доступа'
            })
        }

        message.isRead = true
        message.readAt = new Date()
        await message.save()

        res.json({
            success: true,
            data: message
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка обновления сообщения'
        })
    }
}

// @desc    Get unread messages count
// @route   GET /api/chat/unread
// @access  Private
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            to: req.user.id,
            isRead: false
        })

        res.json({
            success: true,
            data: { count }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения непрочитанных сообщений'
        })
    }
}
