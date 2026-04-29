import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Check, ChevronLeft, Sparkles, Clock, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import { LogoAnimation } from '@/components/ui/LogoAnimation'
import { useEffect, useState } from 'react'

const features = [
    'Доступ к полному курсу по выбранному направлению',
    'Поддержка менторов 24/7',
    'Персональный трекер прогресса',
    'Проверка заданий преподавателем',
    'Расписание занятий',
    'Сертификат специалиста',
]

export const SubscriptionPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated } = useAuthStore()
    const [selectedDirection, setSelectedDirection] = useState('')

    useEffect(() => {
        if (location.state?.direction) {
            setSelectedDirection(location.state.direction)
        } else {
            setSelectedDirection('Веб разработчик')
        }
    }, [location.state])

    const handleSelectPlan = () => {
        const planData = {
            id: 'standard',
            name: 'Стандарт',
            price: 250000,
            duration: '6 месяцев',
        }
        if (isAuthenticated) {
            navigate('/payment', { state: { ...planData, direction: selectedDirection } })
        } else {
            localStorage.setItem('selectedPlan', JSON.stringify(planData))
            navigate('/register', { state: { direction: selectedDirection, plan: 'standard' } })
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faff] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-indigo-100/30 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 py-10 relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-16">
                    <button
                        onClick={() => navigate('/choose-direction')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Назад
                    </button>
                    <LogoAnimation />
                    <div className="w-20" />
                </div>

                {/* Title */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 shadow-sm"
                    >
                        <Zap className="w-3 h-3 text-indigo-500" />
                        Шаг 3 из 4
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
                    >
                        Подписка на курс<br />
                        <span className="text-indigo-600">«{selectedDirection}»</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-medium text-lg"
                    >
                        Один тариф — всё включено. Полный доступ к платформе на весь срок обучения.
                    </motion.p>
                </div>

                {/* Plan Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-xl"
                >
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-[3rem] border-2 border-indigo-200 shadow-2xl shadow-indigo-100/60 p-10 flex flex-col">
                        {/* Popular badge */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Единый тариф
                            </span>
                        </div>

                        <div className="text-center mb-8 mt-4">
                            <div className="text-6xl font-black text-slate-900 tracking-tight">
                                250 000<span className="text-3xl text-slate-400 font-bold">₸</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                <span className="text-slate-500 font-bold text-lg">Длительность: <span className="text-indigo-600">6 месяцев</span></span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-10">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSelectPlan}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 active:scale-[0.98]"
                        >
                            Оплатить и начать обучение
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-center text-slate-400 text-xs font-bold mt-4 flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            После оплаты ученик сразу получает доступ к платформе
                        </p>
                    </div>
                </motion.div>

                {/* Bottom note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex flex-wrap justify-center gap-10 text-center"
                >
                    {[
                        { emoji: '👨‍🏫', label: 'Поддержка', sub: 'Менторы всегда на связи' },
                        { emoji: '📅', label: 'Расписание', sub: 'Занятия с преподавателем' },
                        { emoji: '📜', label: 'Сертификат', sub: 'После окончания курса' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="text-2xl">{item.emoji}</div>
                            <h4 className="font-black text-slate-900 text-sm">{item.label}</h4>
                            <p className="text-slate-400 text-xs font-medium">{item.sub}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default SubscriptionPage
