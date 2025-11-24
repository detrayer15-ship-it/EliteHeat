export interface RobotProject {
    id: string
    title: string
    description: string
    category: 'mini' | 'extended' | 'game'
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    baseTask: string
    customizationOptions: string[]
    extensionIdeas: string[]
    icon: string
}
