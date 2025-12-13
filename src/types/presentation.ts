// Presentation Types
export type ProjectStatus = 'planning' | 'code_generated' | 'ready_for_defense'
export type FeedbackType = 'error' | 'warning' | 'success'
export type SlideType = 'title' | 'problem' | 'solution' | 'technology' | 'demo' | 'roadmap' | 'team' | 'metrics' | 'conclusion'

export interface TechStack {
    backend: string
    database: string
    frontend: string
    deployment?: string
}

export interface ContextVariables {
    idea: string
    audience_persona: string
    presentation_target: string
    problem_statement: string
    target_market?: string
}

export interface PromptContent {
    title: string
    content: string
}

export interface PromptPack {
    database_prompt?: PromptContent
    backend_prompt?: PromptContent
    frontend_prompt?: PromptContent
}

export interface StoryboardSlide {
    slide_index: number
    type: SlideType
    title: string
    on_screen_bullets: string[]
    speaker_notes: string
}

export interface ReviewFeedback {
    slideNumber: number
    type: FeedbackType
    message: string
    suggestion: string
}

export interface DefenseReadiness {
    score_percent: number
    summary_status: FeedbackType
    review_feedback: ReviewFeedback[]
}

export interface Project {
    id: string
    title: string
    status: ProjectStatus
    tech_stack: TechStack
    context_variables: ContextVariables
    prompt_pack: PromptPack
    storyboard: StoryboardSlide[]
    defense_readiness: DefenseReadiness
    author_id: string
    team_members?: string[]
    created_at: Date
    updated_at: Date
}

export interface ContentTemplate {
    type: SlideType
    templates: string[]
}

export interface QAFeedbackTemplate {
    type: FeedbackType
    messages: string[]
    suggestions: string[]
}
