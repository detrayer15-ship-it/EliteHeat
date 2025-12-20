import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getRankByPoints, getProgressToNextRank } from '@/utils/adminRanks'
import { Users, MessageSquare, FileText, TrendingUp, Award, ClipboardCheck } from 'lucide-react'

export const AdminDashboardPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещён</h1>
                    <p className="text-gray-600">Эта страница доступна только администраторам</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        )
    }

    // Get admin rank
    const adminPoints = currentUser?.adminPoints || 0
    const rankInfo = getProgressToNextRank(adminPoints)
    const currentRank = rankInfo.current

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        👑 Админ-панель
                    </h1>
                    <p className="text-gray-600">Управление платформой EliteHeat</p>
                </div>

                {/* Admin Rank Card */}
                <div className="mb-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-7xl">{currentRank.icon}</div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{currentRank.name}</h2>
                                <p className="text-purple-100 mb-1">Уровень {currentRank.level}</p>
                                <p className="text-sm text-purple-200">{currentRank.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold mb-2">{adminPoints}</div>
                            <p className="text-purple-100">очков</p>
                        </div>
                    </div>

                    {/* Progress to next rank */}
                    {rankInfo.next && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span>До следующего ранга: {rankInfo.next.name}</span>
                                <span>{Math.round(rankInfo.progress)}%</span>
                            </div>
                            <div className="w-full bg-purple-400/30 rounded-full h-3">
                                <div
                                    className="bg-white rounded-full h-3 transition-all duration-500"
                                    style={{ width: `${rankInfo.progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-purple-200 mt-2">
                                {rankInfo.next.minPoints - adminPoints} очков до {rankInfo.next.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Пользователи</h3>
                        </div>
                        <p className="text-gray-600">Управление пользователями платформы</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/chat')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Чат с учениками</h3>
                        </div>
                        <p className="text-gray-600">Ответы на вопросы учеников</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/groups')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Группы</h3>
                        </div>
                        <p className="text-gray-600">Управление группами учеников</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/review')}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Проверка заданий</h3>
                        </div>
                        <p className="text-gray-600">Проверяйте домашние задания студентов</p>
                    </button>

                    <button
                        onClick={() => navigate('/admin/ranks')}
                        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ранги и очки</h3>
                        </div>
                        <p className="text-yellow-50">Просмотр системы рангов</p>
                    </button>

                </div>

                {/* Enhanced Features */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Расширенные функции</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button
                            onClick={() => navigate('/admin/enhanced-users')}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Расширенное управление</h3>
                            </div>
                            <p className="text-indigo-50">Фильтры, детали, заметки</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/student-monitoring')}
                            className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Мониторинг учеников</h3>
                            </div>
                            <p className="text-red-50">Кто застрял, флаги проблем</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/enhanced-review')}
                            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <ClipboardCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Улучшенная проверка</h3>
                            </div>
                            <p className="text-orange-50">Шаблоны, авто-очки</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/enhanced-groups')}
                            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Расширенные группы</h3>
                            </div>
                            <p className="text-cyan-50">Прогресс, массовые действия</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/live-ranks')}
                            className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Живые ранги</h3>
                            </div>
                            <p className="text-yellow-50">Логи очков, анти-накрутка</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/analytics')}
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Аналитика</h3>
                            </div>
                            <p className="text-green-50">Эффективность, потери</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/enhanced-chat')}
                            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Улучшенный чат</h3>
                            </div>
                            <p className="text-pink-50">Теги, FAQ, приоритеты</p>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Заданий проверено</h3>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">0</p>
                        <p className="text-sm text-gray-500 mt-2">За всё время</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Всего очков</h3>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{adminPoints}</p>
                        <p className="text-sm text-gray-500 mt-2">Текущий баланс</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Активность</h3>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">100%</p>
                        <p className="text-sm text-gray-500 mt-2">За последнюю неделю</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
