export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface Submission {
    id: string
    userId: string
    userName: string
    taskId: string
    taskTitle: string
    content: string
    files?: string[] // URLs загруженных файлов
    status: SubmissionStatus
    feedback?: string
    reviewedBy?: string
    reviewerName?: string
    reviewedAt?: string
    submittedAt: string
    grade?: number // Оценка от 1 до 10
}

export const statusLabels: Record<SubmissionStatus, string> = {
    pending: '⏳ На проверке',
    approved: '✅ Одобрено',
    rejected: '❌ Отклонено',
}

export const statusColors: Record<SubmissionStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
}
