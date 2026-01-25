import { Bot, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

export const AIPathSuggest = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <div className="bg-[#0f1014] rounded-[2.5rem] p-10 border border-white/5 shadow-4xl relative group overflow-hidden">
            {/* Neural Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-110 animate-pulse-slow"></div>
                    <div className="w-24 h-24 rounded-3xl bg-white/[0.03] backdrop-blur-3xl text-white flex items-center justify-center shadow-4xl relative z-10 border border-white/10 group-hover:scale-110 transition-all duration-700">
                        <Bot className="w-12 h-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                    </div>
                </div>

                <div className="space-y-6 flex-1 text-center lg:text-left">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Mita Neural Core Active</p>
                            </div>
                            <h3 className="text-3xl font-black text-white tracking-tighter leading-none italic">
                                {t('nextStep')} <span className="text-white/20 text-xl font-normal not-italic ml-2">— ИИ помогает 24/7</span>
                            </h3>
                        </div>

                        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-6 border border-white/5 relative italic group-hover:bg-white/[0.04] transition-all shadow-inner">
                            <p className="text-lg text-white/60 font-medium leading-relaxed">
                                "{t('aiSuggestion')}"
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <button
                            onClick={() => navigate('/skill-tree')}
                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                        >
                            {t('openSkillTree')}
                        </button>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Следуйте персональному вектору развития</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
