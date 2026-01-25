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
        <div className="grid grid-cols-2 gap-6">
            {actions.map((action, idx) => (
                <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(action.path)}
                    className={`group relative p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden ${action.id === 'analyzer'
                            ? 'bg-[#0f1014] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white col-span-1'
                            : 'bg-white border-slate-100 shadow-sm hover:shadow-[0_25px_60px_rgba(79,70,229,0.1)] text-slate-900'
                        }`}
                >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-[0.03] group-hover:opacity-[0.15] transition-opacity rounded-bl-[4rem]`}></div>

                    {/* Glow effect for primary card icon */}
                    {action.id === 'analyzer' && (
                        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}

                    <div className="space-y-6 relative z-10">
                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-lg group-hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transition-all transform group-hover:rotate-6`}>
                            {action.icon}
                        </div>
                        <div>
                            <h3 className={`text-xl font-black tracking-tight ${action.id === 'analyzer' ? 'text-white' : 'text-slate-900'}`}>
                                {action.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Zap className={`w-3 h-3 ${action.id === 'analyzer' ? 'text-blue-400' : 'text-blue-600'}`} />
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${action.id === 'analyzer' ? 'text-white/40' : 'text-slate-400'}`}>
                                    {action.desc}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowUpRight className={`w-6 h-6 ${action.id === 'analyzer' ? 'text-blue-400' : 'text-slate-300'}`} />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
