import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatMessage, ChatSession } from '@/types/chat'
import { generateId } from '@/utils/uuid'

interface ChatStore {
    sessions: ChatSession[]
    currentSessionId: string | null
    isLoading: boolean

    createSession: (title?: string) => string
    addMessage: (sessionId: string, role: 'user' | 'assistant', content: string) => void
    getCurrentSession: () => ChatSession | null
    deleteSession: (sessionId: string) => void
    setCurrentSession: (sessionId: string) => void
    sendMessage: (message: string) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            sessions: [],
            currentSessionId: null,
            isLoading: false,

            createSession: (title = 'Новый чат') => {
                const newSession: ChatSession = {
                    id: generateId(),
                    title,
                    messages: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                set({
                    sessions: [...get().sessions, newSession],
                    currentSessionId: newSession.id,
                })

                return newSession.id
            },

            addMessage: (sessionId: string, role: 'user' | 'assistant', content: string) => {
                const message: ChatMessage = {
                    id: generateId(),
                    role,
                    content,
                    timestamp: new Date().toISOString(),
                }

                const updatedSessions = get().sessions.map(session =>
                    session.id === sessionId
                        ? {
                            ...session,
                            messages: [...session.messages, message],
                            updatedAt: new Date().toISOString(),
                        }
                        : session
                )

                set({ sessions: updatedSessions })
            },

            getCurrentSession: () => {
                const { sessions, currentSessionId } = get()
                return sessions.find(s => s.id === currentSessionId) || null
            },

            deleteSession: (sessionId: string) => {
                const { sessions, currentSessionId } = get()
                const updatedSessions = sessions.filter(s => s.id !== sessionId)

                set({
                    sessions: updatedSessions,
                    currentSessionId: currentSessionId === sessionId
                        ? (updatedSessions[0]?.id || null)
                        : currentSessionId,
                })
            },

            setCurrentSession: (sessionId: string) => {
                set({ currentSessionId: sessionId })
            },

            sendMessage: async (message: string) => {
                const { currentSessionId, addMessage } = get()

                if (!currentSessionId) {
                    const newSessionId = get().createSession()
                    set({ currentSessionId: newSessionId })
                }

                const sessionId = get().currentSessionId!

                // Добавляем сообщение пользователя
                addMessage(sessionId, 'user', message)

                set({ isLoading: true })

                try {
                    // Симуляция AI ответа (в реальности здесь будет API запрос к OpenAI)
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    const aiResponse = generateMockAIResponse(message)
                    addMessage(sessionId, 'assistant', aiResponse)
                } catch (error) {
                    console.error('Error sending message:', error)
                    addMessage(sessionId, 'assistant', 'Извините, произошла ошибка. Попробуйте еще раз.')
                } finally {
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: 'chat-storage',
        }
    )
)

// Временная функция для симуляции AI ответов
function generateMockAIResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('python') || lowerMessage.includes('код')) {
        return `Конечно! Вот пример кода на Python:\n\n\`\`\`python\ndef hello_world():\n    print("Hello, World!")\n\nhello_world()\n\`\`\`\n\nЭтот код выводит "Hello, World!" в консоль. Есть вопросы?`
    }

    if (lowerMessage.includes('помощь') || lowerMessage.includes('как')) {
        return 'Я AI-помощник EliteHeat! Могу помочь с:\n\n• Программированием (Python, JavaScript, и др.)\n• Объяснением концепций\n• Проверкой кода\n• Советами по обучению\n\nЗадайте мне любой вопрос!'
    }

    if (lowerMessage.includes('спасибо')) {
        return 'Пожалуйста! Рад помочь. Если есть еще вопросы - обращайтесь! 😊'
    }

    return `Понял ваш вопрос: "${userMessage}"\n\nЯ AI-помощник и готов помочь с программированием и обучением. В будущем здесь будет интеграция с ChatGPT для более точных ответов.\n\nЧем еще могу помочь?`
}
