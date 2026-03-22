import { Bell, Calendar, MessageSquare, Clock } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import { useEffect } from 'react'

export const DashboardRightSidebar = () => {
    const { tasks, loadTasks } = useTaskStore()

    useEffect(() => {
        loadTasks()
    }, [loadTasks])

    // Filter incomplete tasks as deadlines
    const deadlines = tasks.filter(t => !t.completed).slice(0, 3)

    const notifications = [
        { id: 1, text: 'Проверьте ваши уроки на сегодня', time: '10 мин назад', type: 'system' },
        { id: 2, text: 'Добро пожаловать в EliteEdu!', time: '1 час назад', type: 'system' },
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

            {/* Smart Notifications */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Уведомления</h4>
                </div>
                <div className="space-y-6">
                    {notifications.map(n => (
                        <div key={n.id} className="flex gap-4 group cursor-pointer">
                            <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
                                <MessageSquare className="w-4 h-4" />
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
