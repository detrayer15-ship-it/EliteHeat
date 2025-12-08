import { db } from '../config/memoryDB.js'

// Helper function to calculate level from points
const calculateLevel = (points) => {
    if (points >= 1000) return 5
    if (points >= 600) return 4
    if (points >= 300) return 3
    if (points >= 100) return 2
    return 1
}

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res) => {
    try {
        const admin = db.users.findById(req.user.id)

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const level = calculateLevel(admin.points || 0)
        const nextLevelPoints = level === 5 ? 1000 : [100, 300, 600, 1000][level]
        const progress = level === 5 ? 100 : ((admin.points || 0) / nextLevelPoints) * 100

        res.json({
            success: true,
            data: {
                level,
                points: admin.points || 0,
                tasksReviewed: admin.tasksReviewed || 0,
                nextLevelPoints,
                progress: Math.min(progress, 100)
            }
        })
    } catch (error) {
        console.error('Get admin stats error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения статистики'
        })
    }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const admin = db.users.findById(req.user.id)

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const users = db.users.find()

        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        })

        res.json({
            success: true,
            data: usersWithoutPasswords
        })
    } catch (error) {
        console.error('Get all users error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения пользователей'
        })
    }
}

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
    try {
        const admin = db.users.findById(req.user.id)

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const user = db.users.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        const { password, ...userWithoutPassword } = user

        res.json({
            success: true,
            data: userWithoutPassword
        })
    } catch (error) {
        console.error('Get user by ID error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения пользователя'
        })
    }
}

// @desc    Add points to admin
// @route   POST /api/admin/add-points
// @access  Private (Admin only)
export const addPoints = async (req, res) => {
    try {
        const { points, reason } = req.body
        const admin = db.users.findById(req.user.id)

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const newPoints = (admin.points || 0) + points
        const newLevel = calculateLevel(newPoints)

        db.users.updateOne(
            { _id: req.user.id },
            { points: newPoints, level: newLevel }
        )

        res.json({
            success: true,
            data: {
                points: newPoints,
                level: newLevel,
                reason
            }
        })
    } catch (error) {
        console.error('Add points error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка начисления очков'
        })
    }
}
