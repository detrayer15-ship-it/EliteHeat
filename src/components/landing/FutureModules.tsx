import { Card } from '@/components/ui/Card'

export const FutureModules = () => {
    return (
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
    )
}
