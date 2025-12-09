export interface User {
    id: string
    email: string
    name: string
    city: string
    role: 'student' | 'admin'
    level?: number
    points?: number
    tasksReviewed?: number
    avatar?: string
    bio?: string
    createdAt?: Date
}

export const roleLabels: Record<string, string> = {
    student: 'Ученик',
    admin: 'Админ'
}
