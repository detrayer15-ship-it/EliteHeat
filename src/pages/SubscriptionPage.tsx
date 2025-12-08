import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const SubscriptionPage = () => {
    const navigate = useNavigate()
    const [familyMembers, setFamilyMembers] = useState<string[]>([])
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime' | 'family'>('monthly')

    const plans = [
        {
            id: 'monthly',
            name: 'Месячная',
            price: 2990,
            period: 'месяц',
            icon: '📅',
            features: ['Доступ ко всем курсам', 'AI-помощник', 'Поддержка 24/7'],
        },
        {
            id: 'yearly',
            name: 'Годовая',
            price: 29990,
            period: 'год',
            discount: 17,
            icon: '📆',
            features: ['Все функции месячной', 'Скидка 17%', 'Приоритетная поддержка', 'Сертификаты'],
        },
        {
            id: 'lifetime',
            name: 'Пожизненная',
            price: 99990,
            period: 'навсегда',
            discount: 65,
            icon: '♾️',
            features: ['Все функции годовой', 'Доступ навсегда', 'VIP поддержка', 'Все будущие курсы'],
        },
        {
            id: 'family',
            name: 'Семейная',
            price: 9990,
            period: 'месяц',
            members: 3,
            discount: 44,
            icon: '👨‍👩‍👧',
            features: ['До 3 членов семьи', 'Все функции месячной', 'Семейная статистика', 'Скидка 44%'],
        },
    ]

    const addMember = () => {
        if (newMemberEmail && !familyMembers.includes(newMemberEmail)) {
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">💎 Подписка</h1>
                <p className="text-gray-600">Выберите подходящий тариф для обучения</p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl ${selectedPlan === plan.id
                            ? 'ring-2 ring-primary shadow-lg scale-105'
                            : 'hover:shadow-xl'
                            }`}
                    >
                        <div className="flex flex-col h-full">
                            <div className="text-center flex-1">
                                <div className="text-5xl mb-3">{plan.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-primary">
                                        {plan.price.toLocaleString('ru-RU')}₸
                                    </div>
                                    <div className="text-sm text-gray-600">за {plan.period}</div>
                                    {plan.discount && (
                                        <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Скидка {plan.discount}%
                                        </div>
                                    )}
                                </div>
                                {plan.members && (
                                    <div className="text-sm text-gray-700 mb-4">
                                        <div className="font-semibold">До {plan.members} членов семьи</div>
                                        <div className="text-xs text-gray-500">
                                            ~{Math.round(plan.price / plan.members).toLocaleString('ru-RU')}₸ на человека
                                        </div>
                                    </div>
                                )}
                                <div className="text-left space-y-2 mb-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="text-green-500">✓</span>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Button at bottom of card */}
                            <Button
                                className="w-full mt-auto"
                                onClick={() => {
                                    setSelectedPlan(plan.id as any)
                                    navigate('/payment', {
                                        state: {
                                            plan: plan.name,
                                            price: plan.price
                                        }
                                    })
                                }}
                            >
                                Выбрать
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Family Members Management */}
            {isFamilyPlan && (
                <Card>
                    <h2 className="text-xl font-bold mb-4">
                        Члены семьи ({familyMembers.length}/{currentPlan?.members || 0})
                    </h2>

                    {/* Add Member */}
                    <div className="flex gap-2 mb-4">
                        <Input
                            type="email"
                            placeholder="Email члена семьи"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            disabled={familyMembers.length >= (currentPlan?.members || 0)}
                        />
                        <Button
                            onClick={addMember}
                            disabled={!newMemberEmail || familyMembers.length >= (currentPlan?.members || 0)}
                        >
                            ➕ Добавить
                        </Button>
                    </div>

                    {/* Members List */}
                    {familyMembers.length > 0 ? (
                        <div className="space-y-2">
                            {familyMembers.map((email, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                            👤
                                        </div>
                                        <div>
                                            <div className="font-medium">{email}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeMember(email)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">👥</div>
                            <p>Добавьте членов семьи</p>
                        </div>
                    )}
                </Card>
            )}

            {/* Benefits */}
            <Card>
                <h2 className="text-xl font-bold mb-4">🎁 Преимущества подписки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">🎓</div>
                        <div>
                            <div className="font-semibold">Все курсы</div>
                            <div className="text-sm text-gray-600">Доступ ко всем образовательным материалам</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🤖</div>
                        <div>
                            <div className="font-semibold">AI-помощник</div>
                            <div className="text-sm text-gray-600">Персональный помощник по программированию</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">📊</div>
                        <div>
                            <div className="font-semibold">Трекер прогресса</div>
                            <div className="text-sm text-gray-600">Отслеживайте свои достижения</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                            <div className="font-semibold">Сертификаты</div>
                            <div className="text-sm text-gray-600">Получайте сертификаты за курсы</div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
