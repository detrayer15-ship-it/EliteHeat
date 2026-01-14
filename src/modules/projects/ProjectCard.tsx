import { Project } from '@/types/project'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/date'
import { useProjectStore } from '@/store/projectStore'
import {
    ExternalLink,
    Trash2,
    CheckCircle,
    RotateCcw,
    Calendar,
    Layers,
    ArrowUpRight
} from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

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
            updateProject(project.id, { stage: 'prototype' })
        } else {
            if (confirm(`Отметить проект "${project.title}" как завершённый?`)) {
                updateProject(project.id, { stage: 'completed', progress: 100 })
            }
        }
    }

    const isCompleted = project.stage === 'completed'

    return (
        <div className="perspective-1000 group">
            <Card
                onClick={onClick}
                className={`
                    relative cursor-pointer overflow-hidden transition-all duration-700 transform-3d
                    group-hover:rotate-x-2 group-hover:rotate-y-[-5deg] group-hover:scale-[1.03]
                    ${isCompleted
                        ? 'border-green-400/50 bg-green-50/30'
                        : 'border-indigo-100/50 glass-card'
                    }
                    p-0 border-[1px] shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20
                `}
            >
                {/* Holographic Flash Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 z-20"></div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>

                {/* Card Content Shell */}
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {project.stage || 'In Development'}
                                </div>
                                {isCompleted && (
                                    <div className="animate-bounce-subtle">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-black text-indigo-950 truncate group-hover:text-indigo-600 transition-colors">
                                {project.title}
                            </h3>
                        </div>

                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="p-2.5 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all transform hover:rotate-12 active:scale-95 z-30"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-indigo-900/60 line-clamp-2 min-h-[40px] leading-relaxed">
                        {project.description || 'Нет описания для этого проекта. Начните работу с Митой, чтобы спланировать его.'}
                    </p>

                    {/* Progress Engine */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-1.5">
                                <Layers className="w-3 h-3" />
                                Completion
                            </span>
                            <span className="text-sm font-black text-indigo-950">
                                <AnimatedCounter end={project.progress} suffix="%" />
                            </span>
                        </div>
                        <div className="h-2.5 w-full bg-indigo-50 rounded-full overflow-hidden border border-indigo-100/50 p-[2px]">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative overflow-hidden ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                                    }`}
                                style={{ width: `${project.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-6 border-t border-indigo-50/50">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">{formatDate(project.updatedAt)}</span>
                        </div>

                        <div className="flex gap-2">
                            {project.externalUrl && (
                                <button
                                    onClick={handleOpenIDE}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 z-30 shadow-sm"
                                    title="Open IDE"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={handleCompleteProject}
                                className={`p-2 rounded-lg transition-all transform hover:-translate-y-1 active:scale-95 z-30 shadow-sm ${isCompleted
                                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                    }`}
                                title={isCompleted ? "Return to work" : "Complete Project"}
                            >
                                {isCompleted ? <RotateCcw className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Hover Detail Overlay (Partial) */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                            Подробнее <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </Card>

            <style>{`
                .transform-3d {
                    transform-style: preserve-3d;
                }
                .rotate-x-2 {
                    transform: perspective(1000px) rotateX(2deg);
                }
                .rotate-y-5 {
                    transform: perspective(1000px) rotateY(-5deg);
                }
            `}</style>
        </div>
    )
}
