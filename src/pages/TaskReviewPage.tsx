import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { submissionsAPI, Submission } from '@/api/submissions'

export const TaskReviewPage = () => {
    const user = useAuthStore((state) => state.user)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
    const [reviewComment, setReviewComment] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSubmissions()
    }, [filter])

    const loadSubmissions = async () => {
        try {
            setLoading(true)
            const response = await submissionsAPI.getAll(filter === 'all' ? undefined : filter)
            if (response.success) {
                setSubmissions(response.data)
            }
        } catch (error) {
            console.error('Error loading submissions:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReview = async (status: 'approved' | 'rejected') => {
        if (!selectedSubmission) return

        try {
            await submissionsAPI.review(selectedSubmission._id, {
                status,
                comment: reviewComment,
                pointsEarned: status === 'approved' ? 10 : 0
            })

            setSelectedSubmission(null)
            setReviewComment('')
            loadSubmissions()

            alert(status === 'approved' ? 'Задание принято! +10 очков' : 'Задание отклонено. +5 очков за проверку')
        } catch (error) {
            console.error('Error reviewing submission:', error)
            alert('Ошибка при проверке задания')
        }
    }

    if (user?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-error mb-4">Доступ запрещён</h1>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    const filteredSubmissions = submissions

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">📝 Проверка заданий</h1>
                <p className="text-gray-600">Проверяйте задания учеников и зарабатывайте очки</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'pending' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('pending')}
                >
                    ⏳ На проверке ({submissions.filter(s => s.status === 'pending').length})
                </Button>
                <Button
                    variant={filter === 'approved' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('approved')}
                >
                    ✅ Принятые
                </Button>
                <Button
                    variant={filter === 'rejected' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('rejected')}
                >
                    ❌ Отклонённые
                </Button>
                <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('all')}
                >
                    📋 Все
                </Button>
            </div>

            {/* Submissions List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-gray-600">Нет заданий</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredSubmissions.map((submission) => (
                        <Card key={submission._id}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                            {submission.student?.name.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{submission.taskTitle}</h3>
                                            <p className="text-sm text-gray-600">
                                                {submission.student?.name} • {submission.student?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3">{submission.description}</p>
                                    {submission.fileUrl && (
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-sm"
                                        >
                                            📎 Прикреплённый файл
                                        </a>
                                    )}
                                    <div className="mt-3 text-sm text-gray-500">
                                        Отправлено: {new Date(submission.createdAt).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    {submission.status === 'pending' ? (
                                        <Button
                                            onClick={() => setSelectedSubmission(submission)}
                                            variant="primary"
                                        >
                                            Проверить
                                        </Button>
                                    ) : (
                                        <span className={`px-4 py-2 rounded-lg font-semibold ${submission.status === 'approved'
                                                ? 'bg-success/10 text-success'
                                                : 'bg-error/10 text-error'
                                            }`}>
                                            {submission.status === 'approved' ? '✅ Принято' : '❌ Отклонено'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {submission.reviewComment && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-700 mb-1">Комментарий:</p>
                                    <p className="text-sm text-gray-600">{submission.reviewComment}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {selectedSubmission && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setSelectedSubmission(null)
                        setReviewComment('')
                    }}
                    title="Проверка задания"
                >
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg mb-2">{selectedSubmission.taskTitle}</h3>
                            <p className="text-gray-600 mb-2">
                                Ученик: {selectedSubmission.student?.name}
                            </p>
                            <p className="text-gray-700">{selectedSubmission.description}</p>
                        </div>

                        <Textarea
                            label="Комментарий"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Оставьте комментарий для ученика..."
                            rows={4}
                        />

                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleReview('approved')}
                                variant="primary"
                                className="flex-1"
                            >
                                ✅ Принять (+10 очков)
                            </Button>
                            <Button
                                onClick={() => handleReview('rejected')}
                                variant="secondary"
                                className="flex-1"
                            >
                                ❌ Отклонить (+5 очков)
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
