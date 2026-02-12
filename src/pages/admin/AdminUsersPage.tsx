import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore'
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
    AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

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
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'risk'>('all')

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'student'),
                    orderBy('createdAt', 'desc')
                )
                const snapshot = await getDocs(q)
                const userData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as UserData[]
                setUsers(userData)
            } catch (error) {
                console.error('Error loading students:', error)
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, [])

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
            <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Accessing Student Database...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#08090a] text-white selection:bg-indigo-500/30">
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
                        className="group flex items-center gap-2 text-white/30 hover:text-indigo-400 transition-colors mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Назад к мониторингу
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                                <Users className="w-3 h-3" />
                                Student Management Module
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                База <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">учеников</span>
                            </h1>
                            <p className="text-white/40 text-sm font-medium">Централизованный реестр студентов и их академических показателей</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search identifier..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none w-full md:w-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Total Students', value: stats.total, icon: <Users className="w-4 h-4" />, color: 'text-white' },
                        { label: 'Active (72h)', value: stats.active, icon: <Activity className="w-4 h-4" />, color: 'text-emerald-400' },
                        { label: 'Risk Protocol', value: stats.atRisk, icon: <ShieldAlert className="w-4 h-4" />, color: 'text-red-400' },
                        { label: 'High Potential', value: stats.graduated, icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-xl flex flex-col gap-2 group hover:bg-white/[0.05] transition-all">
                            <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color} mb-2`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black tracking-tighter tabular-nums">{stat.value}</div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* User Matrix Table */}
                <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 overflow-x-auto w-full pb-2 md:pb-0">
                            {(['all', 'active', 'inactive', 'risk'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === filter ? 'text-indigo-400 pb-1 border-b-2 border-indigo-400' : 'text-white/20 hover:text-white/40'
                                        }`}
                                >
                                    {filter === 'all' && 'All Systems'}
                                    {filter === 'active' && 'Active'}
                                    {filter === 'inactive' && 'Inactive'}
                                    {filter === 'risk' && 'Stalled'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="text-left py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Candidate</th>
                                    <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Engagement</th>
                                    <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Efficiency</th>
                                    <th className="text-right py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Status</th>
                                    <th className="text-right py-4 px-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => {
                                    const lastActive = user.lastActiveAt?.toDate() || new Date(0)
                                    const isActive = Date.now() - lastActive.getTime() < 3 * 24 * 60 * 60 * 1000
                                    const isInactive = Date.now() - lastActive.getTime() >= 7 * 24 * 60 * 60 * 1000

                                    return (
                                        <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black border border-white/5 text-indigo-400">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm tracking-tight">{user.name}</div>
                                                        <div className="text-[10px] font-medium text-white/20 lowercase tracking-tight">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-center">
                                                <div className="text-xs font-bold tabular-nums">{user.completedTasks || 0} tasks</div>
                                                <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{user.xp || 0} Score</div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="max-w-[100px] mx-auto">
                                                    <div className="flex justify-between items-center mb-1 text-[9px] font-bold tabular-nums">
                                                        <span className="text-white/40">Progression</span>
                                                        <span>{user.progress || 0}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${user.progress || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isInactive ? 'bg-red-500' : 'bg-white/20'}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : isInactive ? 'text-red-400' : 'text-white/20'}`}>
                                                        {isActive ? 'Live' : isInactive ? 'Offline' : 'Idle'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/20 transition-all group-hover:scale-110"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-white/40" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center">
                            <AlertCircle className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 text-sm font-black uppercase tracking-[0.2em]">No Candidates Found</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default AdminUsersPage
