import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Award, AlertTriangle } from 'lucide-react'

interface PointsLog {
    id: string
    student: string
    points: number
    reason: string
    grantedBy: string
    date: number
}

export const LiveRanksPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [logs] = useState<PointsLog[]>([
        { id: '1', student: 'Иван', points: 10, reason: 'Выполнил задание Python #1', grantedBy: 'Учитель А', date: Date.now() },
        { id: '2', student: 'Мария', points: 15, reason: 'Отличная работа по Figma', grantedBy: 'Учитель Б', date: Date.now() - 3600000 },
        { id: '3', student: 'Алексей', points: 50, reason: '⚠️ Подозрительно много очков', grantedBy: 'Учитель А', date: Date.now() - 7200000 }
    ])

    if (!user || user.role !== 'admin') {
        return <div className="p-6"><h1 className="text-2xl font-bold text-red-600">403</h1></div>
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🏆 Живые ранги и очки</h1>

            {/* Анти-абьюз */}
            <Card className="p-6 mb-6 bg-yellow-50 border-2 border-yellow-300">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-yellow-900 mb-2">⚠️ Система анти-накрутки</h3>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Лимит: 100 очков в день на ученика</li>
                            <li>• Предупреждение при выдаче 50+ очков за раз</li>
                            <li>• Все начисления логируются</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Логи */}
            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">📜 История начислений</h2>
                <div className="space-y-3">
                    {logs.map(log => (
                        <div
                            key={log.id}
                            className={`p-4 rounded-lg border-2 ${log.points >= 50 ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-lg">{log.student}</div>
                                    <div className="text-sm text-gray-600">{log.reason}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${log.points >= 50 ? 'text-red-600' : 'text-green-600'}`}>
                                        +{log.points}
                                    </div>
                                    {log.points >= 50 && (
                                        <div className="text-xs text-red-600 font-bold">⚠️ Проверить</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Выдал: {log.grantedBy}</span>
                                <span>{new Date(log.date).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
