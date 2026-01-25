import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createAIChat } from '@/api/aiChats'
import { Timestamp } from 'firebase/firestore'

export interface AIMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: any // Handling both Date and Firestore Timestamp for flexibility
    context?: {
        projectId?: string
        fileName?: string
        codeSnippet?: string
        page?: string
        [key: string]: any
    }
}

export interface AIConversation {
    id: string
    title: string
    messages: AIMessage[]
    timestamp: any
    updatedAt: any
}

interface AIContextState {
    currentConversation: AIConversation | null
    conversations: AIConversation[]
    globalContext: {
        currentProject?: string
        currentFile?: string
        userGoal?: string
        recentTopics: string[]
    }

    // Actions
    startConversation: (title?: string) => Promise<string>
    addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void
    setCurrentConversation: (id: string) => void
    updateGlobalContext: (context: Partial<AIContextState['globalContext']>) => void
    clearConversation: () => void
    deleteConversation: (id: string) => void
    setMessages: (chatId: string, messages: AIMessage[]) => void
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

            startConversation: async (title = 'Новый чат') => {
                try {
                    // Create in Firestore first to get a real ID
                    const newChat = await createAIChat(title)

                    const newConversation: AIConversation = {
                        id: newChat.id,
                        title: newChat.title,
                        messages: [],
                        timestamp: newChat.timestamp,
                        updatedAt: newChat.updatedAt,
                    }

                    set((state) => ({
                        currentConversation: newConversation,
                        conversations: [newConversation, ...state.conversations],
                    }))

                    return newConversation.id
                } catch (error) {
                    console.error('Failed to start AI conversation:', error)
                    throw error
                }
            },

            addMessage: (message) => {
                const newMessage: AIMessage = {
                    ...message,
                    id: Date.now().toString(),
                    timestamp: new Date(),
                }

                set((state) => {
                    if (!state.currentConversation) return state

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

            setMessages: (chatId, messages) => {
                set((state) => {
                    const updatedConversations = state.conversations.map((conv) =>
                        conv.id === chatId ? { ...conv, messages, updatedAt: new Date() } : conv
                    )

                    const isCurrent = state.currentConversation?.id === chatId
                    const currentConversation = isCurrent
                        ? { ...state.currentConversation!, messages, updatedAt: new Date() }
                        : state.currentConversation

                    return {
                        conversations: updatedConversations,
                        currentConversation
                    }
                })
            },

            shareContextToAssistant: (projectId, additionalContext = {}) => {
                set((state) => ({
                    globalContext: {
                        ...state.globalContext,
                        currentProject: projectId,
                        ...additionalContext,
                    },
                }))

                const systemMessage: Omit<AIMessage, 'id' | 'timestamp'> = {
                    role: 'system',
                    content: `Контекст переключен: ${projectId}`,
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
