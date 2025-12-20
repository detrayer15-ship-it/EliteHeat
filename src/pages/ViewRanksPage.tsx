import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { simpleRanks, getRankByLevel, rankColors } from '@/utils/simpleRanks'
import { ArrowLeft } from 'lucide-react'

export const ViewRanksPage = () => {
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

    const currentRank = getRankByLevel(user.teacherRank || 1)
    const currentColors = rankColors[currentRank.color as keyof typeof rankColors]

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к админ панели
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    🏆 Ранги и очки
                </h1>
                <p className="text-gray-600 mt-2">
                    Система рангов для учителей
                </p>
            </div>

            {/* Мой текущий ранг */}
            <Card className={`p-8 mb-6 border-2 ${currentColors.border} ${currentColors.bg}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ваш текущий ранг</h2>
                <div className="flex items-center gap-6">
                    <div className="text-7xl">{currentRank.icon}</div>
                    <div className="flex-1">
                        <h3 className={`text-3xl font-bold ${currentColors.text} mb-2`}>
                            {currentRank.name}
                        </h3>
                        <p className="text-lg text-gray-700">
                            Уровень {currentRank.level} из 9
                        </p>
                    </div>
                </div>
            </Card>

            {/* Все ранги */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Все ранги</h2>
                <p className="text-gray-600 mb-6">
                    Система рангов от 1 до 9. Ранг назначается администратором.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {simpleRanks.map((rank) => {
                        const colors = rankColors[rank.color as keyof typeof rankColors]
                        const isCurrent = rank.level === currentRank.level

                        return (
                            <div
                                key={rank.level}
                                className={`p-6 rounded-xl border-2 transition-all ${isCurrent
                                        ? `${colors.border} ${colors.bg} shadow-lg scale-105`
                                        : 'border-gray-200'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-5xl mb-3">{rank.icon}</div>
                                    <h3 className={`text-xl font-bold mb-1 ${isCurrent ? colors.text : 'text-gray-800'
                                        }`}>
                                        {rank.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Уровень {rank.level}
                                    </p>
                                    {isCurrent && (
                                        <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            Ваш ранг
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Информация */}
            <Card className="mt-6 p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Информация</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Ранг отражает ваш уровень как учителя</li>
                    <li>• Ранг назначается администратором платформы</li>
                    <li>• Всего 9 уровней: от Новичка до Легенды</li>
                    <li>• Ранг отображается в вашем профиле</li>
                </ul>
            </Card>
        </div>
    )
}
