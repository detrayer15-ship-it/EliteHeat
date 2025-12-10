import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface User {
    id: string
    email: string
    name: string
    role: 'student' | 'admin'
    city: string
    createdAt: any
}

export const AdminUsersManagementPage = () => {
    const currentUser = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [search, roleFilter, users])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const usersSnapshot = await getDocs(collection(db, 'users'))
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[]
            setUsers(usersData)
        } catch (error) {
            console.error('Failed to load users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter)
        }

        if (search) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
            )
        }

        setFilteredUsers(filtered)
    }

    const handleChangeRole = async (userId: string, newRole: 'student' | 'admin') => {
        if (!confirm(`Изменить роль на ${newRole === 'admin' ? 'Админ' : 'Ученик'}?`)) return

        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole })
            await loadUsers()
            alert('Роль успешно изменена!')
        } catch (error: any) {
            alert('Ошибка: ' + error.message)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Вы уверены? Это действие необратимо!')) return

        try {
            await deleteDoc(doc(db, 'users', userId))
            await loadUsers()
            alert('Пользователь удалён!')
        } catch (error: any) {
            alert('Ошибка: ' + error.message)
        }
    }

    if (currentUser?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещён</h2>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Загрузка пользователей...</p>
            </div>
        )
    }

    const stats = {
        total: users.length,
        students: users.filter(u => u.role === 'student').length,
        admins: users.filter(u => u.role === 'admin').length,
    }

    return (
        <div className="space-y-6 page-transition">
            {/* Заголовок */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    👥 Управление пользователями
                </h1>
                <p className="text-gray-600">Просмотр и управление всеми пользователями системы</p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card hover>
                    <div className="text-center">
                        <div className="text-4xl mb-2">👥</div>
                        <h3 className="font-semibold text-text">Всего пользователей</h3>
                        <p className="text-3xl font-bold text-primary">{stats.total}</p>
                    </div>
                </Card>
                <Card hover>
                    <div className="text-center">
                        <div className="text-4xl mb-2">🎓</div>
                        <h3 className="font-semibold text-text">Учеников</h3>
                        <p className="text-3xl font-bold text-success">{stats.students}</p>
                    </div>
                </Card>
                <Card hover>
                    <div className="text-center">
                        <div className="text-4xl mb-2">👑</div>
                        <h3 className="font-semibold text-text">Админов</h3>
                        <p className="text-3xl font-bold text-error">{stats.admins}</p>
                    </div>
                </Card>
            </div>

            {/* Фильтры */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="🔍 Поиск по имени или email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />

                    <div className="flex gap-2">
                        <Button
                            variant={roleFilter === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('all')}
                            size="sm"
                        >
                            Все
                        </Button>
                        <Button
                            variant={roleFilter === 'student' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('student')}
                            size="sm"
                        >
                            Ученики
                        </Button>
                        <Button
                            variant={roleFilter === 'admin' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('admin')}
                            size="sm"
                        >
                            Админы
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Список пользователей */}
            <Card>
                <h2 className="text-xl font-bold mb-4">
                    Пользователи ({filteredUsers.length})
                </h2>

                <div className="space-y-3">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Аватар и информация */}
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-text truncate">{user.name}</div>
                                        <div className="text-sm text-gray-600 truncate">{user.email}</div>
                                        <div className="text-xs text-gray-500">📍 {user.city}</div>
                                    </div>
                                </div>

                                {/* Роль */}
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'admin'
                                            ? 'bg-gradient-to-r from-red-500/10 to-pink-600/10 text-red-600 border border-red-200'
                                            : 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border border-blue-200'
                                        }`}>
                                        {user.role === 'admin' ? '👑 Админ' : '🎓 Ученик'}
                                    </span>
                                </div>

                                {/* Действия */}
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => handleChangeRole(
                                            user.id,
                                            user.role === 'admin' ? 'student' : 'admin'
                                        )}
                                    >
                                        {user.role === 'admin' ? '↓ Сделать учеником' : '↑ Сделать админом'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        🗑️ Удалить
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">👥</div>
                        <p>Пользователи не найдены</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
