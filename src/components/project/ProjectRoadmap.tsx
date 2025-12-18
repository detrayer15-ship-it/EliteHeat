import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface ProjectRoadmapProps {
    projectId: string
}

interface Step {
    id: number
    title: string
    description: string
    status: 'locked' | 'current' | 'completed'
}

export const ProjectRoadmap = ({ projectId }: ProjectRoadmapProps) => {
    const [steps, setSteps] = useState<Step[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSteps()
    }, [projectId])

    const loadSteps = async () => {
        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId))
            if (projectDoc.exists()) {
                const data = projectDoc.data()

                if (data.roadmap && Array.isArray(data.roadmap)) {
                    const mappedSteps = data.roadmap.map((item: any, index: number) => ({
                        id: index + 1,
                        title: item.title,
                        description: item.description || 'Выполните этот шаг',
                        status: item.isCompleted ? 'completed' :
                            index === 0 ? 'current' : 'locked'
                    }))
                    setSteps(mappedSteps)
                } else {
                    setSteps([
                        { id: 1, title: 'Описать проблему', description: 'Чётко сформулируй проблему', status: 'current' },
                        { id: 2, title: 'Определить аудиторию', description: 'Кто будет использовать?', status: 'locked' },
                        { id: 3, title: 'Выбрать функции', description: 'Ключевые возможности', status: 'locked' },
                        { id: 4, title: 'Выбрать стек', description: 'Технологии', status: 'locked' },
                        { id: 5, title: 'Создать план', description: 'Разбить на этапы', status: 'locked' },
                    ])
                }
            }
        } catch (error) {
            console.error('Error loading steps:', error)
        } finally {
            setLoading(false)
        }
    }

    const completeStep = async (stepId: number) => {
        const updatedSteps = steps.map(s => {
            if (s.id === stepId && s.status === 'current') {
                return { ...s, status: 'completed' as const }
            }
            if (s.id === stepId + 1 && s.status === 'locked') {
                return { ...s, status: 'current' as const }
            }
            return s
        })

        setSteps(updatedSteps)

        try {
            await updateDoc(doc(db, 'projects', projectId), {
                'roadmap': updatedSteps.map(s => ({
                    title: s.title,
                    description: s.description,
                    isCompleted: s.status === 'completed'
                }))
            })

            alert('✅ Шаг выполнен! Следующий шаг разблокирован.')
        } catch (error) {
            console.error('Error updating step:', error)
        }
    }

    if (loading) {
        return <div className="p-6">Загрузка...</div>
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-6">📋 Roadmap & Plan</h2>

            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all ${step.status === 'completed' ? 'bg-green-50 border-green-500' :
                                step.status === 'current' ? 'bg-blue-50 border-blue-500 shadow-lg' :
                                    'bg-gray-100 border-gray-300 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg">{step.id}.</span>
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {step.status === 'current' && (
                                    <button
                                        onClick={() => completeStep(step.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                    >
                                        ✓ Выполнено
                                    </button>
                                )}

                                {step.status === 'completed' && (
                                    <span className="text-green-500 text-3xl">✓</span>
                                )}

                                {step.status === 'locked' && (
                                    <span className="text-gray-400 text-3xl">🔒</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>AI Mode:</strong> Mentor / Planner
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    💡 Выполняй шаги по порядку. Каждый следующий шаг откроется автоматически!
                </p>
            </div>
        </div>
    )
}
