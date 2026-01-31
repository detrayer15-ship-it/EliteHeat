export const Benefits = () => {
    return (
        <section className="bg-gradient-to-r from-orange-50 to-blue-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                        Почему выбирают EliteHeat
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Современная платформа с уникающими возможностями для эффективного обучения
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
    )
}
