import { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Users, Search, Shield, Trash2, Edit, Mail, MapPin } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

interface User {
    id: string
    name: string
    email: string
    role: 'student' | 'admin' | 'developer'
    city?: string
    adminPoints?: number
    createdAt?: any
}

export const AdminUsersPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState<string>('all')
    const [loading, setLoading] = useState(true)

    // Проверка доступа
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
                    <p className="text-gray-600 mb-6">
                        Эта страница доступна только администраторам
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        На главную
                    </button>
                </div>
            </div>
        )
    }

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [searchTerm, filterRole, users])

    const loadUsers = async () => {
        try {
            const usersRef = collection(db, 'users')
            const snapshot = await getDocs(usersRef)
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[]
            setUsers(usersData)
            setLoading(false)
        } catch (error) {
            console.error('Error loading users:', error)
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        // Filter by role
        if (filterRole !== 'all') {
            filtered = filtered.filter(u => u.role === filterRole)
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredUsers(filtered)
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

        try {
            await deleteDoc(doc(db, 'users', userId))
            setUsers(users.filter(u => u.id !== userId))
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Ошибка при удалении пользователя')
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'developer': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-300'
            case 'student': return 'bg-blue-100 text-blue-800 border-blue-300'
            default: return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'developer': return '👑'
            case 'admin': return '⚡'
            case 'student': return '🎓'
            default: return '👤'
        }
    }

    const getRoleName = (role: string) => {
        switch (role) {
            case 'developer': return 'Разработчик'
            case 'admin': return 'Администратор'
            case 'student': return 'Ученик'
            default: return role
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Управление пользователями
                            </h1>
                            <p className="text-gray-600">Всего пользователей: {users.length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск по имени или email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Role filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterRole('all')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterRole === 'all'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Все ({users.length})
                            </button>
                            <button
                                onClick={() => setFilterRole('student')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterRole === 'student'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                🎓 Ученики ({users.filter(u => u.role === 'student').length})
                            </button>
                            <button
                                onClick={() => setFilterRole('admin')}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${filterRole === 'admin'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                ⚡ Админы ({users.filter(u => u.role === 'admin').length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Загрузка пользователей...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-gray-100 hover:scale-105"
                            >
                                {/* User Avatar */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                            <span>{getRoleIcon(user.role)}</span>
                                            <span>{getRoleName(user.role)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    {user.city && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{user.city}</span>
                                        </div>
                                    )}
                                    {user.adminPoints !== undefined && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Shield className="w-4 h-4" />
                                            <span>Очки: {user.adminPoints}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Изменить
                                    </button>
                                    {currentUser?.role === 'developer' && user.id !== currentUser.id && (
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Пользователи не найдены</h3>
                        <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
                    </div>
                )}
            </div>
        </div>
    )
}
