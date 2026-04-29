import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import {
    User, Mail, Lock, ArrowRight, Sparkles, ChevronLeft,
    GraduationCap, BookOpen, ChevronRight, CheckCircle2, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoAnimation } from '@/components/ui/LogoAnimation'

type RoleChoice = 'student' | 'teacher'

const ROLES: { id: RoleChoice; title: string; desc: string; icon: typeof GraduationCap; color: string; bg: string; border: string }[] = [
    {
        id: 'student',
        title: 'Ученик',
        desc: 'Изучаю курсы, выполняю задания и развиваю навыки',
        icon: GraduationCap,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50 hover:bg-indigo-100',
        border: 'border-indigo-200',
    },
    {
        id: 'teacher',
        title: 'Учитель',
        desc: 'Провожу уроки, проверяю работы студентов.',
        icon: BookOpen,
        color: 'text-amber-600',
        bg: 'bg-amber-50 hover:bg-amber-100',
        border: 'border-amber-200',
    },
]

export const RegisterPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const register = useAuthStore((state) => state.register)
    const { success: showSuccess, error: showError } = useToast()

    const initialRole = location.state?.role === 'teacher' ? 'teacher' : 'student'
    const [selectedRole, setSelectedRole] = useState<RoleChoice>(initialRole)

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        teacherSubject: '',
        direction: location.state?.direction || 'Веб разработчик'
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!location.state?.role && !location.state?.direction) {
            navigate('/select-role', { replace: true })
        }
    }, [location, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await register(
            formData.email,
            formData.password,
            formData.name,
            '',
            selectedRole,
            undefined,
            formData.direction,
            selectedRole === 'teacher' ? formData.teacherSubject : undefined
        )

        setIsLoading(false)

        if (result.success) {
            showSuccess('Успешная регистрация', 'Ваш аккаунт создан')
            navigate('/dashboard')
        } else {
            showError('Ошибка', result.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/40 rounded-full blur-[140px] animate-float-mega-slow pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <LogoAnimation />
                </div>

                <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden">
                    <div className="p-10 md:p-14">

                        {/* Step label */}
                        <div className="text-center mb-8 space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 shadow-sm"
                            >
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                Последний шаг — Данные аккаунта
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Создайте аккаунт
                            </h1>
                            {selectedRole === 'student' && (
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        {formData.direction}
                                    </span>
                                </div>
                            )}
                            {selectedRole === 'teacher' && (
                                <div className="flex items-center justify-center gap-2 pt-1 text-amber-500 font-bold text-xs uppercase tracking-widest">
                                    <BookOpen className="w-3 h-3" />
                                    Регистрация учителя
                                </div>
                            )}
                        </div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Role badge */}
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${selectedRole === 'teacher' ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'}`}>
                                {selectedRole === 'teacher'
                                    ? <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                                    : <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
                                }
                                <span className={`text-xs font-black ${selectedRole === 'teacher' ? 'text-amber-700' : 'text-indigo-700'}`}>
                                    Регистрация как: <strong>{selectedRole === 'teacher' ? 'Учитель' : 'Ученик'}</strong>
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Как вас зовут?</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="Имя Фамилия"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Пароль (мин. 6 символов)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-12 pr-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Teacher subject — only if teacher */}
                                <AnimatePresence>
                                    {selectedRole === 'teacher' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-4">
                                                    Предмет / Специализация
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Например: Python, Web-разработка, C#..."
                                                    className="w-full bg-amber-50 border border-amber-100 rounded-[1.5rem] py-4 px-6 text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-50 focus:bg-white transition-all placeholder:text-amber-300 font-bold"
                                                    value={formData.teacherSubject}
                                                    onChange={(e) => setFormData({ ...formData, teacherSubject: e.target.value })}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-slate-200 mt-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Завершить регистрацию
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                        </motion.form>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                        Безопасность данных гарантирована • 2028 EliteHeat
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
