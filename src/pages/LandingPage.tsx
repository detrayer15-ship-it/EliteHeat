import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export const LandingPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-bold flex items-center">
                                <span className="text-blue-700">Elite</span>
                                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Heat</span>
                            </div>
                            <div className="hidden md:block text-sm text-gray-600">Образовательная платформа</div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-5xl mx-auto animate-fade-in">
                    <div className="inline-block mb-6">
                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            ✨ Новая эра онлайн-образования
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                        Добро пожаловать в{' '}
                        <span className="inline-flex items-center">
                            <span className="text-blue-700">Elite</span>
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Heat</span>
                        </span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-gray-700 mb-6 animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
                        Изучайте программирование и дизайн с лучшими онлайн-курсами
                    </p>
                    <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Получите доступ к профессиональным курсам по Python, Figma и AI-технологиям.
                        Учитесь в удобном темпе с персональным AI-помощником и получайте сертификаты.
                    </p>
                    <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Button
                            size="lg"
                            onClick={() => navigate('/subscription')}
                            className="w-72 text-base py-5 font-semibold shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                        >
                            🚀 Начать обучение
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Что вы получите
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Комплексная образовательная программа для вашего профессионального роста
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200" style={{ animationDelay: '0.1s' }}>
                        <div className="text-7xl mb-6">🐍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Python Programming</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>15 профессиональных уроков</strong> от основ до продвинутых концепций.
                            Изучите переменные, функции, ООП, работу с данными и создание реальных проектов.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Основы синтаксиса и структуры данных</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Объектно-ориентированное программирование</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Работа с файлами и базами данных</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Практические проекты и задачи</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200" style={{ animationDelay: '0.2s' }}>
                        <div className="text-7xl mb-6">🎨</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Figma Design</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>17 детальных уроков</strong> по созданию профессиональных интерфейсов.
                            Освойте UI/UX дизайн, прототипирование и создание дизайн-систем.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Основы UI/UX дизайна и композиции</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Создание адаптивных макетов</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Работа с компонентами и Auto Layout</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Прототипирование и анимации</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200" style={{ animationDelay: '0.3s' }}>
                        <div className="text-7xl mb-6">🤖</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Помощник 24/7</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>Персональный AI-ассистент</strong> для помощи в обучении.
                            Получайте мгновенные ответы на вопросы, проверку кода и рекомендации.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Ответы на вопросы в режиме реального времени</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Проверка и объяснение кода</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Помощь в создании проектов</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Персональные рекомендации</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gradient-to-r from-teal-50 to-cyan-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                            Почему выбирают EliteHeat
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Современная платформа с уникальными возможностями для эффективного обучения
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="flex gap-4 animate-slide-in-left bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                            <div className="text-5xl">✅</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Практический подход</h4>
                                <p className="text-gray-600">
                                    Каждый урок включает реальные проекты и задачи. Вы не просто учите теорию,
                                    а сразу применяете знания на практике, создавая портфолио.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-right bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                            <div className="text-5xl">📊</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Трекер прогресса</h4>
                                <p className="text-gray-600">
                                    Отслеживайте свои достижения с помощью детальной аналитики.
                                    Визуализация прогресса, статистика по урокам и мотивирующие достижения.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-left bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl">💾</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Сохранение прогресса</h4>
                                <p className="text-gray-600">
                                    Ваши данные надёжно хранятся в облаке. Продолжайте обучение с любого
                                    устройства - прогресс синхронизируется автоматически.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 animate-slide-in-right bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl">🎓</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Сертификаты</h4>
                                <p className="text-gray-600">
                                    Получайте официальные сертификаты по завершению курсов.
                                    Подтвердите свои навыки и добавьте сертификаты в резюме.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="animate-fade-in">
                        <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                            32+
                        </div>
                        <div className="text-gray-600 font-medium">Уроков</div>
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            24/7
                        </div>
                        <div className="text-gray-600 font-medium">AI-Поддержка</div>
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                            100%
                        </div>
                        <div className="text-gray-600 font-medium">Практика</div>
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                            ∞
                        </div>
                        <div className="text-gray-600 font-medium">Доступ к материалам</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-teal-100 via-cyan-100 to-emerald-100 border-2 border-teal-300 shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                        Готовы начать обучение?
                    </h2>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Присоединяйтесь к тысячам студентов, которые уже развивают свои навыки на EliteHeat.
                        Выберите подходящий тариф и начните учиться уже сегодня!
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate('/subscription')}
                        className="text-lg py-5 px-10 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                    >
                        Выбрать тариф
                    </Button>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-3xl font-bold mb-4 flex items-center justify-center">
                        <span className="text-blue-700">Elite</span>
                        <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Heat</span>
                    </div>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Образовательная платформа для изучения программирования и дизайна.
                        Развивайте навыки с лучшими онлайн-курсами и AI-помощником.
                    </p>
                    <div className="flex gap-6 justify-center text-sm text-gray-400 mb-6">
                        <a href="#" className="hover:text-white transition-smooth">О нас</a>
                        <a href="#" className="hover:text-white transition-smooth">Курсы</a>
                        <a href="#" className="hover:text-white transition-smooth">Контакты</a>
                        <a href="#" className="hover:text-white transition-smooth">Поддержка</a>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2025 EliteHeat. Все права защищены.
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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
                    animation-fill-mode: both;
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
