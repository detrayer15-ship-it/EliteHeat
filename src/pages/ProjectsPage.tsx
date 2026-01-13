import { useProjectStore } from '@/store/projectStore'
import { ProjectList } from '@/modules/projects/ProjectList'
import { FolderKanban, Plus, TrendingUp, CheckCircle2, Clock, Sparkles, Zap } from 'lucide-react'

export const ProjectsPage = () => {
    const projects = useProjectStore((state) => state.projects)

    const completedProjects = projects.filter(p => p.status === 'completed').length
    const inProgressProjects = projects.filter(p => p.status === 'active').length
    const plannedProjects = projects.filter(p => p.status === 'active' && p.stage === 'idea').length

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Premium Header with Animation */}
                <div className="mb-8 relative">
                    {/* Floating background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Animated Icon */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                                        <FolderKanban className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                                        Мои проекты
                                    </h1>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        {projects.length === 0
                                            ? 'Создайте свой первый проект'
                                            : `Всего проектов: ${projects.length}`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Stats Cards with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Completed Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-green-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">Завершено</h3>
                                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                                {completedProjects}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-green-500" />
                                Готовых проектов
                            </p>
                        </div>
                    </div>

                    {/* In Progress Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-blue-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">В работе</h3>
                                <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                                {inProgressProjects}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-blue-500" />
                                Активных проектов
                            </p>
                        </div>
                    </div>

                    {/* Planned Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-purple-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">Запланировано</h3>
                                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                                {plannedProjects}
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-purple-500" />
                                Будущих проектов
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium Projects List */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/50">
                        <ProjectList />
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -30px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(30px, 30px) scale(1.05); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-blob {
                    animation: blob 7s ease-in-out infinite;
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    )
}
