import { Card } from '@/components/ui/Card'

export const SchoolUsage = () => {
    return (
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
    )
}
