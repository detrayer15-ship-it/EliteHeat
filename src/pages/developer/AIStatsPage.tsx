import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, TrendingUp, MessageSquare } from 'lucide-react'

export const AIStatsPage = () => {
    const navigate = useNavigate()
    const [stats] = useState({
        totalRequests: 1547,
        todayRequests: 89,
        avgResponseTime: 2.3,
        successRate: 98.5,
        topQuestions: [
            { question: 'Как работает цикл for?', count: 45 },
            { question: 'Что такое функция?', count: 38 },
            { question: 'Как создать переменную?', count: 32 }
        ]
    })

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📈 AI Статистика</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="p-6">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalRequests}</div>
                    <div className="text-sm text-gray-600">Всего запросов</div>
                </Card>
                <Card className="p-6">
                    <div className="text-3xl font-bold text-green-600">{stats.todayRequests}</div>
                    <div className="text-sm text-gray-600">Сегодня</div>
                </Card>
                <Card className="p-6">
                    <div className="text-3xl font-bold text-purple-600">{stats.avgResponseTime}s</div>
                    <div className="text-sm text-gray-600">Среднее время</div>
                </Card>
                <Card className="p-6">
                    <div className="text-3xl font-bold text-orange-600">{stats.successRate}%</div>
                    <div className="text-sm text-gray-600">Успешность</div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">🔥 Популярные вопросы</h2>
                <div className="space-y-3">
                    {stats.topQuestions.map((q, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <div>{q.question}</div>
                            </div>
                            <div className="text-gray-600">{q.count} раз</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
