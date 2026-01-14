import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { assignmentsAPI } from '@/api/assignments'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    FileText,
    History,
    ChevronRight,
    ChevronDown,
    Sparkles,
    Search,
    BookOpen
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface Assignment {
    id: string
    title: string
    description: string
}

interface Submission {
    id: string
    assignmentId: string
    status: string
    content: string
    submittedAt: any
}

export const MyAssignmentsPage = () => {
    const user = useAuthStore(state => state.user)
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const assignmentsRes = await assignmentsAPI.getAll()
        if (assignmentsRes.success) {
            setAssignments(assignmentsRes.data as Assignment[])
        }

        if (user) {
            const submissionsRes = await assignmentsAPI.getMySubmissions(user.id)
            if (submissionsRes.success) {
                setSubmissions(submissionsRes.data as Submission[])
            }
        }
    }

    const handleSubmit = async (assignmentId: string) => {
        if (!content.trim() || !user) return

        setIsSubmitting(true)
        const result = await assignmentsAPI.submitAssignment(
            assignmentId,
            user.id,
            user.name,
            content
        )

        if (result.success) {
            setContent('')
            setSelectedAssignment(null)
            loadData()
        }
        setIsSubmitting(false)
    }

    const getSubmissionInfo = (assignmentId: string) => {
        const submission = submissions.find(s => s.assignmentId === assignmentId)
        if (!submission) return null

        const statusMap: Record<string, { label: string, color: string, icon: any, bg: string }> = {
            pending: { label: 'In Review', color: 'text-amber-500', icon: Clock, bg: 'bg-amber-50' },
            approved: { label: 'Verified', color: 'text-emerald-500', icon: CheckCircle2, bg: 'bg-emerald-50' },
            rejected: { label: 'Revision', color: 'text-rose-500', icon: AlertCircle, bg: 'bg-rose-50' }
        }

        return statusMap[submission.status] || { label: submission.status, color: 'text-indigo-500', icon: History, bg: 'bg-indigo-50' }
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO MODULE: THE LEDGER */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-20 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Assignment Ledger v4.1</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                            Мои <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-white to-indigo-400 bg-clip-text text-transparent italic">Задания</span>
                        </h1>
                        <p className="text-xl text-white/40 font-medium max-w-xl leading-relaxed italic">
                            Ваш персональный архив учебных работ. Отслеживайте статусы проверки и управляйте новыми поступлениями.
                        </p>
                    </div>
                </div>
            </ScrollReveal>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Tasks', value: assignments.length, icon: <FileText className="text-indigo-600" />, bg: 'bg-indigo-50' },
                    { label: 'Submissions', value: submissions.length, icon: <Send className="text-emerald-600" />, bg: 'bg-emerald-50' },
                    { label: 'Verified', value: submissions.filter(s => s.status === 'approved').length, icon: <CheckCircle2 className="text-purple-600" />, bg: 'bg-purple-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-indigo-50 shadow-xl flex items-center gap-6 group hover:translate-y-[-5px] transition-all">
                        <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            {s.icon}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30 mb-1">{s.label}</div>
                            <div className="text-3xl font-black text-indigo-950 italic"><AnimatedCounter end={s.value} /></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ASSIGNMENTS LIST */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-6">
                    <h3 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase italic">Current Roster</h3>
                    <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-indigo-50 shadow-sm">
                        <Search className="w-4 h-4 text-indigo-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30">Protocol Filter</span>
                    </div>
                </div>

                <div className="grid gap-6">
                    {assignments.map((assignment, idx) => {
                        const subInfo = getSubmissionInfo(assignment.id)
                        const isExpanded = selectedAssignment === assignment.id
                        const StatusIcon = subInfo?.icon

                        return (
                            <ScrollReveal key={assignment.id} animation="slide-up" delay={idx * 50}>
                                <div className={`group relative bg-white border border-indigo-50 rounded-[3rem] p-10 transition-all hover:shadow-3xl ${isExpanded ? 'shadow-3xl scale-[1.02]' : 'shadow-xl'}`}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">#{idx + 1}</div>
                                                <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{assignment.title}</h3>
                                            </div>
                                            <p className="text-indigo-950/40 font-medium italic leading-relaxed max-w-2xl">{assignment.description}</p>
                                        </div>

                                        <div className="flex items-center gap-6 shrink-0">
                                            {subInfo ? (
                                                <div className={`flex items-center gap-4 px-8 py-4 ${subInfo.bg} ${subInfo.color} rounded-full border border-current/10 shadow-sm`}>
                                                    <StatusIcon className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{subInfo.label}</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedAssignment(isExpanded ? null : assignment.id)}
                                                    className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-600 text-white shadow-glow hover:bg-indigo-700'}`}
                                                >
                                                    {isExpanded ? 'Cancel' : 'Submit Protocol'}
                                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* EXPANDED SUBMISSION AREA */}
                                    {isExpanded && (
                                        <div className="mt-12 pt-12 border-t border-indigo-50 animate-fade-in space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Project Solution / Code</label>
                                                    <span className="text-[9px] font-black uppercase text-indigo-300">Markdown Compatible</span>
                                                </div>
                                                <textarea
                                                    className="w-full bg-indigo-50/30 border border-indigo-50 rounded-[2.5rem] p-10 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all min-h-[300px] resize-none"
                                                    placeholder="Input your work results here..."
                                                    value={content}
                                                    onChange={e => setContent(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    disabled={isSubmitting || !content.trim()}
                                                    onClick={() => handleSubmit(assignment.id)}
                                                    className="flex-1 py-6 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-glow disabled:opacity-30"
                                                >
                                                    {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                                    {isSubmitting ? 'Finalizing...' : 'Execute Submission'}
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedAssignment(null); setContent('') }}
                                                    className="px-10 py-6 border-2 border-indigo-50 text-indigo-950/30 rounded-[1.8rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-50 hover:text-indigo-950 transition-all"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>
                        )
                    })}

                    {assignments.length === 0 && (
                        <div className="h-64 rounded-[3rem] border-4 border-dashed border-indigo-50 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40">
                            <AlertCircle className="w-12 h-12 text-indigo-300" />
                            <h3 className="text-xl font-black text-indigo-950 tracking-tighter uppercase">No Assignments Found</h3>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 2s linear infinite; }
            `}</style>
        </div>
    )
}

const RefreshCw = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
)
