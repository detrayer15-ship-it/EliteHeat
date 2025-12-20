import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users, TrendingUp, Award } from 'lucide-react'

export const EnhancedGroupsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [groups] = useState([
        { id: '1', name: 'Группа A', students: 15, avgScore: 85, progress: 75, weak: 2, strong: 5 },
        { id: '2', name: 'Группа B', students: 12, avgScore: 72, progress: 60, weak: 3, strong: 3 },
        { id: '3', name: 'Группа C', students: 18, avgScore: 90, progress: 85, weak: 1, strong: 8 }
    ])

    if (!user || user.role !== 'admin') {
        return <div className="p-6"><h1 className="text-2xl font-bold text-red-600">403</h1></div>
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🧩 Управление группами</h1>

            <div className="grid gap-6">
                {groups.map(g => (
                    <Card key={g.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">{g.name}</h2>
                                <p className="text-gray-600">{g.students} учеников</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">{g.avgScore}</div>
                                <div className="text-sm text-gray-500">Средний балл</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <span className="font-bold">Прогресс</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600">{g.progress}%</div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-5 h-5 text-yellow-600" />
                                    <span className="font-bold">Слабые</span>
                                </div>
                                <div className="text-2xl font-bold text-yellow-600">{g.weak}</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-5 h-5 text-purple-600" />
                                    <span className="font-bold">Сильные</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-600">{g.strong}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button size="sm">Выдать задание</Button>
                            <Button size="sm" variant="secondary">Начислить очки</Button>
                            <Button size="sm" variant="secondary">Объявление</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
