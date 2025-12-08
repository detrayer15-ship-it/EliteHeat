export type UserRole = 'student' | 'admin' | 'senior_admin' | 'developer'

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    avatar?: string
    level: number
    points: number
    achievements: string[]
    createdAt: string
    updatedAt: string
    isPublic?: boolean
    bio?: string
}

export const roleHierarchy: Record<UserRole, number> = {
    student: 0,
    admin: 1,
    senior_admin: 2,
    developer: 3,
}

export const roleLabels: Record<UserRole, string> = {
    student: '🎓 Ученик',
    admin: '👑 Учитель',
    senior_admin: '⭐ Старший администратор',
    developer: '💻 Разработчик',
}

export const roleDescriptions: Record<UserRole, string> = {
    student: 'Проходит курсы и выполняет задания',
    admin: 'Проверяет задания и управляет учениками',
    senior_admin: 'Управляет всеми администраторами и настройками',
    developer: 'Полный доступ к системе и разработке',
}
