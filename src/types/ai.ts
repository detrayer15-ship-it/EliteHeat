export type AITemplateType = 'title' | 'problem' | 'solution' | 'audience' | 'presentation'

export interface AITemplate {
    type: AITemplateType
    templates: string[]
}

export interface AISuggestion {
    id: string
    type: AITemplateType
    content: string
    timestamp: string
}
