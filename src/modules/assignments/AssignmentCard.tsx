import { Assignment } from '@/types/assignment'

interface AssignmentCardProps {
    assignment: Assignment
    onClick: () => void
}

export const AssignmentCard = ({ assignment, onClick }: AssignmentCardProps) => {
    const getStatusColor = () => {
        return assignment.completed ? 'bg-success/10 border-success/30' : 'bg-gray-50 border-gray-200'
    }

    const getStatusIcon = () => {
        return assignment.completed ? '✓' : '○'
    }

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg border ${getStatusColor()} hover:shadow-md transition-smooth cursor-pointer`}
        >
            <div className="flex items-start gap-3">
                <div className="text-3xl">{assignment.icon || '📝'}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text">{assignment.title}</h3>
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${assignment.completed
                                    ? 'bg-success text-white'
                                    : 'bg-gray-300 text-gray-600'
                                }`}
                        >
                            {getStatusIcon()}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {assignment.description}
                    </p>
                    {assignment.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                            {assignment.category}
                        </span>
                    )}
                </div>
                <div className="text-gray-400 hover:text-primary transition-smooth">
                    →
                </div>
            </div>
        </div>
    )
}
