import { Task } from '@/types/project'

export const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0
    const completed = tasks.filter(t => t.completed).length
    return Math.round((completed / tasks.length) * 100)
}
