import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { RobotProject } from '@/types/robotProject'

export const RobotProjectsPage = () => {
    const [projects, setProjects] = useState<RobotProject[]>([])
    const [selectedProject, setSelectedProject] = useState<RobotProject | null>(null)
    const [filter, setFilter] = useState<'all' | 'mini' | 'extended' | 'game'>('all')
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetch('/data/robot_projects.json')
            .then((res) => res.json())
            .then((data) => setProjects(data))
    }, [])

    const filteredProjects = projects.filter((project) =>
        filter === 'all' ? true : project.category === filter
    )

    const categoryLabels = {
        mini: 'Мини-проекты',
        extended: 'Проекты с расширением',
        game: 'Игровые проекты',
    }

    const categoryColors = {
        mini: 'success',
        extended: 'warning',
        game: 'error',
    } as const

    const difficultyLabels = {
        beginner: 'Начальный',
        intermediate: 'Средний',
        advanced: 'Продвинутый',
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text mb-2">🤖 Роботы проектов</h1>
                <p className="text-gray-600">
                    Создавай уникальные проекты с кастомизацией и расширениями
                </p>
            </div>

            <div className="flex gap-2 mb-6">
                <Button
                    variant={filter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Все ({projects.length})
                </Button>
                <Button
                    variant={filter === 'mini' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('mini')}
                >
                    Мини-проекты ({projects.filter(p => p.category === 'mini').length})
                </Button>
                <Button
                    variant={filter === 'extended' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('extended')}
                >
                    С расширением ({projects.filter(p => p.category === 'extended').length})
                </Button>
                <Button
                    variant={filter === 'game' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('game')}
                >
                    Игровые ({projects.filter(p => p.category === 'game').length})
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <Card
                        key={project.id}
                        hover
                        onClick={() => {
                            setSelectedProject(project)
                            setShowModal(true)
                        }}
                    >
                        <div className="text-5xl mb-3">{project.icon}</div>
                        <h3 className="text-xl font-bold text-text mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                        <div className="flex gap-2 flex-wrap">
                            <Badge variant={categoryColors[project.category]}>
                                {categoryLabels[project.category]}
                            </Badge>
                            <Badge variant="default">
                                {difficultyLabels[project.difficulty]}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedProject && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={selectedProject.title}
                >
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="text-6xl mb-3">{selectedProject.icon}</div>
                            <p className="text-gray-600">{selectedProject.description}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-text mb-2">📋 Базовое задание</h3>
                            <p className="text-gray-700">{selectedProject.baseTask}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-text mb-3">🎨 Варианты кастомизации</h3>
                            <ul className="space-y-2">
                                {selectedProject.customizationOptions.map((option, index) => (
                                    <li key={index} className="flex gap-2 text-gray-700">
                                        <span className="text-primary">•</span>
                                        <span>{option}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-text mb-3">💡 Идеи для расширения</h3>
                            <ul className="space-y-2">
                                {selectedProject.extensionIdeas.map((idea, index) => (
                                    <li key={index} className="flex gap-2 text-gray-700">
                                        <span className="text-success">✓</span>
                                        <span>{idea}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <Button className="w-full" onClick={() => setShowModal(false)}>
                                Начать проект
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                Выбери свои варианты кастомизации и создай уникальный проект!
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
