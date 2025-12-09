import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useSubmissionStore } from '@/store/submissionStore'
import { useAuthStore } from '@/store/authStore'
import { statusLabels, statusColors } from '@/types/submission'

export const SubmissionsPage = () => {
    const user = useAuthStore((state) => state.user)
    const mySubmissions = useSubmissionStore((state) => state.getMySubmissions())
    const pendingSubmissions = useSubmissionStore((state) => state.getPendingSubmissions())
    const reviewSubmission = useSubmissionStore((state) => state.reviewSubmission)

    const [selectedTab, setSelectedTab] = useState<'my' | 'review'>('my')
    const [reviewingId, setReviewingId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState('')
    const [grade, setGrade] = useState(5)

    const isAdmin = user?.role === 'admin'

    const handleApprove = (submissionId: string) => {
        reviewSubmission(submissionId, 'approved', feedback, grade)
        setReviewingId(null)
        setFeedback('')
        setGrade(5)
    }

    const handleReject = (submissionId: string) => {
        reviewSubmission(submissionId, 'rejected', feedback, grade)
        setReviewingId(null)
        setFeedback('')
        setGrade(5)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">📝 Задания</h1>
                <p className="text-gray-600">
                    {isAdmin ? 'Проверка заданий учеников' : 'Мои отправленные задания'}
                </p>
            </div>

            {/* Tabs */}
            {isAdmin && (
                <div className="flex gap-2 border-b">
                    <button
                        onClick={() => setSelectedTab('my')}
                        className={`px-4 py-2 font-semibold transition-smooth ${selectedTab === 'my'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Мои задания ({mySubmissions.length})
                    </button>
                    <button
                        onClick={() => setSelectedTab('review')}
                        className={`px-4 py-2 font-semibold transition-smooth ${selectedTab === 'review'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        На проверку ({pendingSubmissions.length})
                    </button>
                </div>
            )}

            {/* My Submissions */}
            {selectedTab === 'my' && (
                <div className="space-y-4">
                    {mySubmissions.length > 0 ? (
                        mySubmissions.map((submission) => (
                            <Card key={submission.id}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">{submission.taskTitle}</h3>
                                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColors[submission.status]}`}>
                                                {statusLabels[submission.status]}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{submission.content}</p>
                                        <div className="text-xs text-gray-500">
                                            Отправлено: {new Date(submission.submittedAt).toLocaleString('ru-RU')}
                                        </div>

                                        {/* Feedback */}
                                        {submission.feedback && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold">Отзыв преподавателя:</span>
                                                    {submission.grade && (
                                                        <span className="px-2 py-1 bg-primary text-white rounded text-sm font-bold">
                                                            {submission.grade}/10
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm">{submission.feedback}</p>
                                                {submission.reviewerName && (
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Проверил: {submission.reviewerName}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-xl font-semibold text-text mb-2">Нет отправленных заданий</h3>
                                <p className="text-gray-600">Выполните задание и отправьте его на проверку</p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Review Submissions (Admin only) */}
            {selectedTab === 'review' && isAdmin && (
                <div className="space-y-4">
                    {pendingSubmissions.length > 0 ? (
                        pendingSubmissions.map((submission) => (
                            <Card key={submission.id}>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">{submission.taskTitle}</h3>
                                            <span className="text-sm text-gray-600">от {submission.userName}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{submission.content}</p>
                                        <div className="text-xs text-gray-500">
                                            Отправлено: {new Date(submission.submittedAt).toLocaleString('ru-RU')}
                                        </div>
                                    </div>

                                    {reviewingId === submission.id ? (
                                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Оценка (1-10)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={grade}
                                                    onChange={(e) => setGrade(Number(e.target.value))}
                                                    className="w-20 px-3 py-2 border rounded-lg"
                                                />
                                            </div>
                                            <Textarea
                                                label="Отзыв"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Напишите отзыв для ученика..."
                                                rows={4}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleApprove(submission.id)}
                                                    disabled={!feedback}
                                                >
                                                    ✅ Одобрить
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleReject(submission.id)}
                                                    disabled={!feedback}
                                                >
                                                    ❌ Отклонить
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setReviewingId(null)
                                                        setFeedback('')
                                                        setGrade(5)
                                                    }}
                                                >
                                                    Отмена
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button onClick={() => setReviewingId(submission.id)}>
                                            📝 Проверить
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-xl font-semibold text-text mb-2">Все задания проверены!</h3>
                                <p className="text-gray-600">Нет заданий, ожидающих проверки</p>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
