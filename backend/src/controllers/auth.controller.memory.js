import { db } from '../config/memoryDB.js'

// SUPER SIMPLE VERSION - NO BCRYPT, NO JWT
export const register = async (req, res) => {
    try {
        console.log('==================')
        console.log('REGISTER CALLED')
        console.log('req.body:', JSON.stringify(req.body, null, 2))
        console.log('==================')

        const { email, password, name, city, role } = req.body

        if (!email || !password || !name) {
            console.log('Missing fields!')
            return res.status(400).json({
                success: false,
                message: 'Заполните все поля'
            })
        }

        // Check if user exists
        const existingUser = db.users.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            console.log('User already exists!')
            return res.status(400).json({
                success: false,
                message: 'Пользователь уже существует'
            })
        }

        // Create user WITHOUT bcrypt (for testing)
        const user = {
            _id: Date.now().toString(),
            email: email.toLowerCase(),
            password: password, // NOT HASHED - just for testing!
            name: name,
            role: role || 'student', // Use provided role or default to student
            city: city || 'Unknown',
            createdAt: new Date().toISOString()
        }

        console.log('Creating user:', user._id)
        db.users.create(user)
        console.log('User created successfully!')

        // Return simple response WITHOUT JWT
        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    city: user.city,
                    role: user.role
                },
                token: 'fake-token-for-testing'
            }
        })

        console.log('Response sent!')

    } catch (error) {
        console.error('==================')
        console.error('REGISTER ERROR:')
        console.error('Message:', error.message)
        console.error('Stack:', error.stack)
        console.error('==================')

        res.status(500).json({
            success: false,
            message: 'Ошибка сервера',
            error: error.message
        })
    }
}

// Simple login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = db.users.findOne({ email: email.toLowerCase() })

        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            })
        }

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    city: user.city,
                    role: user.role
                },
                token: 'fake-token-for-testing'
            }
        })
    } catch (error) {
        console.error('LOGIN ERROR:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка входа'
        })
    }
}

export const getMe = async (req, res) => {
    res.json({
        success: true,
        data: { message: 'Not implemented in simple version' }
    })
}

export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Вы вышли из системы'
    })
}
