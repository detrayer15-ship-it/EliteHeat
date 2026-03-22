import { Card } from '@/components/ui/Card'

const competitors = [
    {
        name: 'EliteEdu',
        logo: '🔥',
        price: 'От 12,000₸/мес',
        aiAssistant: true,
        practice: true,
        community: true,
        certificates: true,
        projects: true,
    },
    {
        name: 'Stepik',
        logo: '📚',
        price: 'От 16,000₸/мес',
        aiAssistant: false,
        practice: true,
        community: true,
        certificates: true,
        projects: false,
    },
    {
        name: 'Udemy',
        logo: '🎓',
        price: 'От 21,000₸/курс',
        aiAssistant: false,
        practice: true,
        community: false,
        certificates: true,
        projects: false,
    },
    {
        name: 'Skillbox',
        logo: '💼',
        price: 'От 63,000₸/мес',
        aiAssistant: false,
        practice: true,
        community: true,
        certificates: true,
        projects: true,
    },
    {
        name: 'Coursera',
        logo: '🌐',
        price: 'От 63,000₸/мес',
        aiAssistant: false,
        practice: true,
        community: true,
        certificates: true,
        projects: false,
    },
]

const ourFeatures = [
    { icon: '🤖', title: 'AI-ассистент', description: 'Помогает с ошибками и объясняет код' },
    { icon: '💻', title: 'Практика', description: 'Реальные проекты и задания' },
    { icon: '💰', title: 'Доступные цены', description: 'Дешевле конкурентов' },
    { icon: '📊', title: 'Прогресс', description: 'Отслеживание успеваемости' },
]

export const CompetitorAnalysisPage = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-text mb-4">Анализ конкурентов</h1>
                <p className="text-xl text-gray-600">Почему EliteEdu лучше других платформ</p>
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-ai-blue/10">
                <h2 className="text-2xl font-bold text-text mb-4">Наши уникальные преимущества</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ourFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="text-4xl">{feature.icon}</div>
                            <div>
                                <h3 className="font-semibold text-text">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold text-text mb-4">Сравнение с конкурентами</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4 font-semibold">Платформа</th>
                                <th className="text-left p-4 font-semibold">Цена</th>
                                <th className="text-center p-4 font-semibold">AI Помощник</th>
                                <th className="text-center p-4 font-semibold">Практика</th>
                                <th className="text-center p-4 font-semibold">Сообщество</th>
                                <th className="text-center p-4 font-semibold">Сертификаты</th>
                                <th className="text-center p-4 font-semibold">Проекты</th>
                            </tr>
                        </thead>
                        <tbody>
                            {competitors.map((competitor, index) => (
                                <tr
                                    key={competitor.name}
                                    className={`border-b hover:bg-gray-50 ${index === 0 ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{competitor.logo}</span>
                                            <span className="font-semibold text-lg">{competitor.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 font-semibold">{competitor.price}</td>
                                    <td className="p-4 text-center">
                                        {competitor.aiAssistant ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {competitor.practice ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {competitor.community ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {competitor.certificates ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        {competitor.projects ? (
                                            <span className="text-2xl">✅</span>
                                        ) : (
                                            <span className="text-2xl">❌</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="bg-gradient-to-r from-success/10 to-primary/10">
                <h2 className="text-2xl font-bold text-text mb-4">Почему выбирают EliteEdu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-text mb-2">✅ Для новичков</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Простые объяснения</li>
                            <li>• Пошаговые уроки</li>
                            <li>• AI-помощь 24/7</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-text mb-2">✅ Для опытных</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Сложные проекты</li>
                            <li>• Реальные задачи</li>
                            <li>• Портфолио</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}
