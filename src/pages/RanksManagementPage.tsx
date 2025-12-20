import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { defaultRanks, Rank } from '@/utils/ranks'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'

export const RanksManagementPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [ranks, setRanks] = useState<Rank[]>(() => {
        const saved = localStorage.getItem('custom_ranks')
        return saved ? JSON.parse(saved) : defaultRanks
    })

    // Проверка доступа
    if (!user || user.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    const handleSave = () => {
        localStorage.setItem('custom_ranks', JSON.stringify(ranks))
        alert('✅ Ранги сохранены!')
    }

    const handleReset = () => {
        if (confirm('Вы уверены? Это вернёт ранги к значениям по умолчанию.')) {
            setRanks(defaultRanks)
            localStorage.removeItem('custom_ranks')
            alert('✅ Ранги сброшены к значениям по умолчанию')
        }
    }

    const handleUpdateRank = (index: number, field: keyof Rank, value: string | number) => {
        const updated = [...ranks]
        updated[index] = { ...updated[index], [field]: value }
        setRanks(updated)
    }

    const handleAddRank = () => {
        const lastRank = ranks[ranks.length - 1]
        const newRank: Rank = {
            id: `rank_${Date.now()}`,
            name: 'Новый ранг',
            minPoints: lastRank.maxPoints === Infinity ? lastRank.minPoints + 1000 : lastRank.maxPoints + 1,
            maxPoints: lastRank.maxPoints === Infinity ? Infinity : lastRank.maxPoints + 500,
            color: 'blue',
            icon: '⭐'
        }
        setRanks([...ranks, newRank])
    }

    const handleDeleteRank = (index: number) => {
        if (ranks.length <= 1) {
            alert('❌ Должен остаться хотя бы один ранг')
            return
        }
        if (confirm('Удалить этот ранг?')) {
            setRanks(ranks.filter((_, i) => i !== index))
        }
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/developer/panel')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к панели
                </Button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            👑 Управление рангами
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Настройка системы рангов для учителей
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleReset}>
                            Сбросить
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить
                        </Button>
                    </div>
                </div>
            </div>

            {/* Список рангов */}
            <div className="space-y-4">
                {ranks.map((rank, index) => (
                    <Card key={rank.id} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                            {/* Иконка */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Иконка
                                </label>
                                <Input
                                    value={rank.icon}
                                    onChange={(e) => handleUpdateRank(index, 'icon', e.target.value)}
                                    className="text-2xl text-center"
                                    maxLength={2}
                                />
                            </div>

                            {/* Название */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Название
                                </label>
                                <Input
                                    value={rank.name}
                                    onChange={(e) => handleUpdateRank(index, 'name', e.target.value)}
                                    placeholder="Название ранга"
                                />
                            </div>

                            {/* Минимум очков */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    От (очков)
                                </label>
                                <Input
                                    type="number"
                                    value={rank.minPoints}
                                    onChange={(e) => handleUpdateRank(index, 'minPoints', parseInt(e.target.value))}
                                />
                            </div>

                            {/* Максимум очков */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    До (очков)
                                </label>
                                <Input
                                    type="number"
                                    value={rank.maxPoints === Infinity ? 999999 : rank.maxPoints}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value)
                                        handleUpdateRank(index, 'maxPoints', val >= 999999 ? Infinity : val)
                                    }}
                                />
                            </div>

                            {/* Цвет */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Цвет
                                </label>
                                <select
                                    value={rank.color}
                                    onChange={(e) => handleUpdateRank(index, 'color', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="gray">Серый</option>
                                    <option value="blue">Синий</option>
                                    <option value="green">Зелёный</option>
                                    <option value="purple">Фиолетовый</option>
                                    <option value="orange">Оранжевый</option>
                                    <option value="red">Красный</option>
                                </select>
                            </div>
                        </div>

                        {/* Кнопка удаления */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDeleteRank(index)}
                                disabled={ranks.length <= 1}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Кнопка добавления */}
            <div className="mt-6">
                <Button onClick={handleAddRank} variant="secondary" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить новый ранг
                </Button>
            </div>

            {/* Подсказка */}
            <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">💡 Подсказка</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ранги отображаются для учителей в их профиле</li>
                    <li>• Очки начисляются за проверку заданий и активность</li>
                    <li>• Для бесконечного максимума используйте значение 999999</li>
                    <li>• Изменения применяются сразу после сохранения</li>
                </ul>
            </Card>
        </div>
    )
}
