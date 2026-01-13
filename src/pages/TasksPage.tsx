import { useState } from 'react'

import { PythonTasksPage } from './PythonTasksPage'
import { FigmaTasksPage } from './FigmaTasksPage'
import { BookOpen, Code, Palette, TrendingUp, Award, Users, Sparkles, Zap, Star } from 'lucide-react'

export const TasksPage = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'figma'>('python')


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Premium Header with Animation */}
                <div className="mb-6 relative">
                    {/* Floating background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
                        <div className="flex items-center gap-4">
                            {/* Animated Icon */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                                    Курсы
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Обучайтесь программированию и дизайну
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Stats Cards with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Progress Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-blue-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">Прогресс</h3>
                                <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                                75%
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-blue-500" />
                                Выполнено уроков
                            </p>
                        </div>
                    </div>

                    {/* Achievements Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-purple-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">Достижения</h3>
                                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                                3
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Star className="w-3 h-3 text-purple-500 fill-purple-500" />
                                Получено сертификатов
                            </p>
                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-5 border border-pink-100 transform group-hover:scale-105 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-900">Сообщество</h3>
                                <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 text-pink-600" />
                                </div>
                            </div>
                            <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-1">
                                243
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-pink-500" />
                                Активных учеников
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium Course Tabs */}
                <div className="relative mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50">
                        <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
                            <button
                                onClick={() => setActiveTab('python')}
                                className={`flex-1 px-6 py-5 font-bold transition-all duration-300 relative group ${activeTab === 'python'
                                    ? 'text-blue-600 bg-white/80'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className={`p-2 rounded-lg transition-all ${activeTab === 'python' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
                                        <Code className="w-5 h-5" />
                                    </div>
                                    <span className="text-base">Python</span>
                                </div>
                                {activeTab === 'python' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 animate-gradient-x" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('figma')}
                                className={`flex-1 px-6 py-5 font-bold transition-all duration-300 relative group ${activeTab === 'figma'
                                    ? 'text-purple-600 bg-white/80'
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className={`p-2 rounded-lg transition-all ${activeTab === 'figma' ? 'bg-purple-100' : 'bg-gray-100 group-hover:bg-purple-50'}`}>
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <span className="text-base">Figma</span>
                                </div>
                                {activeTab === 'figma' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x" />
                                )}
                            </button>
                        </div>

                        {/* Course Content */}
                        <div className="p-6 bg-white/50 backdrop-blur-sm">
                            {activeTab === 'python' && <PythonTasksPage />}
                            {activeTab === 'figma' && <FigmaTasksPage />}
                        </div>
                    </div>
                </div>

                {/* Premium Info Banner */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
                        {/* Floating particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Award className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">Получайте сертификаты</h2>
                                    <p className="text-blue-100">Подтвердите свои навыки после прохождения курсов</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                                    <h3 className="font-bold mb-2">📚 Практические задания</h3>
                                    <p className="text-sm text-blue-100">Применяйте знания на реальных проектах</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                                    <h3 className="font-bold mb-2">🎯 Пошаговое обучение</h3>
                                    <p className="text-sm text-blue-100">От простого к сложному</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                                    <h3 className="font-bold mb-2">💬 Поддержка менторов</h3>
                                    <p className="text-sm text-blue-100">Помощь на каждом этапе</p>
                                </div>
                            </div>
                        </div>
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
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.5); }
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
