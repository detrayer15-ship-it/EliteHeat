import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const LandingPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    // Если пользователь уже авторизован, перенаправляем на dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-ai-blue/5">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-primary">EliteHeat</div>
                        <div className="text-sm text-gray-600">Образовательная платформа</div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                        <Button onClick={() => navigate('/register')}>
                            Регистрация
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-6xl font-bold text-text mb-6 animate-slide-up">
                        Добро пожаловать в <span className="text-primary">EliteHeat</span>
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Изучайте программирование и дизайн с лучшими онлайн-курсами
                    </p>
                    <p className="text-lg text-gray-500 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Python, Figma, AI-помощник и многое другое в одном месте
                    </p>
                    <div className="flex gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Button size="lg" onClick={() => navigate('/register')}>
                            🚀 Начать обучение
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                            Уже есть аккаунт
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center text-text mb-12">
                    Что вы получите
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center p-8 hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="text-6xl mb-4">🐍</div>
                        <h3 className="text-2xl font-bold text-text mb-3">Python</h3>
                        <p className="text-gray-600">
                            15 уроков от основ до продвинутых тем. Практические задания и проекты.
                        </p>
                    </Card>
                    <Card className="text-center p-8 hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-2xl font-bold text-text mb-3">Figma</h3>
                        <p className="text-gray-600">
                            17 уроков по дизайну интерфейсов. Создавайте профессиональные макеты.
                        </p>
                    </Card>
                    <Card className="text-center p-8 hover:shadow-xl transition-all hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="text-6xl mb-4">🤖</div>
                        <h3 className="text-2xl font-bold text-text mb-3">AI-Помощник</h3>
                        <p className="text-gray-600">
                            Получайте ответы на вопросы и помощь в создании проектов 24/7.
                        </p>
                    </Card>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-text mb-12">
                        Почему выбирают нас
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="flex gap-4 animate-slide-in-left">
                            <div className="text-4xl">✅</div>
                            <div>
                                <h4 className="text-xl font-bold text-text mb-2">Практический подход</h4>
                                <p className="text-gray-600">Реальные проекты и задачи для закрепления знаний</p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-right">
                            <div className="text-4xl">📊</div>
                            <div>
                                <h4 className="text-xl font-bold text-text mb-2">Трекер прогресса</h4>
                                <p className="text-gray-600">Отслеживайте свои достижения и развитие навыков</p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl">💾</div>
                            <div>
                                <h4 className="text-xl font-bold text-text mb-2">Сохранение прогресса</h4>
                                <p className="text-gray-600">Ваши данные и прогресс всегда с вами</p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                            <div className="text-4xl">🎓</div>
                            <div>
                                <h4 className="text-xl font-bold text-text mb-2">Сертификаты</h4>
                                <p className="text-gray-600">Получайте сертификаты по завершению курсов</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <Card className="max-w-3xl mx-auto p-12 bg-gradient-to-r from-primary/10 to-ai-blue/10 border-2 border-primary/20">
                    <h2 className="text-4xl font-bold text-text mb-4">
                        Готовы начать обучение?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Присоединяйтесь к тысячам студентов, которые уже учатся на EliteHeat
                    </p>
                    <Button size="lg" onClick={() => navigate('/register')}>
                        Создать аккаунт бесплатно
                    </Button>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-2xl font-bold mb-4">EliteHeat</div>
                    <p className="text-gray-400 mb-6">
                        Образовательная платформа для изучения программирования и дизайна
                    </p>
                    <div className="flex gap-6 justify-center text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-smooth">О нас</a>
                        <a href="#" className="hover:text-white transition-smooth">Курсы</a>
                        <a href="#" className="hover:text-white transition-smooth">Контакты</a>
                        <a href="#" className="hover:text-white transition-smooth">Поддержка</a>
                    </div>
                    <div className="mt-8 text-sm text-gray-500">
                        © 2025 EliteHeat. Все права защищены.
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
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

                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                    animation-fill-mode: both;
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out;
                    animation-fill-mode: both;
                }

                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    )
}
