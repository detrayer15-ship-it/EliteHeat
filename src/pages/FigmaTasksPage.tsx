import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface FigmaTask {
    id: string
    title: string
    difficulty: 'easy' | 'medium' | 'hard'
    description: string
    videoUrl: string
    steps: string[]
    completed: boolean
}

interface TestQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
}

export const FigmaTasksPage = () => {
    const [tasks, setTasks] = useState<FigmaTask[]>([])
    const [selectedTask, setSelectedTask] = useState<FigmaTask | null>(null)
    const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
    const [answer, setAnswer] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [submittedTasks, setSubmittedTasks] = useState<Set<string>>(
        new Set(JSON.parse(localStorage.getItem('figma_submitted_tasks') || '[]'))
    )

    // Test state
    const [showTest, setShowTest] = useState(false)
    const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<number[]>([])
    const [testCompleted, setTestCompleted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        fetch('/data/figma_tasks.json')
            .then((res) => res.json())
            .then((data) => setTasks(data))

        fetch('/data/figma_test.json')
            .then((res) => res.json())
            .then((data) => setTestQuestions(data))
    }, [])

    const filteredTasks = tasks.filter((task) =>
        filter === 'all' ? true : task.difficulty === filter
    )

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (!answer.trim() && !selectedFile) {
            alert('Пожалуйста, введите ответ или загрузите скриншот')
            return
        }

        // Сохраняем прогресс урока в localStorage
        if (selectedTask) {
            const progress = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')
            progress[selectedTask.id] = true
            localStorage.setItem('figma_lessons_progress', JSON.stringify(progress))

            // Сохраняем статус отправки
            const newSubmitted = new Set(submittedTasks)
            newSubmitted.add(selectedTask.id)
            setSubmittedTasks(newSubmitted)
            localStorage.setItem('figma_submitted_tasks', JSON.stringify([...newSubmitted]))
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

            if (score >= 27) {
                // 90-100% - Отлично
                statusEmoji = '✅'
                statusTitle = 'Отлично!'
                statusMessage = 'Поздравляем! Ты показал высокий уровень знаний и отлично справился с тестом! Можно переходить к новым проектам или экспериментам.'
                statusAdvice = 'Продолжай практиковаться и создавай свои собственные дизайн-проекты!'
                statusColor = 'text-success'
            } else if (score >= 21) {
                // 70-85% - Хорошо
                statusEmoji = '⚡'
                statusTitle = 'Хорошо!'
                statusMessage = 'Ты прошёл тест, но есть небольшие ошибки. Рекомендуем вернуться к проектам, пересмотреть задания и закрепить знания.'
                statusAdvice = 'Попробуй выполнить задания ещё раз и экспериментируй с инструментами Figma.'
                statusColor = 'text-warning'
            } else if (score >= 15) {
                // 50-65% - Средне
                statusEmoji = '⚠️'
                statusTitle = 'Средне'
                statusMessage = 'Тест пройден частично. Некоторые темы нужно повторить. Вернись к проектам и попробуй пройти тест ещё раз.'
                statusAdvice = 'Не переживай — вернись к урокам в разделе "Задачи", пересмотри уроки и попробуй ещё раз. Практика поможет тебе закрепить знания и улучшить результаты.'
                statusColor = 'text-warning'
            } else {
                // 0-45% - Не пройден
                statusEmoji = '❌'
                statusTitle = 'Не пройден'
                statusMessage = 'Тест не пройден. Рекомендуем пересмотреть уроки, повторить проектные задания и попробовать пройти тест снова.'
                statusAdvice = 'Не переживай — вернись к урокам в разделе "Задачи", пересмотри все уроки и попробуй ещё раз. Практика поможет тебе закрепить знания и улучшить результаты.'
                statusColor = 'text-error'
            }

            return (
                <div>
                    <Button variant="ghost" onClick={() => setShowTest(false)} className="mb-4">
                        ← Назад к урокам
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
                                Вернуться к урокам
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
                    ← Назад к урокам
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

                    <h3 className="text-xl font-bold text-text mb-6">{question.question}</h3>

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
            <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                    variant={filter === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Все ({tasks.length})
                </Button>
                <Button
                    variant={filter === 'easy' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('easy')}
                >
                    Начальный ({tasks.filter(t => t.difficulty === 'easy').length})
                </Button>
                <Button
                    variant={filter === 'medium' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('medium')}
                >
                    Средний ({tasks.filter(t => t.difficulty === 'medium').length})
                </Button>
                <Button
                    variant={filter === 'hard' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('hard')}
                >
                    Продвинутый ({tasks.filter(t => t.difficulty === 'hard').length})
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {filteredTasks.map((task) => {
                        const isSubmitted = submittedTasks.has(task.id)
                        const isCompleted = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')[task.id]

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
                                        {task.title}
                                    </h3>
                                    <Badge variant={difficultyColors[task.difficulty]}>
                                        {difficultyLabels[task.difficulty]}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
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
                            <div className="text-5xl mb-3">✅</div>
                            <h3 className="text-xl font-bold text-text mb-2">
                                Тест по Figma
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Проверка знаний по всему курсу
                            </p>
                            <Badge variant="default">30 вопросов</Badge>
                        </div>
                    </Card>
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    {selectedTask ? (
                        <Card>
                            <h2 className="text-2xl font-bold text-text mb-4">
                                {selectedTask.title}
                            </h2>

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
                                    Открыть урок →
                                </a>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-text mb-2">📋 Описание</h3>
                                <p className="text-gray-700 leading-relaxed">{selectedTask.description}</p>
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
                                            Ваш ответ / Описание
                                        </label>
                                        <textarea
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                            rows={4}
                                            placeholder="Опишите, как вы выполнили задание..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🖼 Загрузить скриншот
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
                                <div className="text-6xl mb-4">🎨</div>
                                <p>Выберите урок слева</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
