import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { Sparkles, CheckCircle2, Crown } from 'lucide-react'

export const RegisterPage = () => {
    const navigate = useNavigate()
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

    // Check for selected subscription plan from localStorage
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
            // Clear saved plan
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 sm:py-12 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20 animate-float-slow animation-delay-3000"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 animate-fade-in shadow-2xl bg-white/95 backdrop-blur-xl border-2 border-white/50">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-block mb-3">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                            EliteHeat
                        </div>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Регистрация</h1>
                    <p className="text-sm sm:text-base text-gray-600">Создайте свой личный кабинет</p>
                </div>

                {/* Selected Plan Display */}
                {selectedPlan && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white animate-slide-down">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5" />
                            <span className="font-bold">Выбранный тариф</span>
                        </div>
                        <div className="text-sm opacity-90">
                            {selectedPlan.name} - {selectedPlan.price.toLocaleString()}₸
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                            Срок: {selectedPlan.duration}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Имя и Фамилия"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                        autoComplete="name"
                        required
                        className="transition-all focus:scale-[1.02]"
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                        className="transition-all focus:scale-[1.02]"
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Минимум 6 символов"
                        autoComplete="new-password"
                        minLength={6}
                        required
                        className="transition-all focus:scale-[1.02]"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Роль
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-3 sm:p-4 border-2 rounded-xl transition-all transform hover:scale-105 ${formData.role === 'student'
                                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                            >
                                <div className="text-xl sm:text-2xl mb-1">🎒</div>
                                <div className="font-semibold text-sm sm:text-base">Ученик</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                                className={`p-3 sm:p-4 border-2 rounded-xl transition-all transform hover:scale-105 ${formData.role === 'admin'
                                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                            >
                                <div className="text-xl sm:text-2xl mb-1">👨‍🏫</div>
                                <div className="font-semibold text-sm sm:text-base">Преподаватель</div>
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
                        loading={isLoading}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Создать аккаунт
                        </span>
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">или</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base hover:shadow-lg transition-all"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="hidden sm:inline">Зарегистрироваться через Google</span>
                        <span className="sm:hidden">Google</span>
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                        >
                            Войти
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Вернуться на главную
                        </button>
                    </div>
                </form>
            </Card>

            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
                .animate-fade-in { animation: fade-in 0.8s ease-out; }
                .animate-slide-down { animation: slide-down 0.5s ease-out; }
                .animate-shake { animation: shake 0.5s ease-in-out; }
                .animate-gradient-x { 
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animation-delay-3000 { animation-delay: 3s; }
            `}</style>
        </div>
    )
}
