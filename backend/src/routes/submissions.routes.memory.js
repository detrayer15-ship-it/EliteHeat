import express from 'express'
import {
    submitAssignment,
    getAllSubmissions,
    getMySubmissions,
    reviewSubmission
} from '../controllers/submissions.controller.memory.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Submit assignment (student)
router.post('/', submitAssignment)

// Get all submissions (admin)
router.get('/', getAllSubmissions)

// Get my submissions (student)
router.get('/my', getMySubmissions)

// Review submission (admin)
router.put('/:id/review', reviewSubmission)

export default router
