export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    О EliteHeat
                </h1>

                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">🎓 Наша миссия</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        EliteHeat - это современная образовательная платформа, которая помогает ученикам
                        по всему миру изучать программирование, дизайн и другие IT-навыки. Мы объединяем
                        качественное обучение с индивидуальным подходом к каждому ученику.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-4xl mb-4">🌍</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Глобальное сообщество</h3>
                        <p className="text-gray-700">
                            Более 243 учеников из разных стран мира уже обучаются на нашей платформе
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-4xl mb-4">👨‍🏫</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Опытные наставники</h3>
                        <p className="text-gray-700">
                            Наши менторы помогают ученикам 24/7, отвечают на вопросы
                            и объясняют сложные темы простым языком
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Качественные курсы</h3>
                        <p className="text-gray-700">
                            Python, JavaScript, React, Figma и многое другое - все курсы созданы
                            профессионалами индустрии
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-4xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">Геймификация</h3>
                        <p className="text-gray-700">
                            Система достижений, рангов и наград делает обучение увлекательным
                            и мотивирующим
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
