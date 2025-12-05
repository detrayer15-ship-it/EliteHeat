import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AssignmentCard } from '@/modules/assignments/AssignmentCard'
import { AssignmentForm } from '@/modules/assignments/AssignmentForm'
import { Assignment } from '@/types/assignment'
import { generateId } from '@/utils/uuid'

type FilterType = 'all' | 'active' | 'completed'

export const ProjectProgressPage = () => {
    const navigate = useNavigate()
    const projects = useProjectStore((state) => state.projects)
    const [filter, setFilter] = useState<FilterType>('all')
    const [showForm, setShowForm] = useState(false)
    const [selectedProject, setSelectedProject] = useState<string | null>(null)

    // Собираем все задания из всех проектов
    const allAssignments = useMemo(() => {
        const assignments: Assignment[] = []
        projects.forEach((project) => {
            project.tasks.forEach((task) => {
                assignments.push({
                    id: task.id,
                    projectId: project.id,
                    title: task.title,
                    description: `Проект: ${project.title}`,
                    completed: task.completed,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    category: task.category,
                    icon: '📝',
                })
            })
        })
        return assignments
    }, [projects])

    const filteredAssignments = useMemo(() => {
        switch (filter) {
            case 'active':
                return allAssignments.filter((a) => !a.completed)
            case 'completed':
                return allAssignments.filter((a) => a.completed)
            default:
                return allAssignments
        }
    }, [allAssignments, filter])

    const stats = useMemo(() => {
        const total = allAssignments.length
        const completed = allAssignments.filter((a) => a.completed).length
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0
        return { total, completed, progress }
    }, [allAssignments])

    const handleCreateAssignment = (data: Partial<Assignment>) => {
        // Логика создания будет добавлена позже
        console.log('Create assignment:', data)
        setShowForm(false)
    }

    const handleAssignmentClick = (assignment: Assignment) => {
        navigate(`/progress/${assignment.id}`)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">Курсы</h1>
                <p className="text-gray-600">Образовательные курсы и задания для развития навыков</p>
            </div>

            {/* Progress Bar */}
            <Card>
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-text">Общий прогресс</h2>
                        <span className="text-sm font-semibold text-primary">
                            {stats.progress}%
                        </span>
                    </div>
                    <ProgressBar progress={stats.progress} />
                    <p className="text-sm text-gray-600 mt-2">
                        Выполнено {stats.completed} из {stats.total}
                    </p>
                </div>
            </Card>

            {/* Filters */}
            <Card>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('all')}
                        >
                            Все ({allAssignments.length})
                        </Button>
                        <Button
                            variant={filter === 'active' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('active')}
                        >
                            Не выполнено ({allAssignments.filter((a) => !a.completed).length})
                        </Button>
                        <Button
                            variant={filter === 'completed' ? 'primary' : 'secondary'}
                            onClick={() => setFilter('completed')}
                        >
                            Выполнено ({allAssignments.filter((a) => a.completed).length})
                        </Button>
                    </div>
                    <Button onClick={() => setShowForm(true)}>+ Новое задание</Button>
                </div>
            </Card>

            {/* Assignments List */}
            {filteredAssignments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredAssignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            onClick={() => handleAssignmentClick(assignment)}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-text mb-2">Заданий пока нет</h3>
                        <p className="text-gray-600 mb-4">
                            {filter === 'all'
                                ? 'Создайте первое задание для начала работы'
                                : `Нет заданий в категории "${filter === 'active' ? 'Не выполнено' : 'Выполнено'
                                }"`}
                        </p>
                        {filter === 'all' && (
                            <Button onClick={() => setShowForm(true)}>+ Добавить задание</Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Create Assignment Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Новое задание">
                <AssignmentForm
                    projectId={selectedProject || projects[0]?.id || ''}
                    onSubmit={handleCreateAssignment}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </div>
    )
}
