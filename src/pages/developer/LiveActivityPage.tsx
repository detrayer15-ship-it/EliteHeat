import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Circle } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface UserActivity {
    id: string
    name: string
    email: string
    role: 'student' | 'admin' | 'developer'
    currentPage: string
    module: string
    lastActive: number
    online: boolean
}

export const LiveActivityPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<UserActivity[]>([])
    const [loading, setLoading] = useState(true)

    // Загрузка реальных пользователей из Firestore
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const loadedUsers: UserActivity[] = usersSnapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        name: data.name || 'Пользователь',
                        email: data.email || '',
                        role: data.role || 'student',
                        currentPage: '/dashboard',
                        module: 'Главная',
                        lastActive: Date.now() - Math.random() * 300000, // Случайное время до 5 минут
                        online: Math.random() > 0.5 // 50% онлайн
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

    // Проверка доступа
    if (!user || user.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    // Обновление времени каждую секунду
    useEffect(() => {
        const interval = setInterval(() => {
            setUsers(prev => [...prev])
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000)
        if (seconds < 60) return `${seconds} сек назад`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes} мин назад`
        const hours = Math.floor(minutes / 60)
        return `${hours} ч назад`
    }

    const getRoleBadge = (role: string) => {
        const badges = {
            student: { label: 'Ученик', color: 'bg-blue-100 text-blue-700' },
            admin: { label: 'Учитель', color: 'bg-purple-100 text-purple-700' },
            developer: { label: 'Разработчик', color: 'bg-red-100 text-red-700' }
        }
        return badges[role as keyof typeof badges] || badges.student
    }

    const onlineUsers = users.filter(u => u.online)
    const byRole = {
        student: onlineUsers.filter(u => u.role === 'student').length,
        admin: onlineUsers.filter(u => u.role === 'admin').length,
        developer: onlineUsers.filter(u => u.role === 'developer').length
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
                    onClick={() => navigate('/developer/panel')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к панели
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            👀 Активность онлайн
                            <span className="flex items-center gap-2 text-sm font-normal text-green-600">
                                <Circle className="w-3 h-3 fill-green-500" />
                                Обновляется в реальном времени
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Реальные пользователи из базы данных
                        </p>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {onlineUsers.length}
                        </div>
                        <div className="text-sm text-green-700 mt-1 font-medium">Онлайн сейчас</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {byRole.student}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Учеников</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {byRole.admin}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Учителей</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {byRole.developer}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Разработчиков</div>
                    </div>
                </Card>
            </div>

            {/* Список пользователей */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Активные пользователи ({onlineUsers.length})
                </h2>

                <div className="space-y-3">
                    {onlineUsers.map((u) => {
                        const badge = getRoleBadge(u.role)

                        return (
                            <div
                                key={u.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Статус */}
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>

                                    {/* Информация */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900">{u.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                    </div>

                                    {/* Активность */}
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900 mb-1">
                                            📍 {u.module}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {u.currentPage}
                                        </div>
                                    </div>

                                    {/* Время */}
                                    <div className="text-right min-w-[100px]">
                                        <div className="text-xs text-gray-500">
                                            {getTimeAgo(u.lastActive)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {onlineUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">😴</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Никого нет онлайн
                        </h3>
                        <p className="text-gray-500">
                            Пользователи появятся здесь, когда зайдут на платформу
                        </p>
                    </div>
                )}
            </Card>

            {/* Информация */}
            <Card className="mt-6 p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Информация</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Данные загружаются из Firestore</li>
                    <li>• Показываются реальные пользователи платформы</li>
                    <li>• Статус "онлайн" генерируется случайно (50%)</li>
                    <li>• В продакшене нужно добавить WebSocket для реального времени</li>
                </ul>
            </Card>
        </div>
    )
}
