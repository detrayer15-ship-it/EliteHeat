import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Send, Clock, CheckCircle } from 'lucide-react'

const templates = [
    { id: '1', text: 'Отлично! Задание выполнено правильно. ✅', points: 10 },
    { id: '2', text: 'Хорошая работа, но есть небольшие замечания...', points: 7 },
    { id: '3', text: 'Нужна доработка. Пожалуйста, исправьте следующее...', points: 0 },
    { id: '4', text: 'Задание не выполнено. Попробуйте ещё раз.', points: 0 }
]

export const EnhancedReviewPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [autoPoints, setAutoPoints] = useState(10)

    if (!user || user.role !== 'admin') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">Назад</Button>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📝 Проверка заданий</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Шаблоны */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">💬 Шаблоны комментариев</h2>
                    <div className="space-y-2">
                        {templates.map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setSelectedTemplate(t.text); setAutoPoints(t.points) }}
                                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200"
                            >
                                <div className="font-medium">{t.text}</div>
                                <div className="text-sm text-gray-500 mt-1">Очки: {t.points}</div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Форма */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">✍️ Ответ ученику</h2>
                    <textarea
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full px-4 py-3 border-2 rounded-xl mb-4"
                        rows={6}
                        placeholder="Комментарий..."
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Очки</label>
                        <input
                            type="number"
                            value={autoPoints}
                            onChange={(e) => setAutoPoints(Number(e.target.value))}
                            className="w-full px-4 py-2 border-2 rounded-xl"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Принять
                        </Button>
                        <Button variant="secondary" className="flex-1">
                            <Clock className="w-4 h-4 mr-2" />
                            На доработку
                        </Button>
                    </div>
                </Card>
            </div>

            {/* История */}
            <Card className="p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">📜 История правок</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">Версия {i}</span>
                                <span className="text-sm text-gray-500">{i} дн назад</span>
                            </div>
                            <p className="text-sm text-gray-700">Изменения в коде...</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
