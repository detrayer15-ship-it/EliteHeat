import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        age: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают!')
            return
        }

        // TODO: Отправка данных на backend
        console.log('Регистрация:', formData)
        alert('Регистрация успешна! Теперь вы можете войти.')
        navigate('/login')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text mb-2">Регистрация</h1>
                    <p className="text-gray-600">Создайте свой аккаунт</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Имя"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Иван"
                            required
                        />

                        <Input
                            label="Фамилия"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Иванов"
                            required
                        />
                    </div>

                    <Input
                        label="Возраст"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="15"
                        min="6"
                        max="100"
                        required
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Минимум 6 символов"
                        minLength={6}
                        required
                    />

                    <Input
                        label="Подтвердите пароль"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Повторите пароль"
                        minLength={6}
                        required
                    />

                    <Button type="submit" className="w-full">
                        Зарегистрироваться
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-primary hover:underline"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
