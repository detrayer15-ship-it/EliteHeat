import { useState } from 'react'
import { Check, Circle } from 'lucide-react'

interface RoadmapItem {
    id: string
    title: string
    isCompleted: boolean
    order: number
}

interface RoadmapTabProps {
    roadmap: RoadmapItem[]
    essence?: string
    goal?: string
    painPoint?: string
    onUpdate: (updates: any) => Promise<void>
}

export const RoadmapTab = ({ roadmap, essence, goal, painPoint, onUpdate }: RoadmapTabProps) => {
    const [localEssence, setLocalEssence] = useState(essence || '')
    const [localGoal, setLocalGoal] = useState(goal || '')
    const [localPainPoint, setLocalPainPoint] = useState(painPoint || '')

    const completedCount = roadmap.filter(item => item.isCompleted).length
    const progress = roadmap.length > 0 ? Math.round((completedCount / roadmap.length) * 100) : 0

    const handleToggleTask = async (taskId: string) => {
        const updatedRoadmap = roadmap.map(item =>
            item.id === taskId ? { ...item, isCompleted: !item.isCompleted } : item
        )
        await onUpdate({ roadmap: updatedRoadmap })
    }

    const handleSaveEssence = async () => {
        await onUpdate({ essence: localEssence })
    }

    const handleSaveGoal = async () => {
        await onUpdate({ goal: localGoal })
    }

    const handleSavePainPoint = async () => {
        await onUpdate({ painPoint: localPainPoint })
    }

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Прогресс выполнения</h3>
                    <span className="text-2xl font-bold text-purple-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {completedCount} из {roadmap.length} задач выполнено
                </p>
            </div>

            {/* Essence */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Суть проекта</h3>
                <textarea
                    value={localEssence}
                    onChange={(e) => setLocalEssence(e.target.value)}
                    onBlur={handleSaveEssence}
                    placeholder="Опишите суть вашего проекта..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                />
            </div>

            {/* Roadmap Checklist */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Чеклист разработки</h3>
                    {roadmap.length === 0 && (
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                            Сгенерировать план
                        </button>
                    )}
                </div>

                {roadmap.length > 0 ? (
                    <div className="space-y-3">
                        {roadmap
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleToggleTask(item.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        {item.isCompleted ? (
                                            <Check className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <span className={`flex-1 ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        Нажмите "Сгенерировать план" чтобы AI создал roadmap для вашего проекта
                    </p>
                )}
            </div>

            {/* Goal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Цель проекта</h3>
                <textarea
                    value={localGoal}
                    onChange={(e) => setLocalGoal(e.target.value)}
                    onBlur={handleSaveGoal}
                    placeholder="Какую цель преследует ваш проект?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                />
            </div>

            {/* Pain Point */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Боль клиента</h3>
                <textarea
                    value={localPainPoint}
                    onChange={(e) => setLocalPainPoint(e.target.value)}
                    onBlur={handleSavePainPoint}
                    placeholder="Какую проблему решает ваш проект?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                />
            </div>
        </div>
    )
}
