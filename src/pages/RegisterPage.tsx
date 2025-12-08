import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export const RegisterPage = () => {
    const navigate = useNavigate()
    const register = useAuthStore((state) => state.register)
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        city: '',
        role: 'student' as 'student' | 'admin',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают!')
            return
        }

        setIsLoading(true)
        const result = await register(formData.email, formData.password, formData.name, formData.city, formData.role)
        setIsLoading(false)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-ai-blue/5 py-12 px-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">EliteHeat</div>
                    <h1 className="text-2xl font-bold text-text mb-2">Регистрация</h1>
                    <p className="text-gray-600">Создайте свой личный кабинет</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Имя и Фамилия"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                        required
                    />

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Роль
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'student'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">🎓</div>
                                <div className="font-semibold">Ученик</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'admin'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">👑</div>
                                <div className="font-semibold">Админ</div>
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Город"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Алматы"
                        required
                    />

                    <Button type="submit" className="w-full" loading={isLoading}>
                        Создать аккаунт
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-primary hover:underline font-semibold"
                        >
                            Войти
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Вернуться на главную
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
