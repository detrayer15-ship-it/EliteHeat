import { ProjectStage } from '@/types/project'

interface ProgressTrackerProps {
    currentStage: ProjectStage
}

const stages: { key: ProjectStage; label: string }[] = [
    { key: 'idea', label: 'Идея' },
    { key: 'prototype', label: 'Прототип' },
    { key: 'presentation', label: 'Презентация' },
]

export const ProgressTracker = ({ currentStage }: ProgressTrackerProps) => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage)

    return (
        <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
                const isActive = index === currentIndex
                const isCompleted = index < currentIndex

                return (
                    <div key={stage.key} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${isActive
                                        ? 'bg-primary text-white'
                                        : isCompleted
                                            ? 'bg-success text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-gray-500'
                                    }`}
                            >
                                {stage.label}
                            </span>
                        </div>
                        {index < stages.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 transition-smooth ${isCompleted ? 'bg-success' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
