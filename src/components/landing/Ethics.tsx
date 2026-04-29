import { Card } from '@/components/ui/Card'

export const Ethics = () => {
    return (
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
                    <div className="text-6xl mb-6 text-center">🧠</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Самостоятельность</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">✓</span>
                            <span>Развитие критического мышления</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">✓</span>
                            <span>Ученик остаётся автором проекта</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500">✓</span>
                            <span>Поощрение собственных идей</span>
                        </li>
                    </ul>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 hover:shadow-xl transition-all">
                    <div className="text-6xl mb-6 text-center">👁️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Прозрачность обучения</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">✓</span>
                            <span>Родители видят прогресс ученика</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">✓</span>
                            <span>Отчёты об успеваемости</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">✓</span>
                            <span>Открытая система оценок</span>
                        </li>
                    </ul>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-xl transition-all">
                    <div className="text-6xl mb-6 text-center">👨‍🏫</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Контроль со стороны учителя</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Учитель направляет процесс</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Индивидуальный подход к ученику</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>Финальное слово всегда за учителем</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </section>
    )
}
