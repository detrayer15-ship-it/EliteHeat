import { useProjectStore } from '@/store/projectStore'
import { useTaskStore } from '@/store/taskStore'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Trophy, Target, CheckCircle2, Clock, TrendingUp, Award } from 'lucide-react'

export const ProgressTrackerPage = () => {
    const projects = useProjectStore((state) => state.projects)
    const tasks = useTaskStore((state) => state.tasks)
    const navigate = useNavigate()

    // Динамический расчёт навыков
    const skills = useMemo(() => {
        const pythonLessons = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')
        const figmaLessons = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')

        const pythonCompleted = Object.values(pythonLessons).filter(Boolean).length
        const pythonProgress = Math.round((pythonCompleted / 15) * 100)

        const figmaCompleted = Object.values(figmaLessons).filter(Boolean).length
        const figmaProgress = Math.round((figmaCompleted / 17) * 100)

        const completedProjectTasks = tasks.filter(t => t.completed).length
        const totalProjectTasks = tasks.length
        const dataWorkProgress = totalProjectTasks > 0
            ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
            : 0

        return [
            { name: 'Python', level: pythonProgress, icon: '🐍', color: 'from-blue-500 to-cyan-500' },
            { name: 'Figma', level: figmaProgress, icon: '🎨', color: 'from-purple-500 to-pink-500' },
            { name: 'Работа с данными', level: dataWorkProgress, icon: '📊', color: 'from-green-500 to-emerald-500' },
        ]
    }, [tasks])

    // Статистика
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.stage === 'completed' || p.status === 'completed').length
    const inProgressProjects = totalProjects - completedProjects

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

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

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline)
        const diffTime = date.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return `Просрочено на ${Math.abs(diffDays)} дн.`
        if (diffDays === 0) return 'Сегодня'
        if (diffDays === 1) return 'Завтра'
        return `Через ${diffDays} дн.`
    }

    const getSkillLevel = (level: number) => {
        if (level >= 80) return { text: 'Эксперт', color: 'text-green-600' }
        if (level >= 60) return { text: 'Продвинутый', color: 'text-blue-600' }
        if (level >= 40) return { text: 'Средний', color: 'text-yellow-600' }
        return { text: 'Начинающий', color: 'text-gray-500' }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Трекер прогресса
                            </h1>
                            <p className="text-gray-600">Отслеживайте свои достижения и прогресс</p>
                        </div>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Общий прогресс</h2>
                            <p className="text-blue-100">Выполнено {completedTasks} из {totalTasks} задач</p>
                        </div>
                        <div className="text-6xl font-bold">{overallProgress}%</div>
                    </div>
                    <div className="w-full bg-blue-400/30 rounded-full h-4">
                        <div
                            className="bg-white rounded-full h-4 transition-all duration-500 shadow-lg"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Проекты</h3>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Trophy className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Всего:</span>
                                <span className="font-semibold">{totalProjects}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Завершено:</span>
                                <span className="font-semibold text-green-600">{completedProjects}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">В процессе:</span>
                                <span className="font-semibold text-blue-600">{inProgressProjects}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Задачи</h3>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Всего:</span>
                                <span className="font-semibold">{totalTasks}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Выполнено:</span>
                                <span className="font-semibold text-green-600">{completedTasks}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Осталось:</span>
                                <span className="font-semibold text-orange-600">{totalTasks - completedTasks}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Дедлайны</h3>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Просрочено:</span>
                                <span className="font-semibold text-red-600">{overdueTasks.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Скоро:</span>
                                <span className="font-semibold text-orange-600">{upcomingTasks.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Всего:</span>
                                <span className="font-semibold">{tasksWithDeadlines.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Навыки</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {skills.map((skill) => {
                            const levelInfo = getSkillLevel(skill.level)
                            return (
                                <div key={skill.name} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{skill.icon}</span>
                                            <span className="font-semibold text-gray-900">{skill.name}</span>
                                        </div>
                                        <span className={`text-sm font-medium ${levelInfo.color}`}>
                                            {levelInfo.text}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`bg-gradient-to-r ${skill.color} h-3 rounded-full transition-all duration-500 shadow-md`}
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                        <span className="absolute right-0 -top-6 text-sm font-bold text-gray-700">
                                            {skill.level}%
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Upcoming Tasks */}
                {upcomingTasks.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ближайшие дедлайны</h2>
                        <div className="space-y-3">
                            {upcomingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-600">{task.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                                            {formatDeadline(task.deadline!)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
                        <h2 className="text-2xl font-bold text-red-600 mb-6">Просроченные задачи</h2>
                        <div className="space-y-3">
                            {overdueTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                        <p className="text-sm text-gray-600">{task.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                                            {formatDeadline(task.deadline!)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
