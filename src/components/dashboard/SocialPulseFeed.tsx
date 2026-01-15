import { useState, useEffect } from 'react'
import {
    Zap,
    TrendingUp,
    CheckCircle2,
    UserPlus,
    Crown,
    Sparkles
} from 'lucide-react'
import { adminAPI } from '@/api/firestore'
import { useTranslation } from '@/hooks/useTranslation'

interface Activity {
    id: string
    user: string
    action: string
    type: 'rank' | 'project' | 'module' | 'user'
    timestamp: number
    icon: React.ReactNode
    color: string
}

const ACTIONS = {
    rank: 'достиг ранга "Architect"',
    project: 'завершил проект "AI Analyzer"',
    module: 'освоил модуль "Python Advanced"',
    user: 'присоединился к EliteHeat!'
}

export const SocialPulseFeed = () => {
    const { t } = useTranslation()
    const [activities, setActivities] = useState<Activity[]>([])

    // Initial activities
    useEffect(() => {
        const fetchInitialData = async () => {
            const res = await adminAPI.getUsers()
            if (res.success && res.data) {
                const users = res.data as any[]
                const initial = users.slice(0, 5).map((user, i) => generateActivity(user.id, user))
                setActivities(initial)
            }
        }
        fetchInitialData()
    }, [])

    // Add new activity periodically
    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await adminAPI.getUsers()
            if (res.success && res.data) {
                const users = res.data as any[]
                const randomUser = users[Math.floor(Math.random() * users.length)]
                const newActivity = generateActivity(Date.now(), randomUser)
                setActivities(prev => [newActivity, ...prev.slice(0, 4)])
            }
        }, 8000 + Math.random() * 5000)

        return () => clearInterval(interval)
    }, [])

    const generateActivity = (id: string | number, user?: any): Activity => {
        const typeKeys = Object.keys(ACTIONS) as (keyof typeof ACTIONS)[]
        const type = typeKeys[Math.floor(Math.random() * typeKeys.length)]
        const name = user?.name || user?.displayName || 'Student'

        const icons = {
            rank: <Crown className="w-4 h-4" />,
            project: <Zap className="w-4 h-4" />,
            module: <TrendingUp className="w-4 h-4" />,
            user: <UserPlus className="w-4 h-4" />
        }

        const colors = {
            rank: 'bg-amber-100 text-amber-600 border-amber-200',
            project: 'bg-indigo-100 text-indigo-600 border-indigo-200',
            module: 'bg-emerald-100 text-emerald-600 border-emerald-200',
            user: 'bg-pink-100 text-pink-600 border-pink-200'
        }

        return {
            id: String(id),
            user: name,
            action: ACTIONS[type],
            type,
            timestamp: Date.now(),
            icon: icons[type],
            color: colors[type]
        }
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-[40px] -mr-16 -mt-16"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                    Social Pulse
                </h3>
                <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Live</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 relative">
                {activities.map((activity, idx) => (
                    <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 bg-white/40 hover:bg-white/80 rounded-2xl border border-transparent hover:border-indigo-100 transition-all duration-500 animate-slide-in-right"
                        style={{
                            animationDelay: `${idx * 100}ms`,
                            opacity: 1 - idx * 0.15 // Fade out older items
                        }}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${activity.color}`}>
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-indigo-950 truncate">
                                {activity.user}
                            </p>
                            <p className="text-[10px] font-medium text-indigo-900/60 truncate">
                                {activity.action}
                            </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-indigo-200" />
                    </div>
                ))}

                {/* Vertical Line Gradient */}
                <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-100 to-transparent -z-10"></div>
            </div>

            <p className="mt-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {t('inspiration')}
            </p>

            <style>{`
                @keyframes slide-in-right {
                    from { 
                        opacity: 0; 
                        transform: translateX(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    )
}
