import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { assignmentsAPI } from '@/api/assignments'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface Assignment {
    id: string
    title: string
    description: string
}

interface Submission {
    id: string
    assignmentId: string
    status: string
    content: string
    submittedAt: any
}

export const MyAssignmentsPage = () => {
    const user = useAuthStore(state => state.user)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const assignmentsRes = await assignmentsAPI.getAll()
        if (assignmentsRes.success) {
            setAssignments(assignmentsRes.data as Assignment[])
        }

        if (user) {
            const submissionsRes = await assignmentsAPI.getMySubmissions(user.id)
            if (submissionsRes.success) {
                setSubmissions(submissionsRes.data as Submission[])
            }
        }
    }

    const handleSubmit = async (assignmentId: string) => {
        if (!content.trim() || !user) return

        setIsSubmitting(true)
        const result = await assignmentsAPI.submitAssignment(
            assignmentId,
            user.id,
            user.name,
            content
        )

        if (result.success) {
            setContent('')
            setSelectedAssignment(null)
            loadData()
        }
        setIsSubmitting(false)
    }

    const getSubmissionStatus = (assignmentId: string) => {
        const submission = submissions.find(s => s.assignmentId === assignmentId)
        if (!submission) return null

        const statusLabels: Record<string, string> = {
            pending: '⏳ Ожидает проверки',
            approved: '✅ Принято',
            rejected: '❌ Отклонено'
        }

        return statusLabels[submission.status] || submission.status
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Мои задания</h1>

            <div className="grid gap-6">
                {assignments.map(assignment => {
                    const status = getSubmissionStatus(assignment.id)
                    const isExpanded = selectedAssignment === assignment.id

                    return (
                        <Card key={assignment.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
                                </div>
                                {status && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                        {status}
                                    </span>
                                )}
                            </div>

                            {!status && (
                                <>
                                    {!isExpanded ? (
                                        <Button
                                            onClick={() => setSelectedAssignment(assignment.id)}
                                            className="mt-4"
                                        >
                                            Отправить работу
                                        </Button>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            <Textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Введите текст вашей работы..."
                                                rows={6}
                                                className="w-full"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleSubmit(assignment.id)}
                                                    disabled={isSubmitting || !content.trim()}
                                                >
                                                    {isSubmitting ? 'Отправка...' : 'Отправить на проверку'}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedAssignment(null)
                                                        setContent('')
                                                    }}
                                                >
                                                    Отмена
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    )
                })}

                {assignments.length === 0 && (
                    <Card className="p-8 text-center text-gray-500">
                        Заданий пока нет
                    </Card>
                )}
            </div>
        </div>
    )
}
