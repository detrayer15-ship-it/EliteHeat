import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { email, password, name, city, role } = req.body

        // Check if user exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            })
        }

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            city,
            role: role || 'student', // Default to student
            ipHistory: [{
                ip: req.clientIP,
                userAgent: req.clientUserAgent
            }]
        })

        // Generate token
        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    city: user.city,
                    avatar: user.avatar
                },
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при регистрации',
            error: error.message
        })
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check for user
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            })
        }

        // Check if banned
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Ваш аккаунт заблокирован'
            })
        }

        // Check password
        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            })
        }

        // Update IP history
        user.ipHistory.push({
            ip: req.clientIP,
            userAgent: req.clientUserAgent
        })
        user.lastLoginAt = new Date()
        await user.save()

        // Generate token
        const token = generateToken(user._id)

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    city: user.city,
                    avatar: user.avatar,
                    bio: user.bio
                },
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при входе',
            error: error.message
        })
    }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка получения данных пользователя'
        })
    }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Update online status
        await User.findByIdAndUpdate(req.user.id, { isOnline: false })

        res.json({
            success: true,
            message: 'Вы вышли из системы'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка при выходе'
        })
    }
}
