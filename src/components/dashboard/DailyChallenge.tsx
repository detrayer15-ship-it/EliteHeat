import { Zap, Trophy, TrendingUp, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export const DailyChallenge = () => {
    const { t } = useTranslation()
    return (
        <div className="dashboard-card group">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('dailyChallenge')}</h3>
                    </div>
                    <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        +250 XP
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 group-hover:bg-white transition-colors shadow-sm">
                    <h4 className="font-bold text-slate-900">"Мастер чистого кода"</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Отправь один из своих прошлых файлов на ревью в **Лабораторию Миты** и внедри 2 её рекомендации.
                    </p>
                </div>

                <button className="w-full min-h-[44px] py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg active:scale-95 transition-all">
                    Принять Вызов
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">3/5 Готово</span>
                    </div>
                    <div className="w-[1px] h-4 bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">Streak: 3 дня</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
