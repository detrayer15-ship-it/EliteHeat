import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AIMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    context?: {
        projectId?: string
        fileName?: string
        codeSnippet?: string
        page?: string
        [key: string]: any  // Позволяет любые дополнительные поля
    }
}

export interface AIConversation {
    id: string
    title: string
    messages: AIMessage[]
    createdAt: Date
    updatedAt: Date
}

interface AIContextState {
    // Current conversation
    currentConversation: AIConversation | null
    conversations: AIConversation[]

    // Global AI context
    globalContext: {
        currentProject?: string
        currentFile?: string
        userGoal?: string
        recentTopics: string[]
    }

    // Actions
    startConversation: (title?: string) => string
    addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void
    setCurrentConversation: (id: string) => void
    updateGlobalContext: (context: Partial<AIContextState['globalContext']>) => void
    clearConversation: () => void
    deleteConversation: (id: string) => void

    // Cross-page communication
    shareContextToAssistant: (projectId: string, additionalContext?: any) => void
    getSharedContext: () => any
}

export const useAIContext = create<AIContextState>()(
    persist(
        (set, get) => ({
            currentConversation: null,
            conversations: [],
            globalContext: {
                recentTopics: [],
            },

            startConversation: (title = 'Новый чат') => {
                const newConversation: AIConversation = {
                    id: Date.now().toString(),
                    title,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                set((state) => ({
                    currentConversation: newConversation,
                    conversations: [...state.conversations, newConversation],
                }))

                return newConversation.id
            },

            addMessage: (message) => {
                const newMessage: AIMessage = {
                    ...message,
                    id: Date.now().toString(),
                    timestamp: new Date(),
                }

                set((state) => {
                    if (!state.currentConversation) {
                        // Create new conversation if none exists
                        const newConv: AIConversation = {
                            id: Date.now().toString(),
                            title: message.content.slice(0, 50),
                            messages: [newMessage],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                        return {
                            currentConversation: newConv,
                            conversations: [...state.conversations, newConv],
                        }
                    }

                    // Update existing conversation
                    const updatedConversation = {
                        ...state.currentConversation,
                        messages: [...state.currentConversation.messages, newMessage],
                        updatedAt: new Date(),
                    }

                    return {
                        currentConversation: updatedConversation,
                        conversations: state.conversations.map((conv) =>
                            conv.id === updatedConversation.id ? updatedConversation : conv
                        ),
                    }
                })

                // Update recent topics
                if (message.role === 'user') {
                    set((state) => ({
                        globalContext: {
                            ...state.globalContext,
                            recentTopics: [
                                message.content.slice(0, 50),
                                ...state.globalContext.recentTopics.slice(0, 4),
                            ],
                        },
                    }))
                }
            },

            setCurrentConversation: (id) => {
                const conversation = get().conversations.find((conv) => conv.id === id)
                if (conversation) {
                    set({ currentConversation: conversation })
                }
            },

            updateGlobalContext: (context) => {
                set((state) => ({
                    globalContext: {
                        ...state.globalContext,
                        ...context,
                    },
                }))
            },

            clearConversation: () => {
                set({ currentConversation: null })
            },

            deleteConversation: (id) => {
                set((state) => ({
                    conversations: state.conversations.filter((conv) => conv.id !== id),
                    currentConversation:
                        state.currentConversation?.id === id ? null : state.currentConversation,
                }))
            },

            // Cross-page communication methods
            shareContextToAssistant: (projectId, additionalContext = {}) => {
                set((state) => ({
                    globalContext: {
                        ...state.globalContext,
                        currentProject: projectId,
                        ...additionalContext,
                    },
                }))

                // Add system message about context switch
                const systemMessage: Omit<AIMessage, 'id' | 'timestamp'> = {
                    role: 'system',
                    content: `Переключился на проект: ${projectId}`,
                    context: {
                        projectId,
                        page: 'assistant',
                        ...additionalContext,
                    },
                }

                get().addMessage(systemMessage)
            },

            getSharedContext: () => {
                return {
                    globalContext: get().globalContext,
                    currentConversation: get().currentConversation,
                    recentMessages: get().currentConversation?.messages.slice(-5) || [],
                }
            },
        }),
        {
            name: 'ai-context-storage',
            partialize: (state) => ({
                conversations: state.conversations,
                globalContext: state.globalContext,
            }),
        }
    )
)
