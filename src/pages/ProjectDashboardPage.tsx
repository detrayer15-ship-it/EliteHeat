import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RoadmapTab } from '@/components/project/RoadmapTab'
import { PromptPackTab } from '@/components/project/PromptPackTab'
import { StoryboardTab } from '@/components/project/StoryboardTab'
import { AiSidebar } from '@/components/project/AiSidebar'
import { useProjectData } from '@/hooks/useProjectData'
import { FileDown, Copy } from 'lucide-react'

type TabType = 'roadmap' | 'prompts' | 'storyboard'

export const ProjectDashboardPage = () => {
    const { id } = useParams<{ id: string }>()
    const [activeTab, setActiveTab] = useState<TabType>('roadmap')
    const { project, loading, error, updateProject } = useProjectData(id!)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка проекта...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Проект не найден</h2>
                    <p className="text-gray-600">{error || 'Проект не существует'}</p>
                </div>
            </div>
        )
    }

    const handleCopyPrompts = () => {
        // TODO: Implement copy all prompts
        alert('Копирование всех промптов...')
    }

    const handleExportPDF = () => {
        // TODO: Implement PDF export
        alert('Экспорт в PDF...')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${project.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {project.status === 'completed' ? '✅ Завершён' : '🟡 В процессе'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Готовность к защите: {project.progress || 0}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopyPrompts}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Экспорт промптов
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                            >
                                <FileDown className="w-4 h-4" />
                                Экспорт PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('roadmap')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'roadmap'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            🗺️ Roadmap & Plan
                        </button>
                        <button
                            onClick={() => setActiveTab('prompts')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'prompts'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            ⚙️ Prompt Pack
                        </button>
                        <button
                            onClick={() => setActiveTab('storyboard')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'storyboard'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            🎞️ Storyboard
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Content Area (75%) */}
                    <div className="lg:col-span-3">
                        {activeTab === 'roadmap' && (
                            <RoadmapTab
                                roadmap={project.roadmap || []}
                                essence={project.essence}
                                goal={project.goal}
                                painPoint={project.painPoint}
                                onUpdate={updateProject}
                            />
                        )}
                        {activeTab === 'prompts' && (
                            <PromptPackTab
                                project={project}
                                prompts={project.prompts || []}
                                onUpdate={updateProject}
                            />
                        )}
                        {activeTab === 'storyboard' && (
                            <StoryboardTab
                                slides={project.slides || []}
                                onUpdate={updateProject}
                            />
                        )}
                    </div>

                    {/* AI Sidebar (25%) */}
                    <div className="lg:col-span-1">
                        <AiSidebar
                            activeTab={activeTab}
                            project={project}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
