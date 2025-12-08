import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Submission, SubmissionStatus } from '@/types/submission'
import { generateId } from '@/utils/uuid'

interface SubmissionStore {
    submissions: Submission[]
    createSubmission: (taskId: string, taskTitle: string, content: string, files?: string[]) => void
    reviewSubmission: (submissionId: string, status: SubmissionStatus, feedback: string, grade?: number) => void
    getSubmissionsByUser: (userId: string) => Submission[]
    getSubmissionsByTask: (taskId: string) => Submission[]
    getPendingSubmissions: () => Submission[]
    getMySubmissions: () => Submission[]
}

export const useSubmissionStore = create<SubmissionStore>()(
    persist(
        (set, get) => ({
            submissions: [],

            createSubmission: (taskId: string, taskTitle: string, content: string, files?: string[]) => {
                const userStr = localStorage.getItem('auth-storage')
                if (!userStr) return

                const authData = JSON.parse(userStr)
                const user = authData.state?.user

                if (!user) return

                const newSubmission: Submission = {
                    id: generateId(),
                    userId: user.id,
                    userName: user.name,
                    taskId,
                    taskTitle,
                    content,
                    files,
                    status: 'pending',
                    submittedAt: new Date().toISOString(),
                }

                set({ submissions: [...get().submissions, newSubmission] })
            },

            reviewSubmission: (submissionId: string, status: SubmissionStatus, feedback: string, grade?: number) => {
                const userStr = localStorage.getItem('auth-storage')
                if (!userStr) return

                const authData = JSON.parse(userStr)
                const user = authData.state?.user

                if (!user || (user.role !== 'admin' && user.role !== 'senior_admin' && user.role !== 'developer')) {
                    return
                }

                const updatedSubmissions = get().submissions.map(sub =>
                    sub.id === submissionId
                        ? {
                            ...sub,
                            status,
                            feedback,
                            grade,
                            reviewedBy: user.id,
                            reviewerName: user.name,
                            reviewedAt: new Date().toISOString(),
                        }
                        : sub
                )

                set({ submissions: updatedSubmissions })
            },

            getSubmissionsByUser: (userId: string) => {
                return get().submissions.filter(sub => sub.userId === userId)
            },

            getSubmissionsByTask: (taskId: string) => {
                return get().submissions.filter(sub => sub.taskId === taskId)
            },

            getPendingSubmissions: () => {
                return get().submissions.filter(sub => sub.status === 'pending')
            },

            getMySubmissions: () => {
                const userStr = localStorage.getItem('auth-storage')
                if (!userStr) return []

                const authData = JSON.parse(userStr)
                const user = authData.state?.user

                if (!user) return []

                return get().submissions.filter(sub => sub.userId === user.id)
            },
        }),
        {
            name: 'submission-storage',
        }
    )
)
