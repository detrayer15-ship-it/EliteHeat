import { Card } from '@/components/ui/Card'
import { ScrollReveal } from '@/components/ScrollReveal'

export const Features = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <ScrollReveal animation="fade">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent text-glow">
                        Что вы получите
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Комплексная образовательная программа для вашего профессионального роста
                    </p>
                </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
                <ScrollReveal animation="scale" delay={100}>
                    <Card className="text-center p-8 card-hover-lift card-tilt glass-card border-gradient border-gradient-animated group gpu-accelerated">
                        <div className="text-7xl mb-6 animate-bounce-subtle">🐍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Python Programming</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>15 профессиональных уроков</strong> от основ до продвинутых концепций.
                            Изучите переменные, функции, ООП, работу с данными и создание реальных проектов.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Основы синтаксиса и структуры данных</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Объектно-ориентированное программирование</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Работа с файлами и базами данных</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Практические проекты и задачи</span>
                            </li>
                        </ul>
                    </Card>
                </ScrollReveal>

                <ScrollReveal animation="scale" delay={200}>
                    <Card className="text-center p-8 card-hover-lift card-tilt glass-card border-gradient border-gradient-animated group gpu-accelerated">
                        <div className="text-7xl mb-6 animate-bounce-subtle animation-delay-100">🎨</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Figma Design</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>17 детальных уроков</strong> по созданию профессиональных интерфейсов.
                            Освойте UI/UX дизайн, прототипирование и создание дизайн-систем.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Основы UI/UX дизайна и композиции</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Создание адаптивных макетов</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Работа с компонентами и Auto Layout</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Прототипирование и анимации</span>
                            </li>
                        </ul>
                    </Card>
                </ScrollReveal>

                <ScrollReveal animation="scale" delay={300}>
                    <Card className="text-center p-8 card-hover-lift card-tilt glass-card border-gradient border-gradient-animated group gpu-accelerated">
                        <div className="text-7xl mb-6 animate-bounce-subtle animation-delay-200">🤖</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Помощник 24/7</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong>Персональный AI-ассистент</strong> для помощи в обучении.
                            Получайте мгновенные ответы на вопросы, проверку кода и рекомендации.
                        </p>
                        <ul className="text-left text-sm text-gray-700 space-y-2">
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Ответы на вопросы в режиме реального времени</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Проверка и объяснение кода</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Помощь в создании проектов</span>
                            </li>
                            <li className="flex items-start gap-2 transition-transform group-hover:translate-x-1">
                                <span className="text-green-500">✓</span>
                                <span>Персональные рекомендации</span>
                            </li>
                        </ul>
                    </Card>
                </ScrollReveal>
            </div>
        </section>
    )
}
