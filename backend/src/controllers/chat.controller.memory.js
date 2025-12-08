import { db } from '../config/memoryDB.js'

// @desc    Get or create chat between student and admin
// @route   GET /api/chats/my
// @access  Private
export const getMyChat = async (req, res) => {
    try {
        const user = db.users.findById(req.user.id)

        let chat
        if (user.role === 'student') {
            // Student: find chat with any admin
            chat = db.chats.findOne({ studentId: req.user.id })

            if (!chat) {
                // Create new chat with first available admin
                const admins = db.users.find({ role: 'admin' })
                if (admins.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Нет доступных админов'
                    })
                }

                chat = db.chats.create({
                    studentId: req.user.id,
                    adminId: admins[0]._id,
                    messages: [],
                    unreadCount: 0
                })
            }
        } else if (user.role === 'admin') {
            // Admin: get all chats
            const chats = db.chats.find({ adminId: req.user.id })

            // Add student info to each chat
            const chatsWithStudents = chats.map(chat => {
                const student = db.users.findById(chat.studentId)
                return {
                    ...chat,
                    student: student ? {
                        _id: student._id,
                        name: student.name,
                        email: student.email
                    } : null
                }
            })

            return res.json({
                success: true,
                data: chatsWithStudents
            })
        }

        res.json({
            success: true,
            data: chat
        })
    } catch (error) {
        console.error('Get my chat error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения чата'
        })
    }
}

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
export const getChatById = async (req, res) => {
    try {
        const chat = db.chats.findById(req.params.id)

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Чат не найден'
            })
        }

        // Check access
        const user = db.users.findById(req.user.id)
        if (chat.studentId !== req.user.id && chat.adminId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        // Add participant info
        const student = db.users.findById(chat.studentId)
        const admin = db.users.findById(chat.adminId)

        const chatWithParticipants = {
            ...chat,
            student: student ? {
                _id: student._id,
                name: student.name,
                email: student.email
            } : null,
            admin: admin ? {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            } : null
        }

        res.json({
            success: true,
            data: chatWithParticipants
        })
    } catch (error) {
        console.error('Get chat by ID error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения чата'
        })
    }
}

// @desc    Send message
// @route   POST /api/chats/:id/message
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body
        const chat = db.chats.findById(req.params.id)

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Чат не найден'
            })
        }

        // Check access
        if (chat.studentId !== req.user.id && chat.adminId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const message = {
            _id: Date.now().toString(),
            senderId: req.user.id,
            text,
            timestamp: new Date(),
            read: false
        }

        chat.messages.push(message)
        chat.lastMessageAt = new Date()

        // Increment unread count if message from student
        if (req.user.id === chat.studentId) {
            chat.unreadCount = (chat.unreadCount || 0) + 1
        }

        db.chats.updateOne(
            { _id: req.params.id },
            {
                messages: chat.messages,
                lastMessageAt: chat.lastMessageAt,
                unreadCount: chat.unreadCount
            }
        )

        res.json({
            success: true,
            data: message
        })
    } catch (error) {
        console.error('Send message error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка отправки сообщения'
        })
    }
}

// @desc    Mark messages as read
// @route   PUT /api/chats/:id/read
// @access  Private (Admin)
export const markAsRead = async (req, res) => {
    try {
        const chat = db.chats.findById(req.params.id)

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Чат не найден'
            })
        }

        // Only admin can mark as read
        if (chat.adminId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        db.chats.updateOne(
            { _id: req.params.id },
            { unreadCount: 0 }
        )

        res.json({
            success: true,
            message: 'Сообщения отмечены как прочитанные'
        })
    } catch (error) {
        console.error('Mark as read error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка'
        })
    }
}
