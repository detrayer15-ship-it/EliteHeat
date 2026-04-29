import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Target, Wrench, Presentation, Loader2, Shield, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import type { Project } from '@/types/project'

interface AiSidebarProps {
    activeTab: 'roadmap' | 'prompts' | 'storyboard'
    project: Project
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export const AiSidebar = ({ activeTab, project }: AiSidebarProps) => {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading) return

        // ИИ отключён - просто очищаем поле ввода без отправки
        setMessage('')
        
        // Опционально: показать уведомление что ИИ отключён
        console.log('AI chat disabled in AiSidebar');
    }

    const handleQuickAction = async (action: string) => {
        // ИИ отключён - просто очищаем историю чата
        setChatHistory([])
        console.log('AI quick actions disabled in AiSidebar');
    }

    const getContent = () => {
        switch (activeTab) {
            case 'roadmap':
                return {
                    icon: <Target className="w-6 h-6" />,
                    title: '🎯 Project Mentor',
                    description: 'Помогу спланировать следующие шаги и структурировать работу над проектом',
                    actions: [
                        { label: 'Анализ прогресса', action: 'Проанализируй мой прогресс' },
                        { label: 'Предложить следующий шаг', action: 'Какой следующий шаг?' },
                        { label: 'Сгенерировать roadmap', action: 'Создай roadmap' },
                    ]
                }
            case 'prompts':
                return {
                    icon: <Wrench className="w-6 h-6" />,
                    title: '🛠️ Tech Architect',
                    description: 'Помогу настроить промпты под ваш технологический стек',
                    currentStack: project.techStack,
                    actions: [
                        { label: 'Предложить стек', action: 'Какой стек выбрать?' },
                        { label: 'Создать промпт', action: 'Создай промпт для базы данных' },
                        { label: 'Оптимизировать промпты', action: 'Оптимизируй промпты' },
                    ]
                }
            case 'storyboard':
                return {
                    icon: <Presentation className="w-6 h-6" />,
                    title: '🎤 Presentation Coach',
                    description: 'Помогу подготовить убедительную презентацию для защиты проекта',
                    actions: [
                        { label: 'Симуляция защиты', action: 'Симулируй вопрос от жюри' },
                        { label: 'Улучшить слайд', action: 'Как улучшить слайд 1?' },
                        { label: 'Создать презентацию', action: 'Создай структуру презентации' },
                    ]
                }
        }
    }

    const content = getContent()

    return (
        <div className="sticky top-24 space-y-4">
            {/* AI Mode Card - Disabled */}
            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-2 bg-red-100 rounded-lg"
                    >
                        <Shield className="w-6 h-6 text-red-600" />
                    </motion.div>
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {content.title}
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                <EyeOff className="w-3 h-3 inline" /> OFF
                            </span>
                        </h3>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    {content.description}
                </p>

                {/* Current Stack (for prompts tab) */}
                {content.currentStack && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Текущий стек (доступен):
                        </p>
                        <div className="space-y-1 text-sm">
                            <p>• Frontend: {content.currentStack.frontend || 'Не указан'}</p>
                            <p>• Backend: {content.currentStack.backend || 'Не указан'}</p>
                            <p>• DB: {content.currentStack.db || 'Не указан'}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions - Disabled */}
                <div className="space-y-2">
                    {content.actions.map((action, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickAction(action.action)}
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left flex items-center justify-between"
                        >
                            <span>{action.label}</span>
                            <EyeOff className="w-4 h-4 opacity-50" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Chat Interface */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-5 border border-red-200"
            >
                <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-2 bg-red-100 rounded-lg"
                    >
                        <Shield className="w-5 h-5 text-red-600" />
                    </motion.div>
                    <h4 className="font-bold text-gray-900">AI Чат</h4>
                    <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="ml-auto text-xs bg-red-500 text-white px-3 py-1 rounded-full font-medium flex items-center gap-1"
                    >
                        <EyeOff className="w-3 h-3" /> Отключён
                    </motion.span>
                </div>

                {/* Warning Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-100 rounded-lg flex items-center gap-2"
                >
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <p className="text-xs text-red-800 font-medium">
                        Диалог с ИИ отключён. Сообщения не сохраняются.
                    </p>
                </motion.div>

                {/* Chat History */}
                <AnimatePresence>
                    {chatHistory.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-3 max-h-32 overflow-y-auto space-y-2"
                        >
                            {chatHistory.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`p-2 rounded-lg text-xs ${msg.role === 'user'
                                            ? 'bg-red-100 text-red-900 ml-4'
                                            : 'bg-gray-100 text-gray-900 mr-4'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="ИИ отключён"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 bg-white"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>

                <p className="text-xs text-red-500 mt-3 text-center font-medium flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> ИИ отключён пользователем
                </p>
            </motion.div>

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Информация о проекте</h4>
                <div className="space-y-2 text-xs text-gray-600">
                    <p><span className="font-medium">Название:</span> {project.title}</p>
                    <p><span className="font-medium">Тип:</span> {project.type || 'Не указан'}</p>
                    <p><span className="font-medium">Прогресс:</span> {project.progress || 0}%</p>
                </div>
            </div>
        </div>
    )
}
