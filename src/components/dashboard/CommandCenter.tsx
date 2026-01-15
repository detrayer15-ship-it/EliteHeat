import {
    Code2,
    Globe,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Search,
    BookOpen
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export const CommandCenter = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const actions = [
        {
            id: 'analyzer',
            title: t('analyzer'),
            desc: 'Лаборатория Миты', // Maybe needs a key
            icon: <Search className="w-8 h-8" />,
            path: '/analyzer',
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50/50'
        },
        {
            id: 'skill-tree',
            title: t('skillTree'),
            desc: 'Карта развития', // Maybe needs a key
            icon: <TrendingUp className="w-8 h-8" />,
            path: '/skill-tree',
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50/50'
        },
        {
            id: 'portfolio',
            title: t('portfolio'),
            desc: 'Публичный статус', // Needs key
            icon: <Globe className="w-8 h-8" />,
            path: '/portfolio',
            color: 'from-purple-500 to-pink-600',
            bg: 'bg-purple-50/50'
        },
        {
            id: 'learning',
            title: t('tasks'),
            desc: 'Текущий проект', // Needs key
            icon: <BookOpen className="w-8 h-8" />,
            path: '/projects',
            color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50/50'
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-4">
            {actions.map((action, idx) => (
                <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(action.path)}
                    className={`group relative p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer transition-all hover:scale-[1.05] active:scale-95 overflow-hidden ${action.bg}`}
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[3rem]`}></div>

                    <div className="space-y-4 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                            {action.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tighter">{action.title}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{action.desc}</p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-slate-300" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
