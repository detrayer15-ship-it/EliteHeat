import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { ProjectRoadmap } from '@/components/project/ProjectRoadmap'
import { ProjectPrompts } from '@/components/project/ProjectPrompts'
import { ProjectStoryboard } from '@/components/project/ProjectStoryboard'
import { AICopilot } from '@/components/project/AICopilot'

type TabType = 'roadmap' | 'prompts' | 'storyboard'

export const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.currentUser)
    const [activeTab, setActiveTab] = useState<TabType>('roadmap')
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // AI Mode в зависимости от таба
    const getAIMode = () => {
        switch (activeTab) {
            case 'roadmap':
                return { icon: '🎯', title: 'Mentor Mode', description: 'Помогаю сформулировать идею и план' }
            case 'prompts':
                return { icon: '🏗️', title: 'Architect Mode', description: 'Генерирую технические промпты' }
            case 'storyboard':
                return { icon: '🎤', title: 'Speaker Coach', description: 'Готовлю презентацию для защиты' }
        }
    }

    useEffect(() => {
        loadProject()
    }, [projectId])

    const loadProject = async () => {
        if (!projectId) {
            setLoading(false)
            return
        }

        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId))
            if (projectDoc.exists()) {
                setProject({ id: projectDoc.id, ...projectDoc.data() })
            }
        } catch (error) {
            console.error('Error loading project:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка проекта...</p>
                </div>
            </div>
        )
    }

    // Если проект не найден - создаём демо
    const displayProject = project || {
        id: projectId,
        title: 'Новый проект',
        description: 'Описание появится после настройки',
        status: 'planning' as const,
    }

    const aiMode = getAIMode()

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Левая панель - Блоки управления */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                <h3 className="font-bold text-sm text-gray-600 mb-3">УПРАВЛЕНИЕ</h3>

                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/projects')}
                        className="w-full px-3 py-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        ← Все проекты
                    </button>

                    <button
                        onClick={() => {
                            alert('💾 Проект сохранён!')
                        }}
                        className="w-full px-3 py-2 text-left text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        💾 Сохранить
                    </button>

                    <button
                        onClick={() => {
                            const content = `Проект: ${displayProject.title}\n\nОписание: ${displayProject.description}\n\nСтатус: ${displayProject.status}\n\nЭкспортировано: ${new Date().toLocaleString()}`
                            const blob = new Blob([content], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${displayProject.title}.txt`
                            a.click()
                            URL.revokeObjectURL(url)
                            alert('📋 Проект экспортирован!')
                        }}
                        className="w-full px-3 py-2 text-left text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    >
                        📋 Экспорт
                    </button>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold text-sm text-gray-600 mb-3">СТАТУС</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Прогресс:</span>
                            <span className="font-bold text-blue-600">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Центральная панель - Контент */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {displayProject.title}
                            </h1>
                            <p className="text-gray-600 mt-1">{displayProject.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${displayProject.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                displayProject.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                {displayProject.status === 'planning' ? '📋 Planning' :
                                    displayProject.status === 'in-progress' ? '🔄 In Progress' :
                                        '✅ Ready'}
                            </span>
                        </div>
                    </div>

                    {/* Табы */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'roadmap'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            📋 Idea & Roadmap
                        </button>
                        <button
                            onClick={() => setActiveTab('prompts')}
                            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'prompts'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            ⚙️ Prompt Pack
                        </button>
                        <button
                            onClick={() => setActiveTab('storyboard')}
                            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === 'storyboard'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            🎞️ Storyboard
                        </button>
                    </div>
                </div>

                {/* Контент табов */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'roadmap' && <ProjectRoadmap projectId={projectId!} />}
                    {activeTab === 'prompts' && <ProjectPrompts projectId={projectId!} />}
                    {activeTab === 'storyboard' && <ProjectStoryboard projectId={projectId!} />}
                </div>
            </div>

            {/* Правая панель - AI Copilot */}
            <AICopilot activeTab={activeTab} />
        </div>
    )
}
