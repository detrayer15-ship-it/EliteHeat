import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, getDocs, where, orderBy, doc, setDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    Search,
    ChevronRight,
    ArrowLeft,
    ShieldAlert,
    Activity,
    Users,
    Zap,
    AlertCircle,
    Database,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserData {
    id: string
    name: string
    email: string
    role: 'student' | 'teacher' | 'admin' | 'developer'
    lastActiveAt?: any
    createdAt?: any
    progress?: number
    completedTasks?: number
    xp?: number
}

export const AdminUsersPage = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'risk'>('all')

    const loadUsers = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'student')
            )
            const snapshot = await getDocs(q)
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[]

            // Client-side sorting because Firestore composite indexes can be tricky
            const sortedData = userData.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });

            setUsers(sortedData)
        } catch (error) {
            console.error('Error loading students:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const seedDatabase = async () => {
        setSeeding(true)
        try {
            const mockUsers = [
                { name: 'Кирилл Петров', email: 'kirill@test.com', role: 'student', progress: 45, xp: 1200, points: 1200, completedTasks: 12, city: 'Алматы', createdAt: new Date() },
                { name: 'Алина Сидорова', email: 'alina@test.com', role: 'student', progress: 12, xp: 350, points: 350, completedTasks: 3, city: 'Астана', createdAt: new Date() },
                { name: 'Максим Кузнецов', email: 'max@test.com', role: 'student', progress: 88, xp: 2400, points: 2400, completedTasks: 25, city: 'Шымкент', createdAt: new Date() },
                { name: 'Софья Иванова', email: 'sofya@test.com', role: 'student', progress: 5, xp: 100, points: 100, completedTasks: 1, city: 'Алматы', createdAt: new Date() },
            ]

            for (const user of mockUsers) {
                const userRef = doc(collection(db, 'users'))
                await setDoc(userRef, { ...user, id: userRef.id })
            }
            await loadUsers()
        } catch (error) {
            console.error(error)
        } finally {
            setSeeding(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())

        if (statusFilter === 'active') {
            const lastActive = user.lastActiveAt?.toDate() || new Date(0)
            return matchesSearch && (Date.now() - lastActive.getTime() < 3 * 24 * 60 * 60 * 1000)
        }
        if (statusFilter === 'inactive') {
            const lastActive = user.lastActiveAt?.toDate() || new Date(0)
            return matchesSearch && (Date.now() - lastActive.getTime() >= 7 * 24 * 60 * 60 * 1000)
        }
        if (statusFilter === 'risk') {
            return matchesSearch && (user.progress || 0) < 10
        }
        return matchesSearch
    })

    const stats = {
        total: users.length,
        active: users.filter(u => {
            const lastActive = u.lastActiveAt?.toDate() || new Date(0)
            return (Date.now() - lastActive.getTime() < 3 * 24 * 60 * 60 * 1000)
        }).length,
        atRisk: users.filter(u => (u.progress || 0) < 10).length,
        graduated: users.filter(u => (u.progress || 0) >= 90).length
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0d10] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Синхронизация базы...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0c0d10] text-white selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/admin')}
                        className="group flex items-center gap-2 text-white/30 hover:text-indigo-400 transition-all mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Назад к управлению
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                                <Database className="w-3 h-3" />
                                Student Management
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                База <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">учеников</span>
                            </h1>
                            <p className="text-white/40 text-sm font-medium">Реестр студентов и показатели эффективности обучения</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Поиск ученика..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none w-full md:w-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Всего учеников', value: stats.total, icon: <Users className="w-4 h-4" />, color: 'text-white' },
                        { label: 'Активны (72ч)', value: stats.active, icon: <Activity className="w-4 h-4" />, color: 'text-emerald-400' },
                        { label: 'В зоне риска', value: stats.atRisk, icon: <ShieldAlert className="w-4 h-4" />, color: 'text-red-400' },
                        { label: 'Высокий потенциал', value: stats.graduated, icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-xl flex flex-col gap-2 group hover:bg-white/[0.04] transition-all border-b-2 border-b-transparent hover:border-b-indigo-500/50">
                            <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color} mb-2`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black tracking-tighter tabular-nums">{stat.value}</div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* User Matrix Table */}
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border-t border-t-white/10">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.01]">
                        <div className="flex items-center gap-6 overflow-x-auto w-full pb-2 md:pb-0">
                            {(['all', 'active', 'inactive', 'risk'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-full ${statusFilter === filter ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-white/20 hover:text-white/40'
                                        }`}
                                >
                                    {filter === 'all' && 'Все ученики'}
                                    {filter === 'active' && 'Активные'}
                                    {filter === 'inactive' && 'Неактивные'}
                                    {filter === 'risk' && 'Риск'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {users.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="text-left py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Студент</th>
                                        <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Активность</th>
                                        <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Подписка</th>
                                        <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Прогресс</th>
                                        <th className="text-right py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Статус</th>
                                        <th className="text-right py-4 px-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((user) => {
                                        const lastActive = user.lastActiveAt?.toDate() || new Date(0)
                                        const isActive = Date.now() - lastActive.getTime() < 3 * 24 * 60 * 60 * 1000
                                        const isInactive = Date.now() - lastActive.getTime() >= 7 * 24 * 60 * 60 * 1000

                                        return (
                                            <tr key={user.id} className="group hover:bg-white/[0.03] transition-colors">
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center text-sm font-black border border-white/10 text-indigo-400 group-hover:scale-110 transition-transform">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm tracking-tight">{user.name}</div>
                                                            <div className="text-[10px] font-medium text-white/20 lowercase tracking-tight">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-center">
                                                    <div className="text-xs font-bold tabular-nums">{user.completedTasks || 0} задач</div>
                                                    <div className="text-[9px] font-bold text-indigo-400/40 uppercase tracking-widest">{user.xp || 0} XP</div>
                                                </td>
                                                <td className="py-6 px-8 text-center">
                                                    <div className={`text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full inline-block ${(user as any).subscriptionStatus === 'active'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        }`}>
                                                        {(user as any).subscriptionPlan || 'No Plan'}
                                                    </div>
                                                    {(user as any).subscriptionEndDate && (
                                                        <div className="text-[8px] text-white/20 mt-1">
                                                            до {(user as any).subscriptionEndDate instanceof Date
                                                                ? (user as any).subscriptionEndDate.toLocaleDateString()
                                                                : (user as any).subscriptionEndDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="max-w-[120px] mx-auto">
                                                        <div className="flex justify-between items-center mb-1.5 text-[9px] font-bold tabular-nums">
                                                            <span className="text-white/40">Обучение</span>
                                                            <span className="text-indigo-400">{user.progress || 0}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                                style={{ width: `${user.progress || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isInactive ? 'bg-red-500' : 'bg-white/20'}`} />
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : isInactive ? 'text-red-400' : 'text-white/20'}`}>
                                                            {isActive ? 'Online' : isInactive ? 'Offline' : 'Idle'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8 text-right">
                                                    <button
                                                        onClick={() => navigate(`/admin/users/${user.id}`)}
                                                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-600 hover:border-indigo-500 transition-all text-white/40 hover:text-white"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-24 text-center">
                                <AlertCircle className="w-16 h-16 text-white/5 mx-auto mb-6" />
                                <h3 className="text-xl font-black mb-2 uppercase tracking-tight">База пуста</h3>
                                <p className="text-white/30 text-sm font-medium mb-10 max-w-sm mx-auto">
                                    Система не обнаружила активных студентов. Вы можете наполнить базу тестовыми данными для проверки интерфейса.
                                </p>
                                <Button
                                    onClick={seedDatabase}
                                    disabled={seeding}
                                    className="bg-indigo-600 hover:bg-indigo-500 px-8 py-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                                >
                                    {seeding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Генерация...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Наполнить базу учениками
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default AdminUsersPage
