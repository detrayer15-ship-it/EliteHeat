import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { Typewriter } from '@/components/Typewriter'
import { FloatingParticles } from '@/components/FloatingParticles'

export const LandingPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 relative overflow-hidden">
            {/* Floating Particles Background */}
            <FloatingParticles />
            
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 relative">
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
            <section className="container mx-auto px-4 py-20 text-center relative z-10">
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
                    <div className="text-2xl md:text-4xl text-gray-700 mb-6 animate-slide-up font-medium min-h-[100px] flex items-center justify-center" style={{ animationDelay: '0.1s' }}>
                        <Typewriter
                            texts={[
                                'Изучайте программирование 🐍',
                                'Создавайте дизайны в Figma 🎨',
                                'Работайте с AI-помощником 🤖',
                                'Получайте сертификаты 🎓',
                                'Развивайте свои навыки 🚀'
                            ]}
                            speed={80}
                            deleteSpeed={40}
                            pauseTime={2000}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
                        />
                    </div>
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

            {/* Использование в школе */}
            <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Как EliteHeat используется в школе
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Один проект = одна учебная четверть. Полный цикл от идеи до защиты.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-indigo-200">
                            <div className="text-6xl mb-6 text-center">👨‍🎓</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ученик</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">1.</span>
                                    <span>Выбирает тему проекта</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">2.</span>
                                    <span>Работает пошагово в Project Hub</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">3.</span>
                                    <span>Получает помощь AI-ассистента</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold">4.</span>
                                    <span>Защищает проект перед классом</span>
                                </li>
                            </ul>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-purple-200">
                            <div className="text-6xl mb-6 text-center">👨‍🏫</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Учитель</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span>Видит прогресс каждого ученика</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span>Проверяет выполненные задания</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span>Комментирует и направляет</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span>Выставляет финальную оценку</span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 🔴 КРИТИЧНО: Соответствие школьной программе */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            📚 Соответствие стандартам
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Соответствие учебным целям
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Без этого школы боятся внедрять. Мы полностью соответствуем образовательным стандартам РК.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:shadow-xl transition-all">
                        <div className="text-5xl mb-4 text-center">🧠</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Критическое мышление</h3>
                        <p className="text-gray-600 text-sm text-center">
                            Анализ проблем, поиск решений, оценка результатов
                        </p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-xl transition-all">
                        <div className="text-5xl mb-4 text-center">🔬</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Проектная деятельность</h3>
                        <p className="text-gray-600 text-sm text-center">
                            От идеи до реализации, работа в команде
                        </p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-all">
                        <div className="text-5xl mb-4 text-center">💻</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Цифровая грамотность</h3>
                        <p className="text-gray-600 text-sm text-center">
                            Работа с современными инструментами и технологиями
                        </p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-xl transition-all">
                        <div className="text-5xl mb-4 text-center">🚀</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Предпринимательство</h3>
                        <p className="text-gray-600 text-sm text-center">
                            Создание продуктов, презентация идей
                        </p>
                    </Card>
                </div>
            </section>

            {/* 🔴 КРИТИЧНО: Роль учителя */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                👨‍🏫 Для учителей
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Инструменты для учителя
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Мы не заменяем учителя, а усиливаем его возможности
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="p-8 bg-white hover:shadow-2xl transition-all border-l-4 border-blue-500">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">📱</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Панель класса</h3>
                                    <p className="text-gray-600 mb-4">
                                        Видите всех учеников, их прогресс, активность и проблемные зоны в одном месте
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Кто на каком этапе проекта</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Кому нужна помощь</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Общая статистика класса</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-2xl transition-all border-l-4 border-indigo-500">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">📄</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Авто-отчёты</h3>
                                    <p className="text-gray-600 mb-4">
                                        Система автоматически генерирует отчёты по успеваемости и вовлечённости
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Еженедельные сводки</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Отчёты по проектам</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Экспорт в Excel/PDF</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-2xl transition-all border-l-4 border-purple-500">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">🛡️</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Анти-списывание</h3>
                                    <p className="text-gray-600 mb-4">
                                        Система отслеживает, что ученик действительно понимает материал
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Режим "Объясни своими словами"</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Экзаменационный режим</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>История изменений проекта</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-2xl transition-all border-l-4 border-pink-500">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">💬</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Комментарии и оценка</h3>
                                    <p className="text-gray-600 mb-4">
                                        Оставляйте обратную связь и выставляйте оценки прямо в системе
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Комментарии к этапам</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Рубрики оценивания</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            <span>Финальная оценка проекта</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 🟠 Метрики успеха (KPI) */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            📈 KPI
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Как мы измеряем результат
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Инвесторы и школы это любят. Прозрачные метрики успеха.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 text-center hover:shadow-xl transition-all">
                        <div className="text-5xl font-bold text-green-600 mb-2">85%</div>
                        <div className="text-gray-700 font-semibold mb-2">Завершённых проектов</div>
                        <p className="text-sm text-gray-600">Ученики доводят проекты до конца</p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 text-center hover:shadow-xl transition-all">
                        <div className="text-5xl font-bold text-blue-600 mb-2">+40%</div>
                        <div className="text-gray-700 font-semibold mb-2">Рост уверенности</div>
                        <p className="text-sm text-gray-600">Самооценка навыков учеников</p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 text-center hover:shadow-xl transition-all">
                        <div className="text-5xl font-bold text-purple-600 mb-2">4.7/5</div>
                        <div className="text-gray-700 font-semibold mb-2">Качество защит</div>
                        <p className="text-sm text-gray-600">Средняя оценка презентаций</p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 text-center hover:shadow-xl transition-all">
                        <div className="text-5xl font-bold text-orange-600 mb-2">92%</div>
                        <div className="text-gray-700 font-semibold mb-2">Вовлечённость</div>
                        <p className="text-sm text-gray-600">Активность учеников на платформе</p>
                    </Card>
                </div>

                <div className="mt-12 max-w-4xl mx-auto">
                    <Card className="p-8 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Дополнительные метрики</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-teal-600 mb-1">73%</div>
                                <div className="text-sm text-gray-600">Используют AI-помощника регулярно</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">2.5x</div>
                                <div className="text-sm text-gray-600">Рост скорости обучения</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-pink-600 mb-1">95%</div>
                                <div className="text-sm text-gray-600">Удовлетворённость учителей</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 🟠 Риски и решения */}
            <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                🛡️ Безопасность
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Риски и как мы их закрываем
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Признак зрелости — открыто говорить о рисках и показывать решения
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-6">
                        <Card className="p-8 bg-white hover:shadow-xl transition-all border-l-4 border-red-500">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">
                                        ⚠️
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-red-600 mb-2">Риск: ИИ делает за ученика</h3>
                                    <p className="text-gray-600 mb-4">
                                        Ученик может попросить AI сделать всю работу вместо него
                                    </p>
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                        <h4 className="font-bold text-green-700 mb-2">✅ Решение:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Режим "Объясни своими словами"</strong> — ученик должен пересказать решение</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Экзаменационный режим</strong> — AI ограничен, только подсказки</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Защита проекта</strong> — финальная презентация показывает понимание</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-xl transition-all border-l-4 border-orange-500">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                                        😰
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-orange-600 mb-2">Риск: Перегруз учеников</h3>
                                    <p className="text-gray-600 mb-4">
                                        Слишком много информации может демотивировать
                                    </p>
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                        <h4 className="font-bold text-green-700 mb-2">✅ Решение:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Пошаговый Project Hub</strong> — один этап за раз</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Прогресс-бар</strong> — видно, сколько осталось</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Микро-достижения</strong> — мотивация на каждом шаге</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 bg-white hover:shadow-xl transition-all border-l-4 border-yellow-500">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl">
                                        🔒
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-yellow-600 mb-2">Риск: Безопасность данных</h3>
                                    <p className="text-gray-600 mb-4">
                                        Личные данные учеников должны быть защищены
                                    </p>
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                        <h4 className="font-bold text-green-700 mb-2">✅ Решение:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Шифрование данных</strong> — SSL/TLS протоколы</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Соответствие GDPR</strong> — защита персональных данных</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span><strong>Контроль доступа</strong> — учитель видит только свой класс</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 🟠 Правовые и этические аспекты */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            ⚖️ Этика и право
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                        Правовые и этические аспекты
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Для школ это очень важно. Мы работаем прозрачно и ответственно.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="p-8 bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-300 hover:shadow-xl transition-all">
                        <div className="text-6xl mb-6 text-center">🤖</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">ИИ — помощник, не автор</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span>AI помогает, но не делает за ученика</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span>Ученик остаётся автором проекта</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">✓</span>
                                <span>История взаимодействия с AI сохраняется</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 hover:shadow-xl transition-all">
                        <div className="text-6xl mb-6 text-center">👁️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Прозрачность использования ИИ</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500">✓</span>
                                <span>Учитель видит все запросы к AI</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500">✓</span>
                                <span>Отчёты об использовании помощника</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500">✓</span>
                                <span>Маркировка AI-сгенерированного контента</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-xl transition-all">
                        <div className="text-6xl mb-6 text-center">👨‍🏫</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Контроль со стороны учителя</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Учитель может ограничить AI</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Настройка уровня помощи</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Финальное слово всегда за учителем</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>


            {/* 🟢 Будущие модули */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                            🔮 Будущее
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Будущие модули
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Показывает масштаб. Мы только начинаем.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                        <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">🌐</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">SafeWeb</h3>
                        <p className="text-gray-600 text-center mb-4">
                            Создание безопасных веб-приложений
                        </p>
                        <div className="text-sm text-gray-500 text-center">
                            HTML, CSS, JavaScript + безопасность
                        </div>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                        <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">🎮</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">GameDev</h3>
                        <p className="text-gray-600 text-center mb-4">
                            Разработка игр на Unity и Godot
                        </p>
                        <div className="text-sm text-gray-500 text-center">
                            От 2D платформеров до 3D миров
                        </div>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                        <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">🔬</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Research</h3>
                        <p className="text-gray-600 text-center mb-4">
                            Научные исследования с AI
                        </p>
                        <div className="text-sm text-gray-500 text-center">
                            Анализ данных, визуализация, выводы
                        </div>
                    </Card>

                    <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                        <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">🚀</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Startup</h3>
                        <p className="text-gray-600 text-center mb-4">
                            От идеи до MVP стартапа
                        </p>
                        <div className="text-sm text-gray-500 text-center">
                            Бизнес-модель, прототип, питч
                        </div>
                    </Card>
                </div>

                <div className="mt-12 text-center">
                    <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
                        <p className="text-lg text-gray-700">
                            <strong>💡 Roadmap:</strong> Каждый модуль — это новая возможность для школ расширить учебную программу.
                            Мы планируем запускать по 1 новому модулю каждые 3 месяца.
                        </p>
                    </Card>
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

            {/* 🎓 Наши ученики */}
            <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-4">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                🎓 Наши ученики
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Истории успеха наших учеников
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Реальные студенты, которые учатся в нашей школе и достигают впечатляющих результатов
                        </p>
                    </div>

                    {/* Отзывы учеников */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Ученик 1 */}
                        <Card className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-indigo-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    А
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Алия К.</h3>
                                    <p className="text-sm text-gray-600">11 класс</p>
                                    <div className="flex gap-1 mt-1">
                                        <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "Раньше я боялась программирования, но благодаря AI-помощнику и пошаговым урокам, я создала свой первый сайт! Теперь хочу стать веб-разработчиком."
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                                    Python
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    Figma
                                </span>
                            </div>
                        </Card>

                        {/* Ученик 2 */}
                        <Card className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-purple-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    Д
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Данияр Б.</h3>
                                    <p className="text-sm text-gray-600">10 класс</p>
                                    <div className="flex gap-1 mt-1">
                                        <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "Я создал игру на Python за одну четверть! AI-помощник объяснял сложные концепции простым языком. Защита проекта прошла на отлично!"
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    Python
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    Проект
                                </span>
                            </div>
                        </Card>

                        {/* Ученик 3 */}
                        <Card className="p-8 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-pink-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    А
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Айым С.</h3>
                                    <p className="text-sm text-gray-600">9 класс</p>
                                    <div className="flex gap-1 mt-1">
                                        <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "Figma стал моим любимым инструментом! Я создала дизайн мобильного приложения для школьного проекта. Учитель был в восторге!"
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                                    Figma
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    UI/UX
                                </span>
                            </div>
                        </Card>
                    </div>

                    {/* Достижения */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-indigo-200">
                        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            🏆 Достижения наших учеников
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                                <div className="text-5xl font-bold text-green-600 mb-2">156</div>
                                <div className="text-gray-700 font-medium">Завершенных проектов</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                                <div className="text-5xl font-bold text-blue-600 mb-2">89%</div>
                                <div className="text-gray-700 font-medium">Успеваемость</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                                <div className="text-5xl font-bold text-purple-600 mb-2">42</div>
                                <div className="text-gray-700 font-medium">Активных студента</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                                <div className="text-5xl font-bold text-orange-600 mb-2">4.8/5</div>
                                <div className="text-gray-700 font-medium">Средняя оценка</div>
                            </div>
                        </div>
                    </div>

                    {/* Галерея проектов */}
                    <div className="mt-16">
                        <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            📱 Проекты наших учеников
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 bg-white hover:shadow-xl transition-all">
                                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                                    <div className="text-6xl">🎮</div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Игра "Змейка"</h4>
                                <p className="text-gray-600 text-sm mb-3">Python игра с графикой</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        Д
                                    </div>
                                    <span className="text-sm text-gray-600">Данияр Б.</span>
                                </div>
                            </Card>

                            <Card className="p-6 bg-white hover:shadow-xl transition-all">
                                <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-red-100 rounded-lg mb-4 flex items-center justify-center">
                                    <div className="text-6xl">📱</div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Дизайн приложения</h4>
                                <p className="text-gray-600 text-sm mb-3">Мобильное приложение в Figma</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        А
                                    </div>
                                    <span className="text-sm text-gray-600">Айым С.</span>
                                </div>
                            </Card>

                            <Card className="p-6 bg-white hover:shadow-xl transition-all">
                                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                                    <div className="text-6xl">🌐</div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">Личный сайт</h4>
                                <p className="text-gray-600 text-sm mb-3">Портфолио на HTML/CSS</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        А
                                    </div>
                                    <span className="text-sm text-gray-600">Алия К.</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
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
