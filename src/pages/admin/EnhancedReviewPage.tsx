import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    ArrowLeft,
    Send,
    Clock,
    CheckCircle,
    MessageSquare,
    History,
    FileText,
    Sparkles,
    Shield,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const templates = [
    { id: '1', text: 'Отлично! Задание выполнено правильно. Все требования соблюдены. ✅', points: 10, type: 'success' },
    { id: '2', text: 'Хорошая работа, однако есть небольшие замечания по архитектуре. Обратите внимание на...', points: 7, type: 'warning' },
    { id: '3', text: 'Нужна доработка. Пожалуйста, исправьте ошибки в логике и загрузите решение повторно.', points: 0, type: 'error' },
    { id: '4', text: 'Задание выполнено частично. Рекомендую изучить документацию по разделу...', points: 5, type: 'info' }
]

export const EnhancedReviewPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [autoPoints, setAutoPoints] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer' && currentUser?.role !== 'teacher') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090a]">
                <Card className="p-8 text-center bg-white/5 border-white/10 backdrop-blur-xl">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                    <h1 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Доступ ограничен</h1>
                    <Button onClick={() => navigate('/admin')} className="mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                        Вернуться в Центр
                    </Button>
                </Card>
            </div>
        )
    }

    const handleSubmit = async (status: 'accepted' | 'revision') => {
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            navigate('/admin')
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-[#08090a] text-white selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate('/admin')}
                        className="group flex items-center gap-2 text-white/30 hover:text-indigo-400 transition-colors mb-6 text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Назад к мониторингу
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                                <Sparkles className="w-3 h-3" />
                                Quality Assurance Module
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter">
                                Проверка <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">заданий</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Текущее задание</div>
                                <div className="text-sm font-bold tracking-tight">Разработка структуры БД</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Comment Templates */}
                    <div className="lg:col-span-4 space-y-6">
                        <section>
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-2 mb-4 flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" /> Интеллектуальные шаблоны
                            </h3>
                            <div className="space-y-3">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => { setSelectedTemplate(template.text); setAutoPoints(template.points) }}
                                        className="w-full text-left p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`w-2 h-2 rounded-full ${template.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : template.type === 'error' ? 'bg-red-500' : 'bg-orange-500'}`} />
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{template.points} XP</span>
                                        </div>
                                        <p className="text-xs text-white/60 group-hover:text-white/90 line-clamp-2 transition-colors leading-relaxed">
                                            {template.text}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-indigo-600/10 to-transparent p-6 rounded-[2rem] border border-indigo-500/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-indigo-300">Рекомендация AI</h4>
                            </div>
                            <p className="text-xs text-indigo-200/60 leading-relaxed italic">
                                "Система обнаружила схожесть кода с эталонным решением на 94%. Рекомендуется принять задание."
                            </p>
                        </section>
                    </div>

                    {/* Right: Feedback Form */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] flex flex-col gap-6">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-1">Ваш вердикт</label>
                                <textarea
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-6 text-sm text-white placeholder-white/10 focus:ring-1 focus:ring-indigo-500/50 min-h-[220px] transition-all resize-none font-medium leading-relaxed"
                                    placeholder="Детальный разбор задания для ученика..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-1">Присвоено XP</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            value={autoPoints}
                                            onChange={(e) => setAutoPoints(Number(e.target.value))}
                                            className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <div className="w-16 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-lg font-black text-indigo-400 tabular-nums">
                                            {autoPoints}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => handleSubmit('revision')}
                                        disabled={isSubmitting}
                                        className="flex-1 h-16 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Доработка
                                    </Button>
                                    <Button
                                        onClick={() => handleSubmit('accepted')}
                                        disabled={isSubmitting}
                                        className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group"
                                    >
                                        <div className="relative z-10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Принять
                                        </div>
                                        {isSubmitting && (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Submission History Section */}
                        <section className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8">
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] px-2 mb-6 flex items-center gap-2">
                                <History className="w-4 h-4" /> Хронология правок
                            </h3>
                            <div className="space-y-4">
                                {[1, 2].map((v) => (
                                    <div key={v} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-indigo-500 transition-colors border border-white/5 z-10"></div>
                                            <div className="w-px h-full bg-white/5"></div>
                                        </div>
                                        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all cursor-pointer">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Версия v0.{v}</span>
                                                <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{v === 2 ? 'Сегодня, 14:30' : 'Среда, 09:12'}</span>
                                            </div>
                                            <p className="text-xs text-white/40 leading-relaxed font-medium">
                                                {v === 2 ? 'Вторая итерация с исправленными путями импорта и оптимизированной логикой Redux.' : 'Первичное решение задачи по разработке структуры данных.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnhancedReviewPage

