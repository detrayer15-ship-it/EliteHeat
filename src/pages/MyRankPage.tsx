import { useAuthStore } from '@/store/authStore'
import { RankDisplay } from '@/components/RankDisplay'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const MyRankPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    // Проверка доступа - только для админов/учителей
    if (!user || user.role !== 'admin') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только учителям.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    const points = user.adminPoints || 0

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    👑 Мой ранг
                </h1>
                <p className="text-gray-600 mt-2">
                    Ваш прогресс и достижения как учителя
                </p>
            </div>

            {/* Отображение ранга */}
            <RankDisplay points={points} showProgress={true} />

            {/* Как заработать очки */}
            <Card className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 text-xl">
                    💡 Как заработать очки?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <div className="text-3xl mb-2">✅</div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                            Проверка заданий
                        </h4>
                        <p className="text-sm text-gray-600">
                            +10 очков за каждое проверенное задание
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <div className="text-3xl mb-2">💬</div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                            Комментарии
                        </h4>
                        <p className="text-sm text-gray-600">
                            +5 очков за полезный комментарий
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <div className="text-3xl mb-2">⭐</div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                            Качественная обратная связь
                        </h4>
                        <p className="text-sm text-gray-600">
                            +20 очков за детальный отзыв
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <div className="text-3xl mb-2">🎯</div>
                        <h4 className="font-semibold text-gray-800 mb-1">
                            Активность
                        </h4>
                        <p className="text-sm text-gray-600">
                            +50 очков за ежедневную активность
                        </p>
                    </div>
                </div>
            </Card>

            {/* Статистика */}
            <Card className="mt-6 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">
                    📊 Ваша статистика
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-primary">{points}</div>
                        <div className="text-sm text-gray-600 mt-1">Всего очков</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">Проверено заданий</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">Комментариев</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-gray-600 mt-1">Дней активности</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
