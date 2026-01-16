import { Globe, Users, ExternalLink, Eye, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { useProjectStore } from '@/store/projectStore'

export const PortfolioWidget = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const projects = useProjectStore((state) => state.projects)

    return (
        <div className="dashboard-card group">
            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-purple-200/10 rounded-full blur-3xl group-hover:bg-purple-300/20 transition-colors"></div>

            <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('portfolio')}</h3>
                    </div>
                    <button
                        onClick={() => navigate('/portfolio')}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 hover:text-purple-600 transition-all shadow-sm group/btn"
                    >
                        <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                            <FolderKanban className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Проекты</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{projects.length}</p>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 space-y-1">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Users className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Рейтинг</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">4.9</p>
                    </div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                    <p className="text-[10px] font-bold text-purple-900/60 leading-relaxed italic">
                        Твое портфолио в топ-10% учеников этого месяца!
                    </p>
                </div>
            </div>
        </div>
    )
}
