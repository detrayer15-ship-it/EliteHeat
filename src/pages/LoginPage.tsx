import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const LoginPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: Отправка данных на backend
        console.log('Вход:', formData)
        alert('Вход выполнен успешно!')
        navigate('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-text mb-2">Вход</h1>
                    <p className="text-gray-600">Войдите в свой аккаунт</p>
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

                    <Input
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Введите пароль"
                        required
                    />

                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm text-primary hover:underline"
                        >
                            Забыли пароль?
                        </button>
                    </div>

                    <Button type="submit" className="w-full">
                        Войти
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Нет аккаунта?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-primary hover:underline"
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
