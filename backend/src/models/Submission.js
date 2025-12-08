import mongoose from 'mongoose'

const SubmissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewComment: {
        type: String,
        default: null
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

export default mongoose.model('Submission', SubmissionSchema)
