export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
}

export interface ChatSession {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
}
