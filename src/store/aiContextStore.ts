import { create } from 'zustand'

type Role = 'user' | 'assistant'

export type AIContextMessage = {
    role: Role
    content: string
    context?: Record<string, unknown>
}

type AIContextState = {
    messages: AIContextMessage[]
    addMessage: (msg: AIContextMessage) => void
    clear: () => void
    /**
     * Hook used by project creation flow to share project context.
     * For now it’s a safe no-op that keeps the build working.
     */
    shareContextToAssistant: (projectId: string, context: Record<string, unknown>) => void
}

export const useAIContext = create<AIContextState>((set) => ({
    messages: [],
    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
    clear: () => set({ messages: [] }),
    shareContextToAssistant: () => { },
}))

