import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { assignmentsAPI } from '@/api/assignments'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface Submission {
    id: string
    assignmentTitle: string
    studentName: string
    content: string
    status: string
    submittedAt: any
    reviewComment?: string
}

export const TaskReviewPage = () => {
    const user = useAuthStore(state => state.user)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
    const [comment, setComment] = useState('')
    const [isReviewing, setIsReviewing] = useState(false)

    useEffect(() => {
        loadSubmissions()
    }, [])

    const loadSubmissions = async () => {
        const result = await assignmentsAPI.getAllSubmissions()
        if (result.success) {
            setSubmissions(result.data as Submission[])
        }
    }

    const handleReview = async (submissionId: string, status: 'approved' | 'rejected') => {
        if (!user) return

        setIsReviewing(true)
        const result = await assignmentsAPI.reviewSubmission(
            submissionId,
            user.id,
            status,
            comment || (status === 'approved' ? 'Отличная работа!' : 'Нужно доработать')
        )

        if (result.success) {
            setComment('')
            setSelectedSubmission(null)
            loadSubmissions()
        }
        setIsReviewing(false)
    }

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            pending: { label: '⏳ Ожидает', className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' },
            approved: { label: '✅ Принято', className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' },
            rejected: { label: '❌ Отклонено', className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' }
        }

        const badge = badges[status] || badges.pending
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
                {badge.label}
            </span>
        )
    }

    const pendingSubmissions = submissions.filter(s => s.status === 'pending')
    const reviewedSubmissions = submissions.filter(s => s.status !== 'pending')

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Проверка заданий</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Ожидают проверки ({pendingSubmissions.length})</h2>
                <div className="grid gap-4">
                    {pendingSubmissions.map(submission => (
                        <Card key={submission.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{submission.assignmentTitle}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ученик: {submission.studentName}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Отправлено: {new Date(submission.submittedAt?.seconds * 1000).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                                {getStatusBadge(submission.status)}
                            </div>

                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="whitespace-pre-wrap">{submission.content}</p>
                            </div>

                            {selectedSubmission === submission.id ? (
                                <div className="space-y-4">
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Комментарий (необязательно)"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleReview(submission.id, 'approved')}
                                            disabled={isReviewing}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            ✔ Принять
                                        </Button>
                                        <Button
                                            onClick={() => handleReview(submission.id, 'rejected')}
                                            disabled={isReviewing}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            ✖ Отклонить
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setSelectedSubmission(null)
                                                setComment('')
                                            }}
                                        >
                                            Отмена
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button onClick={() => setSelectedSubmission(submission.id)}>
                                    Проверить
                                </Button>
                            )}
                        </Card>
                    ))}

                    {pendingSubmissions.length === 0 && (
                        <Card className="p-8 text-center text-gray-500">
                            Нет заданий на проверке
                        </Card>
                    )}
                </div>
            </div>

            {reviewedSubmissions.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Проверенные ({reviewedSubmissions.length})</h2>
                    <div className="grid gap-4">
                        {reviewedSubmissions.map(submission => (
                            <Card key={submission.id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{submission.assignmentTitle}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Ученик: {submission.studentName}
                                        </p>
                                        {submission.reviewComment && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Комментарий: {submission.reviewComment}
                                            </p>
                                        )}
                                    </div>
                                    {getStatusBadge(submission.status)}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
