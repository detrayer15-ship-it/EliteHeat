import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'

export const AssignmentDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const projects = useProjectStore((state) => state.projects)
    const toggleTask = useTaskStore((state) => state.toggleTask)
    const [answer, setAnswer] = useState('')

    // Находим задание по ID
    const taskData = projects
        .flatMap((p) => p.tasks.map((t) => ({ ...t, projectTitle: p.title, projectId: p.id, projectCreatedAt: p.createdAt })))
        .find((t) => t.id === id)

    const assignment = taskData

    useEffect(() => {
        if (assignment) {
            setAnswer((assignment as any).answer || '')
        }
    }, [assignment])

    if (!assignment) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-text mb-4">Задание не найдено</h2>
                <Button onClick={() => navigate('/progress')}>← Вернуться к заданиям</Button>
            </div>
        )
    }

    const handleSave = () => {
        // Логика сохранения ответа будет добавлена позже
        console.log('Save answer:', answer)
    }

    const handleToggleComplete = () => {
        if (id) {
            toggleTask(id)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/progress')}>
                    ← Все задания
                </Button>
                <Badge variant={assignment.completed ? 'success' : 'default'}>
                    {assignment.completed ? 'Выполнено' : 'В работе'}
                </Badge>
            </div>

            {/* Assignment Info */}
            <Card>
                <div className="flex items-start gap-4 mb-6">
                    <div className="text-5xl">📝</div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-text mb-2">{assignment.title}</h1>
                        <p className="text-gray-600 mb-2">Проект: {assignment.projectTitle}</p>
                        {assignment.category && (
                            <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                                {assignment.category}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-bold text-text mb-3">📋 Описание задания</h2>
                        <Card className="bg-gray-50">
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {assignment.title}
                            </p>
                        </Card>
                    </div>

                    {/* Answer Field */}
                    <div>
                        <h2 className="text-xl font-bold text-text mb-3">✍️ Ваш ответ</h2>
                        <Textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Введите ваш ответ или заметки по выполнению задания..."
                            rows={8}
                            className="font-mono"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSave} variant="secondary">
                            💾 Сохранить ответ
                        </Button>
                        <Button
                            onClick={handleToggleComplete}
                            variant={assignment.completed ? 'secondary' : 'primary'}
                        >
                            {assignment.completed ? '↩️ Вернуть в работу' : '✓ Отметить как выполнено'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <h3 className="font-semibold text-text mb-1">Создано</h3>
                        <p className="text-sm text-gray-600">
                            {new Date(assignment.projectCreatedAt || '').toLocaleDateString('ru-RU')}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🏷️</div>
                        <h3 className="font-semibold text-text mb-1">Категория</h3>
                        <p className="text-sm text-gray-600">{assignment.category || 'Без категории'}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">
                            {assignment.completed ? '✅' : '⏳'}
                        </div>
                        <h3 className="font-semibold text-text mb-1">Статус</h3>
                        <p className="text-sm text-gray-600">
                            {assignment.completed ? 'Завершено' : 'В процессе'}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
