import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import { adminRanks, pointsActions, getProgressToNextRank } from '@/utils/adminRanks'

export const AdminRanksPage = () => {
    const user = useAuthStore((state) => state.user)
    const points = user?.points || 0
    const { current, next, progress } = getProgressToNextRank(points)

    if (!user || user.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Доступ запрещён</h2>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 page-transition">
            {/* Заголовок */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mb-2">
                    🏆 Система рангов и очков
                </h1>
                <p className="text-gray-600">Зарабатывайте очки за активность и повышайте свой ранг!</p>
            </div>

            {/* Текущий ранг */}
            <Card className="bg-gradient-to-br from-white to-gray-50">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{current.icon}</div>
                    <h2 className={`text-3xl font-bold bg-gradient-to-r ${current.color} bg-clip-text text-transparent mb-2`}>
                        {current.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{current.description}</p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full border-2 border-yellow-300">
                        <span className="text-2xl">⭐</span>
                        <span className="text-2xl font-bold text-orange-600">{points}</span>
                        <span className="text-gray-600">очков</span>
                    </div>
                </div>

                {/* Прогресс до следующего ранга */}
                {next && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                                Прогресс до {next.icon} {next.name}
                            </span>
                            <span className="text-sm font-bold text-primary">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${next.color} transition-all duration-500 rounded-full`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Ещё {next.minPoints - points} очков до следующего ранга
                        </p>
                    </div>
                )}
            </Card>

            {/* Как зарабатывать очки */}
            <Card>
                <h2 className="text-2xl font-bold mb-4">💰 Как зарабатывать очки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">✅</span>
                            <div>
                                <h3 className="font-bold">Проверка задания</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.REVIEW_TASK} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Проверьте и оцените задание ученика</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">👍</span>
                            <div>
                                <h3 className="font-bold">Одобрение задания</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.APPROVE_TASK} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Одобрите качественное задание</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">❌</span>
                            <div>
                                <h3 className="font-bold">Отклонение задания</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.REJECT_TASK} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Отклоните задание с комментариями</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">💬</span>
                            <div>
                                <h3 className="font-bold">Ответ на сообщение</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.REPLY_MESSAGE} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Ответьте на вопрос ученика в чате</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">📚</span>
                            <div>
                                <h3 className="font-bold">Создание курса</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.CREATE_COURSE} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Создайте новый обучающий курс</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">📖</span>
                            <div>
                                <h3 className="font-bold">Добавление урока</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.ADD_LESSON} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Добавьте урок в существующий курс</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border-2 border-pink-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🤝</span>
                            <div>
                                <h3 className="font-bold">Помощь ученику</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.HELP_STUDENT} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Помогите ученику решить проблему</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">📅</span>
                            <div>
                                <h3 className="font-bold">Ежедневный вход</h3>
                                <p className="text-sm text-gray-600">+{pointsActions.DAILY_LOGIN} очков</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Войдите в систему каждый день</p>
                    </div>
                </div>
            </Card>

            {/* Все ранги */}
            <Card>
                <h2 className="text-2xl font-bold mb-4">🎖️ Все ранги</h2>
                <div className="space-y-3">
                    {adminRanks.map((rank) => {
                        const isCurrentRank = rank.level === current.level
                        const isAchieved = points >= rank.minPoints

                        return (
                            <div
                                key={rank.level}
                                className={`p-4 rounded-xl border-2 transition-all ${isCurrentRank
                                    ? `bg-gradient-to-r ${rank.color} text-white border-transparent shadow-lg scale-105`
                                    : isAchieved
                                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
                                        : 'bg-white border-gray-200 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{rank.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-xl font-bold ${isCurrentRank ? 'text-white' : 'text-gray-800'}`}>
                                                Уровень {rank.level}: {rank.name}
                                            </h3>
                                            {isCurrentRank && <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Текущий</span>}
                                            {isAchieved && !isCurrentRank && <span className="text-sm">✓</span>}
                                        </div>
                                        <p className={`text-sm mb-2 ${isCurrentRank ? 'text-white/90' : 'text-gray-600'}`}>
                                            {rank.description}
                                        </p>
                                        <p className={`text-xs ${isCurrentRank ? 'text-white/70' : 'text-gray-500'}`}>
                                            {rank.minPoints} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints} очков
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            {/* Информация о компании */}
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-200">
                <div className="text-center">
                    <div className="text-5xl mb-3">🚀</div>
                    <h2 className="text-2xl font-bold mb-2">Создатель платформы</h2>
                    <p className="text-lg font-semibold text-primary mb-2">Компания EliteHeat</p>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Мы создаём лучшую образовательную платформу для развития навыков и достижения целей.
                        Присоединяйтесь к нашей команде и помогайте ученикам расти!
                    </p>
                </div>
            </Card>
        </div>
    )
}
