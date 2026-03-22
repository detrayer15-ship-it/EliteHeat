import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { LogoAnimation } from '@/components/ui/LogoAnimation'

const getRoleRedirect = (role?: string) => {
    if (role === 'teacher') return '/teacher/dashboard'
    if (role === 'admin') return '/admin'
    if (role === 'developer') return '/developer/panel'
    return '/dashboard'
}

export const LoginPage = () => {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const getUser = useAuthStore((state) => state.user)
    const { success: showSuccess, error: showError } = useToast()

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await login(formData.email, formData.password)
        setIsLoading(false)

        if (result.success) {
            const user = useAuthStore.getState().user
            showSuccess('Добро пожаловать!', 'Вы успешно вошли в систему')
            navigate(getRoleRedirect(user?.role))
        } else {
            showError('Ошибка входа', result.message)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        const result = await loginWithGoogle()
        setIsLoading(false)

        if (result.success) {
            const user = useAuthStore.getState().user
            showSuccess('Добро пожаловать!', 'Вход через Google успешен')
            navigate(getRoleRedirect(user?.role))
        } else {
            if (result.message !== 'Вход отменён') {
                showError('Ошибка входа', result.message)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8faff] via-white to-[#eff2ff] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-100/40 to-blue-100/30 rounded-full blur-[140px] animate-float-mega-slow" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] bg-gradient-to-tr from-purple-100/30 to-pink-100/20 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute top-[40%] left-[50%] w-[20%] h-[20%] bg-gradient-to-br from-cyan-100/20 to-sky-100/15 rounded-full blur-[80px] animate-pulse-slow" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex justify-center mb-8"
                >
                    <LogoAnimation />
                </motion.div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-20px_rgba(99,102,241,0.08)] border border-slate-100/80">
                    <div className="space-y-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center space-y-2"
                        >
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Вход в систему</h1>
                            <p className="text-slate-400 text-sm font-medium">Рады видеть вас снова! Введите свои данные</p>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                {/* Email */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`relative group rounded-2xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-indigo-100 shadow-lg shadow-indigo-50' : ''}`}
                                >
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'text-indigo-500 scale-110' : 'text-slate-300'}`} />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={formData.email}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </motion.div>

                                {/* Password */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className={`relative group rounded-2xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-indigo-100 shadow-lg shadow-indigo-50' : ''}`}
                                >
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'text-indigo-500 scale-110' : 'text-slate-300'}`} />
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        required
                                        className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                                        value={formData.password}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </motion.div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200/50 mt-2 relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 opacity-70" />
                                        Войти в аккаунт
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white/80 px-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">или</span>
                            </div>
                        </div>

                        {/* Google */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-4 border border-slate-200/80 rounded-2xl flex items-center justify-center gap-3 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all font-bold text-sm disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Продолжить с Google
                        </motion.button>

                        {/* Footer Link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center pt-2"
                        >
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
                            >
                                Нет аккаунта? <span className="text-indigo-600 font-bold">Зарегистрироваться</span>
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Return to Main */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-center"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-slate-300 hover:text-slate-500 transition-colors font-bold uppercase tracking-widest group"
                    >
                        <span className="inline-block group-hover:-translate-x-1 transition-transform">←</span> На главную
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}
