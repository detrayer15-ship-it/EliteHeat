import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { Sparkles, Check, Zap, Crown } from 'lucide-react'

export const SubscriptionPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuthStore()
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime' | 'family'>('yearly')

    const plans = [
        {
            id: 'monthly',
            name: 'Месячная',
            price: 2990,
            period: 'месяц',
            duration: '1 месяц',
            icon: '📆',
            color: 'from-blue-500 to-cyan-500',
            features: ['Доступ ко всем курсам', 'AI-помощник', 'Поддержка 24/7', 'Мобильное приложение'],
            popular: false,
        },
        {
            id: 'yearly',
            name: 'Годовая',
            price: 29990,
            period: 'год',
            duration: '12 месяцев',
            icon: '🎯',
            color: 'from-purple-500 to-pink-500',
            features: ['Все функции месячной', 'Приоритетная поддержка', 'Сертификаты', 'Эксклюзивные курсы'],
            popular: true,
        },
        {
            id: 'lifetime',
            name: 'Пожизненная',
            price: 99990,
            period: 'навсегда',
            duration: 'Навсегда',
            icon: '💎',
            color: 'from-yellow-500 to-orange-500',
            features: ['Все функции годовой', 'Доступ навсегда', 'VIP поддержка', 'Все будущие курсы', 'Персональный ментор'],
            popular: false,
        },
        {
            id: 'family',
            name: 'Семейная',
            price: 9990,
            period: 'месяц',
            duration: '1 месяц',
            members: 3,
            icon: '👨‍👩‍👧‍👦',
            color: 'from-green-500 to-emerald-500',
            features: ['До 3 членов семьи', 'Все функции месячной', 'Семейная статистика', 'Общий прогресс'],
            popular: false,
        },
    ]

    const currentPlan = plans.find(p => p.id === selectedPlan)

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* ULTRA PREMIUM Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl opacity-10 animate-float-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-10 animate-float-slow animation-delay-3000"></div>
            </div>

            {/* Header для незарегистрированных */}
            {!isAuthenticated && (
                <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg relative">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 group">
                                <div className="text-3xl font-bold flex items-center transform group-hover:scale-105 transition-transform">
                                    <span className="text-blue-700">Elite</span>
                                    <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Heat</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => navigate('/')}>
                                    ← Назад
                                </Button>
                                <Button variant="secondary" onClick={() => navigate('/login')}>
                                    Войти
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <div className={`${isAuthenticated ? 'py-8' : 'container mx-auto px-4 py-16'} relative z-10`}>
                {/* PREMIUM Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block mb-4 group">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-2xl transform group-hover:scale-110 transition-all relative overflow-hidden">
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                            <span className="relative z-10 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Специальное предложение
                            </span>
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient-x">
                        Выберите свой тариф
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Начните обучение с подходящей подпиской и получите доступ ко всем курсам
                    </p>

                    {/* Current Subscription Display */}
                    {user?.subscriptionPlan && user?.subscriptionStatus === 'active' && (
                        <div className="mt-6 inline-block">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-5 h-5" />
                                    <span className="font-bold">
                                        Активная подписка: {plans.find(p => p.id === user.subscriptionPlan)?.name}
                                    </span>
                                </div>
                                {user.subscriptionEndDate && (
                                    <div className="text-sm mt-1 opacity-90">
                                        До: {new Date(user.subscriptionEndDate).toLocaleDateString('ru-RU')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* PREMIUM Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="relative group h-full">
                                {/* Glow effect */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity`}></div>

                                <Card
                                    className={`relative h-full flex flex-col transition-all duration-300 hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-lg ${selectedPlan === plan.id
                                        ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
                                        : 'hover:shadow-xl'
                                        }`}
                                    onClick={() => setSelectedPlan(plan.id as any)}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                <Crown className="w-3 h-3" />
                                                ПОПУЛЯРНЫЙ
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col h-full">
                                        {/* Icon & Name */}
                                        <div className="text-center mb-4">
                                            <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform">{plan.icon}</div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center mb-6">
                                            <div className="flex items-baseline justify-center gap-2">
                                                <span className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                    {plan.price.toLocaleString()}₸
                                                </span>
                                            </div>
                                            <div className="text-gray-500 text-sm mt-1">/ {plan.period}</div>
                                            <div className="text-purple-600 text-xs font-semibold mt-1">
                                                Срок: {plan.duration}
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="flex-1 mb-6">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-700 text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Button */}
                                        <Button
                                            className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-all duration-300 text-base py-4 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedPlan(plan.id as any)

                                                if (isAuthenticated) {
                                                    navigate('/payment', {
                                                        state: {
                                                            plan: plan.name,
                                                            planId: plan.id,
                                                            price: plan.price,
                                                            duration: plan.duration
                                                        }
                                                    })
                                                } else {
                                                    localStorage.setItem('selectedPlan', JSON.stringify({
                                                        id: plan.id,
                                                        name: plan.name,
                                                        price: plan.price,
                                                        duration: plan.duration
                                                    }))
                                                    navigate('/register')
                                                }
                                            }}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <Zap className="w-5 h-5" />
                                                {isAuthenticated ? 'Оплатить' : 'Выбрать тариф'}
                                            </span>
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PREMIUM Benefits Section */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl blur opacity-20"></div>
                    <Card className="relative bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-2">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                                Что входит во все тарифы
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">🐍</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Python курс</div>
                                        <div className="text-sm text-gray-600">15 уроков от основ до продвинутых тем</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">🎨</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Figma дизайн</div>
                                        <div className="text-sm text-gray-600">17 уроков по созданию интерфейсов</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">🤖</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Мита AI</div>
                                        <div className="text-sm text-gray-600">Персональный AI помощник 24/7</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">📊</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Трекер прогресса</div>
                                        <div className="text-sm text-gray-600">Отслеживайте свои достижения</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">🏆</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Сертификаты</div>
                                        <div className="text-sm text-gray-600">Получайте сертификаты за курсы</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white/50 p-4 rounded-xl">
                                    <div className="text-4xl">💬</div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">Поддержка</div>
                                        <div className="text-sm text-gray-600">Помощь от экспертов в чате</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-fade-in { animation: fade-in 0.8s ease-out; }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                    animation-fill-mode: both;
                }
                .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animation-delay-3000 { animation-delay: 3s; }
            `}</style>
        </div>
    )
}
