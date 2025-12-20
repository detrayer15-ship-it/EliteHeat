import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, TrendingUp, TrendingDown, Users, BookOpen } from 'lucide-react'

export const AnalyticsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    if (!user || user.role !== 'admin') {
        return <div className="p-6"><h1 className="text-2xl font-bold text-red-600">403</h1></div>
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📊 Аналитика эффективности</h1>

            {/* Эффективность обучения */}
            <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Эффективность обучения
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-600 mb-2">68%</div>
                            <div className="text-sm text-green-700 font-medium">Завершили курсы</div>
                        </div>
                    </div>
                    <div className="p-6 bg-red-50 rounded-xl border-2 border-red-200">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-red-600 mb-2">22%</div>
                            <div className="text-sm text-red-700 font-medium">Бросили обучение</div>
                        </div>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-2">5.2</div>
                            <div className="text-sm text-blue-700 font-medium">Дней на задание</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Потери */}
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                    Анализ потерь
                </h2>
                <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">Неактивные пользователи</span>
                            <span className="text-2xl font-bold text-orange-600">34</span>
                        </div>
                        <div className="text-sm text-orange-700">Не заходили 14+ дней</div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                        <div className="font-bold mb-3">Отток по неделям:</div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Неделя 1:</span>
                                <span className="font-bold text-red-600">-8 учеников</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Неделя 2:</span>
                                <span className="font-bold text-red-600">-5 учеников</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Неделя 3:</span>
                                <span className="font-bold text-orange-600">-3 ученика</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Неделя 4:</span>
                                <span className="font-bold text-green-600">+2 ученика</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
