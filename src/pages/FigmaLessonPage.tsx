import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TaskComments } from '@/components/TaskComments'
import { ArrowLeft, Video, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'


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
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

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

        // Загружаем локальный прогресс шагов
        const stepsProgress = JSON.parse(localStorage.getItem(`figma_steps_${lessonId}`) || '[]')
        setCompletedSteps(stepsProgress)
    }, [lessonId])

    const toggleStep = (index: number) => {
        const newSteps = completedSteps.includes(index)
            ? completedSteps.filter(i => i !== index)
            : [...completedSteps, index]

        setCompletedSteps(newSteps)
        localStorage.setItem(`figma_steps_${lessonId}`, JSON.stringify(newSteps))
    }

    const progress = task?.steps.length ? Math.round((completedSteps.length / task.steps.length) * 100) : 0

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

                {/* Progress Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="md:col-span-3 p-8 bg-white/80 backdrop-blur-xl border-2 border-purple-100 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">Ваш прогресс</h3>
                                <div className="text-4xl font-black text-gray-900 leading-none">{progress}%</div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-gray-500">{completedSteps.length} из {task.steps.length} шагов пройдены</span>
                            </div>
                        </div>
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 50 }}
                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            />
                        </div>
                        {progress === 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 font-bold"
                            >
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Задание полностью готово к отправке!
                            </motion.div>
                        )}
                    </Card>
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
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            Шаги выполнения
                        </h2>
                        <div className="space-y-3">
                            {task.steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    onClick={() => toggleStep(index)}
                                    className={`flex gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group ${completedSteps.includes(index)
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-transparent hover:border-purple-200 hover:bg-purple-50'
                                        }`}
                                >
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${completedSteps.includes(index)
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                                        }`}>
                                        {completedSteps.includes(index) ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                    </span>
                                    <span className={`flex-1 pt-1 transition-all ${completedSteps.includes(index) ? 'text-gray-400 line-through' : 'text-gray-700'
                                        }`}>
                                        {step}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
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
