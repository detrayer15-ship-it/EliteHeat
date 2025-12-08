import { db } from '../config/memoryDB.js'

// Helper to add points to admin
const addPointsToAdmin = (adminId, points, reason) => {
    const admin = db.users.findById(adminId)
    if (admin && admin.role === 'admin') {
        const newPoints = (admin.points || 0) + points
        const newLevel = calculateLevel(newPoints)
        const newTasksReviewed = (admin.tasksReviewed || 0) + 1

        db.users.updateOne(
            { _id: adminId },
            {
                points: newPoints,
                level: newLevel,
                tasksReviewed: newTasksReviewed
            }
        )
    }
}

const calculateLevel = (points) => {
    if (points >= 1000) return 5
    if (points >= 600) return 4
    if (points >= 300) return 3
    if (points >= 100) return 2
    return 1
}

// @desc    Submit assignment
// @route   POST /api/submissions
// @access  Private (Student)
export const submitAssignment = async (req, res) => {
    try {
        const { taskTitle, description, fileUrl } = req.body

        const submission = db.submissions.create({
            studentId: req.user.id,
            taskTitle,
            description,
            fileUrl: fileUrl || null,
            status: 'pending',
            reviewedBy: null,
            reviewComment: null,
            pointsEarned: 0
        })

        res.status(201).json({
            success: true,
            data: submission
        })
    } catch (error) {
        console.error('Submit assignment error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка отправки задания'
        })
    }
}

// @desc    Get all submissions (for admin)
// @route   GET /api/submissions
// @access  Private (Admin)
export const getAllSubmissions = async (req, res) => {
    try {
        const user = db.users.findById(req.user.id)

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const { status } = req.query
        let submissions = db.submissions.find()

        if (status) {
            submissions = submissions.filter(s => s.status === status)
        }

        // Add student info to each submission
        const submissionsWithStudents = submissions.map(sub => {
            const student = db.users.findById(sub.studentId)
            return {
                ...sub,
                student: student ? {
                    _id: student._id,
                    name: student.name,
                    email: student.email
                } : null
            }
        })

        res.json({
            success: true,
            data: submissionsWithStudents
        })
    } catch (error) {
        console.error('Get submissions error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения заданий'
        })
    }
}

// @desc    Get my submissions (for student)
// @route   GET /api/submissions/my
// @access  Private (Student)
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = db.submissions.find({ studentId: req.user.id })

        res.json({
            success: true,
            data: submissions
        })
    } catch (error) {
        console.error('Get my submissions error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка получения заданий'
        })
    }
}

// @desc    Review submission
// @route   PUT /api/submissions/:id/review
// @access  Private (Admin)
export const reviewSubmission = async (req, res) => {
    try {
        const user = db.users.findById(req.user.id)

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Доступ запрещён'
            })
        }

        const { status, comment, pointsEarned } = req.body
        const submission = db.submissions.findById(req.params.id)

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Задание не найдено'
            })
        }

        // Update submission
        db.submissions.updateOne(
            { _id: req.params.id },
            {
                status,
                reviewedBy: req.user.id,
                reviewComment: comment,
                pointsEarned: pointsEarned || 0,
                reviewedAt: new Date()
            }
        )

        // Add points to admin for reviewing
        const adminPoints = status === 'approved' ? 10 : 5
        addPointsToAdmin(req.user.id, adminPoints, 'Проверка задания')

        const updatedSubmission = db.submissions.findById(req.params.id)

        res.json({
            success: true,
            data: updatedSubmission,
            message: status === 'approved' ? 'Задание принято' : 'Задание отклонено'
        })
    } catch (error) {
        console.error('Review submission error:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка проверки задания'
        })
    }
}
