import { useState } from 'react'

interface ProtectionScoreProps {
    score: number // 0-100
    studentName: string
    details?: {
        originalWork: number // % оригинальной работы
        aiAssistance: number // % использования AI
        understanding: number // % понимания материала
        consistency: number // % последовательности в ответах
    }
    showDetails?: boolean
}

export const ProtectionScore = ({
    score,
    studentName,
    details,
    showDetails = false
}: ProtectionScoreProps) => {
    const [expanded, setExpanded] = useState(showDetails)

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-600'
        if (score >= 60) return 'from-yellow-500 to-orange-500'
        if (score >= 40) return 'from-orange-500 to-red-500'
        return 'from-red-600 to-red-800'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Отличное понимание'
        if (score >= 60) return 'Хорошее понимание'
        if (score >= 40) return 'Среднее понимание'
        return 'Требует внимания'
    }

    const getScoreIcon = (score: number) => {
        if (score >= 80) return '🎓'
        if (score >= 60) return '📚'
        if (score >= 40) return '⚠️'
        return '🚨'
    }

    const getBarColor = (value: number) => {
        if (value >= 80) return 'bg-green-500'
        if (value >= 60) return 'bg-yellow-500'
        if (value >= 40) return 'bg-orange-500'
        return 'bg-red-500'
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{studentName}</h3>
                    <p className="text-sm text-gray-600">Оценка понимания материала</p>
                </div>
                <div className="text-4xl">{getScoreIcon(score)}</div>
            </div>

            {/* Score Circle */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    {/* Background Circle */}
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(score / 100) * 351.86} 351.86`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop
                                    offset="0%"
                                    className={`${getScoreColor(score).split(' ')[0].replace('from-', 'text-')}`}
                                    stopColor="currentColor"
                                />
                                <stop
                                    offset="100%"
                                    className={`${getScoreColor(score).split(' ')[1].replace('to-', 'text-')}`}
                                    stopColor="currentColor"
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Score Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{score}</div>
                            <div className="text-xs text-gray-600">из 100</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Label */}
            <div className="text-center mb-4">
                <div
                    className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(
                        score
                    )} text-white font-semibold text-sm`}
                >
                    {getScoreLabel(score)}
                </div>
            </div>

            {/* Details Toggle */}
            {details && (
                <>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full py-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {expanded ? '▼ Скрыть детали' : '▶ Показать детали'}
                    </button>

                    {/* Detailed Breakdown */}
                    {expanded && (
                        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
                            {/* Original Work */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        📝 Оригинальная работа
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {details.originalWork}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                                            details.originalWork
                                        )}`}
                                        style={{ width: `${details.originalWork}%` }}
                                    />
                                </div>
                            </div>

                            {/* AI Assistance */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        🤖 Использование AI (обратное)
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {100 - details.aiAssistance}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                                            100 - details.aiAssistance
                                        )}`}
                                        style={{ width: `${100 - details.aiAssistance}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    AI использован в {details.aiAssistance}% работы
                                </p>
                            </div>

                            {/* Understanding */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        💡 Понимание материала
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {details.understanding}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                                            details.understanding
                                        )}`}
                                        style={{ width: `${details.understanding}%` }}
                                    />
                                </div>
                            </div>

                            {/* Consistency */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        🎯 Последовательность
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {details.consistency}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(
                                            details.consistency
                                        )}`}
                                        style={{ width: `${details.consistency}%` }}
                                    />
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-xs font-semibold text-blue-900 mb-1">
                                    ℹ️ Как рассчитывается оценка:
                                </div>
                                <ul className="text-xs text-blue-800 space-y-1">
                                    <li>• Анализ оригинальности работы</li>
                                    <li>• Частота и характер использования AI</li>
                                    <li>• Качество ответов на контрольные вопросы</li>
                                    <li>• Последовательность в решениях</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
