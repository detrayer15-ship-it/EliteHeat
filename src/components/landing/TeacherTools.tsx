import { Card } from '@/components/ui/Card'

export const TeacherTools = () => {
    return (
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
    )
}
