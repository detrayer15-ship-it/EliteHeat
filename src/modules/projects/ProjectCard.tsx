import { Project } from '@/types/project'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatDate } from '@/utils/date'

interface ProjectCardProps {
    project: Project
    onClick: () => void
    onDelete?: (id: string) => void
}

export const ProjectCard = ({ project, onClick, onDelete }: ProjectCardProps) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm(`Удалить проект "${project.title}"?`)) {
            onDelete?.(project.id)
        }
    }

    return (
        <Card hover onClick={onClick} className="relative group cursor-pointer">
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

            <div className="mb-3 pr-8">
                <h3 className="text-lg font-semibold text-text line-clamp-1">{project.title}</h3>
            </div>

            {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            )}

            <ProgressBar value={project.progress} className="mb-3" />

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>📊 Прогресс: {project.progress}%</span>
                <span>🕒 {formatDate(project.updatedAt)}</span>
            </div>

            {/* IDE Link Indicator */}
            {project.externalUrl && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="font-medium">Нажмите, чтобы открыть IDE</span>
                    </div>
                </div>
            )}
        </Card>
    )
}
