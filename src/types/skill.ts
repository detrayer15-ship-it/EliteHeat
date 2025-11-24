export interface Skill {
    id: string
    title: string
    description: string
    category: string
    progress: number
}

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: string
}
