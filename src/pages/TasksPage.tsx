import { useState } from 'react'

import { PythonTasksPage } from './PythonTasksPage'
import { FigmaTasksPage } from './FigmaTasksPage'
import { BookOpen, Code, Palette, TrendingUp, Award, Users } from 'lucide-react'

export const TasksPage = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'figma'>('python')


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Курсы
                            </h1>
                            <p className="text-gray-600">Обучайтесь программированию и дизайну</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Прогресс</h3>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
                        <p className="text-sm text-gray-600">Выполнено уроков</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Достижения</h3>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                        <p className="text-sm text-gray-600">Получено сертификатов</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Сообщество</h3>
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <Users className="w-5 h-5 text-pink-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-pink-600 mb-2">243</div>
                        <p className="text-sm text-gray-600">Активных учеников</p>
                    </div>
                </div>

                {/* Course Tabs */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <button
                            onClick={() => setActiveTab('python')}
                            className={`flex-1 px-8 py-6 font-semibold transition-all duration-300 relative ${activeTab === 'python'
                                ? 'text-blue-600 bg-white'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Code className="w-6 h-6" />
                                <span className="text-lg">Python</span>
                            </div>
                            {activeTab === 'python' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('figma')}
                            className={`flex-1 px-8 py-6 font-semibold transition-all duration-300 relative ${activeTab === 'figma'
                                ? 'text-purple-600 bg-white'
                                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Palette className="w-6 h-6" />
                                <span className="text-lg">Figma</span>
                            </div>
                            {activeTab === 'figma' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                            )}
                        </button>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                        {activeTab === 'python' && <PythonTasksPage />}
                        {activeTab === 'figma' && <FigmaTasksPage />}
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Получайте сертификаты</h2>
                            <p className="text-blue-100">Подтвердите свои навыки после прохождения курсов</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">📚 Практические задания</h3>
                            <p className="text-sm text-blue-100">Применяйте знания на реальных проектах</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">🎯 Пошаговое обучение</h3>
                            <p className="text-sm text-blue-100">От простого к сложному</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">💬 Поддержка менторов</h3>
                            <p className="text-sm text-blue-100">Помощь на каждом этапе</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
