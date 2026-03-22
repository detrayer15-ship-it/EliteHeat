import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { getProgressToNextRank } from '@/utils/adminRanks'
import {
    Users,
    MessageCircle,
    TrendingUp,
    Award,
    ClipboardCheck,
    Activity,
    ShieldCheck,
    Zap,
    Cpu,
    Bell,
    ExternalLink,
    ChevronRight,
    PieChart,
    UserCheck
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const AdminDashboardPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        setLoading(false)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer' && currentUser?.role !== 'teacher') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c0d10]">
                <Card className="p-8 text-center max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                    <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Доступ ограничен</h1>
                    <p className="text-white/40 text-sm mb-6">Требуется уровень доступа: АДМИНИСТРАТОР или РАЗРАБОТЧИК</p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-6 text-xs font-bold uppercase tracking-widest">
                        Вернуться на главную
                    </Button>
                </Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c0d10]">
                <div className="relative">
                    <div className="w-24 h-24 border-2 border-indigo-500/20 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-24 h-24 border-t-2 border-indigo-500 rounded-full animate-spin relative z-10 text-xs flex items-center justify-center text-indigo-400 font-bold uppercase tracking-widest">
                        Syncing
                    </div>
                </div>
            </div>
        )
    }

    const adminPoints = currentUser?.adminPoints || 0

    return (
        <div className="min-h-screen bg-[#08090a] text-white selection:bg-indigo-500/30">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-2">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Live System Monitor
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                            Центр <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Мониторинга</span>
                        </h1>
                        <p className="text-white/40 text-sm font-medium">Контроль и управление образовательной экосистемой EliteEdu</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mb-1">System Time</div>
                            <div className="text-lg font-mono font-bold text-white/80 tabular-nums">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                <span className="animate-pulse">:</span>
                                {currentTime.toLocaleTimeString([], { second: '2-digit' })}
                            </div>
                        </div>
                        <button className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all flex items-center justify-center relative group">
                            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    {/* Main Stats Panel */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* System Metrics Panel */}
                        <div className="bg-gradient-to-br from-[#111218] to-[#08090a] border border-white/[0.05] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl mb-8">
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/20 flex items-center justify-center text-4xl shadow-inner text-indigo-400">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">Панель управления</h2>
                                        <p className="text-white/30 text-sm font-medium">Доступ разрешен • Системы мониторинга активны</p>
                                    </div>
                                </div>

                                <div className="flex gap-8">
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">99.9%</div>
                                        <div className="text-[9px] font-bold text-indigo-400/50 uppercase tracking-[0.2em] mt-1">Uptime</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">24ms</div>
                                        <div className="text-[9px] font-bold text-indigo-400/50 uppercase tracking-[0.2em] mt-1">Latency</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interaction Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <MonitorCard
                                title="База учеников"
                                description="Просмотр и управление базой учеников"
                                icon={<Users className="w-6 h-6" />}
                                color="blue"
                                onClick={() => navigate('/admin/users')}
                                value="Синхронизировано"
                                label="Состояние базы"
                            />
                            <MonitorCard
                                title="Проверка"
                                description="Контроль качества выполнения задач"
                                icon={<ClipboardCheck className="w-6 h-6" />}
                                color="orange"
                                onClick={() => navigate('/admin/tasks')}
                                value="14"
                                label="Pending"
                            />
                            <MonitorCard
                                title="Аналитика"
                                description="Глубокий анализ эффективности"
                                icon={<PieChart className="w-6 h-6" />}
                                color="emerald"
                                onClick={() => navigate('/admin/analytics')}
                                value="+22%"
                                label="Growth"
                            />
                            <MonitorCard
                                title="Обращения"
                                description="Ответы на вопросы и помощь"
                                icon={<MessageCircle className="w-6 h-6" />}
                                color="pink"
                                onClick={() => navigate('/admin/support-chats')}
                                value="2 мин"
                                label="Avg Response"
                            />
                        </div>
                    </div>

                    {/* Side Sidebar Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Quick Action Links */}
                        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl p-6 rounded-[2rem] flex flex-col gap-4">
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-2 mb-2">Операционные модули</h3>
                            <ActionLink icon={<TrendingUp className="w-4 h-4" />} title="Мониторинг риска" onClick={() => navigate('/admin/student-monitoring')} />

                            <ActionLink icon={<UserCheck className="w-4 h-4" />} title="Заявки учителей" onClick={() => navigate('/admin/teacher-applications')} />
                            <ActionLink icon={<MessageCircle className="w-4 h-4" />} title="Чат админов" onClick={() => navigate('/admin/group-chat')} />
                        </Card>

                        {/* System Health Card */}
                        <Card className="bg-gradient-to-br from-[#111218] to-[#08090a] border-white/5 p-6 rounded-[2rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Cpu className="w-24 h-24" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Статус систем</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-zinc-300">API Core</span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase">Stable</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-zinc-300">Database</span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase">99.9%</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-6 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 rounded-xl h-10 border border-zinc-600/30 text-xs font-bold uppercase tracking-widest"
                                    onClick={() => navigate('/developer/panel')}
                                >
                                    Developer Panel
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Components
const MonitorCard = ({ title, description, icon, color, onClick, value, label }: any) => {
    const colors: any = {
        indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/10 border-indigo-500/20',
        blue: 'from-blue-500 to-cyan-500 shadow-blue-500/10 border-blue-500/20',
        orange: 'from-orange-500 to-red-500 shadow-orange-500/10 border-orange-500/20',
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/10 border-emerald-500/20',
        pink: 'from-pink-500 to-rose-600 shadow-pink-500/10 border-pink-500/20'
    }

    return (
        <button
            onClick={onClick}
            className={`group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02] text-left relative overflow-hidden`}
        >
            <div className={`p-3 w-fit rounded-2xl bg-gradient-to-br ${colors[color]} text-white mb-4 group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <h3 className="text-lg font-black text-white tracking-tight mb-1">{title}</h3>
            <p className="text-white/30 text-[11px] leading-snug mb-4 group-hover:text-white/50 transition-colors uppercase font-bold tracking-wider">{description}</p>

            <div className="flex items-end justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{value}</span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{label}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/20 transition-all">
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </button>
    )
}

const ActionLink = ({ icon, title, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex items-center justify-between w-full p-4 rounded-2xl border border-white/[0.03] hover:bg-white/[0.02] hover:border-white/10 transition-all group"
    >
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                {icon}
            </div>
            <span className="text-xs font-bold text-white/60 tracking-tight group-hover:text-white transition-colors">{title}</span>
        </div>
        <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </button>
)
