import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const FamilySubscriptionPage = () => {
    const [familyMembers, setFamilyMembers] = useState<string[]>([])
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [selectedPlan, setSelectedPlan] = useState<'individual' | 'family' | 'large-family'>('individual')

    const plans = [
        {
            id: 'individual',
            name: 'Индивидуальная',
            price: 12000,
            members: 1,
            icon: '👤',
            features: ['Доступ ко всем курсам', 'AI-помощник', 'Сертификаты'],
        },
        {
            id: 'family',
            name: 'Семейная',
            price: 20000,
            members: 3,
            discount: 44,
            icon: '👨‍👩‍👧',
            features: ['До 3 членов семьи', 'Все функции Individual', 'Семейная статистика', 'Скидка 44%'],
        },
        {
            id: 'large-family',
            name: 'Многодетная семья',
            price: 25000,
            members: 6,
            discount: 65,
            icon: '👨‍👩‍👧‍👦',
            features: ['До 6 членов семьи', 'Все функции Individual', 'Приоритетная поддержка', 'Скидка 65%'],
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
    const pricePerMember = currentPlan ? Math.round(currentPlan.price / currentPlan.members) : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">👨‍👩‍👧‍👦 Семейная подписка</h1>
                <p className="text-gray-600">Обучайте всю семью с выгодой до 65%</p>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`cursor-pointer transition-smooth ${selectedPlan === plan.id
                                ? 'ring-2 ring-primary shadow-lg'
                                : 'hover:shadow-md'
                            }`}
                        onClick={() => setSelectedPlan(plan.id as any)}
                    >
                        <div className="text-center">
                            <div className="text-5xl mb-3">{plan.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-primary">
                                    {plan.price.toLocaleString('ru-RU')}₸
                                </div>
                                <div className="text-sm text-gray-600">в месяц</div>
                                {plan.discount && (
                                    <div className="mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        Скидка {plan.discount}%
                                    </div>
                                )}
                            </div>
                            <div className="text-sm text-gray-700 mb-4">
                                <div className="font-semibold mb-2">До {plan.members} {plan.members === 1 ? 'человека' : 'членов семьи'}</div>
                                <div className="text-xs text-gray-500">
                                    ~{Math.round(plan.price / plan.members).toLocaleString('ru-RU')}₸ на человека
                                </div>
                            </div>
                            <div className="text-left space-y-2">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Family Members Management */}
            {selectedPlan !== 'individual' && (
                <Card>
                    <h2 className="text-xl font-bold mb-4">Члены семьи ({familyMembers.length}/{currentPlan?.members})</h2>

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
                                            <div className="text-xs text-gray-500">
                                                {pricePerMember.toLocaleString('ru-RU')}₸/мес
                                            </div>
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
                <h2 className="text-xl font-bold mb-4">🎁 Преимущества семейной подписки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                        <div className="text-2xl">💰</div>
                        <div>
                            <div className="font-semibold">Экономия до 65%</div>
                            <div className="text-sm text-gray-600">Чем больше семья, тем больше скидка</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">📊</div>
                        <div>
                            <div className="font-semibold">Семейная статистика</div>
                            <div className="text-sm text-gray-600">Отслеживайте прогресс всей семьи</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🎓</div>
                        <div>
                            <div className="font-semibold">Все курсы</div>
                            <div className="text-sm text-gray-600">Доступ ко всем образовательным материалам</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="text-2xl">🤝</div>
                        <div>
                            <div className="font-semibold">Поддержка многодетных</div>
                            <div className="text-sm text-gray-600">Специальные условия для больших семей</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Action */}
            <div className="flex justify-center">
                <Button size="lg" className="px-8">
                    💳 Оформить подписку - {currentPlan?.price.toLocaleString('ru-RU')}₸/мес
                </Button>
            </div>
        </div>
    )
}
