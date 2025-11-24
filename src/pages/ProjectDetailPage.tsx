import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { TaskList } from '@/modules/tasks/TaskList'
import { TaskForm } from '@/modules/tasks/TaskForm'
import { ProgressTracker } from '@/modules/tasks/ProgressTracker'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const ProjectDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const project = useProjectStore((state) =>
        state.projects.find((p) => p.id === id)
    )
    const updateProject = useProjectStore((state) => state.updateProject)
    const deleteProject = useProjectStore((state) => state.deleteProject)
    const updateProgress = useProjectStore((state) => state.updateProgress)

    const tasks = useTaskStore((state) => state.tasks.filter((t) => t.projectId === id))
    const createTask = useTaskStore((state) => state.createTask)
    const toggleTask = useTaskStore((state) => state.toggleTask)
    const deleteTask = useTaskStore((state) => state.deleteTask)

    const [isEditing, setIsEditing] = useState(false)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        problem: '',
        solution: '',
        audience: '',
    })

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                problem: project.problem,
                solution: project.solution,
                audience: project.audience,
            })
        }
    }, [project])

    useEffect(() => {
        if (id) {
            updateProgress(id)
        }
    }, [tasks, id, updateProgress])

    if (!project) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-text mb-4">Проект не найден</h2>
                <Button onClick={() => navigate('/projects')}>← Вернуться к проектам</Button>
            </div>
        )
    }

    const handleSave = () => {
        if (id) {
            updateProject(id, formData)
            setIsEditing(false)
        }
    }

    const handleDelete = () => {
        if (id && confirm(`Удалить проект "${project.title}"? Это действие нельзя отменить.`)) {
            deleteProject(id)
            navigate('/projects')
        }
    }

    const handleTaskCreate = (data: any) => {
        createTask(data)
        setShowTaskForm(false)
    }

    const completedTasks = tasks.filter(t => t.completed).length
    const activeTasks = tasks.filter(t => !t.completed).length
    const overdueTasks = tasks.filter(t => !t.completed && t.deadline && new Date(t.deadline) < new Date()).length

    const stageLabels = {
        idea: 'Идея',
        prototype: 'Прототип',
        presentation: 'Презентация',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/projects')}>
                    ← Все проекты
                </Button>
                <div className="flex gap-2">
                    {project.externalUrl && (
                        <Button
                            variant="primary"
                            onClick={() => window.open(project.externalUrl, '_blank')}
                        >
                            🔗 Открыть в IDE
                        </Button>
                    )}
                    {!isEditing && (
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>
                            ✏️ Редактировать
                        </Button>
                    )}
                    <Button variant="ghost" onClick={handleDelete} className="text-error hover:bg-error/10">
                        🗑️ Удалить
                    </Button>
                </div>
            </div>

            {/* Project Header */}
            <Card>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-text mb-2">{project.title}</h1>
                        <p className="text-gray-600">{project.description}</p>
                    </div>
                    <Badge variant={project.stage === 'presentation' ? 'success' : project.stage === 'prototype' ? 'warning' : 'default'}>
                        {stageLabels[project.stage]}
                    </Badge>
                </div>

                {/* Project Visual */}
                <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-ai-blue/10 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                                🎯
                            </div>
                            <div>
                                <h3 className="font-semibold text-text">Цель</h3>
                                <p className="text-sm text-gray-600">Решение проблемы</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-ai-blue/20 flex items-center justify-center text-3xl">
                                👥
                            </div>
                            <div>
                                <h3 className="font-semibold text-text">Аудитория</h3>
                                <p className="text-sm text-gray-600">{project.audience || 'Не указана'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-3xl">
                                ⚡
                            </div>
                            <div>
                                <h3 className="font-semibold text-text">Прогресс</h3>
                                <p className="text-sm text-gray-600">{project.progress}% завершено</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ProgressTracker currentStage={project.stage} />
            </Card>

            {/* Timeline */}
            <Card>
                <h2 className="text-2xl font-bold text-text mb-4">📅 Временная шкала</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white font-bold">
                            ✓
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-text">Проект создан</h3>
                            <p className="text-sm text-gray-600">{new Date(project.createdAt).toLocaleDateString('ru-RU')}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {tasks.length}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-text">Задачи добавлены</h3>
                            <p className="text-sm text-gray-600">{tasks.length} задач для выполнения</p>
                        </div>
                    </div>
                    {completedTasks > 0 && (
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-ai-blue flex items-center justify-center text-white font-bold">
                                {completedTasks}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-text">Задачи выполнены</h3>
                                <p className="text-sm text-gray-600">{completedTasks} из {tasks.length} завершено</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{tasks.length}</div>
                        <div className="text-sm text-gray-600">Всего задач</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-ai-blue mb-1">{activeTasks}</div>
                        <div className="text-sm text-gray-600">Активных</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-success mb-1">{completedTasks}</div>
                        <div className="text-sm text-gray-600">Завершено</div>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-error mb-1">{overdueTasks}</div>
                        <div className="text-sm text-gray-600">Просрочено</div>
                    </div>
                </Card>
            </div>

            {/* Resources & Tools */}
            <Card>
                <h2 className="text-2xl font-bold text-text mb-4">🛠️ Ресурсы и инструменты</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">📐</div>
                        <h3 className="font-semibold text-text text-sm">Фреймы</h3>
                        <p className="text-xs text-gray-600">Холсты для экранов</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">📚</div>
                        <h3 className="font-semibold text-text text-sm">Слои</h3>
                        <p className="text-xs text-gray-600">Управление элементами</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">⚙️</div>
                        <h3 className="font-semibold text-text text-sm">Свойства</h3>
                        <p className="text-xs text-gray-600">Параметры объектов</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">✏️</div>
                        <h3 className="font-semibold text-text text-sm">Рисование</h3>
                        <p className="text-xs text-gray-600">Формы и линии</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">🧩</div>
                        <h3 className="font-semibold text-text text-sm">Компоненты</h3>
                        <p className="text-xs text-gray-600">Повторные элементы</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">🔗</div>
                        <h3 className="font-semibold text-text text-sm">Прототипы</h3>
                        <p className="text-xs text-gray-600">Интерактивные связи</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">🎨</div>
                        <h3 className="font-semibold text-text text-sm">Палитра</h3>
                        <p className="text-xs text-gray-600">Цвета проекта</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200 hover:shadow-md transition-smooth cursor-pointer">
                        <div className="text-3xl mb-2">📝</div>
                        <h3 className="font-semibold text-text text-sm">Заметки</h3>
                        <p className="text-xs text-gray-600">Идеи и комментарии</p>
                    </div>
                </div>
            </Card>

            {/* Project Information */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-text">Информация о проекте</h2>
                    {isEditing && (
                        <div className="flex gap-2">
                            <Button onClick={handleSave}>💾 Сохранить</Button>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>Отмена</Button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <Input
                            label="Название"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Textarea
                            label="Описание"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                        <Textarea
                            label="Проблема"
                            value={formData.problem}
                            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                            rows={3}
                        />
                        <Textarea
                            label="Решение"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            rows={3}
                        />
                        <Textarea
                            label="Целевая аудитория"
                            value={formData.audience}
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                            rows={2}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {project.problem && (
                            <div>
                                <h3 className="font-semibold text-text mb-2">🎯 Проблема</h3>
                                <p className="text-gray-600">{project.problem}</p>
                            </div>
                        )}
                        {project.solution && (
                            <div>
                                <h3 className="font-semibold text-text mb-2">💡 Решение</h3>
                                <p className="text-gray-600">{project.solution}</p>
                            </div>
                        )}
                        {project.audience && (
                            <div>
                                <h3 className="font-semibold text-text mb-2">👥 Целевая аудитория</h3>
                                <p className="text-gray-600">{project.audience}</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Tasks */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-text">Задачи проекта</h2>
                    <Button onClick={() => setShowTaskForm(!showTaskForm)}>
                        {showTaskForm ? '✖ Отмена' : '+ Добавить задачу'}
                    </Button>
                </div>

                {showTaskForm && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <TaskForm
                            projectId={id!}
                            onSubmit={handleTaskCreate}
                            onCancel={() => setShowTaskForm(false)}
                        />
                    </div>
                )}

                {tasks.length > 0 ? (
                    <TaskList
                        tasks={tasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        <div className="text-5xl mb-3">📝</div>
                        <p>Задач пока нет</p>
                        <p className="text-sm mt-1">Добавьте первую задачу для начала работы</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
