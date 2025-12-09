import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
// import { adminAPI } from '@/api/admin' // Deprecated
import { useAuthStore } from '@/store/authStore'

interface User {
    _id: string
    email: string
    name: string
    role: 'student' | 'admin'
    city: string
    isOnline: boolean
    isBanned: boolean
    createdAt: string
    lastLoginAt?: string
}

export const AdminUsersPage = () => {
    const currentUser = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [admins, setAdmins] = useState<User[]>([])
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all')

    useEffect(() => {
        loadUsers()
        loadAdmins()
    }, [roleFilter, search])

    const loadUsers = async () => {
        setUsers([]) // Placeholder
    }

    const loadAdmins = async () => {
        setAdmins([]) // Placeholder
    }

    const handleBan = async (_userId: string) => {
        alert('Функция временно недоступна')
    }

    const handleDelete = async (_userId: string) => {
        alert('Функция временно недоступна')
    }

    const handleChangeRole = async (_userId: string, _newRole: 'student' | 'admin') => {
        alert('Функция временно недоступна')
    }

    const showIPHistory = async (_userId: string) => {
        alert('Функция временно недоступна')
    }

    // Check if current user is admin
    if (currentUser?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещён</h2>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">👥 Управление пользователями</h1>
                <p className="text-gray-600">Просмотр и управление всеми пользователями системы</p>
            </div>

            {/* Admins List */}
            <Card>
                <h2 className="text-xl font-bold mb-4">👑 Администраторы ({admins.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {admins.map((admin) => (
                        <div key={admin._id} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                                    {admin.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate">{admin.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{admin.email}</div>
                                    <div className="text-xs text-gray-500">📍 {admin.city}</div>
                                </div>
                                {admin.isOnline && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Filters */}
            <Card>
                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Поиск по имени или email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px]"
                    />

                    <div className="flex gap-2">
                        <Button
                            variant={roleFilter === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('all')}
                        >
                            Все
                        </Button>
                        <Button
                            variant={roleFilter === 'student' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('student')}
                        >
                            Ученики
                        </Button>
                        <Button
                            variant={roleFilter === 'admin' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('admin')}
                        >
                            Админы
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <h2 className="text-xl font-bold mb-4">
                    Пользователи ({users.length})
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3">Пользователь</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Город</th>
                                <th className="text-left p-3">Роль</th>
                                <th className="text-left p-3">Статус</th>
                                <th className="text-left p-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="p-3 text-sm">📍 {user.city}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.role === 'admin' ? '👑 Админ' : '🎓 Ученик'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col gap-1">
                                            {user.isOnline && (
                                                <span className="text-xs text-green-600">🟢 Онлайн</span>
                                            )}
                                            {user.isBanned && (
                                                <span className="text-xs text-red-600">🚫 Забанен</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => showIPHistory(user._id)}
                                            >
                                                IP
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleChangeRole(
                                                    user._id,
                                                    user.role === 'admin' ? 'student' : 'admin'
                                                )}
                                            >
                                                {user.role === 'admin' ? '↓ Ученик' : '↑ Админ'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleBan(user._id)}
                                            >
                                                {user.isBanned ? 'Разбанить' : 'Забанить'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">👥</div>
                            <p>Пользователи не найдены</p>
                    )}
                        </div>
            </Card>
        </div>
    )
}
