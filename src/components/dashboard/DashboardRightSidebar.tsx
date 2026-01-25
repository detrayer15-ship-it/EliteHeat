import { Bell, Calendar, Trophy, MessageSquare, ChevronRight, Clock, BrainCircuit } from 'lucide-react'
import { AchievementBadge } from '@/components/gamification/AchievementBadge'
import { useGamificationStore } from '@/store/gamificationStore'
import { useTaskStore } from '@/store/taskStore'
import { useEffect } from 'react'

export const DashboardRightSidebar = () => {
    const { achievements } = useGamificationStore()
    const { tasks, loadTasks } = useTaskStore()

    useEffect(() => {
        loadTasks()
    }, [loadTasks])

    const recentAchievements = achievements.filter(a => a.isUnlocked).slice(-2)

    // Filter incomplete tasks as deadlines
    const deadlines = tasks.filter(t => !t.completed).slice(0, 3)

    const notifications = [
        { id: 1, text: 'Митя проанализировал твой последний код', time: '5 мин назад', type: 'ai' },
        { id: 2, text: 'Новое достижение разблокировано!', time: '1 час назад', type: 'system' },
    ]

    return (
        <div className="space-y-8 animate-slide-in-right">
            {/* Deadlines Block */}
            {deadlines.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Дедлайны</h4>
                    </div>
                    <div className="space-y-4">
                        {deadlines.map(d => (
                            <div key={d.id} className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{d.title}</p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    Активная задача
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Achievements */}
            <div className="bg-[#0f1014] rounded-[2rem] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Достижения</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    {recentAchievements.length > 0 ? (
                        recentAchievements.map(ach => (
                            <div key={ach.id} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                <span className="text-2xl">{ach.icon}</span>
                                <p className="text-[8px] font-black text-white/60 uppercase text-center truncate w-full">{ach.title}</p>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-2 text-center text-[10px] text-white/30 font-bold py-4 italic uppercase tracking-widest">Пока нет наград</p>
                    )}
                </div>
            </div>

            {/* Smart Notifications */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Уведомления</h4>
                </div>
                <div className="space-y-6">
                    {notifications.map(n => (
                        <div key={n.id} className="flex gap-4 group cursor-pointer">
                            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${n.type === 'ai' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                {n.type === 'ai' ? <BrainCircuit className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{n.text}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
