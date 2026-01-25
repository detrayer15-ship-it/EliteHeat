import { ArrowUpRight, BrainCircuit, Rocket } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'

export const AIRecommendationCard = () => {
    const user = useAuthStore((state) => state.user)
    const projects = useProjectStore((state) => state.projects)

    // Dynamic Recommendation Logic
    const hasProjects = projects.length > 0
    const recommendationTitle = hasProjects ? 'Расширенная Оптимизация' : 'Старт Мастер-Класса'
    const recommendationDesc = hasProjects
        ? `"Митя проанализировал твой стек. На основе завершенных модулей мы предлагаем углубиться в паттерны чистого кода."`
        : `"Добро пожаловать в EliteHeat! Начни свой путь с создания первого высокопроизводительного проекта."`

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl relative overflow-hidden group">
            {/* Soft AI Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors group-hover:bg-indigo-100/50"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50/30 rounded-full blur-[60px]"></div>

            <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit className="w-4 h-4 text-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600/60">Рекомендовано ИИ</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{recommendationTitle}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <Rocket className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 relative">
                    <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                        {recommendationDesc}
                    </p>
                    <div className="absolute -left-1 top-4 w-1 h-8 bg-indigo-500 rounded-full"></div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(hasProjects ? ['Patterns', 'Clean Architecture'] : ['React', 'TypeScript']).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                    ))}
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn">
                    Принять вектор
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
            </div>
        </div>
    )
}
