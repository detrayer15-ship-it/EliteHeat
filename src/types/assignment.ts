export interface Assignment {
    id: string
    projectId: string
    title: string
    description: string
    answer?: string
    completed: boolean
    createdAt: string
    updatedAt: string
    icon?: string
    category?: string
}
