import { Card } from '@/components/ui/Card'
import { TrendingUp, Award, Flame } from 'lucide-react'

interface ProgressTrackerProps {
    courseName: string
    progress: number
    currentLesson: string
    nextStep: string
    points: number
    rank: string
    streak: number
}

export const ProgressTracker = ({ courseName, progress, currentLesson, nextStep, points, rank, streak }: ProgressTrackerProps) => {
    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">📊 Мой прогресс</h2>

            {/* Курс */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{courseName}</span>
                    <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Текущий этап */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-sm text-blue-600 mb-1">Текущий урок</div>
                    <div className="font-bold">{currentLesson}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="text-sm text-green-600 mb-1">Следующий шаг</div>
                    <div className="font-bold">{nextStep}</div>
                </div>
            </div>

            {/* Мотивация */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{points}</div>
                    <div className="text-xs text-gray-600">Очков</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{rank}</div>
                    <div className="text-xs text-gray-600">Ранг</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{streak}</div>
                    <div className="text-xs text-gray-600">Дней подряд</div>
                </div>
            </div>

            {/* Цель недели */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
                <div className="font-bold mb-2">🎯 Цель на неделю</div>
                <div className="text-sm text-gray-700">Завершить 3 задания до воскресенья</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }} />
                </div>
                <div className="text-xs text-gray-600 mt-1">2 из 3 выполнено</div>
            </div>
        </Card>
    )
}
