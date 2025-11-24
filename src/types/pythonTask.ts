export interface PythonTask {
    id: string
    title: string
    description: string
    fullDescription: string
    videoUrl: string
    videoTitle: string
    steps: string[]
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    completed?: boolean
}
