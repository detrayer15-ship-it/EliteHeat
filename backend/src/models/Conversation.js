import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
}, {
    timestamps: true
})

// Ensure only 2 participants
conversationSchema.index({ participants: 1 }, { unique: true })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation
