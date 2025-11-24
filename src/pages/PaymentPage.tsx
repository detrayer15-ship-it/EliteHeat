import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import { SubscriptionPlan } from '@/types/subscription'
import { useSubscriptionStore } from '@/store/subscriptionStore'

export const PaymentPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const plan = location.state?.plan as SubscriptionPlan | undefined
    const activateSubscription = useSubscriptionStore((state) => state.activateSubscription)

    const [transactionId, setTransactionId] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'kaspi' | 'halyk'>('kaspi')

    if (!plan) {
        navigate('/subscription')
        return null
    }

    const handleConfirmPayment = () => {
        if (!transactionId.trim()) {
            alert('Пожалуйста, введите номер транзакции')
            return
        }

        setIsProcessing(true)

        // Имитация проверки платежа
        setTimeout(() => {
            activateSubscription(plan.id, plan.price)
            setIsProcessing(false)
            alert('✅ Оплата подтверждена! Подписка активирована.')
            navigate('/subscription')
        }, 2000)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <Button variant="ghost" onClick={() => navigate('/subscription')} className="mb-4">
                    ← Назад к тарифам
                </Button>
                <h1 className="text-3xl font-bold text-text mb-2">💳 Оплата подписки</h1>
                <p className="text-gray-600">Выберите способ оплаты и следуйте инструкциям</p>
            </div>

            {/* Выбранный тариф */}
            <Card className="bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-text mb-1">{plan.name}</h3>
                        <p className="text-gray-600">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                            {plan.price.toLocaleString('ru-RU')} ₸
                        </div>
                    </div>
                </div>
            </Card>

            {/* Выбор способа оплаты */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">Способ оплаты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setPaymentMethod('kaspi')}
                        className={`p-4 border-2 rounded-lg transition-smooth ${paymentMethod === 'kaspi'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                            }`}
                    >
                        <div className="text-4xl mb-2">🔴</div>
                        <h4 className="font-semibold text-text">Kaspi</h4>
                        <p className="text-sm text-gray-600">Kaspi QR / Kaspi Pay</p>
                    </button>
                    <button
                        onClick={() => setPaymentMethod('halyk')}
                        className={`p-4 border-2 rounded-lg transition-smooth ${paymentMethod === 'halyk'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                            }`}
                    >
                        <div className="text-4xl mb-2">💳</div>
                        <h4 className="font-semibold text-text">Halyk Bank</h4>
                        <p className="text-sm text-gray-600">Перевод на карту</p>
                    </button>
                </div>
            </Card>

            {/* Инструкции по оплате */}
            {paymentMethod === 'kaspi' && (
                <Card>
                    <h2 className="text-xl font-bold text-text mb-4">📱 Оплата через Kaspi</h2>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="text-6xl mb-3">📱</div>
                            <p className="text-sm text-gray-600 mb-2">Отсканируйте QR-код в приложении Kaspi</p>
                            <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">QR-код Kaspi</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-text mb-3">Или переведите на номер:</h4>
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary">+7 (777) 123-45-67</span>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText('+77771234567')
                                            alert('Номер скопирован!')
                                        }}
                                    >
                                        Копировать
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                            <p className="text-sm text-gray-700">
                                <strong>Важно:</strong> После оплаты введите номер транзакции из Kaspi ниже
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {paymentMethod === 'halyk' && (
                <Card>
                    <h2 className="text-xl font-bold text-text mb-4">💳 Оплата через Halyk Bank</h2>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-text mb-3">Реквизиты для перевода:</h4>
                            <div className="space-y-3">
                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                    <div className="text-sm text-gray-600 mb-1">Номер карты</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary">4400 4301 2345 6789</span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText('4400430123456789')
                                                alert('Номер карты скопирован!')
                                            }}
                                        >
                                            Копировать
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Владелец:</span>
                                            <div className="font-semibold">ELITE HEAT PLATFORM</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Банк:</span>
                                            <div className="font-semibold">Halyk Bank</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                            <p className="text-sm text-gray-700">
                                <strong>Важно:</strong> После оплаты введите номер транзакции из банковского приложения ниже
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Подтверждение оплаты */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">✅ Подтверждение оплаты</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Номер транзакции / ID платежа
                        </label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Введите номер транзакции"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Номер транзакции можно найти в истории платежей вашего приложения
                        </p>
                    </div>

                    <Button
                        onClick={handleConfirmPayment}
                        disabled={!transactionId.trim() || isProcessing}
                        className="w-full"
                    >
                        {isProcessing ? 'Проверка платежа...' : 'Подтвердить оплату'}
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                        Нажимая кнопку, вы подтверждаете, что совершили оплату
                    </div>
                </div>
            </Card>

            {/* Инструкция */}
            <Card className="bg-gray-50">
                <h3 className="font-semibold text-text mb-3">📋 Как оплатить:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                        <span className="font-semibold">1.</span>
                        <span>Выберите способ оплаты (Kaspi или Halyk Bank)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold">2.</span>
                        <span>Переведите указанную сумму по реквизитам</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold">3.</span>
                        <span>Скопируйте номер транзакции из приложения</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold">4.</span>
                        <span>Вставьте номер в поле выше и нажмите "Подтвердить"</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold">5.</span>
                        <span>Подписка активируется автоматически после проверки</span>
                    </li>
                </ol>
            </Card>
        </div>
    )
}
