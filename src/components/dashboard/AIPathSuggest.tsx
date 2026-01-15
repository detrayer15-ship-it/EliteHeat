import { Bot, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

export const AIPathSuggest = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative group">
            <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-100/50 blur-2xl rounded-full scale-110 animate-pulse"></div>
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl relative z-10 border border-slate-800 group-hover:scale-110 transition-transform">
                        <Bot className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">{t('mitasPath')}</p>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('nextStep')}</h3>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative italic group-hover:bg-white transition-colors shadow-sm">
                        <div className="absolute top-[-8px] left-4 w-4 h-4 bg-slate-50 rotate-45 border-l border-t border-slate-100 group-hover:bg-white"></div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            {t('aiSuggestion')}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/skill-tree')}
                        className="flex items-center gap-3 text-blue-600 font-black uppercase tracking-widest text-[9px] hover:gap-5 transition-all"
                    >
                        {t('openSkillTree')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
