import { Project } from '@/types/project'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/date'
import { useProjectStore } from '@/store/projectStore'

interface ProjectCardProps {
    project: Project
    onClick: () => void
    onDelete?: (id: string) => void
}

export const ProjectCard = ({ project, onClick, onDelete }: ProjectCardProps) => {
    const updateProject = useProjectStore((state) => state.updateProject)

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm(`Удалить проект "${project.title}"?`)) {
            onDelete?.(project.id)
        }
    }

    const handleOpenIDE = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (project.externalUrl) {
            window.open(project.externalUrl, '_blank')
        }
    }

    const handleCompleteProject = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (project.stage === 'completed') {
            // Если проект уже завершён, вернуть в работу
            updateProject(project.id, { stage: 'prototype' })
        } else {
            // Завершить проект
            if (confirm(`Отметить проект "${project.title}" как завершённый?`)) {
                updateProject(project.id, { stage: 'completed', progress: 100 })
            }
        }
    }

    const isCompleted = project.stage === 'completed'

    return (
        <Card
            hover
            onClick={onClick}
            className={`relative group cursor-pointer ${isCompleted ? 'border-success border-2 bg-success/5' : ''}`}
        >
            {/* Completed Badge */}
            {isCompleted && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-success text-white rounded-full text-xs font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Завершён
                    </div>
                </div>
            )}

            {/* Delete Button */}
            {onDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth p-2 hover:bg-error/10 rounded-lg z-10"
                    title="Удалить проект"
                >
                    <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}

            <div className={`mb-3 ${isCompleted ? 'pr-8 pl-24' : 'pr-8'}`}>
                <h3 className="text-lg font-semibold text-text line-clamp-1">{project.title}</h3>
            </div>

            {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            )}

            <ProgressBar value={project.progress} className="mb-3" />

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>📊 Прогресс: {project.progress}%</span>
                <span>🕒 {formatDate(project.updatedAt)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
                {/* Complete/Uncomplete Button */}
                <Button
                    variant={isCompleted ? "secondary" : "primary"}
                    size="sm"
                    className="w-full"
                    onClick={handleCompleteProject}
                >
                    {isCompleted ? (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Вернуть в работу
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Завершить проект
                        </>
                    )}
                </Button>

                {/* IDE Link Button */}
                {project.externalUrl && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={handleOpenIDE}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Открыть в IDE
                    </Button>
                )}
            </div>
        </Card>
    )
}
