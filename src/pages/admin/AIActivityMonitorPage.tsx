import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface AIUsageLog {
    id: string
    studentId: string
    studentName: string
    studentEmail: string
    timestamp: Date
    feature: 'chat' | 'code-review' | 'assistant' | 'image-analysis'
    prompt: string
    response: string
    tokensUsed: number
    suspicious: boolean
    suspicionReasons: string[]
}

interface StudentAIStats {
    studentId: string
    studentName: string
    totalRequests: number
    suspiciousRequests: number
    lastUsed: Date
    avgTokensPerRequest: number
    features: {
        chat: number
        codeReview: number
        assistant: number
        imageAnalysis: number
    }
    suspicionScore: number // 0-100
}

export const AIActivityMonitorPage = () => {
    const [logs, setLogs] = useState<AIUsageLog[]>([])
    const [studentStats, setStudentStats] = useState<StudentAIStats[]>([])
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
    const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAIActivityData()
    }, [timeFilter])

    const loadAIActivityData = async () => {
        setLoading(true)
        try {
            // 1. Fetch Students
            const usersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')))
            const studentsMap = new Map()
            usersSnapshot.docs.forEach(doc => {
                studentsMap.set(doc.id, { id: doc.id, ...doc.data() })
            })

            // 2. Fetch AI Messages
            const messagesSnapshot = await getDocs(query(
                collection(db, 'aiMessages'),
                orderBy('timestamp', 'desc'),
                limit(100)
            ))

            const realLogs: AIUsageLog[] = messagesSnapshot.docs.map(doc => {
                const data = doc.data()
                const student = studentsMap.get(data.userId) || { name: 'Unknown', email: '' }

                const suspicionReasons = []
                const suspiciousKeywords = ['готовый код', 'ответ', 'решение', 'сделай за меня', 'код для задания']
                if (data.role === 'user' && suspiciousKeywords.some(k => data.content.toLowerCase().includes(k))) {
                    suspicionReasons.push('Запрос прямого решения или готового кода')
                }

                return {
                    id: doc.id,
                    studentId: data.userId,
                    studentName: student.name,
                    studentEmail: student.email,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    feature: data.feature || 'chat',
                    prompt: data.role === 'user' ? data.content : '(Ответ AI)',
                    response: data.role === 'assistant' ? data.content : '',
                    tokensUsed: data.meta?.totalTokens || 0,
                    suspicious: suspicionReasons.length > 0,
                    suspicionReasons
                }
            })

            // 3. Calculate Stats
            const statsMap = new Map<string, StudentAIStats>()

            realLogs.forEach(log => {
                if (!statsMap.has(log.studentId)) {
                    statsMap.set(log.studentId, {
                        studentId: log.studentId,
                        studentName: log.studentName,
                        totalRequests: 0,
                        suspiciousRequests: 0,
                        lastUsed: log.timestamp,
                        avgTokensPerRequest: 0,
                        features: { chat: 0, codeReview: 0, assistant: 0, imageAnalysis: 0 },
                        suspicionScore: 0
                    })
                }

                const s = statsMap.get(log.studentId)!
                s.totalRequests++
                if (log.suspicious) s.suspiciousRequests++
                if (log.timestamp > s.lastUsed) s.lastUsed = log.timestamp

                // Track features (simplified)
                if (log.feature === 'chat') s.features.chat++
                else if (log.feature === 'code-review') s.features.codeReview++
            })

            // Finalize stats
            const finalStats = Array.from(statsMap.values()).map(s => {
                s.suspicionScore = Math.min(100, Math.round((s.suspiciousRequests / s.totalRequests) * 100 * 2)) // Scaled for visibility
                return s
            })

            setLogs(realLogs.filter(l => l.prompt !== '(Ответ AI)')) // Show only user prompts for clarity in logs
            setStudentStats(finalStats)
        } catch (error) {
            console.error('Error loading AI activity:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSuspicionColor = (score: number) => {
        if (score >= 70) return 'text-red-600 bg-red-50'
        if (score >= 40) return 'text-yellow-600 bg-yellow-50'
        return 'text-green-600 bg-green-50'
    }

    const getSuspicionLabel = (score: number) => {
        if (score >= 70) return 'Высокий риск'
        if (score >= 40) return 'Средний риск'
        return 'Низкий риск'
    }

    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 1000 / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (minutes < 60) return `${minutes} мин назад`
        if (hours < 24) return `${hours} ч назад`
        return `${days} дн назад`
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🔍 Мониторинг использования AI
                </h1>
                <p className="text-gray-600">
                    Отслеживание активности AI и обнаружение подозрительного поведения
                </p>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">Период:</label>
                    <div className="flex gap-2">
                        {(['today', 'week', 'month', 'all'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeFilter === filter
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter === 'today' && 'Сегодня'}
                                {filter === 'week' && 'Неделя'}
                                {filter === 'month' && 'Месяц'}
                                {filter === 'all' && 'Все время'}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-sm text-gray-600 mb-1">Всего запросов</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {studentStats.reduce((sum, s) => sum + s.totalRequests, 0)}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600 mb-1">Подозрительных</div>
                    <div className="text-3xl font-bold text-red-600">
                        {studentStats.reduce((sum, s) => sum + s.suspiciousRequests, 0)}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600 mb-1">Активных студентов</div>
                    <div className="text-3xl font-bold text-blue-600">
                        {studentStats.length}
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-gray-600 mb-1">Средний риск</div>
                    <div className="text-3xl font-bold text-yellow-600">
                        {Math.round(
                            studentStats.reduce((sum, s) => sum + s.suspicionScore, 0) /
                            studentStats.length
                        )}
                        %
                    </div>
                </Card>
            </div>

            {/* Student Stats Table */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    📊 Статистика по студентам
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                                    Студент
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                    Запросов
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                    Подозрительных
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                    Последняя активность
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                    Риск списывания
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentStats.map((student) => (
                                <tr
                                    key={student.studentId}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-gray-900">
                                            {student.studentName}
                                        </div>
                                    </td>
                                    <td className="text-center py-3 px-4 text-gray-700">
                                        {student.totalRequests}
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <span className="text-red-600 font-semibold">
                                            {student.suspiciousRequests}
                                        </span>
                                    </td>
                                    <td className="text-center py-3 px-4 text-gray-600 text-sm">
                                        {formatTimestamp(student.lastUsed)}
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getSuspicionColor(
                                                student.suspicionScore
                                            )}`}
                                        >
                                            {student.suspicionScore}% -{' '}
                                            {getSuspicionLabel(student.suspicionScore)}
                                        </span>
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        <button
                                            onClick={() => setSelectedStudent(student.studentId)}
                                            className="text-primary hover:text-primary-dark font-medium text-sm"
                                        >
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Recent Activity Log */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    📝 Последняя активность AI
                </h2>
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-4 rounded-lg border-2 ${log.suspicious
                                    ? 'border-red-200 bg-red-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {log.studentName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {log.studentEmail}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                        {formatTimestamp(log.timestamp)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {log.tokensUsed} токенов
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className="text-xs font-semibold text-gray-600 uppercase">
                                    {log.feature === 'chat' && '💬 Чат'}
                                    {log.feature === 'code-review' && '🔍 Проверка кода'}
                                    {log.feature === 'assistant' && '🤖 Ассистент'}
                                    {log.feature === 'image-analysis' && '🖼️ Анализ изображения'}
                                </span>
                            </div>

                            <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                    Запрос:
                                </div>
                                <div className="text-sm text-gray-900">{log.prompt}</div>
                            </div>

                            {log.suspicious && (
                                <div className="bg-red-100 p-3 rounded border border-red-300">
                                    <div className="text-sm font-semibold text-red-800 mb-2">
                                        ⚠️ Подозрительная активность:
                                    </div>
                                    <ul className="list-disc list-inside space-y-1">
                                        {log.suspicionReasons.map((reason, idx) => (
                                            <li key={idx} className="text-sm text-red-700">
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Anti-Cheating Indicators */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    🛡️ Индикаторы анти-списывания
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-semibold text-gray-700 mb-2">
                            Паттерны списывания
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ Запросы готовых решений</li>
                            <li>✓ Копирование без понимания</li>
                            <li>✓ Частые запросы за короткий период</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-semibold text-gray-700 mb-2">
                            Анализ поведения
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ Время между запросами</li>
                            <li>✓ Качество вопросов</li>
                            <li>✓ Использование подсказок</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm font-semibold text-gray-700 mb-2">
                            Защита данных
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ Логирование всех запросов</li>
                            <li>✓ Шифрование данных</li>
                            <li>✓ Прозрачность для учителя</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}
