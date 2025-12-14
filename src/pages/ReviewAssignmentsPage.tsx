import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, User, Calendar, CheckCircle, XCircle, Star } from 'lucide-react'

interface Submission {
    id: string
    studentId: string
    studentName: string
    studentEmail: string
    taskTitle: string
    answer: string
    status: 'pending' | 'approved' | 'rejected'
    grade: number | null
    feedback: string
    submittedAt: any
    reviewedAt: any
    reviewedBy: string | null
}

export const ReviewAssignmentsPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [grade, setGrade] = useState<number>(0)
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(true)
    const [reviewing, setReviewing] = useState(false)

    // Проверка доступа
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
                    <p className="text-gray-600 mb-6">
                        Эта страница доступна только администраторам
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        На главную
                    </button>
                </div>
            </div>
        )
    }

    useEffect(() => {
        loadSubmissions()
    }, [])

    const loadSubmissions = async () => {
        try {
            const submissionsRef = collection(db, 'submissions')
            const q = query(submissionsRef, orderBy('submittedAt', 'desc'))
            const snapshot = await getDocs(q)

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Submission[]

            setSubmissions(data)
            setLoading(false)
        } catch (error) {
            console.error('Error loading submissions:', error)
            setLoading(false)
        }
    }

    const handleReview = async (status: 'approved' | 'rejected') => {
        if (!selectedSubmission) return
        if (status === 'approved' && (grade < 1 || grade > 10)) {
            alert('Оценка должна быть от 1 до 10')
            return
        }

        setReviewing(true)

        try {
            const submissionRef = doc(db, 'submissions', selectedSubmission.id)
            await updateDoc(submissionRef, {
                status,
                grade: status === 'approved' ? grade : null,
                feedback: feedback.trim(),
                reviewedAt: Timestamp.now(),
                reviewedBy: currentUser?.name || currentUser?.email
            })

            alert(`✅ Задание ${status === 'approved' ? 'одобрено' : 'отклонено'}!`)
            setSelectedSubmission(null)
            setGrade(0)
            setFeedback('')
            loadSubmissions()
        } catch (error) {
            console.error('Error reviewing submission:', error)
            alert('Ошибка при проверке задания')
        } finally {
            setReviewing(false)
        }
    }

    const pendingCount = submissions.filter(s => s.status === 'pending').length
    const approvedCount = submissions.filter(s => s.status === 'approved').length
    const rejectedCount = submissions.filter(s => s.status === 'rejected').length

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-blue-600 hover:text-blue-700 mb-4"
                    >
                        ← Назад в админ-панель
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                            <ClipboardCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Проверка заданий
                            </h1>
                            <p className="text-gray-600">Проверяйте задания студентов</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                            <div className="text-sm text-yellow-700 mb-1">Ожидают проверки</div>
                            <div className="text-3xl font-bold text-yellow-900">{pendingCount}</div>
                        </div>
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                            <div className="text-sm text-green-700 mb-1">Одобрено</div>
                            <div className="text-3xl font-bold text-green-900">{approvedCount}</div>
                        </div>
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <div className="text-sm text-red-700 mb-1">Отклонено</div>
                            <div className="text-3xl font-bold text-red-900">{rejectedCount}</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submissions List */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Список заданий</h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">⏳</div>
                                <p className="text-gray-600">Загрузка заданий...</p>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-600">Нет заданий</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {submissions.map((submission) => (
                                    <button
                                        key={submission.id}
                                        onClick={() => {
                                            setSelectedSubmission(submission)
                                            setGrade(submission.grade || 0)
                                            setFeedback(submission.feedback || '')
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedSubmission?.id === submission.id
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-gray-900">{submission.taskTitle}</h3>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {submission.status === 'pending' ? 'Ожидает' :
                                                    submission.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            {submission.studentName}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {submission.submittedAt?.toDate().toLocaleDateString('ru-RU')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Review Panel */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        {selectedSubmission ? (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedSubmission.taskTitle}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {selectedSubmission.studentName}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {selectedSubmission.submittedAt?.toDate().toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                </div>

                                {/* Answer */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Ответ студента:</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                                            {selectedSubmission.answer}
                                        </pre>
                                    </div>
                                </div>

                                {selectedSubmission.status === 'pending' && (
                                    <>
                                        {/* Grade */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Оценка (1-10)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={grade || ''}
                                                    onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                                                    className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <div className="flex gap-1">
                                                    {[...Array(grade)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Обратная связь
                                            </label>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Напишите комментарий для студента..."
                                                rows={4}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleReview('approved')}
                                                disabled={reviewing || grade < 1 || grade > 10}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Одобрить
                                            </button>
                                            <button
                                                onClick={() => handleReview('rejected')}
                                                disabled={reviewing}
                                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Отклонить
                                            </button>
                                        </div>
                                    </>
                                )}

                                {selectedSubmission.status !== 'pending' && (
                                    <div className={`p-4 rounded-xl ${selectedSubmission.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                                        }`}>
                                        <div className="font-bold mb-2">
                                            {selectedSubmission.status === 'approved' ? '✅ Одобрено' : '❌ Отклонено'}
                                        </div>
                                        {selectedSubmission.grade && (
                                            <div className="text-sm mb-2">
                                                Оценка: {selectedSubmission.grade}/10
                                            </div>
                                        )}
                                        {selectedSubmission.feedback && (
                                            <div className="text-sm">
                                                Комментарий: {selectedSubmission.feedback}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-600 mt-2">
                                            Проверено: {selectedSubmission.reviewedBy}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-24">
                                <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Выберите задание для проверки</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
