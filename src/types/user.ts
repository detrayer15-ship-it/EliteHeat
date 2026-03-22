export interface User {
    id: string
    email: string
    name: string
    city: string
    role: 'student' | 'teacher' | 'admin' | 'developer'
    teacherApplicationStatus?: 'pending' | 'approved' | 'rejected'
    teacherApplicationSubject?: string
    teacherApplicationDate?: Date
    level?: number
    points?: number
    tasksReviewed?: number
    avatar?: string
    photoURL?: string
    username?: string
    phone?: string
    birthday?: string
    bio?: string
    createdAt?: Date
}

export const roleLabels: Record<string, string> = {
    student: 'Ученик',
    teacher: 'Учитель',
    admin: 'Админ'
}
