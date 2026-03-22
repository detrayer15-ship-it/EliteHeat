import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    collection, query, getDocs, doc, updateDoc, orderBy, where
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import {
    ArrowLeft, BookOpen, CheckCircle2, XCircle, Clock,
    Search, Users, AlertCircle, Loader2, ChevronRight, Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface TeacherApplication {
    userId: string
    name: string
    email: string
    subject: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: any
}

const statusConfig = {
    pending: { label: 'На рассмотрении', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    approved: { label: 'Одобрено', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    rejected: { label: 'Отклонено', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}

export const AdminTeacherApplicationsPage = () => {
    const navigate = useNavigate()
    const [applications, setApplications] = useState<TeacherApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [processing, setProcessing] = useState<string | null>(null)

    const loadApplications = async () => {
        setLoading(true)
        try {
            const snapshot = await getDocs(collection(db, 'teacherApplications'))
            const data = snapshot.docs.map(d => ({
                ...d.data()
            })) as TeacherApplication[]

            // Sort client-side newest first
            data.sort((a, b) => {
                const ta = a.createdAt?.toMillis?.() || 0
                const tb = b.createdAt?.toMillis?.() || 0
                return tb - ta
            })
            setApplications(data)
        } catch (err) {
            console.error('Error loading teacher applications:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadApplications() }, [])

    const handleApprove = async (app: TeacherApplication) => {
        setProcessing(app.userId)
        try {
            // 1. Update application status
            await updateDoc(doc(db, 'teacherApplications', app.userId), {
                status: 'approved'
            })
            // 2. Update user role in users collection
            await updateDoc(doc(db, 'users', app.userId), {
                role: 'teacher',
                teacherApplicationStatus: 'approved'
            })
            setApplications(prev =>
                prev.map(a => a.userId === app.userId ? { ...a, status: 'approved' } : a)
            )
        } catch (err) {
            console.error('Error approving teacher:', err)
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (app: TeacherApplication) => {
        setProcessing(app.userId)
        try {
            await updateDoc(doc(db, 'teacherApplications', app.userId), {
                status: 'rejected'
            })
            await updateDoc(doc(db, 'users', app.userId), {
                teacherApplicationStatus: 'rejected'
            })
            setApplications(prev =>
                prev.map(a => a.userId === app.userId ? { ...a, status: 'rejected' } : a)
            )
        } catch (err) {
            console.error('Error rejecting teacher:', err)
        } finally {
            setProcessing(null)
        }
    }

    const filtered = applications.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            (a.subject || '').toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || a.status === filter
        return matchSearch && matchFilter
    })

    const counts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    }

    return (
        <div className="min-h-screen bg-[#0c0d10] text-white">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/admin')}
                        className="group flex items-center gap-2 text-white/30 hover:text-amber-400 transition-all mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Назад к панели
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-2">
                                <BookOpen className="w-3 h-3" />
                                Teacher Moderation
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Заявки <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">учителей</span>
                            </h1>
                            <p className="text-white/40 text-sm font-medium">
                                Одобряйте или отклоняйте заявки на роль учителя
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Поиск по имени, email, предмету..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none w-full md:w-80"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {([
                        { key: 'all', label: 'Всего', icon: Users, color: 'text-white' },
                        { key: 'pending', label: 'Ожидают', icon: Clock, color: 'text-amber-400' },
                        { key: 'approved', label: 'Одобрено', icon: CheckCircle2, color: 'text-emerald-400' },
                        { key: 'rejected', label: 'Отклонено', icon: XCircle, color: 'text-red-400' },
                    ] as const).map(s => (
                        <Card
                            key={s.key}
                            className={`p-5 bg-white/[0.02] border-white/5 backdrop-blur-xl flex flex-col gap-2 cursor-pointer transition-all hover:bg-white/[0.04] ${filter === s.key ? 'border-b-2 border-b-amber-500' : 'border-b-2 border-b-transparent'}`}
                            onClick={() => setFilter(s.key)}
                        >
                            <s.icon className={`w-4 h-4 ${s.color}`} />
                            <div className="text-3xl font-black tracking-tighter tabular-nums">{counts[s.key]}</div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{s.label}</div>
                        </Card>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 py-24">
                            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Загрузка заявок...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-16 flex flex-col items-center gap-4 text-center">
                            <AlertCircle className="w-14 h-14 text-white/5 mx-auto" />
                            <h3 className="text-xl font-black uppercase tracking-tight">Заявок нет</h3>
                            <p className="text-white/30 text-sm font-medium max-w-xs">
                                {filter === 'pending'
                                    ? 'Новых заявок от учителей пока не поступало'
                                    : 'Нет заявок, соответствующих фильтру'}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filtered.map((app, idx) => {
                                const sc = statusConfig[app.status]
                                const isProcessing = processing === app.userId
                                const date = app.createdAt?.toDate?.()?.toLocaleDateString('ru-RU') || '—'

                                return (
                                    <motion.div
                                        key={app.userId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center gap-5 hover:bg-white/[0.05] transition-all"
                                    >
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg font-black text-amber-400 shrink-0">
                                            {app.name?.charAt(0) || 'U'}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-black text-sm text-white">{app.name}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color} ${sc.border}`}>
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-xs font-medium">{app.email}</p>
                                            {app.subject && (
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <BookOpen className="w-3 h-3 text-amber-400/60" />
                                                    <span className="text-amber-300/70 text-xs font-medium">{app.subject}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Date */}
                                        <div className="text-white/20 text-xs font-medium shrink-0">{date}</div>

                                        {/* Actions */}
                                        {app.status === 'pending' && (
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleApprove(app)}
                                                    disabled={!!isProcessing}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                                                >
                                                    {isProcessing
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <CheckCircle2 className="w-3.5 h-3.5" />
                                                    }
                                                    Одобрить
                                                </button>
                                                <button
                                                    onClick={() => handleReject(app)}
                                                    disabled={!!isProcessing}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                                                >
                                                    {isProcessing
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <XCircle className="w-3.5 h-3.5" />
                                                    }
                                                    Отклонить
                                                </button>
                                            </div>
                                        )}

                                        {app.status !== 'pending' && (
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${sc.bg} ${sc.border} ${sc.color}`}>
                                                {app.status === 'approved'
                                                    ? <CheckCircle2 className="w-3.5 h-3.5" />
                                                    : <XCircle className="w-3.5 h-3.5" />
                                                }
                                                {sc.label}
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    )
}

export default AdminTeacherApplicationsPage
