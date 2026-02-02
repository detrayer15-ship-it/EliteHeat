import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Search, Filter, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface User {
    id: string
    name: string
    email: string
    role: 'student' | 'teacher' | 'admin' | 'developer'
    teacherRank?: number
    createdAt: Date
    lastActive?: number
    coursesProgress?: { python: number; figma: number }
    activeProjects?: number
    warnings?: number
    adminNotes?: string
}

export const EnhancedUsersPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher' | 'admin' | 'developer'>('all')
    const [filterActivity, setFilterActivity] = useState<'all' | 'active' | 'inactive' | 'risk'>('all')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // Проверка доступа
    if (!user || (user.role !== 'admin' && user.role !== 'developer' && user.role !== 'teacher')) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только учителям и разработчикам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    // Загрузка пользователей
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const loadedUsers: User[] = usersSnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        name: data.name || 'Пользователь',
                        email: data.email || '',
                        role: data.role || 'student',
                        teacherRank: data.teacherRank,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        lastActive: data.lastActiveAt?.toDate().getTime() || data.createdAt?.toDate().getTime() || Date.now(),
                        coursesProgress: {
                            python: data.progress || 0,
                            figma: data.figmaProgress || 0
                        },
                        activeProjects: data.activeProjects || 0,
                        warnings: data.warnings || 0,
                        adminNotes: data.adminNotes || ''
                    }
                })
                setUsers(loadedUsers)
            } catch (error) {
                console.error('Error loading users:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUsers()
    }, [])

    // Фильтрация
    const filteredUsers = users.filter(u => {
        // Поиск
        if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !u.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Роль
        if (filterRole !== 'all' && u.role !== filterRole) {
            return false
        }

        // Активность
        if (filterActivity === 'active' && (!u.lastActive || Date.now() - u.lastActive > 24 * 60 * 60 * 1000)) {
            return false
        }
        if (filterActivity === 'inactive' && u.lastActive && Date.now() - u.lastActive <= 7 * 24 * 60 * 60 * 1000) {
            return false
        }
        if (filterActivity === 'risk' && (!u.lastActive || Date.now() - u.lastActive <= 14 * 24 * 60 * 60 * 1000)) {
            return false
        }

        return true
    })

    const getActivityStatus = (lastActive?: number) => {
        if (!lastActive) return { label: 'Неизвестно', color: 'bg-gray-100 text-gray-700' }
        const days = Math.floor((Date.now() - lastActive) / (24 * 60 * 60 * 1000))
        if (days === 0) return { label: 'Сегодня', color: 'bg-green-100 text-green-700' }
        if (days <= 3) return { label: `${days} дн назад`, color: 'bg-blue-100 text-blue-700' }
        if (days <= 7) return { label: `${days} дн назад`, color: 'bg-yellow-100 text-yellow-700' }
        if (days <= 14) return { label: `${days} дн назад`, color: 'bg-orange-100 text-orange-700' }
        return { label: `${days} дн назад`, color: 'bg-red-100 text-red-700' }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⏳</div>
                    <p className="text-gray-600">Загрузка пользователей...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к админ панели
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    👥 Управление пользователями
                </h1>
                <p className="text-gray-600 mt-2">
                    Расширенное управление с фильтрами и детальной информацией
                </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{users.length}</div>
                        <div className="text-sm text-gray-600 mt-1">Всего</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {users.filter(u => u.role === 'student').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Учеников</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {users.filter(u => u.role === 'teacher').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Учителей</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600">
                            {users.filter(u => u.role === 'admin').length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Админов</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {users.filter(u => u.lastActive && Date.now() - u.lastActive > 14 * 24 * 60 * 60 * 1000).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Риск отчисления</div>
                    </div>
                </Card>
            </div>

            {/* Фильтры */}
            <Card className="p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-bold text-gray-900">Фильтры</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Поиск */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Поиск
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Имя или email..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Роль */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Роль
                        </label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as any)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Все роли</option>
                            <option value="student">Ученики</option>
                            <option value="teacher">Учителя</option>
                            <option value="admin">Администраторы</option>
                            <option value="developer">Разработчики</option>
                        </select>
                    </div>

                    {/* Активность */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Активность
                        </label>
                        <select
                            value={filterActivity}
                            onChange={(e) => setFilterActivity(e.target.value as any)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Все</option>
                            <option value="active">Активные (сегодня)</option>
                            <option value="inactive">Неактивные (7+ дней)</option>
                            <option value="risk">Риск отчисления (14+ дней)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Найдено: {filteredUsers.length} из {users.length}
                </div>
            </Card>

            {/* Список пользователей */}
            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map((u) => {
                    const activityStatus = getActivityStatus(u.lastActive)
                    const avgProgress = u.coursesProgress ? (u.coursesProgress.python + u.coursesProgress.figma) / 2 : 0

                    return (
                        <Card
                            key={u.id}
                            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Аватар */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                        {u.name.charAt(0)}
                                    </div>

                                    {/* Информация */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{u.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'student' ? 'bg-blue-100 text-blue-700' :
                                                u.role === 'teacher' ? 'bg-orange-100 text-orange-700' :
                                                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {u.role === 'student' ? 'Ученик' : u.role === 'teacher' ? 'Учитель' : u.role === 'admin' ? 'Админ' : 'Разработчик'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${activityStatus.color}`}>
                                                {activityStatus.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{u.email}</p>

                                        {/* Прогресс */}
                                        {u.role === 'student' && u.coursesProgress && (
                                            <div className="grid grid-cols-3 gap-4 mb-3">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Python</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                style={{ width: `${u.coursesProgress.python}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">
                                                            {u.coursesProgress.python}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Figma</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-purple-500 h-2 rounded-full"
                                                                style={{ width: `${u.coursesProgress.figma}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">
                                                            {u.coursesProgress.figma}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Проекты</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {u.activeProjects || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Предупреждения */}
                                        {u.warnings && u.warnings > 0 && (
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {u.warnings} предупреждени{u.warnings === 1 ? 'е' : 'я'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Тренд */}
                                    <div className="text-right">
                                        {avgProgress > 50 ? (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <TrendingUp className="w-5 h-5" />
                                                <span className="text-sm font-bold">Растёт</span>
                                            </div>
                                        ) : avgProgress > 0 ? (
                                            <div className="flex items-center gap-1 text-yellow-600">
                                                <span className="text-sm font-bold">Средний</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <TrendingDown className="w-5 h-5" />
                                                <span className="text-sm font-bold">Риск</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {filteredUsers.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        Пользователи не найдены
                    </h3>
                    <p className="text-gray-500">
                        Попробуйте изменить фильтры или поисковый запрос
                    </p>
                </Card>
            )}

            {/* Модальное окно с деталями */}
            {selectedUser && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedUser(null)}
                >
                    <Card
                        className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Детали пользователя
                        </h2>

                        <div className="space-y-6">
                            {/* Основная информация */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3">Основная информация</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Имя</div>
                                        <div className="font-medium">{selectedUser.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <div className="font-medium">{selectedUser.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Роль</div>
                                        <div className="font-medium">{selectedUser.role}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Зарегистрирован</div>
                                        <div className="font-medium">
                                            {selectedUser.createdAt.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Заметки админа */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3">🔒 Заметки админа (скрытые)</h3>
                                <textarea
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={4}
                                    placeholder="Приватные заметки об ученике..."
                                    defaultValue={selectedUser.adminNotes}
                                />
                            </div>

                            {/* Кнопки */}
                            <div className="flex gap-3">
                                <Button onClick={() => setSelectedUser(null)} className="flex-1">
                                    Закрыть
                                </Button>
                                <Button variant="secondary" className="flex-1">
                                    Сохранить заметки
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
