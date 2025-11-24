import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const ProgressTrackerPage = () => {
    const projects = useProjectStore((state) => state.projects)
    const tasks = useTaskStore((state) => state.tasks)
    const navigate = useNavigate()

    // Навыки
    const [skills] = useState([
        { name: 'Python', level: 75, icon: '🐍' },
        { name: 'Figma', level: 60, icon: '🎨' },
        { name: 'Работа с данными', level: 55, icon: '📊' },
    ])

    // Статистика
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.stage === 'presentation').length
    const inProgressProjects = totalProjects - completedProjects

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length

    // Задачи с дедлайнами
    const tasksWithDeadlines = tasks.filter(t => t.deadline && !t.completed)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdueTasks = tasksWithDeadlines.filter(t => {
        const deadline = new Date(t.deadline!)
        deadline.setHours(0, 0, 0, 0)
        return deadline < today
    })

    const upcomingTasks = tasksWithDeadlines.filter(t => {
        const deadline = new Date(t.deadline!)
        deadline.setHours(0, 0, 0, 0)
        const threeDaysFromNow = new Date(today)
        threeDaysFromNow.setDate(today.getDate() + 3)
        return deadline >= today && deadline <= threeDaysFromNow
    })

    const getProjectById = (projectId: string) => {
        return projects.find(p => p.id === projectId)
    }

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline)
        const diffTime = date.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) {
            return `Просрочено на ${Math.abs(diffDays)} дн.`
        } else if (diffDays === 0) {
            return 'Сегодня'
        } else if (diffDays === 1) {
            return 'Завтра'
        } else {
            return `Через ${diffDays} дн.`
        }
    }

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const getSkillLevel = (level: number) => {
        if (level >= 80) return { text: 'Эксперт', color: 'text-success' }
        if (level >= 60) return { text: 'Продвинутый', color: 'text-ai-blue' }
        if (level >= 40) return { text: 'Средний', color: 'text-warning' }
        return { text: 'Начинающий', color: 'text-gray-500' }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">📊 Трекер Прогресса</h1>
                <p className="text-gray-600">Отслеживайте свой прогресс и дедлайны</p>
            </div>

            {/* Общая статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{totalProjects}</div>
                        <div className="text-sm text-gray-600">Всего проектов</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-ai-blue mb-2">{inProgressProjects}</div>
                        <div className="text-sm text-gray-600">В работе</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-success mb-2">{completedTasks}</div>
                        <div className="text-sm text-gray-600">Задач выполнено</div>
                    </div>
                </Card>
            </div>

            {/* Общий прогресс */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">Общий прогресс</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Выполнено задач</span>
                        <span className="font-semibold text-text">{completedTasks} из {totalTasks}</span>
                    </div>
                    <ProgressBar value={overallProgress} />
                    <div className="text-center text-2xl font-bold text-primary">{overallProgress}%</div>
                </div>
            </Card>

            {/* Просроченные задачи */}
            {overdueTasks.length > 0 && (
                <Card className="border-error border-2">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⚠️</span>
                        <h2 className="text-xl font-bold text-error">Просроченные задачи ({overdueTasks.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {overdueTasks.map((task) => {
                            const project = getProjectById(task.projectId)
                            return (
                                <div
                                    key={task.id}
                                    className="p-4 bg-error/5 border border-error/20 rounded-lg cursor-pointer hover:bg-error/10 transition-smooth"
                                    onClick={() => navigate(`/projects/${task.projectId}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text mb-1">{task.title}</h3>
                                            <p className="text-sm text-gray-600">Проект: {project?.title}</p>
                                        </div>
                                        <Badge variant="default" className="bg-error text-white">
                                            {formatDeadline(task.deadline!)}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            )}

            {/* Ближайшие дедлайны */}
            {upcomingTasks.length > 0 && (
                <Card className="border-warning border-2">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⏰</span>
                        <h2 className="text-xl font-bold text-warning">Ближайшие дедлайны ({upcomingTasks.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => {
                            const project = getProjectById(task.projectId)
                            return (
                                <div
                                    key={task.id}
                                    className="p-4 bg-warning/5 border border-warning/20 rounded-lg cursor-pointer hover:bg-warning/10 transition-smooth"
                                    onClick={() => navigate(`/projects/${task.projectId}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text mb-1">{task.title}</h3>
                                            <p className="text-sm text-gray-600">Проект: {project?.title}</p>
                                        </div>
                                        <Badge variant="warning">
                                            {formatDeadline(task.deadline!)}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            )}

            {/* Навыки */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">⭐ Мои навыки</h2>
                <div className="space-y-4">
                    {skills.map((skill, index) => {
                        const levelInfo = getSkillLevel(skill.level)
                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{skill.icon}</span>
                                        <span className="font-semibold text-text">{skill.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${levelInfo.color}`}>
                                            {levelInfo.text}
                                        </span>
                                        <span className="text-sm text-gray-600">{skill.level}%</span>
                                    </div>
                                </div>
                                <ProgressBar value={skill.level} />
                            </div>
                        )
                    })}
                </div>
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-gray-600">
                        💡 <strong>Совет:</strong> Продолжайте выполнять проекты и задачи, чтобы повысить свои навыки!
                    </p>
                </div>
            </Card>

            {/* Прогресс по проектам */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">Прогресс по проектам</h2>
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-smooth"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-text">{project.title}</h3>
                                    <span className="text-sm text-gray-600">{project.progress}%</span>
                                </div>
                                <ProgressBar value={project.progress} />
                                <div className="mt-2 text-sm text-gray-600">
                                    {project.tasks.filter(t => t.completed).length} из {project.tasks.length} задач выполнено
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        <div className="text-5xl mb-3">📊</div>
                        <p>Нет проектов для отслеживания</p>
                        <p className="text-sm mt-1">Создайте свой первый проект</p>
                    </div>
                )}
            </Card>

            {/* Напоминания */}
            {overdueTasks.length === 0 && upcomingTasks.length === 0 && (
                <Card className="bg-success/5 border-success/20">
                    <div className="text-center py-6">
                        <div className="text-5xl mb-3">✅</div>
                        <h3 className="text-xl font-bold text-success mb-2">Отличная работа!</h3>
                        <p className="text-gray-600">У вас нет просроченных задач и ближайших дедлайнов</p>
                    </div>
                </Card>
            )}
        </div>
    )
}
