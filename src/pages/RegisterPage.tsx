import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import {
    Sparkles,
    Crown,
    User,
    Mail,
    Lock,
    ArrowRight,
    CheckCircle2,
    Zap,
    ShieldCheck,
    Globe,
    Bot
} from 'lucide-react'
import { LogoAnimation } from '@/components/ui/LogoAnimation'
import { motion } from 'framer-motion'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const register = useAuthStore((state) => state.register)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'student' as 'student' | 'admin',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<any>(null)

    useEffect(() => {
        const savedPlan = localStorage.getItem('selectedPlan')
        if (savedPlan) {
            try {
                setSelectedPlan(JSON.parse(savedPlan))
            } catch (e) {
                console.error('Error parsing saved plan:', e)
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        const result = await register(
            formData.email,
            formData.password,
            formData.name,
            '',
            formData.role,
            selectedPlan?.id
        )
        setIsLoading(false)

        if (result.success) {
            localStorage.removeItem('selectedPlan')
            navigate('/dashboard')
        } else {
            setError(result.message)
        }
    }

    const handleGoogleRegister = async () => {
        setError('')
        setIsLoading(true)
        const result = await loginWithGoogle()
        setIsLoading(false)

        if (result.success) {
            localStorage.removeItem('selectedPlan')
            navigate('/dashboard')
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* EDUCATIONAL-PREMIUM BACKDROP */}
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-50 rounded-full blur-[150px] -z-10 opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-50 rounded-full blur-[130px] -z-10 opacity-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10"
            >
                {/* LEFT SIDE: EDUCATIONAL BENEFITS */}
                <div className="lg:col-span-5 space-y-12 py-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Путь к мастерству</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                            ВАШ НОВЫЙ <br />
                            <span className="text-orange-500 italic">ЭЛИТНЫЙ</span> ПУТЬ.
                        </h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                            Присоединяйтесь к платформе, где технологии ИИ помогают масштабировать ваше обучение и проекты.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: <Zap className="text-orange-500" />, title: "Масштабируемость", desc: "15+ Python лабораторий и 17+ дизайн-миссий для вашего роста." },
                            { icon: <Bot className="text-blue-600" />, title: "ИИ Ассистент Mita", desc: "Персональный наставник в обучении 24/7." },
                            { icon: <ShieldCheck className="text-emerald-500" />, title: "Верификация", desc: "Сертификаты, подтверждающие ваш профессиональный уровень." }
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{benefit.icon}</div>
                                <div>
                                    <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest">{benefit.title}</h4>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 999}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            К нам присоединились <span className="text-slate-900">+243</span> студента
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: REGISTRATION FORM */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rotate-45 translate-x-20 -translate-y-20"></div>

                        <div className="relative z-10 space-y-10">
                            <div className="text-center space-y-4">
                                <LogoAnimation />
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Регистрация профиля</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Протокол безопасного зачисления</p>
                                </div>
                            </div>

                            {selectedPlan && (
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl text-white shadow-xl shadow-blue-100 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 rounded-2xl"><Crown className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Выбранный план</p>
                                            <p className="font-black text-lg">{selectedPlan.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl">{selectedPlan.price.toLocaleString()}₸</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{selectedPlan.duration}</p>
                                    </div>
                                </motion.div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-600 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="ПОЛНОЕ ИМЯ"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-900 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-600 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="EMAIL АДРЕС"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-900 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="СОЗДАТЬ ПАРОЛЬ"
                                        required
                                        minLength={6}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-6 text-slate-900 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 text-center">Выберите тип доступа</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'student', label: t('roleStudent'), emoji: '🎒' },
                                            { id: 'admin', label: t('roleTeacher'), emoji: '👨‍🏫' }
                                        ].map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: r.id as any })}
                                                className={`
                                                    p-6 rounded-3xl border-2 transition-all group/role
                                                    ${formData.role === r.id
                                                        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-50'
                                                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-100'}
                                                `}
                                            >
                                                <div className="text-3xl mb-2 group-hover/role:scale-125 transition-transform">{r.emoji}</div>
                                                <div className={`text-[10px] font-black uppercase tracking-widest ${formData.role === r.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                                    {r.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full group/btn relative overflow-hidden bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-6 rounded-3xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-100"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 translate-x-[100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-3 transition-colors">
                                        {isLoading ? 'ОФОРМЛЕНИЕ...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                                    </span>
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">ИЛИ</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                className="w-full py-5 border border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-slate-600 hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest"
                            >
                                <Globe className="w-5 h-5" />
                                Продолжить через Google
                            </button>

                            <div className="text-center">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    Уже есть аккаунт? Войти в систему
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </motion.div >
        </div >
    )
}
