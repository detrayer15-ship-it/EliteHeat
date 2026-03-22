import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase,
    Mail,
    User,
    ChevronLeft,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Globe,
    Send,
    MessageSquare,
    Star,
    Award
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { LogoAnimation } from '@/components/ui/LogoAnimation'
import { firebaseAuthAPI } from '@/api/firebase-auth'

const SPECIALIZATIONS = [
    'Web-разработка (Frontend)',
    'Web-разработка (Fullstack)',
    'Python (Data Science/ML)',
    'Roblox Scripting (Lua)',
    'UI/UX Дизайн',
    'Мобильная разработка'
]

const EXPERIENCE_LEVELS = [
    { id: 'junior', label: '1-2 года (Junior)', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'middle', label: '3-4 года (Middle)', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'senior', label: '5+ лет (Senior)', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'lead', label: 'Lead / Expert', color: 'text-rose-500', bg: 'bg-rose-50' }
]

export const BecomeTeacherPage = () => {
    const navigate = useNavigate()
    const { success, error } = useToast()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telegram: '',
        specialization: '',
        experience: '',
        portfolio: '',
        about: '',
        whyMe: ''
    })

    const handleNext = () => setStep(s => s + 1)
    const handlePrev = () => setStep(s => s - 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const response = await firebaseAuthAPI.submitTeacherApplication({
            ...formData,
            status: 'pending'
        })

        setIsLoading(false)

        if (response.success) {
            success(
                'Заявка принята!',
                'Мы рассмотрим ваш профиль и свяжемся с вами в Telegram в течение 48 часов.'
            )
            navigate('/')
        } else {
            error('Ошибка отправки', response.message || 'Не удалось отправить заявку')
        }
    }

    return (
        <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-6 relative overflow-hidden">
            {/* BG Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-100/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <LogoAnimation />
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-100/40 border border-white overflow-hidden p-10 md:p-16">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 shadow-sm mb-2"
                        >
                            <Award className="w-3.5 h-3.5" />
                            EliteEdu Recruitment 2024
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                            Заявка на <span className="text-indigo-600">наставничество</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg mx-auto italic">
                            Станьте частью команды экспертов и помогайте новому поколению войти в IT.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-16 px-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={`h-1 w-12 md:w-20 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Имя Фамилия</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Айдос Касымов"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Telegram ID / @username</label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="@elite_dev"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold"
                                                    value={formData.telegram}
                                                    onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="work@example.com"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
                                        >
                                            Продолжить <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Специализация</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {SPECIALIZATIONS.map(spec => (
                                                <button
                                                    key={spec}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, specialization: spec })}
                                                    className={`px-4 py-3 rounded-2xl text-[11px] font-black transition-all border ${formData.specialization === spec ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-indigo-200'}`}
                                                >
                                                    {spec}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Опыт работы</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {EXPERIENCE_LEVELS.map(level => (
                                                <button
                                                    key={level.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, experience: level.id })}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border ${formData.experience === level.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white border-slate-100'}`}
                                                >
                                                    <span className={`text-[10px] font-black uppercase text-center ${formData.experience === level.id ? 'text-white' : 'text-slate-400'}`}>{level.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button onClick={handlePrev} className="p-5 rounded-3xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all font-black uppercase text-xs tracking-widest">Назад</button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex-1 bg-slate-900 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
                                        >
                                            Почти готово <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Ссылка на Резюме / Портфолио (LinkedIn, GitHub)</label>
                                        <div className="relative">
                                            <Globe className="absolute left-5 top-5 w-4 h-4 text-slate-300" />
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://behance.net/username..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold"
                                                value={formData.portfolio}
                                                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Почему вы хотите преподавать в EliteEdu?</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Расскажите о своем опыте и мотивации..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                                            value={formData.whyMe}
                                            onChange={e => setFormData({ ...formData, whyMe: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-start gap-4">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <Star className="w-4 h-4" />
                                        </div>
                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                            Нажимая кнопку, вы подтверждаете готовность пройти техническое собеседование и проверку навыков наставничества.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="button" onClick={handlePrev} className="p-5 rounded-3xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all font-black uppercase text-xs tracking-widest text-center">Назад</button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Отправить заявку <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="mt-12 flex items-center justify-center gap-10">
                    <button onClick={() => navigate('/select-role')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Назад к ролям
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
