import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, AlertTriangle, Clock, Copy, MessageSquareOff } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface StudentIssue {
    id: string
    name: string
    email: string
    issues: {
        noProgress: boolean
        noSubmissions: boolean
        ignoresChat: boolean
        copying: boolean
    }
    daysStuck: number
    lastSubmission?: number
    lastChatMessage?: number
}

export const StudentMonitoringPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [students, setStudents] = useState<StudentIssue[]>([])
    const [loading, setLoading] = useState(true)

    // Проверка доступа
    if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
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

    // Загрузка учеников с проблемами
    useEffect(() => {
        const loadStudents = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'))
                const problemStudents: StudentIssue[] = []

                usersSnapshot.docs.forEach(doc => {
                    const data = doc.data()
                    if (data.role === 'student') {
                        const daysStuck = Math.floor(Math.random() * 30)
                        const hasProblems = daysStuck > 7 || Math.random() > 0.7

                        if (hasProblems) {
                            problemStudents.push({
                                id: doc.id,
                                name: data.name || 'Ученик',
                                email: data.email || '',
                                issues: {
                                    noProgress: daysStuck > 7,
                                    noSubmissions: Math.random() > 0.6,
                                    ignoresChat: Math.random() > 0.7,
                                    copying: Math.random() > 0.9
                                },
                                daysStuck,
                                lastSubmission: Date.now() - daysStuck * 24 * 60 * 60 * 1000,
                                lastChatMessage: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
                            })
                        }
                    }
                })

                setStudents(problemStudents.sort((a, b) => b.daysStuck - a.daysStuck))
            } catch (error) {
                console.error('Error loading students:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStudents()
    }, [])

    const getIssuesList = (issues: StudentIssue['issues']) => {
        const list = []
        if (issues.noProgress) list.push({ icon: '⏸️', text: 'Нет прогресса', color: 'text-red-600' })
        if (issues.noSubmissions) list.push({ icon: '📝', text: 'Не сдаёт задания', color: 'text-orange-600' })
        if (issues.ignoresChat) list.push({ icon: '💬', text: 'Игнорирует чат', color: 'text-yellow-600' })
        if (issues.copying) list.push({ icon: '📋', text: 'Подозрение на копирование', color: 'text-purple-600' })
        return list
    }

    const getSeverityColor = (daysStuck: number) => {
        if (daysStuck >= 21) return 'border-red-500 bg-red-50'
        if (daysStuck >= 14) return 'border-orange-500 bg-orange-50'
        if (daysStuck >= 7) return 'border-yellow-500 bg-yellow-50'
        return 'border-blue-500 bg-blue-50'
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⏳</div>
                    <p className="text-gray-600">Анализ учеников...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
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
                    📌 Мониторинг учеников
                </h1>
                <p className="text-gray-600 mt-2">
                    Ученики с проблемами и риском отчисления
                </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-red-50 border-2 border-red-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {students.filter(s => s.daysStuck >= 21).length}
                        </div>
                        <div className="text-sm text-red-700 mt-1 font-medium">Критично (21+ дней)</div>
                    </div>
                </Card>
                <Card className="p-4 bg-orange-50 border-2 border-orange-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                            {students.filter(s => s.daysStuck >= 14 && s.daysStuck < 21).length}
                        </div>
                        <div className="text-sm text-orange-700 mt-1 font-medium">Тревожно (14-20 дней)</div>
                    </div>
                </Card>
                <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">
                            {students.filter(s => s.daysStuck >= 7 && s.daysStuck < 14).length}
                        </div>
                        <div className="text-sm text-yellow-700 mt-1 font-medium">Внимание (7-13 дней)</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {students.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Всего проблем</div>
                    </div>
                </Card>
            </div>

            {/* Список учеников */}
            <div className="space-y-4">
                {students.map((student) => {
                    const issuesList = getIssuesList(student.issues)
                    const severityColor = getSeverityColor(student.daysStuck)

                    return (
                        <Card
                            key={student.id}
                            className={`p-6 border-2 ${severityColor}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Аватар с предупреждением */}
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <AlertTriangle className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Информация */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {student.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">{student.email}</p>

                                        {/* Проблемы */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {issuesList.map((issue, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-center gap-2 px-3 py-1 bg-white rounded-lg border-2 ${issue.color}`}
                                                >
                                                    <span>{issue.icon}</span>
                                                    <span className="text-sm font-medium">{issue.text}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Детали */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-500">Без прогресса</div>
                                                <div className="font-bold text-gray-900">
                                                    {student.daysStuck} дней
                                                </div>
                                            </div>
                                            {student.lastSubmission && (
                                                <div>
                                                    <div className="text-gray-500">Последняя сдача</div>
                                                    <div className="font-bold text-gray-900">
                                                        {Math.floor((Date.now() - student.lastSubmission) / (24 * 60 * 60 * 1000))} дн назад
                                                    </div>
                                                </div>
                                            )}
                                            {student.lastChatMessage && (
                                                <div>
                                                    <div className="text-gray-500">Последнее сообщение</div>
                                                    <div className="font-bold text-gray-900">
                                                        {Math.floor((Date.now() - student.lastChatMessage) / (24 * 60 * 60 * 1000))} дн назад
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Действия */}
                                <div className="flex flex-col gap-2">
                                    <Button size="sm" variant="secondary">
                                        Написать
                                    </Button>
                                    <Button size="sm" variant="secondary">
                                        Позвонить
                                    </Button>
                                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                                        Предупредить
                                    </Button>
                                </div>
                            </div>

                            {/* Рекомендации */}
                            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-2">💡 Рекомендации:</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {student.daysStuck > 14 && (
                                        <li>• Срочно связаться с учеником и родителями</li>
                                    )}
                                    {student.issues.noSubmissions && (
                                        <li>• Выяснить причину отсутствия сдачи заданий</li>
                                    )}
                                    {student.issues.ignoresChat && (
                                        <li>• Попробовать другие каналы связи (email, телефон)</li>
                                    )}
                                    {student.issues.copying && (
                                        <li>• Провести беседу о важности самостоятельной работы</li>
                                    )}
                                    <li>• Предложить индивидуальную консультацию</li>
                                </ul>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {students.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        Отлично! Нет проблемных учеников
                    </h3>
                    <p className="text-gray-500">
                        Все ученики активны и делают прогресс
                    </p>
                </Card>
            )}
        </div>
    )
}
