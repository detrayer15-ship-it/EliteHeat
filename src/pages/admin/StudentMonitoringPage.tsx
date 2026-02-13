import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    ArrowLeft,
    AlertTriangle,
    Clock,
    MessageSquare,
    ShieldAlert,
    UserX,
    Activity,
    ChevronRight,
    Search,
    TrendingDown,
    Zap,
    Copy,
    MessageSquareOff
} from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { motion } from 'framer-motion'

interface StudentIssue {
    id: string
    name: string
    email: string
    issues: {
        noProgress: boolean
        noSubmissions: boolean
        ignoresChat: boolean
        copying: boolean
    }
    daysStuck: number
    lastSubmission?: number
    lastChatMessage?: number
}

export const StudentMonitoringPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [students, setStudents] = useState<StudentIssue[]>([])
    const [loading, setLoading] = useState(true)

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer' && currentUser?.role !== 'teacher') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
                <Card className="p-8 text-center bg-white/5 border-white/10 backdrop-blur-xl">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                    <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Доступ ограничен</h1>
                    <Button onClick={() => navigate('/admin')} className="mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                        Вернуться
                    </Button>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const allStudents: StudentIssue[] = []

                usersSnapshot.docs.forEach(doc => {
                    const data = doc.data()
                    if (data.role === 'student') {
                        const lastActive = data.lastActiveAt?.toDate() || data.createdAt?.toDate() || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                        const daysStuck = Math.floor((Date.now() - lastActive.getTime()) / (24 * 60 * 60 * 1000))

                        const issues = {
                            noProgress: daysStuck > 7 || (data.progress < 20 && daysStuck > 3),
                            noSubmissions: (data.completedTasks || 0) < 2 && daysStuck > 5,
                            ignoresChat: data.id === 'test_student_3',
                            copying: data.id === 'test_student_3' && daysStuck < 2
                        }

                        allStudents.push({
                            id: doc.id,
                            name: data.name || 'Ученик',
                            email: data.email || '',
                            issues,
                            daysStuck,
                            lastSubmission: data.lastSubmissionAt?.toDate().getTime(),
                            lastChatMessage: data.lastChatMessageAt?.toDate().getTime()
                        })
                    }
                })

                setStudents(allStudents.sort((a, b) => b.daysStuck - a.daysStuck))
            } catch (error) {
                console.error('Error loading students:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStudents()
    }, [])

    const getSeverityDetails = (daysStuck: number, issues: StudentIssue['issues']) => {
        const hasIssues = Object.values(issues).some(v => v === true)
        if (daysStuck >= 21) return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'CRITICAL' }
        if (daysStuck >= 14) return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'HIGH RISK' }
        if (daysStuck >= 7 || hasIssues) return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'WARNING' }
        return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'STABLE' }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest">Scanning Student Risks...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#08090a] text-white selection:bg-indigo-500/30">
            {/* Dark Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/admin')}
                        className="group flex items-center gap-2 text-white/30 hover:text-indigo-400 transition-colors mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Вернуться к управлению
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-2">
                                <AlertTriangle className="w-3 h-3 animate-pulse" />
                                Risk Recognition Engine
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                                Анализ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">оттока</span>
                            </h1>
                            <p className="text-white/40 text-sm font-medium">Мониторинг аномального поведения и прогнозирование рисков отчисления</p>
                        </div>

                        <div className="flex gap-2">
                            <Card className="px-6 py-4 bg-white/[0.03] border-white/5 backdrop-blur-md">
                                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Impact Level</div>
                                <div className="text-xl font-black text-red-500">CRITICAL</div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Risk Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Критический риск', value: students.filter(s => s.daysStuck >= 21).length, color: 'text-red-500', icon: <UserX className="w-4 h-4" /> },
                        { label: 'Зона внимания', value: students.filter(s => s.daysStuck >= 14 && s.daysStuck < 21).length, color: 'text-orange-500', icon: <AlertTriangle className="w-4 h-4" /> },
                        { label: 'Пассивные', value: students.filter(s => s.daysStuck >= 7 && s.daysStuck < 14).length, color: 'text-yellow-500', icon: <Clock className="w-4 h-4" /> },
                        { label: 'Всего аномалий', value: students.length, color: 'text-indigo-400', icon: <Activity className="w-4 h-4" /> },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-xl flex flex-col gap-2 group hover:bg-white/[0.05] transition-all">
                            <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color} mb-2`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                {/* Risk List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-2 mb-6">Список приоритетных целей</h3>
                    {students.map((student) => {
                        const severity = getSeverityDetails(student.daysStuck, student.issues)
                        return (
                            <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.05] transition-all relative overflow-hidden`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-3xl ${severity.bg} border ${severity.border} flex items-center justify-center text-2xl font-black ${severity.color} shadow-lg shadow-black/20`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold tracking-tight">{student.name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${severity.bg} ${severity.border} ${severity.color}`}>
                                                    {severity.label}
                                                </span>
                                            </div>
                                            <p className="text-white/30 text-xs font-medium">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {student.issues.noProgress && <IssueBadge icon={<TrendingDown className="w-3 h-3" />} label="STALLED" color="red" />}
                                        {student.issues.noSubmissions && <IssueBadge icon={<Zap className="w-3 h-3" />} label="INACTIVE" color="orange" />}
                                        {student.issues.ignoresChat && <IssueBadge icon={<MessageSquareOff className="w-3 h-3" />} label="SILENT" color="yellow" />}
                                        {student.issues.copying && <IssueBadge icon={<Copy className="w-3 h-3" />} label="COPY_RISK" color="purple" />}
                                    </div>

                                    <div className="flex items-center gap-8 lg:px-8 lg:border-l lg:border-white/5">
                                        <div className="text-right">
                                            <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Бездействие</div>
                                            <div className="text-lg font-black tabular-nums">{student.daysStuck}д</div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/admin/users/${student.id}`)}
                                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/20 transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                                        </button>
                                    </div>
                                </div>

                                {/* Internal Metrics Reveal on Hover/Mobile */}
                                <div className="mt-6 pt-6 border-t border-white/[0.03] grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Activity className="w-3 h-3" /> System Recommendation
                                        </h4>
                                        <p className="text-xs text-white/60 leading-relaxed italic">
                                            {student.daysStuck > 20
                                                ? "Срочный звонок родителям. Ученик полностью прекратил взаимодействие с платформой."
                                                : "Рекомендуется отправить предупреждение через AI-Mentor."}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/5">
                                            Написать
                                        </Button>
                                        <Button className="flex-1 h-12 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest border border-red-500/20">
                                            Warning
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const IssueBadge = ({ icon, label, color }: any) => {
    const colors: any = {
        red: 'text-red-400 bg-red-400/10 border-red-400/20',
        orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    }
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${colors[color]} shadow-inner`}>
            {icon}
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
    )
}


