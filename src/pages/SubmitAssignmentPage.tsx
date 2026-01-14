import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import {
    Send,
    FileText,
    CheckCircle2,
    ChevronLeft,
    Zap,
    Sparkles,
    Globe,
    Cpu,
    ShieldCheck,
    CloudUpload,
    Rocket
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

export const SubmitAssignmentPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [taskTitle, setTaskTitle] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async () => {
        if (!taskTitle.trim() || !answer.trim()) {
            alert('Security Protocol: Please complete all required fields.')
            return
        }

        setLoading(true)
        try {
            await addDoc(collection(db, 'submissions'), {
                studentId: currentUser?.id,
                studentName: currentUser?.name,
                studentEmail: currentUser?.email,
                taskTitle: taskTitle.trim(),
                answer: answer.trim(),
                status: 'pending',
                grade: null,
                feedback: '',
                submittedAt: Timestamp.now(),
                reviewedAt: null,
                reviewedBy: null
            })

            setSuccess(true)
            setTimeout(() => {
                navigate('/tasks')
            }, 3000)
        } catch (error) {
            console.error('Error submitting assignment:', error)
            alert('Transmission Interrupted: Error sending data.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>
                <div className="text-center relative z-10 space-y-8 animate-fade-in">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-40 animate-pulse"></div>
                        <CheckCircle2 className="w-32 h-32 text-emerald-500 relative z-10" />
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter italic">
                        Данные <br />
                        <span className="text-emerald-400">Переданы!</span>
                    </h1>
                    <p className="text-white/40 font-medium text-xl max-w-sm mx-auto leading-relaxed italic">
                        Ваше задание успешно загружено в облачный хаб. Ожидайте верификации ментором.
                    </p>
                    <div className="pt-10">
                        <div className="w-12 h-1 bg-white/10 mx-auto rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-loading-bar"></div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes loading-bar { 
                        0% { width: 0; }
                        100% { width: 100%; }
                    }
                    .animate-loading-bar { animation: loading-bar 3s linear forwards; }
                `}</style>
            </div>
        )
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO MODULE: THE UPLINK */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-8 flex-1">
                            <button
                                onClick={() => navigate('/tasks')}
                                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Return to Academy
                            </button>
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                                <CloudUpload className="w-5 h-5 text-indigo-400 animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Secure Uplink Protocol v9.0</span>
                            </div>
                            <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
                                Сдача <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Работ</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed italic">
                                Отправьте результаты своих трудов на финальную проверку. Каждое решение приближает вас к статусу мастера.
                            </p>
                        </div>

                        <div className="relative group/rocket hidden xl:block">
                            <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20 group-hover/rocket:opacity-40 transition-opacity"></div>
                            <div className="w-72 h-72 rounded-[4rem] bg-gradient-to-tr from-indigo-600 to-purple-600 relative flex items-center justify-center border border-white/20 shadow-glow rotate-12 transition-transform hover:rotate-0">
                                <Rocket className="w-32 h-32 text-white drop-shadow-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* FORM PANEL */}
                <div className="lg:col-span-2">
                    <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl space-y-12">
                        <div className="space-y-8">
                            {/* TITLE INPUT */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8 flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Assignment Header / Title
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-8 flex items-center text-indigo-400"><FileText className="w-5 h-5" /></div>
                                    <input
                                        className="w-full bg-white border border-indigo-50 rounded-[2rem] p-8 pl-18 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all shadow-sm"
                                        placeholder="Ex: Unit 01 - Interface Architecture Masterclass"
                                        value={taskTitle}
                                        onChange={e => setTaskTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* CONTENT INPUT */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Solution Submission / Code / Links
                                    </label>
                                    <span className="text-[9px] font-black uppercase text-indigo-300 italic">Advanced Markdown Support</span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        className="w-full bg-white border border-indigo-50 rounded-[3rem] p-10 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all shadow-sm min-h-[450px] resize-none"
                                        placeholder="Describe your approach, paste GitHub URLs, or raw production code..."
                                        value={answer}
                                        onChange={e => setAnswer(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT ACTION */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !taskTitle.trim() || !answer.trim()}
                                className="w-full py-10 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-glow hover:scale-[1.01] group disabled:opacity-30"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Initialising Uplink...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>Execute System Submission</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-indigo-950/20 mt-6 italic">Secure end-to-end encrypted transmission</p>
                        </div>
                    </div>
                </div>

                {/* INFO PANEL */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-premium rounded-[3.5rem] p-12 border border-white shadow-3xl space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 text-indigo-500/5"><Sparkles className="w-40 h-40" /></div>
                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#0a0a0c] flex items-center justify-center text-white shadow-lg">
                                <Cpu className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-black text-indigo-950 tracking-tighter italic uppercase">Protocol Info</h3>
                            <div className="space-y-6">
                                {[
                                    { text: 'Задание поступит в очередь верификации', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                                    { text: 'Оценка и обратная связь в разделе "Задания"', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                                    { text: 'Поддержка внешних ссылок (GitHub, Figma)', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                                    { text: 'Чистый код — залог высокого балла', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                                ].map((info, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1">{info.icon}</div>
                                        <p className="text-sm font-medium text-indigo-950/60 leading-tight">{info.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0c] rounded-[3.5rem] p-10 text-white relative overflow-hidden flex flex-col items-center text-center space-y-4">
                        <ShieldCheck className="w-12 h-12 text-indigo-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Mastery Status</h4>
                        <p className="text-white/40 text-[10px] leading-relaxed italic">Каждая сданная работа повышает ваш XP на 10-50 ед. в зависимости от сложности.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .pl-18 { padding-left: 4.5rem; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 2s linear infinite; }
            `}</style>
        </div>
    )
}
