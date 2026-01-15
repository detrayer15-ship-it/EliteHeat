import { Globe, Users, ExternalLink, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

export const PortfolioWidget = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-purple-200/20 rounded-full blur-3xl group-hover:bg-purple-300/30 transition-colors"></div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('portfolio')}</h3>
                    </div>
                    <button
                        onClick={() => navigate('/portfolio')}
                        className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-1 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Eye className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Просмотры</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">128</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-1 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Оценка</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">4.9</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                        Твое портфолио в топ-10% учеников этого месяца! Добавь новый проект, чтобы подняться выше.
                    </p>
                </div>
            </div>
        </div>
    )
}
