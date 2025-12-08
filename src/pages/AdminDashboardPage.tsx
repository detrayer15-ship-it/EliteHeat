import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { adminAPI } from '@/api/admin-new'

interface AdminStats {
    level: number
    points: number
    tasksReviewed: number
    nextLevelPoints: number
    progress: number
}

interface User {
    _id: string
    name: string
    email: string
    role: string
    level?: number
    points?: number
}

export const AdminDashboardPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            // Load admin stats
            const statsResponse = await adminAPI.getStats()
            if (statsResponse.success) {
                setStats(statsResponse.data)
            }

            // Load all users
            const usersResponse = await adminAPI.getAllUsers()
            if (usersResponse.success) {
                setUsers(usersResponse.data)
            }
        } catch (error) {
            console.error('Error loading admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (currentUser?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-error mb-4">Доступ запрещён</h1>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Загрузка...</p>
            </div>
        )
    }

    const getLevelIcon = (level: number) => {
        const icons = ['🥉', '🥈', '🥇', '💎', '👑']
        return icons[level - 1] || '🥉'
    }

    const getLevelName = (level: number) => {
        const names = ['Новичок', 'Опытный', 'Профессионал', 'Эксперт', 'Мастер']
        return names[level - 1] || 'Новичок'
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">👑 Админ-панель</h1>
                <p className="text-gray-600">Управление платформой EliteHeat</p>
            </div>

            {/* Admin Level Card */}
            {stats && (
                <Card>
                    <div className="text-center">
                        <div className="text-6xl mb-4">{getLevelIcon(stats.level)}</div>
                        <h2 className="text-2xl font-bold text-text mb-2">
                            Уровень {stats.level} - {getLevelName(stats.level)}
                        </h2>
                        <p className="text-gray-600 mb-4">{stats.points} очков</p>

                        {/* Progress Bar */}
                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>{stats.points} очков</span>
                                <span>{stats.level < 5 ? `${stats.nextLevelPoints} до уровня ${stats.level + 1}` : 'Максимальный уровень'}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-primary to-ai-blue h-4 rounded-full transition-all"
                                    style={{ width: `${stats.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">{stats.tasksReviewed}</div>
                                <div className="text-sm text-gray-600">Заданий проверено</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-success">{stats.points}</div>
                                <div className="text-sm text-gray-600">Всего очков</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-warning">{stats.level}</div>
                                <div className="text-sm text-gray-600">Текущий уровень</div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <h3 className="font-semibold text-text">Всего пользователей</h3>
                        <p className="text-2xl font-bold text-primary">{users.length}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="font-semibold text-text">Учеников</h3>
                        <p className="text-2xl font-bold text-success">
                            {users.filter(u => u.role === 'student').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">👑</div>
                        <h3 className="font-semibold text-text">Админов</h3>
                        <p className="text-2xl font-bold text-error">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">⭐</div>
                        <h3 className="font-semibold text-text">Всего очков</h3>
                        <p className="text-2xl font-bold text-warning">
                            {users.reduce((sum, u) => sum + (u.points || 0), 0)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">⚡ Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        onClick={() => navigate('/admin/users')}
                        className="w-full"
                    >
                        👥 Управление пользователями
                    </Button>
                    <Button
                        onClick={() => navigate('/admin/tasks')}
                        variant="secondary"
                        className="w-full"
                    >
                        📝 Проверка заданий
                    </Button>
                    <Button
                        onClick={() => navigate('/admin/chat')}
                        variant="secondary"
                        className="w-full"
                    >
                        💬 Чаты с учениками
                    </Button>
                </div>
            </Card>

            {/* Top Users */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">🏆 Топ пользователей</h2>
                <div className="space-y-2">
                    {users
                        .sort((a, b) => (b.points || 0) - (a.points || 0))
                        .slice(0, 5)
                        .map((u, index) => (
                            <div key={u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{u.name}</div>
                                        <div className="text-sm text-gray-600">{u.email}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">{u.points || 0}</div>
                                    <div className="text-sm text-gray-600">очков</div>
                                </div>
                            </div>
                        ))}
                </div>
            </Card>
        </div>
    )
}
