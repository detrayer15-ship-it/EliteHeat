import { getRankByPoints, getNextRank, getProgressToNextRank, getPointsToNextRank, rankColors } from '@/utils/ranks'

interface RankDisplayProps {
    points: number
    showProgress?: boolean
}

export const RankDisplay = ({ points, showProgress = true }: RankDisplayProps) => {
    const currentRank = getRankByPoints(points)
    const nextRank = getNextRank(points)
    const progress = getProgressToNextRank(points)
    const pointsNeeded = getPointsToNextRank(points)

    const colors = rankColors[currentRank.color as keyof typeof rankColors]

    return (
        <div className="space-y-4">
            {/* Текущий ранг */}
            <div className={`p-6 rounded-xl border-2 ${colors.border} ${colors.bg}`}>
                <div className="flex items-center gap-4">
                    <div className="text-5xl">{currentRank.icon}</div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`text-2xl font-bold ${colors.text}`}>
                                {currentRank.name}
                            </h3>
                            <span className="text-sm text-gray-600">
                                ({points} очков)
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {currentRank.minPoints} - {currentRank.maxPoints === Infinity ? '∞' : currentRank.maxPoints} очков
                        </p>
                    </div>
                </div>
            </div>

            {/* Прогресс до следующего ранга */}
            {showProgress && nextRank && (
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h4 className="font-semibold text-gray-800">
                                Следующий ранг: {nextRank.icon} {nextRank.name}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Осталось {pointsNeeded} очков
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {progress}%
                            </div>
                        </div>
                    </div>

                    {/* Прогресс-бар */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Максимальный ранг достигнут */}
            {showProgress && !nextRank && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-300">
                    <div className="flex items-center gap-3">
                        <div className="text-4xl">🏆</div>
                        <div>
                            <h4 className="font-bold text-yellow-800">
                                Максимальный ранг достигнут!
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                Вы достигли высшего ранга в системе
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
