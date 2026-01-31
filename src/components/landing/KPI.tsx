import { Card } from '@/components/ui/Card'

export const KPI = () => {
    return (
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
                            <div className="text-3xl font-bold text-orange-600 mb-1">73%</div>
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
    )
}
