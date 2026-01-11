import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

export const SubscriptionPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [familyMembers, setFamilyMembers] = useState<string[]>([])
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime' | 'family'>('yearly')

    const plans = [
        {
            id: 'monthly',
            name: 'Месячная',
            price: 2990,
            period: 'месяц',
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
            icon: '💎',
            color: 'from-yellow-500 to-orange-500',
            features: ['Все функции годовой', 'Доступ навсегда', 'VIP поддержка', 'Все будущие курсы', 'Персональный ментор', 'Приоритет в очереди'],
            popular: false,
        },
        {
            id: 'family',
            name: 'Семейная',
            price: 9990,
            period: 'месяц',
            members: 3,
            icon: '👨‍👩‍👧‍👦',
            color: 'from-green-500 to-emerald-500',
            features: ['До 3 членов семьи', 'Все функции месячной', 'Семейная статистика', 'Общий прогресс'],
            popular: false,
        },
    ]

    const addMember = () => {
        if (newMemberEmail && familyMembers.length < 2) {
            setFamilyMembers([...familyMembers, newMemberEmail])
            setNewMemberEmail('')
        }
    }

    const removeMember = (email: string) => {
        setFamilyMembers(familyMembers.filter(m => m !== email))
    }

    const currentPlan = plans.find(p => p.id === selectedPlan)
    const isFamilyPlan = selectedPlan === 'family'

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header для незарегистрированных */}
            {!isAuthenticated && (
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/eliteheat-logo.png"
                                    alt="EliteHeat"
                                    className="w-12 h-12 object-contain"
                                />
                                <div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        EliteHeat
                                    </div>
                                    <div className="hidden md:block text-sm text-gray-600">Образовательная платформа</div>
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

            <div className={`${isAuthenticated ? 'py-8' : 'container mx-auto px-4 py-16'}`}>
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            🎉 Специальное предложение
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                        Выберите свой тариф
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Начните обучение с подходящей подпиской и получите доступ ко всем курсам
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card
                                className={`relative h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${selectedPlan === plan.id
                                    ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
                                    : 'hover:shadow-xl'
                                    } ${plan.popular ? 'border-4 border-purple-500' : ''}`}
                                onClick={() => setSelectedPlan(plan.id as any)}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                            ⭐ ПОПУЛЯРНЫЙ
                                        </span>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col h-full">
                                    {/* Icon & Name */}
                                    <div className="text-center mb-4">
                                        <div className="text-6xl mb-3">{plan.icon}</div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {plan.price.toLocaleString()}₸
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-sm mt-1">/ {plan.period}</div>
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 mb-6">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">✓</span>
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Button */}
                                    <Button
                                        className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-all duration-300 text-base py-4 font-semibold`}
                                        style={{
                                            boxShadow: `
                                                0 0 20px ${plan.id === 'monthly' ? 'rgba(59, 130, 246, 0.3)' :
                                                    plan.id === 'yearly' ? 'rgba(168, 85, 247, 0.3)' :
                                                        plan.id === 'lifetime' ? 'rgba(251, 146, 60, 0.3)' :
                                                            'rgba(34, 197, 94, 0.3)'},
                                                0 0 40px ${plan.id === 'monthly' ? 'rgba(59, 130, 246, 0.15)' :
                                                    plan.id === 'yearly' ? 'rgba(168, 85, 247, 0.15)' :
                                                        plan.id === 'lifetime' ? 'rgba(251, 146, 60, 0.15)' :
                                                            'rgba(34, 197, 94, 0.15)'},
                                                0 4px 6px rgba(0, 0, 0, 0.1)
                                            `
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedPlan(plan.id as any)

                                            if (isAuthenticated) {
                                                navigate('/payment', {
                                                    state: {
                                                        plan: plan.name,
                                                        price: plan.price
                                                    }
                                                })
                                            } else {
                                                localStorage.setItem('selectedPlan', JSON.stringify({
                                                    id: plan.id,
                                                    name: plan.name,
                                                    price: plan.price
                                                }))
                                                navigate('/register')
                                            }
                                        }}
                                    >
                                        {isAuthenticated ? '💳 Оплатить' : '🚀 Выбрать тариф'}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            ✨ Что входит во все тарифы
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex gap-4 items-start">
                                <div className="text-4xl">🐍</div>
                                <div>
                                    <div className="font-bold text-lg mb-1">Python курс</div>
                                    <div className="text-sm text-gray-600">15 уроков от основ до продвинутых тем</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="text-4xl">🎨</div>
                                <div>
                                    <div className="font-bold text-lg mb-1">Figma дизайн</div>
                                    <div className="text-sm text-gray-600">17 уроков по созданию интерфейсов</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <img
                                    src="/ellie-logo.png"
                                    alt="Ellie"
                                    className="w-12 h-12 object-contain"
                                />
                                <div>
                                    <div className="font-bold text-lg mb-1">Ellie</div>
                                    <div className="text-sm text-gray-600">Персональный AI помощник 24/7</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="text-4xl">📊</div>
                                <div>
                                    <div className="font-bold text-lg mb-1">Трекер прогресса</div>
                                    <div className="text-sm text-gray-600">Отслеживайте свои достижения</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="text-4xl">🏆</div>
                                <div>
                                    <div className="font-bold text-lg mb-1">Сертификаты</div>
                                    <div className="text-sm text-gray-600">Получайте сертификаты за курсы</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
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

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    )
}
