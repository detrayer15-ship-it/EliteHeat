import { useProjectStore } from '@/store/projectStore'
import { ProjectList } from '@/modules/projects/ProjectList'
import { FolderKanban, Plus, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

export const ProjectsPage = () => {
    const projects = useProjectStore((state) => state.projects)

    const completedProjects = projects.filter(p => p.status === 'completed' || p.stage === 'completed').length
    const inProgressProjects = projects.filter(p => p.status === 'in-progress' || p.stage === 'development').length
    const plannedProjects = projects.filter(p => p.status === 'planned' || p.stage === 'planning').length

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <FolderKanban className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Мои проекты
                                </h1>
                                <p className="text-gray-600">
                                    {projects.length === 0
                                        ? 'Создайте свой первый проект'
                                        : `Всего проектов: ${projects.length}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Завершено</h3>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">{completedProjects}</div>
                        <p className="text-sm text-gray-600">Готовых проектов</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">В работе</h3>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressProjects}</div>
                        <p className="text-sm text-gray-600">Активных проектов</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Запланировано</h3>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">{plannedProjects}</div>
                        <p className="text-sm text-gray-600">Будущих проектов</p>
                    </div>
                </div>

                {/* Projects List */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <ProjectList />
                </div>
            </div>
        </div>
    )
}
