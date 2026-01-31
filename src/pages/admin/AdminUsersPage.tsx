import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Search, Filter, AlertTriangle, TrendingDown, TrendingUp, Trash2, Edit, Mail, Shield, User as UserIcon } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface User {
    id: string
    name: string
    email: string
    role: 'student' | 'admin' | 'developer'
    teacherRank?: number
    createdAt: Date
    lastActive?: number
    coursesProgress?: { python: number; figma: number }
    activeProjects?: number
    warnings?: number
    adminNotes?: string
    adminPoints?: number
    city?: string
}

export const AdminUsersPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin' | 'developer'>('all')
    const [filterActivity, setFilterActivity] = useState<'all' | 'active' | 'inactive' | 'risk'>('all')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    // Access check
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'developer')) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <Card className="p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
                    <p className="text-gray-600 mb-6">Эта страница доступна только администраторам и разработчикам.</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full">
                        Вернуться на главную
                    </Button>
                </Card>
            </div>
        )
    }

    const loadUsers = async () => {
        setLoading(true)
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
                    adminNotes: data.adminNotes || '',
                    adminPoints: data.adminPoints || 0,
                    city: data.city || ''
                }
            })
            setUsers(loadedUsers)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const handleDeleteUser = async (userId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) return

        try {
            await deleteDoc(doc(db, 'users', userId))
            setUsers(users.filter(u => u.id !== userId))
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Ошибка при удалении пользователя')
        }
    }

    // Filtering
    const filteredUsers = users.filter(u => {
        if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !u.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        if (filterRole !== 'all' && u.role !== filterRole) {
            return false
        }

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
                    <p className="text-gray-600 font-medium">Синхронизация данных...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/admin')}
                        className="mb-2 -ml-2 text-gray-500 hover:text-indigo-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Панель управления
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        👥 Пользователи системы
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={loadUsers} className="rounded-xl">
                        Обновить
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Всего', value: users.length, color: 'text-indigo-600', icon: <UserIcon className="w-4 h-4" /> },
                    { label: 'Ученики', value: users.filter(u => u.role === 'student').length, color: 'text-blue-600', icon: <Shield className="w-4 h-4" /> },
                    { label: 'Админы', value: users.filter(u => u.role === 'admin' || u.role === 'developer').length, color: 'text-purple-600', icon: <Shield className="w-4 h-4" /> },
                    { label: 'В зоне риска', value: users.filter(u => u.lastActive && Date.now() - u.lastActive > 14 * 24 * 60 * 60 * 1000).length, color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> },
                ].map((stat, i) => (
                    <Card key={i} className="p-4 flex flex-col items-center justify-center space-y-1 bg-white/50 backdrop-blur-sm border-white/20">
                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                            {stat.icon}
                            {stat.label}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="p-6 bg-white shadow-sm border-gray-100 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Поиск</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Имя или email..."
                                className="pl-10 rounded-xl border-gray-200 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Роль</label>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                        >
                            <option value="all">Все роли</option>
                            <option value="student">Ученики</option>
                            <option value="admin">Учителя</option>
                            <option value="developer">Разработчики</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Активность</label>
                        <select
                            value={filterActivity}
                            onChange={(e) => setFilterActivity(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                        >
                            <option value="all">Любая активность</option>
                            <option value="active">Активные (сегодня)</option>
                            <option value="inactive">Неактивные (7+ дней)</option>
                            <option value="risk">Риск отчисления (14+ дней)</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* User List */}
            <div className="space-y-3">
                {filteredUsers.map((u) => {
                    const activity = getActivityStatus(u.lastActive)
                    const avgProgress = u.coursesProgress ? (u.coursesProgress.python + u.coursesProgress.figma) / 2 : 0

                    return (
                        <Card
                            key={u.id}
                            className="p-4 hover:shadow-md transition-all cursor-pointer group border-transparent hover:border-indigo-100 bg-white"
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-indigo-100 shadow-lg">
                                    {u.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-gray-900 truncate">{u.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${u.role === 'student' ? 'bg-blue-50 text-blue-600' :
                                            u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            {u.role === 'student' ? 'Ученик' : u.role === 'admin' ? 'Учитель' : 'Dev'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activity.color}`}>
                                            {activity.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                        <Mail className="w-3 h-3" />
                                        {u.email}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-8 px-4 border-l border-gray-100">
                                    {u.role === 'student' && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Прогресс</span>
                                            <span className="text-sm font-black text-gray-700">{Math.round(avgProgress)}%</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Очки</span>
                                        <span className="text-sm font-black text-gray-700">{u.adminPoints || 0} XP</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${u.id}/edit`); }}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    {currentUser.role === 'developer' && u.id !== currentUser.id && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
                                            onClick={(e) => handleDeleteUser(u.id, e)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {filteredUsers.length === 0 && (
                <Card className="p-12 text-center bg-transparent border-dashed border-2 border-gray-200 shadow-none">
                    <div className="text-4xl mb-2">🔎</div>
                    <p className="text-gray-500 font-medium">Никого не нашли по вашему запросу</p>
                </Card>
            )}

            {/* Detailed Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <Card className="max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-8 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-100">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">{selectedUser.name}</h2>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="rounded-full w-10 h-10 p-0" onClick={() => setSelectedUser(null)}>✕</Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Роль</div>
                                <div className="font-bold text-gray-900">{selectedUser.role}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Зарегистрирован</div>
                                <div className="font-bold text-gray-900">{selectedUser.createdAt.toLocaleDateString()}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Очки</div>
                                <div className="font-bold text-indigo-600">{selectedUser.adminPoints || 0} XP</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Город</div>
                                <div className="font-bold text-gray-900">{selectedUser.city || '—'}</div>
                            </div>
                        </div>

                        {selectedUser.role === 'student' && selectedUser.coursesProgress && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                                    Академический прогресс
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(selectedUser.coursesProgress).map(([lang, progress]) => (
                                        <div key={lang} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                                                <span>{lang}</span>
                                                <span className="text-gray-900">{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${lang === 'python' ? 'bg-blue-500' : 'bg-purple-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-orange-500" />
                                Примечания администратора
                            </h3>
                            <textarea
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 min-h-[120px] transition-all text-sm"
                                placeholder="Служебная информация об этом пользователе..."
                                defaultValue={selectedUser.adminNotes}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={() => setSelectedUser(null)} className="flex-1 h-12 rounded-2xl text-gray-500 border-gray-200" variant="secondary">
                                Отмена
                            </Button>
                            <Button className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                                Сохранить изменения
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default AdminUsersPage
