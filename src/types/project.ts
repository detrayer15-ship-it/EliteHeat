export type ProjectStage = 'idea' | 'prototype' | 'presentation' | 'completed'

export interface Task {
    id: string
    title: string
    completed: boolean
    deadline?: string
    category?: string
    projectId: string
    // AI-generated task fields
    aiGenerated?: boolean
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    subject?: 'python' | 'figma'
    description?: string
    hints?: string[]
    estimatedTime?: number // in minutes
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
    userId: string
    title: string
    description: string
    category?: 'mini' | 'extended' | 'game'
    type?: 'app' | 'site' | 'mvp' | 'other'
    externalUrl?: string
    problem: string
    solution: string
    audience: string
    goal?: string
    stage: ProjectStage
    status?: 'active' | 'completed' | 'archived'
    progress: number
    tasks: Task[]
    presentation?: Presentation
    techStack?: {
        frontend: string
        backend: string
        db: string
    }

    // New dashboard fields
    essence?: string // Суть проекта
    painPoint?: string // Боль клиента

    roadmap?: Array<{
        id: string
        title: string
        isCompleted: boolean
        order: number
    }>

    prompts?: Array<{
        id: string
        title: string
        content: string
        category: 'database' | 'backend' | 'frontend' | 'other'
    }>

    slides?: Array<{
        id: string
        order: number
        title: string
        bullets: string[]
        speakerNotes: string
    }>

    createdAt: string
    updatedAt: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export interface ProjectAnalysis {
    title: string
    type: 'app' | 'site' | 'mvp' | 'other'
    description: string
    goal: string
    needsClarification: boolean
    clarificationQuestion?: string
}
