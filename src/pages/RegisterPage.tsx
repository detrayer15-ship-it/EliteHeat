import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { User, Mail, Lock, ArrowRight, GraduationCap, School } from 'lucide-react'
import { motion } from 'framer-motion'
import { LogoAnimation } from '@/components/ui/LogoAnimation'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const register = useAuthStore((state) => state.register)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const { success: showSuccess, error: showError } = useToast()

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'student' as 'student' | 'teacher',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await register(
            formData.email,
            formData.password,
            formData.name,
            '', // city
            formData.role
        )

        setIsLoading(false)

        if (result.success) {
            showSuccess('Успешная регистрация', 'Ваш аккаунт создан')
            navigate('/dashboard')
        } else {
            showError('Ошибка', result.message)
        }
    }

    const handleGoogleRegister = async () => {
        setIsLoading(true)
        const result = await loginWithGoogle()
        setIsLoading(false)

        if (result.success) {
            showSuccess('Добро пожаловать', 'Вход через Google успешен')
            navigate('/dashboard')
        } else {
            if (result.message !== 'Вход отменён') {
                showError('Ошибка', result.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <LogoAnimation />
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Создать профиль</h1>
                            <p className="text-slate-400 text-sm font-medium">Начните изучение новых технологий вместе с нами</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                {/* Name */}
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Ваше имя"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        required
                                        minLength={6}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${formData.role === 'student'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-500'
                                        }`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Ученик
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${formData.role === 'teacher'
                                            ? 'bg-white text-orange-600 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-500'
                                        }`}
                                >
                                    <School className="w-4 h-4" />
                                    Учитель
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-200 mt-2"
                            >
                                {isLoading ? 'Создание...' : 'Создать аккаунт'}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-xs text-slate-300 font-bold uppercase tracking-widest">или</span>
                            </div>
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogleRegister}
                            disabled={isLoading}
                            className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm disabled:opacity-50 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Продолжить с Google
                        </button>

                        {/* Footer Link */}
                        <div className="text-center pt-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
                            >
                                Уже есть аккаунт? <span className="text-blue-600 font-bold">Войти</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Return to Main */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-slate-300 hover:text-slate-400 transition-colors font-bold uppercase tracking-widest"
                    >
                        ← На главную
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
