import { useAIContext } from '@/store/aiContextStore'
import { sendAIChatMessage, type ChatMode } from '@/api/gemini'
import { subscribeToAIChatMessages } from '@/api/aiMessages'
import { useState, useEffect, useMemo } from 'react'
import { useGamificationStore } from '@/store/gamificationStore'

export const useAIAssistant = (context?: { projectId?: string; page?: string }) => {
    const {
        currentConversation,
        setMessages,
        startConversation,
        getSharedContext,
    } = useAIContext() as any

    const [isLoading, setIsLoading] = useState(false)
    const [selectedMode, setSelectedMode] = useState<ChatMode>('tutor')
    const [error, setError] = useState<string | null>(null)

    // Gamification store
    const { updateProgress, getAchievement } = useGamificationStore()

    // Subscribe to Firestore messages
    useEffect(() => {
        if (!currentConversation?.id) return

        const unsubscribe = subscribeToAIChatMessages(
            currentConversation.id,
            (firestoreMessages) => {
                // Map Firestore messages to local AIMessage format
                const mappedMessages = firestoreMessages.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: (msg.timestamp as any)?.toDate ? (msg.timestamp as any).toDate() : new Date(),
                    context: msg.meta
                }))

                if (typeof setMessages === 'function') {
                    setMessages(currentConversation.id, mappedMessages)
                }
            }
        )

        return () => unsubscribe()
    }, [currentConversation?.id, setMessages])

    const sendMessage = async (userMessage: string) => {
        let chatId = currentConversation?.id

        // If no active conversation, start one first
        if (!chatId) {
            try {
                chatId = await startConversation('AI Chat (' + new Date().toLocaleDateString() + ')')
            } catch (err) {
                setError('Не удалось создать новый чат.')
                return
            }
        }

        setIsLoading(true)
        setError(null)

        try {
            const sharedContext = getSharedContext()

            const contextPrompt = sharedContext.globalContext.currentProject
                ? `[Context: ${sharedContext.globalContext.currentProject}] ${userMessage}`
                : userMessage

            await sendAIChatMessage(chatId!, contextPrompt, selectedMode)

            // Achievement: Chat Explorer
            const chatExplorer = getAchievement('chat-explorer')
            if (chatExplorer && !chatExplorer.isUnlocked) {
                const newProgress = (chatExplorer.progress || 0) + 1
                await updateProgress('chat-explorer', newProgress, chatExplorer.maxProgress)
            }
        } catch (err: any) {
            console.error('AI Error:', err)
            if (err.message?.includes('requires an index')) {
                setError('Система обновляет базу данных (индексы). Пожалуйста, подождите 2-3 минуты...')
            } else {
                setError('Произошла ошибка при отправке сообщения.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        messages: currentConversation?.messages || [],
        isLoading,
        selectedMode,
        setSelectedMode,
        sendMessage,
        error,
        sharedContext: getSharedContext(),
    }
}
