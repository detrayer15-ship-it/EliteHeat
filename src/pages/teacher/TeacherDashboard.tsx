import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
    Users,
    BookOpen,
    MessageSquare,
    TrendingUp,
    Award,
    ClipboardCheck,
    Calendar,
    FileText,
    BarChart3,
    Settings,
    Bell
} from 'lucide-react'

export const TeacherDashboard = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    if (currentUser?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещён</h1>
                    <p className="text-gray-600">Эта страница доступна только учителям</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-full py-2 space-y-10">
            {/* HERO SECTION */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-[3rem] shadow-2xl border border-white/20">
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-yellow-400 to-green-500 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000"></div>
                </div>

                <div className="relative z-10 p-10 lg:p-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/25 shadow-xl">
                            <Award className="w-4 h-4 text-yellow-300 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Учительская панель</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
                            Добро пожаловать,<br />
                            <span className="bg-gradient-to-r from-yellow-200 via-white to-cyan-200 bg-clip-text text-transparent italic">
                                {currentUser?.name || currentUser?.displayName || 'Учитель'}
                            </span>
                        </h1>
                        <p className="text-xl text-white/90 font-medium max-w-2xl leading-relaxed">
                            Управляйте учебным процессом, отслеживайте прогресс учеников и создавайте вдохновляющую образовательную среду.
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Активных учеников', count: 0, icon: <Users />, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Непроверенных работ', count: 0, icon: <ClipboardCheck />, color: 'from-orange-500 to-red-600' },
                    { label: 'Новых сообщений', count: 0, icon: <MessageSquare />, color: 'from-green-500 to-emerald-600' },
                    { label: 'Активных курсов', count: 0, icon: <BookOpen />, color: 'from-purple-500 to-pink-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-premium p-6 rounded-[2rem] border border-white/60 shadow-xl hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-4xl font-black text-indigo-950 mb-2">{stat.count}</div>
                        <div className="text-sm font-bold text-indigo-950/60 uppercase tracking-wide">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* MAIN ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <button
                    onClick={() => navigate('/admin/enhanced-users')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Мои ученики</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Управление списком учеников и их прогрессом</p>
                </button>

                <button
                    onClick={() => navigate('/admin/enhanced-review')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <ClipboardCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Проверка работ</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Проверяйте и оценивайте задания учеников</p>
                </button>

                <button
                    onClick={() => navigate('/admin/enhanced-chat')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Сообщения</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Общайтесь с учениками и родителями</p>
                </button>

                <button
                    onClick={() => navigate('/admin/enhanced-groups')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Группы</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Управление учебными группами</p>
                </button>

                <button
                    onClick={() => navigate('/admin/analytics')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Аналитика</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Статистика и отчёты по успеваемости</p>
                </button>

                <button
                    onClick={() => navigate('/admin/appeals')}
                    className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all text-left group relative"
                >
                    <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                            0
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl text-white group-hover:scale-110 transition-transform">
                            <Bell className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-indigo-950">Обращения</h3>
                    </div>
                    <p className="text-indigo-950/60 font-medium">Ответы на вопросы учеников</p>
                </button>
            </div>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </div>
    )
}
