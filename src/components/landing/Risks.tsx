import { Card } from '@/components/ui/Card'

export const Risks = () => {
    return (
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
    )
}
