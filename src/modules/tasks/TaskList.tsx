import { useState } from 'react'
import { Task } from '@/types/project'
import { TaskItem } from './TaskItem'
import { Button } from '@/components/ui/Button'

interface TaskListProps {
    tasks: Task[]
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

type Filter = 'all' | 'active' | 'completed'

export const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
    const [filter, setFilter] = useState<Filter>('all')

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'active') return !task.completed
        if (filter === 'completed') return task.completed
        return true
    })

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Button
                    variant={filter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Все ({tasks.length})
                </Button>
                <Button
                    variant={filter === 'active' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('active')}
                >
                    Активные ({tasks.filter((t) => !t.completed).length})
                </Button>
                <Button
                    variant={filter === 'completed' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('completed')}
                >
                    Завершённые ({tasks.filter((t) => t.completed).length})
                </Button>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {filter === 'all' && 'Нет задач'}
                    {filter === 'active' && 'Нет активных задач'}
                    {filter === 'completed' && 'Нет завершённых задач'}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={() => onToggle(task.id)}
                            onDelete={() => onDelete(task.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
