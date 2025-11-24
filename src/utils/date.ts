export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const isOverdue = (deadline: string): boolean => {
    return new Date(deadline) < new Date()
}
