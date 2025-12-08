import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Текст сообщения обязателен'],
        trim: true,
        maxlength: [1000, 'Сообщение не может быть длиннее 1000 символов']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

// Indexes for faster queries
messageSchema.index({ from: 1, to: 1, createdAt: -1 })
messageSchema.index({ to: 1, isRead: 1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
