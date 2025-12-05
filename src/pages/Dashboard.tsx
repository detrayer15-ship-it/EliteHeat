import { useProjectStore } from '@/store/projectStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()

    const stats = {
        total: projects.length,
        inProgress: projects.filter((p) => p.stage !== 'completed').length,
        completed: projects.filter((p) => p.stage === 'completed').length,
    }

    const recentProjects = projects.slice(-3).reverse()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">Добро пожаловать в EliteHeat</h1>
                <p className="text-gray-600">Превращайте идеи в реальные проекты</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{stats.total}</div>
                        <div className="text-gray-600">Всего проектов</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{stats.inProgress}</div>
                        <div className="text-gray-600">В работе</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-success mb-2">{stats.completed}</div>
                        <div className="text-gray-600">Завершено</div>
                    </div>
                </Card>
            </div>

            {recentProjects.length > 0 && (
                <Card>
                    <h2 className="text-xl font-bold text-text mb-4">Последние проекты</h2>
                    <div className="space-y-3">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-smooth"
                                onClick={() => {
                                    if (project.externalUrl) {
                                        window.open(project.externalUrl, '_blank')
                                    }
                                }}
                            >
                                <div>
                                    <h3 className="font-semibold text-text">{project.title}</h3>
                                    <p className="text-sm text-gray-600">{project.tasks.length} задач · {project.progress}%</p>
                                </div>
                                <Button variant="ghost" size="sm">→</Button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <h2 className="text-xl font-bold text-text mb-4">Быстрые действия</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button onClick={() => navigate('/projects')}>
                        📁 Мои проекты
                    </Button>
                    <Button onClick={() => navigate('/tasks')}>
                        ✓ Курсы
                    </Button>
                    <Button onClick={() => navigate('/progress')}>
                        📊 Трекер Прогресса
                    </Button>
                    <Button onClick={() => navigate('/ai-assistant')}>
                        🤖 AI Помощник
                    </Button>
                    <Button onClick={() => navigate('/analyzer')}>
                        📈 Анализ презентаций
                    </Button>
                </div>
            </Card>
        </div>
    )
}
