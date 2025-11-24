import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useNavigate } from 'react-router-dom'
import { SubscriptionPlan } from '@/types/subscription'
import { useSubscriptionStore } from '@/store/subscriptionStore'

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'monthly',
        name: 'Месячная подписка',
        price: 2990,
        duration: '30 дней',
        features: [
            'Доступ ко всем урокам Python',
            'Доступ ко всем урокам Figma',
            'Сохранение прогресса',
            'Прохождение тестов',
            'AI-помощник',
            'Трекер прогресса',
        ],
    },
    {
        id: 'yearly',
        name: 'Годовая подписка',
        price: 29990,
        duration: '12 месяцев',
        popular: true,
        features: [
            'Все возможности месячной',
            'Скидка 17% от месячной',
            'Скачивание материалов',
            'Приоритетная поддержка',
            'Сертификаты по завершению',
            'Доступ к новым курсам',
        ],
    },
    {
        id: 'lifetime',
        name: 'Пожизненная подписка',
        price: 99990,
        duration: 'Навсегда',
        features: [
            'Все возможности годовой',
            'Пожизненный доступ',
            'Все будущие курсы',
            'Персональный наставник',
            'Закрытое комьюнити',
            'Эксклюзивные проекты',
        ],
    },
]

export const SubscriptionPage = () => {
    const navigate = useNavigate()
    const subscription = useSubscriptionStore((state) => state.subscription)
    const checkStatus = useSubscriptionStore((state) => state.checkSubscriptionStatus)
    const getRemainingDays = useSubscriptionStore((state) => state.getRemainingDays)

    const isActive = checkStatus()
    const remainingDays = getRemainingDays()

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        navigate('/payment', { state: { plan } })
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-text mb-3">💎 Подписка</h1>
                <p className="text-gray-600 text-lg">
                    Выберите подходящий тариф и получите полный доступ к платформе
                </p>
            </div>

            {/* Текущая подписка */}
            {isActive && (
                <Card className="bg-success/5 border-success/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-success mb-1">
                                ✅ Подписка активна
                            </h3>
                            <p className="text-gray-600">
                                {subscription.tier === 'lifetime'
                                    ? 'Пожизненный доступ'
                                    : `Осталось ${remainingDays} дней`}
                            </p>
                        </div>
                        <Badge variant="default" className="bg-success text-white">
                            {subscription.tier === 'monthly' && 'Месячная'}
                            {subscription.tier === 'yearly' && 'Годовая'}
                            {subscription.tier === 'lifetime' && 'Пожизненная'}
                        </Badge>
                    </div>
                </Card>
            )}

            {/* Тарифы */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge variant="default" className="bg-primary text-white">
                                    🔥 Популярный
                                </Badge>
                            </div>
                        )}

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold text-primary mb-1">
                                {plan.price.toLocaleString('ru-RU')} ₸
                            </div>
                            <p className="text-gray-600">{plan.duration}</p>
                        </div>

                        <ul className="space-y-3 mb-6">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-success text-xl">✓</span>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            className="w-full"
                            variant={plan.popular ? 'primary' : 'secondary'}
                            onClick={() => handleSelectPlan(plan)}
                            disabled={isActive && subscription.tier === plan.id}
                        >
                            {isActive && subscription.tier === plan.id
                                ? 'Текущий тариф'
                                : 'Выбрать'}
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Преимущества */}
            <Card>
                <h2 className="text-2xl font-bold text-text mb-4">🎁 Что вы получите</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">📚</span>
                        <div>
                            <h4 className="font-semibold text-text mb-1">Полный доступ к урокам</h4>
                            <p className="text-sm text-gray-600">
                                Все уроки по Python и Figma с практическими заданиями
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">💾</span>
                        <div>
                            <h4 className="font-semibold text-text mb-1">Сохранение прогресса</h4>
                            <p className="text-sm text-gray-600">
                                Ваш прогресс сохраняется автоматически
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">📝</span>
                        <div>
                            <h4 className="font-semibold text-text mb-1">Тесты и проверка</h4>
                            <p className="text-sm text-gray-600">
                                Проходите тесты и получайте обратную связь
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">🎓</span>
                        <div>
                            <h4 className="font-semibold text-text mb-1">Сертификаты</h4>
                            <p className="text-sm text-gray-600">
                                Получайте сертификаты по завершению курсов
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* FAQ */}
            <Card>
                <h2 className="text-2xl font-bold text-text mb-4">❓ Часто задаваемые вопросы</h2>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-text mb-1">Как оплатить подписку?</h4>
                        <p className="text-sm text-gray-600">
                            Выберите тариф, перейдите на страницу оплаты и следуйте инструкциям.
                            Принимаем оплату через Kaspi и Halyk Bank.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-text mb-1">Можно ли отменить подписку?</h4>
                        <p className="text-sm text-gray-600">
                            Да, вы можете отменить подписку в любой момент. Доступ сохранится до конца оплаченного периода.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-text mb-1">Что делать, если оплата не прошла?</h4>
                        <p className="text-sm text-gray-600">
                            Свяжитесь с нашей поддержкой, и мы поможем решить проблему.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
