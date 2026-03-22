import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, ChevronLeft, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { LogoAnimation } from '@/components/ui/LogoAnimation'

export const SelectRolePage = () => {
    const navigate = useNavigate()

    const handleChoice = (role: 'student' | 'teacher', type: 'register' | 'login' = 'register') => {
        if (type === 'login') {
            navigate('/login', { state: { role } })
            return
        }

        if (role === 'student') {
            navigate('/choose-direction')
        } else {
            // Teacher goes to special recruitment application page
            navigate('/become-teacher')
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl relative z-10"
            >
                <div className="flex flex-col items-center mb-12">
                    <LogoAnimation />
                </div>

                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-sm mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        Шаг 1 — Кто вы на платформе?
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">Выберите свою <span className="text-indigo-600">роль</span></h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto italic">
                        Начните свой путь как мастер или как наставник в мире технологий.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Student Card */}
                    <motion.button
                        whileHover={{ y: -10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice('student')}
                        className="group relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 text-left border border-white shadow-2xl shadow-indigo-100 transition-all hover:bg-slate-900"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 group-hover:bg-indigo-500 flex items-center justify-center mb-8 transition-colors">
                            <GraduationCap className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors mb-4">Я Ученик</h2>
                        <ul className="space-y-3 mb-10">
                            {['Доступ к 3 направлениям', '150+ уроков в библиотеке', 'Поддержка менторов 24/7', 'Официальный сертификат'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-500 group-hover:text-slate-300 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex items-center gap-2 text-indigo-600 group-hover:text-indigo-400 font-black text-sm uppercase tracking-widest">
                                Выбрать направление
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleChoice('student', 'login')
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                            >
                                Есть аккаунт? Войти
                            </div>
                        </div>
                    </motion.button>

                    {/* Teacher Card */}
                    <motion.button
                        whileHover={{ y: -10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoice('teacher')}
                        className="group relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 text-left border border-white shadow-2xl shadow-amber-100 transition-all hover:bg-slate-900"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-500 flex items-center justify-center mb-8 transition-colors">
                            <BookOpen className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors mb-4">Я Учитель</h2>
                        <ul className="space-y-3 mb-10">
                            {['Проверка работ студентов', 'Управление группами', 'Аналитика успеваемости', 'Наставничество и менторство'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-500 group-hover:text-slate-300 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex items-center gap-2 text-amber-600 group-hover:text-amber-400 font-black text-sm uppercase tracking-widest">
                                Подать заявку
                                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleChoice('teacher', 'login')
                                }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                            >
                                Есть аккаунт? Войти
                            </div>
                        </div>
                    </motion.button>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Вернуться на главную
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default SelectRolePage
