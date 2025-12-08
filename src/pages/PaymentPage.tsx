import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const PaymentPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { plan, price } = location.state || { plan: 'Месячная', price: 12000 }

    const [selectedMethod, setSelectedMethod] = useState<'kaspi' | 'halyk' | null>(null)
    const [paymentData, setPaymentData] = useState({
        phone: '',
        email: '',
        name: '',
    })

    const handlePayment = () => {
        if (!selectedMethod) {
            alert('Выберите способ оплаты')
            return
        }

        if (!paymentData.phone || !paymentData.email || !paymentData.name) {
            alert('Заполните все поля')
            return
        }

        // Здесь будет интеграция с платежными системами
        alert(`Оплата через ${selectedMethod === 'kaspi' ? 'Kaspi.kz' : 'Halyk Bank'}\nСумма: ${price.toLocaleString('ru-RU')}₸\n\nВ production здесь будет редирект на платежную систему`)

        // После успешной оплаты
        navigate('/dashboard')
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">💳 Оплата подписки</h1>
                <p className="text-gray-600">Выбранный тариф: <span className="font-semibold">{plan}</span></p>
            </div>

            {/* Order Summary */}
            <Card>
                <h2 className="text-xl font-bold mb-4">📋 Детали заказа</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Тариф:</span>
                        <span className="font-semibold">{plan}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Сумма к оплате:</span>
                        <span className="text-2xl font-bold text-primary">{price.toLocaleString('ru-RU')}₸</span>
                    </div>
                </div>
            </Card>

            {/* Payment Method Selection */}
            <Card>
                <h2 className="text-xl font-bold mb-4">💳 Выберите способ оплаты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        onClick={() => setSelectedMethod('kaspi')}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-smooth ${selectedMethod === 'kaspi'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                    >
                        <div className="text-center">
                            <div className="text-5xl mb-3">💳</div>
                            <h3 className="text-xl font-bold mb-2">Kaspi.kz</h3>
                            <p className="text-sm text-gray-600">Быстрая оплата через Kaspi</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setSelectedMethod('halyk')}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-smooth ${selectedMethod === 'halyk'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                    >
                        <div className="text-center">
                            <div className="text-5xl mb-3">🏦</div>
                            <h3 className="text-xl font-bold mb-2">Halyk Bank</h3>
                            <p className="text-sm text-gray-600">Оплата через Halyk Bank</p>
                        </div>
                    </div>
                </div>

                {selectedMethod && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            ℹ️ После нажатия "Оплатить" вы будете перенаправлены на страницу{' '}
                            {selectedMethod === 'kaspi' ? 'Kaspi.kz' : 'Halyk Bank'} для завершения оплаты
                        </p>
                    </div>
                )}
            </Card>

            {/* Contact Information */}
            <Card>
                <h2 className="text-xl font-bold mb-4">📝 Контактная информация</h2>
                <div className="space-y-4">
                    <Input
                        label="Имя и Фамилия"
                        type="text"
                        placeholder="Иван Иванов"
                        value={paymentData.name}
                        onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                    />
                    <Input
                        label="Номер телефона"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={paymentData.phone}
                        onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="example@email.com"
                        value={paymentData.email}
                        onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    />
                </div>
            </Card>

            {/* Security Notice */}
            <Card>
                <div className="flex items-start gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                        <h3 className="font-semibold mb-1">Безопасная оплата</h3>
                        <p className="text-sm text-gray-600">
                            Все платежи защищены SSL-шифрованием. Мы не храним данные ваших банковских карт.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => navigate('/subscription')}
                >
                    ← Назад
                </Button>
                <Button
                    className="flex-1"
                    onClick={handlePayment}
                    disabled={!selectedMethod}
                >
                    Оплатить {price.toLocaleString('ru-RU')}₸
                </Button>
            </div>
        </div>
    )
}
