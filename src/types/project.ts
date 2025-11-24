export type ProjectStage = 'idea' | 'prototype' | 'presentation'

export interface Task {
    id: string
    title: string
    completed: boolean
    deadline?: string
    category?: string
    projectId: string
}

export interface Slide {
    id: string
    title: string
    content: string
}

export interface Presentation {
    slides: Slide[]
}

export interface Project {
    id: string
    title: string
    description: string
    category?: 'mini' | 'extended' | 'game'
    externalUrl?: string
    problem: string
    solution: string
    audience: string
    stage: ProjectStage
    progress: number
    tasks: Task[]
    presentation?: Presentation
    createdAt: string
    updatedAt: string
}
