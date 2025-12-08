import express from 'express'
import {
    getAllUsers,
    getAllAdmins,
    getUserById,
    updateUser,
    banUser,
    deleteUser,
    getUserIPHistory,
    changeUserRole
} from '../controllers/admin.controller.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/admin.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(protect, isAdmin)

router.get('/users', getAllUsers)
router.get('/admins', getAllAdmins)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.put('/users/:id/ban', banUser)
router.delete('/users/:id', deleteUser)
router.get('/users/:id/ip', getUserIPHistory)
router.put('/users/:id/role', changeUserRole)

export default router
