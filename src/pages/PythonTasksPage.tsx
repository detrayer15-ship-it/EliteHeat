import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PythonTask } from '@/types/pythonTask'

interface TestQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
}

export const PythonTasksPage = () => {
    const [tasks, setTasks] = useState<PythonTask[]>([])
    const [selectedTask, setSelectedTask] = useState<PythonTask | null>(null)
    const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
    const [answer, setAnswer] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [submittedTasks, setSubmittedTasks] = useState<Set<string>>(
        new Set(JSON.parse(localStorage.getItem('python_submitted_tasks') || '[]'))
    )
    const [submissionTimes, setSubmissionTimes] = useState<Record<string, number>>(
        JSON.parse(localStorage.getItem('python_submission_times') || '{}')
    )

    // Test state
    const [showTest, setShowTest] = useState(false)
    const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<number[]>([])
    const [testCompleted, setTestCompleted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        fetch('/data/python_tasks.json')
            .then((res) => res.json())
            .then((data) => setTasks(data))

        fetch('/data/python_test.json')
            .then((res) => res.json())
            .then((data) => setTestQuestions(data))

        // Проверяем автоматическое принятие заданий каждую минуту
        const interval = setInterval(() => {
            checkAutoApproval()
        }, 60000) // Каждую минуту

        // Проверяем сразу при загрузке
        checkAutoApproval()

        return () => clearInterval(interval)
    }, [])

    const checkAutoApproval = () => {
        const now = Date.now()
        const oneHour = 60 * 60 * 1000 // 1 час в миллисекундах
        const progress = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')
        const times = JSON.parse(localStorage.getItem('python_submission_times') || '{}')
        let updated = false

        Object.keys(times).forEach((taskId) => {
            const submissionTime = times[taskId]
            const timePassed = now - submissionTime

            // Если прошёл 1 час и задание ещё не принято
            if (timePassed >= oneHour && !progress[taskId]) {
                progress[taskId] = true
                updated = true
            }
        })

        if (updated) {
            localStorage.setItem('python_lessons_progress', JSON.stringify(progress))
            // Перезагружаем компонент для обновления UI
            window.location.reload()
        }
    }

    // Показываем все задачи без фильтрации
    const filteredTasks = tasks

    const difficultyColors = {
        beginner: 'success',
        intermediate: 'warning',
        advanced: 'error',
    } as const

    const difficultyLabels = {
        beginner: 'Начальный',
        intermediate: 'Средний',
        advanced: 'Продвинутый',
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (!answer.trim()) {
            alert('Пожалуйста, введите ответ')
            return
        }

        if (selectedTask) {
            // Сохраняем статус отправки
            const newSubmitted = new Set(submittedTasks)
            newSubmitted.add(selectedTask.id)
            setSubmittedTasks(newSubmitted)
            localStorage.setItem('python_submitted_tasks', JSON.stringify([...newSubmitted]))

            // Сохраняем время отправки для автоматического принятия через 1 час
            const newTimes = { ...submissionTimes, [selectedTask.id]: Date.now() }
            setSubmissionTimes(newTimes)
            localStorage.setItem('python_submission_times', JSON.stringify(newTimes))
        }

        alert('✅ Ваш ответ принят! Ожидайте проверки преподавателя.')
        setAnswer('')
        setSelectedFile(null)
    }

    const handleTestAnswer = (answerIndex: number) => {
        const newAnswers = [...userAnswers]
        newAnswers[currentQuestion] = answerIndex
        setUserAnswers(newAnswers)
    }

    const handleNextQuestion = () => {
        if (currentQuestion < testQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            let correctCount = 0
            testQuestions.forEach((q, index) => {
                if (userAnswers[index] === q.correctAnswer) {
                    correctCount++
                }
            })
            setScore(correctCount)
            setTestCompleted(true)
        }
    }

    const resetTest = () => {
        setCurrentQuestion(0)
        setUserAnswers([])
        setTestCompleted(false)
        setScore(0)
    }

    if (showTest) {
        if (testCompleted) {
            const percentage = Math.round((score / testQuestions.length) * 100)

            let statusEmoji = ''
            let statusTitle = ''
            let statusMessage = ''
            let statusAdvice = ''
            let statusColor = ''

            if (score >= 18) {
                // 90-100% - Отлично
                statusEmoji = '🎉'
                statusTitle = 'Поздравляем!'
                statusMessage = 'Ты успешно прошёл финальный тест по курсу Python. Ты показал, что освоил все 15 заданий и понял, как создавать свои проекты. Теперь ты готов переходить к более сложным задачам или экспериментировать с творческими проектами!'
                statusAdvice = 'Попробуй улучшить свои проекты, добавь новые функции, чтобы закрепить знания.'
                statusColor = 'text-success'
            } else if (score >= 14) {
                // 70-85% - Хорошо
                statusEmoji = '⚡'
                statusTitle = 'Хороший результат!'
                statusMessage = 'Ты прошёл тест, но есть небольшие ошибки. Рекомендуем вернуться к проектам, пересмотреть задания и закрепить знания.'
                statusAdvice = 'Попробуй выполнить задания ещё раз и экспериментируй с кодом, чтобы закрепить знания.'
                statusColor = 'text-warning'
            } else if (score >= 10) {
                // 50-65% - Средне
                statusEmoji = '⚠️'
                statusTitle = 'Тест пройден частично'
                statusMessage = 'Некоторые темы нужно повторить. Вернись к проектам и попробуй пройти тест ещё раз.'
                statusAdvice = 'Не переживай — вернись к проектам в разделе "Курсы", пересмотри задания и попробуй ещё раз. Практика поможет тебе закрепить знания и улучшить результаты.'
                statusColor = 'text-warning'
            } else {
                // 0-45% - Не пройден
                statusEmoji = '❌'
                statusTitle = 'Тест не пройден'
                statusMessage = 'Рекомендуем пересмотреть уроки, повторить проектные задания и попробовать пройти тест снова.'
                statusAdvice = 'Не переживай — вернись к проектам в разделе "Курсы", пересмотри задания и попробуй ещё раз. Практика поможет тебе закрепить знания и улучшить результаты.'
                statusColor = 'text-error'
            }

            return (
                <div>
                    <Button variant="ghost" onClick={() => setShowTest(false)} className="mb-4">
                        ← Назад к заданиям
                    </Button>

                    <Card className="py-8 px-6">
                        <div className="text-center mb-6">
                            <div className="text-7xl mb-4">{statusEmoji}</div>
                            <h2 className={`text-3xl font-bold mb-2 ${statusColor}`}>{statusTitle}</h2>
                            <p className="text-xl text-gray-700 mb-4">
                                Ваш результат: {score} из {testQuestions.length} ({percentage}%)
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <p className="text-gray-800 leading-relaxed mb-4">
                                {statusMessage}
                            </p>
                            <div className="border-l-4 border-primary pl-4">
                                <p className="text-sm text-gray-700 italic">
                                    💡 <strong>Совет:</strong> {statusAdvice}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <div className="text-center p-3 bg-success/10 rounded-lg">
                                <div className="text-2xl font-bold text-success">✅</div>
                                <div className="text-xs text-gray-600 mt-1">Отлично</div>
                                <div className="text-sm font-semibold">90-100%</div>
                            </div>
                            <div className="text-center p-3 bg-warning/10 rounded-lg">
                                <div className="text-2xl font-bold text-warning">⚡</div>
                                <div className="text-xs text-gray-600 mt-1">Хорошо</div>
                                <div className="text-sm font-semibold">70-85%</div>
                            </div>
                            <div className="text-center p-3 bg-warning/10 rounded-lg">
                                <div className="text-2xl font-bold text-warning">⚠️</div>
                                <div className="text-xs text-gray-600 mt-1">Средне</div>
                                <div className="text-sm font-semibold">50-65%</div>
                            </div>
                            <div className="text-center p-3 bg-error/10 rounded-lg">
                                <div className="text-2xl font-bold text-error">❌</div>
                                <div className="text-xs text-gray-600 mt-1">Не пройден</div>
                                <div className="text-sm font-semibold">0-45%</div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button onClick={resetTest}>Пройти тест заново</Button>
                            <Button variant="secondary" onClick={() => setShowTest(false)}>
                                Вернуться к заданиям
                            </Button>
                        </div>
                    </Card>
                </div>
            )
        }

        const question = testQuestions[currentQuestion]
        if (!question) return null

        return (
            <div>
                <Button variant="ghost" onClick={() => setShowTest(false)} className="mb-4">
                    ← Назад к заданиям
                </Button>

                <Card>
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="default">
                                Вопрос {currentQuestion + 1} из {testQuestions.length}
                            </Badge>
                            <span className="text-sm text-gray-600">
                                Прогресс: {Math.round(((currentQuestion + 1) / testQuestions.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-text mb-6 whitespace-pre-wrap">{question.question}</h3>

                    <div className="space-y-3 mb-6">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleTestAnswer(index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${userAnswers[currentQuestion] === index
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-primary/50'
                                    }`}
                            >
                                <span className="font-semibold mr-2">{String.fromCharCode(97 + index)})</span>
                                {option}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={handleNextQuestion}
                        disabled={userAnswers[currentQuestion] === undefined}
                        className="w-full"
                    >
                        {currentQuestion < testQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div>
            {/* Убраны фильтры по уровням - показываем все задачи */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {filteredTasks.map((task) => {
                        const isSubmitted = submittedTasks.has(task.id)
                        const isCompleted = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[task.id]

                        // Определяем статус и цвет
                        let statusBadge = null
                        let cardClass = selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''

                        if (isCompleted) {
                            // Зелёный - принято/выполнено
                            statusBadge = (
                                <div className="flex items-center gap-1 px-2 py-1 bg-success text-white rounded-full text-xs font-semibold">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Принято
                                </div>
                            )
                            cardClass += ' border-success border-2 bg-success/5'
                        } else if (isSubmitted) {
                            // Жёлтый - ожидает проверки
                            statusBadge = (
                                <div className="flex items-center gap-1 px-2 py-1 bg-warning text-white rounded-full text-xs font-semibold">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ожидает проверки
                                </div>
                            )
                            cardClass += ' border-warning border-2 bg-warning/5'
                        } else {
                            // Серый - не выполнено
                            statusBadge = (
                                <div className="flex items-center gap-1 px-2 py-1 bg-gray-400 text-white rounded-full text-xs font-semibold">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Не выполнено
                                </div>
                            )
                        }

                        return (
                            <Card
                                key={task.id}
                                hover
                                onClick={() => setSelectedTask(task)}
                                className={cardClass}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-text flex-1">
                                        {task.id}. {task.title}
                                    </h3>
                                    <Badge variant={difficultyColors[task.difficulty]}>
                                        {difficultyLabels[task.difficulty]}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                {statusBadge}
                            </Card>
                        )
                    })}

                    <Card
                        hover
                        onClick={() => setShowTest(true)}
                        className="border-2 border-primary bg-primary/5 cursor-pointer"
                    >
                        <div className="text-center py-6">
                            <div className="text-5xl mb-3">📝</div>
                            <h3 className="text-xl font-bold text-text mb-2">
                                Финальный тест
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Проверка знаний Python — Проектная работа
                            </p>
                            <Badge variant="default">20 вопросов</Badge>
                        </div>
                    </Card>
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    {selectedTask ? (
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-text">
                                    {selectedTask.id}. {selectedTask.title}
                                </h2>
                                {submittedTasks.has(selectedTask.id) && !JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[selectedTask.id] && (
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        В ожидании
                                    </span>
                                )}
                                {JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[selectedTask.id] && (
                                    <span className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Принято
                                    </span>
                                )}
                            </div>

                            <div className="mb-4">
                                <Badge variant={difficultyColors[selectedTask.difficulty]}>
                                    {difficultyLabels[selectedTask.difficulty]}
                                </Badge>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-text mb-2">📹 Видео-урок</h3>
                                <a
                                    href={selectedTask.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-ai-blue hover:underline"
                                >
                                    {selectedTask.videoTitle}
                                </a>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-text mb-2">📋 Полное описание</h3>
                                <p className="text-gray-700 leading-relaxed">{selectedTask.fullDescription}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-text mb-3">✅ Шаги выполнения</h3>
                                <ol className="space-y-2">
                                    {selectedTask.steps.map((step, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-700 flex-1">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-text mb-4">📤 Отправить решение</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ваш ответ / Описание решения
                                        </label>
                                        <textarea
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                            rows={4}
                                            placeholder="Опишите, как вы выполнили задание, вставьте код или объясните свое решение..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Прикрепить скриншот (опционально)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-smooth">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id={`file-upload-${selectedTask.id}`}
                                            />
                                            <label
                                                htmlFor={`file-upload-${selectedTask.id}`}
                                                className="cursor-pointer block"
                                            >
                                                {selectedFile ? (
                                                    <div>
                                                        <div className="text-4xl mb-2">✅</div>
                                                        <p className="text-sm text-gray-700 font-medium">
                                                            {selectedFile.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Нажмите для замены
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="text-4xl mb-2">📸</div>
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

                                    {/* Статус отправки */}
                                    {selectedTask && submittedTasks.has(selectedTask.id) && !JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[selectedTask.id] && (
                                        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="font-medium">В ожидании проверки преподавателя...</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Ваш ответ отправлен и будет автоматически принят в течение часа
                                            </p>
                                        </div>
                                    )}

                                    {/* Статус принятия */}
                                    {selectedTask && JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[selectedTask.id] && (
                                        <div className="p-4 bg-success/10 border border-success rounded-lg">
                                            <div className="flex items-center gap-2 text-success">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">Задание принято!</span>
                                            </div>
                                            <p className="text-sm text-success/80 mt-2">
                                                Отличная работа! Урок отмечен как выполненный
                                            </p>
                                        </div>
                                    )}

                                    <Button className="w-full" onClick={handleSubmit}>
                                        Отправить на проверку
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center">
                                        После отправки ваше решение будет проверено преподавателем
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card>
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4">🐍</div>
                                <p>Выберите задание слева</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
