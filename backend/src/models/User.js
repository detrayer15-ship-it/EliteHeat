import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    city: {
        type: String,
        default: ''
    },
    // Admin fields
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    points: {
        type: Number,
        default: 0
    },
    tasksReviewed: {
        type: Number,
        default: 0
    },
    // Profile fields
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    ipHistory: [{
        ip: String,
        timestamp: Date
    }]
}, {
    timestamps: true
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', UserSchema)
