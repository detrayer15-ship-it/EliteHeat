import User from '../models/User.js'

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const { role, city, search, page = 1, limit = 20 } = req.query

        // Build query
        let query = {}

        if (role) query.role = role
        if (city) query.city = city
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        // Get users with pagination
        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        const count = await User.countDocuments(query)

        res.json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения пользователей'
        })
    }
}

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private/Admin
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 })

        res.json({
            success: true,
            data: admins
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения администраторов'
        })
    }
}

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения пользователя'
        })
    }
}

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const { name, email, city, bio } = req.body

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, city, bio },
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        res.json({
            success: true,
            data: user,
            message: 'Пользователь обновлён'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка обновления пользователя'
        })
    }
}

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        // Cannot ban other admins
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Нельзя заблокировать администратора'
            })
        }

        user.isBanned = !user.isBanned
        await user.save()

        res.json({
            success: true,
            data: user,
            message: user.isBanned ? 'Пользователь заблокирован' : 'Пользователь разблокирован'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка блокировки пользователя'
        })
    }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        // Cannot delete other admins
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Нельзя удалить администратора'
            })
        }

        await user.deleteOne()

        res.json({
            success: true,
            message: 'Пользователь удалён'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка удаления пользователя'
        })
    }
}

// @desc    Get user IP history
// @route   GET /api/admin/users/:id/ip
// @access  Private/Admin
export const getUserIPHistory = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('ipHistory email name')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                ipHistory: user.ipHistory
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения истории IP'
        })
    }
}

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body

        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Неверная роль'
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        res.json({
            success: true,
            data: user,
            message: `Роль изменена на ${role === 'admin' ? 'администратор' : 'ученик'}`
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка изменения роли'
        })
    }
}
