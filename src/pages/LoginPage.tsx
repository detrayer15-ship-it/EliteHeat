import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export const LoginPage = () => {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        setIsLoading(true)
        const result = await login(formData.email, formData.password)
        setIsLoading(false)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setIsLoading(true)
        const result = await loginWithGoogle()
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
                    <h1 className="text-2xl font-bold text-text mb-2">Вход</h1>
                    <p className="text-gray-600">Войдите в свой личный кабинет</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

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

                    <Button type="submit" className="w-full" loading={isLoading}>
                        Войти
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">или</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-3"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Войти через Google
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        Нет аккаунта?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-primary hover:underline font-semibold"
                        >
                            Зарегистрироваться
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
