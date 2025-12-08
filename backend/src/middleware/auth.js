import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
    try {
        let token

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Не авторизован. Токен отсутствует'
            })
        }

        // Verify token
        const decoded = verifyToken(token)

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Неверный или истёкший токен'
            })
        }

        // Get user from MongoDB
        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Ваш аккаунт заблокирован'
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        res.status(401).json({
            success: false,
            message: 'Ошибка авторизации'
        })
    }
}
