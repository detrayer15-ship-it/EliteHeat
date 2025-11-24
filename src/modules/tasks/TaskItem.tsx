import { Task } from '@/types/project'
import { Chip } from '@/components/ui/Chip'
import { formatDate, isOverdue } from '@/utils/date'

interface TaskItemProps {
    task: Task
    onToggle: () => void
    onDelete: () => void
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    const overdue = task.deadline && !task.completed && isOverdue(task.deadline)

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border transition-smooth ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
            }`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={onToggle}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />

            <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-text'}`}>
                    {task.title}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    {task.category && <Chip label={task.category} />}
                    {task.deadline && (
                        <span className={`text-xs ${overdue ? 'text-error font-medium' : 'text-gray-500'}`}>
                            {formatDate(task.deadline)}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={onDelete}
                className="text-gray-400 hover:text-error transition-smooth p-1"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}
