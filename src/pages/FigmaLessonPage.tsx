import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TaskComments } from '@/components/TaskComments'
import { ArrowLeft, Video, CheckCircle, Clock } from 'lucide-react'

interface FigmaTask {
    id: string
    title: string
    difficulty: 'easy' | 'medium' | 'hard'
    description: string
    videoUrl: string
    steps: string[]
    completed: boolean
}

export const FigmaLessonPage = () => {
    const { lessonId } = useParams<{ lessonId: string }>()
    const navigate = useNavigate()
    const [task, setTask] = useState<FigmaTask | null>(null)
    const [answer, setAnswer] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        // Загружаем задание
        fetch('/data/figma_tasks.json')
            .then((res) => res.json())
            .then((data: FigmaTask[]) => {
                const foundTask = data.find(t => t.id === lessonId)
                setTask(foundTask || null)
            })

        // Проверяем статус
        const submitted = JSON.parse(localStorage.getItem('figma_submitted_tasks') || '[]')
        const completed = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')

        setIsSubmitted(submitted.includes(lessonId))
        setIsCompleted(completed[lessonId || ''] === true)
    }, [lessonId])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (!answer.trim() && !selectedFile) {
            alert('❌ Пожалуйста, введите ответ или загрузите скриншот')
            return
        }

        if (!task) return

        // Сохраняем отправку
        const submitted = JSON.parse(localStorage.getItem('figma_submitted_tasks') || '[]')
        if (!submitted.includes(task.id)) {
            submitted.push(task.id)
            localStorage.setItem('figma_submitted_tasks', JSON.stringify(submitted))
        }

        // Сохраняем время отправки
        const times = JSON.parse(localStorage.getItem('figma_submission_times') || '{}')
        times[task.id] = Date.now()
        localStorage.setItem('figma_submission_times', JSON.stringify(times))

        // Сохраняем ответ
        const answers = JSON.parse(localStorage.getItem('figma_answers') || '{}')
        answers[task.id] = {
            text: answer,
            file: selectedFile?.name || null,
            timestamp: Date.now()
        }
        localStorage.setItem('figma_answers', JSON.stringify(answers))

        setIsSubmitted(true)
        alert('✅ Задание отправлено на проверку!')
    }

    if (!task) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Урок не найден</h2>
                    <p className="text-gray-600 mb-4">Урок с ID "{lessonId}" не существует</p>
                    <Button onClick={() => navigate('/figma-tasks')}>
                        Вернуться к урокам
                    </Button>
                </div>
            </div>
        )
    }

    const difficultyColors = {
        easy: 'success',
        medium: 'warning',
        hard: 'error',
    } as const

    const difficultyLabels = {
        easy: 'Начальный',
        medium: 'Средний',
        hard: 'Продвинутый',
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/figma-tasks')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к урокам Figma
                </Button>

                {/* Статус */}
                <div className="mb-6">
                    {isCompleted && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <h3 className="font-bold text-green-800">Задание выполнено!</h3>
                                <p className="text-sm text-green-700">Отличная работа! Урок отмечен как пройденный</p>
                            </div>
                        </div>
                    )}
                    {isSubmitted && !isCompleted && (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-yellow-600 animate-pulse" />
                            <div>
                                <h3 className="font-bold text-yellow-800">Ожидает проверки</h3>
                                <p className="text-sm text-yellow-700">Ваше задание отправлено учителю на проверку</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Основная карточка */}
                <Card className="p-8">
                    {/* Заголовок */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Badge variant={difficultyColors[task.difficulty]}>
                                {difficultyLabels[task.difficulty]}
                            </Badge>
                            <span className="text-sm text-gray-500">Урок {task.id}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {task.title}
                        </h1>
                        <p className="text-lg text-gray-600">{task.description}</p>
                    </div>

                    {/* Видео-урок */}
                    <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                            <Video className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900">📹 Видео-урок</h2>
                        </div>
                        <a
                            href={task.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 font-medium hover:underline text-lg"
                        >
                            Открыть видео-урок →
                        </a>
                    </div>

                    {/* Шаги выполнения */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Шаги выполнения</h2>
                        <ol className="space-y-3">
                            {task.steps.map((step, index) => (
                                <li key={index} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 flex-1 pt-1">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Форма отправки */}
                    <div className="pt-8 border-t-2 border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">📤 Отправить решение</h2>

                        <div className="space-y-4">
                            {/* Текстовый ответ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ваш ответ / Описание
                                </label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                    rows={6}
                                    placeholder="Опишите, как вы выполнили задание..."
                                    disabled={isCompleted}
                                />
                            </div>

                            {/* Загрузка файла */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🖼 Загрузить скриншот дизайна
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        disabled={isCompleted}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer block">
                                        {selectedFile ? (
                                            <div>
                                                <div className="text-5xl mb-2">✅</div>
                                                <p className="text-sm text-gray-700 font-medium">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Нажмите для замены
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-5xl mb-2">🎨</div>
                                                <p className="text-sm text-gray-600">
                                                    Нажмите для загрузки скриншота
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG до 5MB
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Кнопка отправки */}
                            <Button
                                className="w-full py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                                onClick={handleSubmit}
                                disabled={isCompleted || isSubmitted}
                            >
                                {isCompleted ? '✅ Задание выполнено' : isSubmitted ? '⏳ Отправлено на проверку' : '📤 Отправить на проверку'}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                После отправки ваше решение будет проверено учителем
                            </p>
                        </div>
                    </div>

                    {/* Комментарии */}
                    <TaskComments taskId={task.id} />
                </Card>
            </div>
        </div>
    )
}
