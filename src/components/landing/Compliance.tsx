import { Card } from '@/components/ui/Card'

export const Compliance = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <div className="inline-block mb-4">
                    <span className="bg-gradient-to-r from-orange-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        📚 Соответствие стандартам
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                    Соответствие учебным целям
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Без этого школы боятся внедрять. Мы полностью соответствуем образовательным стандартам РК.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-blue-50 border-2 border-orange-200 hover:shadow-xl transition-all">
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
    )
}
