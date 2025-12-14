import { useAIContext } from '@/store/aiContextStore'
import { sendTextMessage } from '@/api/gemini'
import { useState } from 'react'

export const useAIAssistant = (context?: { projectId?: string; page?: string }) => {
    const {
        currentConversation,
        addMessage,
        startConversation,
        updateGlobalContext,
        shareContextToAssistant,
        getSharedContext,
    } = useAIContext()

    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = async (userMessage: string, additionalContext?: any) => {
        // Add user message
        addMessage({
            role: 'user',
            content: userMessage,
            context: {
                ...context,
                ...additionalContext,
            },
        })

        setIsLoading(true)

        try {
            // Get shared context from other pages
            const sharedContext = getSharedContext()

            // Build context-aware prompt
            const contextPrompt = `
Контекст разговора:
${sharedContext.globalContext.currentProject ? `- Текущий проект: ${sharedContext.globalContext.currentProject}` : ''}
${sharedContext.globalContext.currentFile ? `- Текущий файл: ${sharedContext.globalContext.currentFile}` : ''}
${sharedContext.recentMessages.length > 0 ? `- Последние сообщения:\n${sharedContext.recentMessages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}` : ''}

Вопрос пользователя: ${userMessage}

Ответь как опытный AI-помощник, учитывая весь контекст.
`

            // Call Gemini API
            const response = await sendTextMessage(contextPrompt)

            // Add AI response
            addMessage({
                role: 'assistant',
                content: response,
                context: {
                    ...context,
                    ...additionalContext,
                },
            })
        } catch (error) {
            console.error('AI Error:', error)
            addMessage({
                role: 'assistant',
                content: 'Извините, произошла ошибка. Попробуйте ещё раз.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const switchToProject = (projectId: string, projectData?: any) => {
        shareContextToAssistant(projectId, projectData)
    }

    const updateContext = (newContext: any) => {
        updateGlobalContext(newContext)
    }

    return {
        messages: currentConversation?.messages || [],
        isLoading,
        sendMessage,
        switchToProject,
        updateContext,
        sharedContext: getSharedContext(),
    }
}
