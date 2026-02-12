import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import {
    Cpu,
    Search,
    Clock,
    AlertTriangle,
    ShieldCheck,
    MessageSquare,
    Terminal,
    Activity,
    ChevronRight,
    ArrowLeft,
    Filter,
    Layers,
    Bot
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIUsageLog {
    id: string
    studentId: string
    studentName: string
    studentEmail: string
    timestamp: Date
    feature: 'chat' | 'code-review' | 'assistant' | 'image-analysis'
    prompt: string
    response: string
    tokensUsed: number
    suspicious: boolean
    suspicionReasons: string[]
}

interface StudentAIStats {
    studentId: string
    studentName: string
    totalRequests: number
    suspiciousRequests: number
    lastUsed: Date
    avgTokensPerRequest: number
    features: {
        chat: number
        codeReview: number
        assistant: number
        imageAnalysis: number
    }
    suspicionScore: number // 0-100
}

export const AIActivityMonitorPage = () => {
    const navigate = useNavigate()
    const [logs, setLogs] = useState<AIUsageLog[]>([])
    const [studentStats, setStudentStats] = useState<StudentAIStats[]>([])
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAIActivityData()
    }, [timeFilter])

    const loadAIActivityData = async () => {
        setLoading(true)
        try {
            const usersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
            const studentsMap = new Map()
            usersSnapshot.docs.forEach(doc => {
                studentsMap.set(doc.id, { id: doc.id, ...doc.data() })
            })

            const messagesSnapshot = await getDocs(query(
                collection(db, 'aiMessages'),
                orderBy('timestamp', 'desc'),
                limit(100)
            ))

            const realLogs: AIUsageLog[] = messagesSnapshot.docs.map(doc => {
                const data = doc.data()
                const student = studentsMap.get(data.userId) || { name: 'Unknown', email: '' }

                const suspicionReasons = []
                const suspiciousKeywords = ['готовый код', 'ответ', 'решение', 'сделай за меня', 'код для задания']
                if (data.role === 'user' && suspiciousKeywords.some(k => data.content.toLowerCase().includes(k))) {
                    suspicionReasons.push('Запрос прямого решения или готового кода')
                }

                return {
                    id: doc.id,
                    studentId: data.userId,
                    studentName: student.name,
                    studentEmail: student.email,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    feature: data.feature || 'chat',
                    prompt: data.role === 'user' ? data.content : '(Ответ AI)',
                    response: data.role === 'assistant' ? data.content : '',
                    tokensUsed: data.meta?.totalTokens || 0,
                    suspicious: suspicionReasons.length > 0,
                    suspicionReasons
                }
            })

            const statsMap = new Map<string, StudentAIStats>()

            realLogs.forEach(log => {
                if (!statsMap.has(log.studentId)) {
                    statsMap.set(log.studentId, {
                        studentId: log.studentId,
                        studentName: log.studentName,
                        totalRequests: 0,
                        suspiciousRequests: 0,
                        lastUsed: log.timestamp,
                        avgTokensPerRequest: 0,
                        features: { chat: 0, codeReview: 0, assistant: 0, imageAnalysis: 0 },
                        suspicionScore: 0
                    })
                }

                const s = statsMap.get(log.studentId)!
                s.totalRequests++
                if (log.suspicious) s.suspiciousRequests++
                if (log.timestamp > s.lastUsed) s.lastUsed = log.timestamp

                if (log.feature === 'chat') s.features.chat++
                else if (log.feature === 'code-review') s.features.codeReview++
            })

            const finalStats = Array.from(statsMap.values()).map(s => {
                s.suspicionScore = Math.min(100, Math.round((s.suspiciousRequests / s.totalRequests) * 100 * 2))
                return s
            })

            setLogs(realLogs.filter(l => l.prompt !== '(Ответ AI)'))
            setStudentStats(finalStats)
        } catch (error) {
            console.error('Error loading AI activity:', error)
        } finally {
            setLoading(false)
        }
    }

    const getRiskDetails = (score: number) => {
        if (score >= 70) return { color: 'text-red-500', label: 'CRITICAL', bg: 'bg-red-500/10', border: 'border-red-500/20' }
        if (score >= 40) return { color: 'text-yellow-500', label: 'MODERATE', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
        return { color: 'text-emerald-500', label: 'MINIMAL', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
    }

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 1000 / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Synching AI Neural Logs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#08090a] text-white selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] left-[15%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/admin')}
                        className="group flex items-center gap-2 text-white/30 hover:text-blue-400 transition-colors mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Command Center
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">
                                <Cpu className="w-3 h-3" />
                                Neural Activity Monitor
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Анализ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">интеллекта</span>
                            </h1>
                            <p className="text-white/40 text-sm font-medium">Контроль взаимодействия с AI-системами и детектирование академической нечестности</p>
                        </div>

                        <div className="flex gap-2 bg-white/[0.03] p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === filter
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Neural Queries', value: studentStats.reduce((sum, s) => sum + s.totalRequests, 0), icon: <Activity className="w-4 h-4" />, color: 'text-blue-400' },
                        { label: 'Academic Risks', value: studentStats.reduce((sum, s) => sum + s.suspiciousRequests, 0), icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400' },
                        { label: 'Active Mindset', value: studentStats.length, icon: <Bot className="w-4 h-4" />, color: 'text-indigo-400' },
                        { label: 'Avg System Flux', value: `${Math.round(studentStats.reduce((sum, s) => sum + s.suspicionScore, 0) / (studentStats.length || 1))}%`, icon: <Layers className="w-4 h-4" />, color: 'text-emerald-400' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-6 bg-white/[0.02] border-white/5 backdrop-blur-xl group hover:bg-white/[0.05] transition-all">
                            <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color} mb-3`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black tracking-tighter tabular-nums mb-1">{stat.value}</div>
                            <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Student Stats Table */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Student Intelligence Matrix</h2>
                                <Search className="w-4 h-4 text-white/20" />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="text-left py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Identifier</th>
                                            <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Activity</th>
                                            <th className="text-center py-4 px-8 text-[9px] font-black uppercase tracking-widest text-white/30">Risk Factor</th>
                                            <th className="text-right py-4 px-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {studentStats.map((student) => {
                                            const risk = getRiskDetails(student.suspicionScore)
                                            return (
                                                <tr key={student.studentId} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-6 px-8">
                                                        <div className="font-bold text-sm tracking-tight">{student.studentName}</div>
                                                        <div className="text-[10px] text-white/20 font-medium">Internal ID: {student.studentId.slice(0, 8)}</div>
                                                    </td>
                                                    <td className="py-6 px-8 text-center text-sm font-black tabular-nums">{student.totalRequests} q</td>
                                                    <td className="py-6 px-8 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${risk.bg} ${risk.border} ${risk.color}`}>
                                                            {risk.label} ({student.suspicionScore}%)
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-8 text-right">
                                                        <button
                                                            onClick={() => setSelectedStudent(student.studentId)}
                                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/20 transition-all group-hover:scale-110"
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
                        </Card>
                    </div>

                    {/* Recent Intelligence Logs */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Live Neural Stream
                        </h3>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    layout
                                    className={`p-5 rounded-2xl border bg-white/[0.02] backdrop-blur-md transition-all ${log.suspicious ? 'border-red-500/30' : 'border-white/5'}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="text-xs font-bold tracking-tight mb-1">{log.studentName}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">[{log.feature}]</span>
                                                <span className="text-[8px] font-medium text-white/20 uppercase tracking-widest">{formatTimestamp(log.timestamp)}</span>
                                            </div>
                                        </div>
                                        {log.suspicious && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] font-mono text-white/60 leading-relaxed mb-3 break-words">
                                        {log.prompt}
                                    </div>
                                    {log.suspicious && (
                                        <div className="text-[9px] font-bold text-red-400/80 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/10">
                                            DETECTED: {log.suspicionReasons[0]}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <Card className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/10 rounded-[2.5rem]">
                        <ShieldCheck className="w-6 h-6 text-blue-400 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-wider text-blue-300 mb-2">Integrity Engine</h4>
                        <p className="text-[11px] text-blue-200/40 leading-relaxed">Continuous verification of student responses against global solution patterns.</p>
                    </Card>
                    <Card className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/10 rounded-[2.5rem]">
                        <Terminal className="w-6 h-6 text-indigo-400 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-wider text-indigo-300 mb-2">Protocol Analysis</h4>
                        <p className="text-[11px] text-indigo-200/40 leading-relaxed">Real-time monitoring of RESTful communication between user agents and LLM endpoints.</p>
                    </Card>
                    <Card className="p-8 bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/10 rounded-[2.5rem]">
                        <Activity className="w-6 h-6 text-emerald-400 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-300 mb-2">Neural Metrics</h4>
                        <p className="text-[11px] text-emerald-200/40 leading-relaxed">Aggregated data points reflecting the quality and complexity of student-AI interaction.</p>
                    </Card>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    )
}

export default AIActivityMonitorPage

