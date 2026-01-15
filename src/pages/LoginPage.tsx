import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LogIn, Github, Mail, Lock, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { LogoAnimation } from '@/components/ui/LogoAnimation'
import { motion } from 'framer-motion'

export const LoginPage = () => {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        const result = await login(formData.email, formData.password)
        setIsLoading(false)
        if (result.success) navigate('/dashboard')
        else setError(result.message)
    }

    const handleGoogleLogin = async () => {
        setError('')
        setIsLoading(true)
        const result = await loginWithGoogle()
        setIsLoading(false)
        if (result.success) navigate('/dashboard')
        else setError(result.message)
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* EDUCATIONAL-PREMIUM BACKDROP */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px] -z-10 opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="mb-12">
                    <LogoAnimation />
                </div>

                <div className="bg-white rounded-[3.5rem] p-12 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative group">
                    {/* Soft light highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>

                    <div className="relative z-10 space-y-10">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Вход в систему</h1>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Elite Education Protocol</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Электронная почта"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-900 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Ключ доступа"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-900 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group/btn relative overflow-hidden bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 translate-x-[100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3 transition-colors">
                                    {isLoading ? 'ИНИЦИАЛИЗАЦИЯ...' : 'ПОЛУЧИТЬ ДОСТУП'}
                                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                                </span>
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Синхронизация</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-5 border border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-slate-600 hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest group/google shadow-sm"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Продолжить через Google
                        </button>

                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-50">
                            <button
                                onClick={() => navigate('/register')}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                Нет аккаунта? Зарегистрироваться
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                ← На главную
                            </button>
                        </div>
                    </div>

                    {/* Decorative bits */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rotate-45 translate-x-16 -translate-y-16"></div>
                </div>

                <div className="mt-8 flex justify-center gap-10 opacity-40">
                    <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Защищенное соединение
                    </div>
                    <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3 text-blue-600" /> Верификация личности
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
