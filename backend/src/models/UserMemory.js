import bcrypt from 'bcryptjs'
import { db } from '../config/memoryDB.js'

export class User {
    static async create(data) {
        try {
            console.log('UserMemory.create START', data)

            // Hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(data.password, salt)

            const user = {
                _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                email: data.email.toLowerCase(),
                password: hashedPassword,
                name: data.name,
                role: data.role || 'student',
                city: data.city || 'Unknown',
                avatar: data.avatar || null,
                bio: data.bio || '',
                isOnline: false,
                isBanned: false,
                ipHistory: data.ipHistory || [],
                lastLoginAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const result = db.users.create(user)
            console.log('UserMemory.create SUCCESS', result._id)
            return result
        } catch (error) {
            console.error('UserMemory.create ERROR:', error)
            throw error
        }
    }

    static async findOne(query) {
        return db.users.findOne(query)
    }

    static async findById(id) {
        return db.users.findById(id)
    }

    static async find(query = {}) {
        return db.users.find(query)
    }

    static async findByIdAndUpdate(id, update) {
        return db.users.updateOne({ _id: id }, update)
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }

    static async countDocuments(query = {}) {
        return db.users.find(query).length
    }
}

export default User
