import { useState } from 'react'
import { BookOpen, Code, Palette, Database, Globe, Zap, Star, Clock, Users } from 'lucide-react'

interface Course {
    id: string
    title: string
    description: string
    icon: any
    color: string
    lessons: number
    duration: string
    level: 'Начальный' | 'Средний' | 'Продвинутый'
    students: number
    rating: number
}

const courses: Course[] = [
    {
        id: 'python',
        title: 'Python для начинающих',
        description: 'Изучите основы программирования на Python с нуля',
        icon: Code,
        color: 'from-blue-500 to-cyan-500',
        lessons: 15,
        duration: '6 недель',
        level: 'Начальный',
        students: 1234,
        rating: 4.8
    },
    {
        id: 'figma',
        title: 'Дизайн в Figma',
        description: 'Создавайте профессиональные дизайны интерфейсов',
        icon: Palette,
        color: 'from-purple-500 to-pink-500',
        lessons: 17,
        duration: '8 недель',
        level: 'Начальный',
        students: 987,
        rating: 4.9
    },
    {
        id: 'database',
        title: 'Работа с базами данных',
        description: 'SQL, NoSQL и управление данными',
        icon: Database,
        color: 'from-green-500 to-emerald-500',
        lessons: 12,
        duration: '5 недель',
        level: 'Средний',
        students: 654,
        rating: 4.7
    },
    {
        id: 'web',
        title: 'Веб-разработка',
        description: 'HTML, CSS, JavaScript и современные фреймворки',
        icon: Globe,
        color: 'from-orange-500 to-red-500',
        lessons: 20,
        duration: '10 недель',
        level: 'Средний',
        students: 1456,
        rating: 4.9
    },
    {
        id: 'react',
        title: 'React и TypeScript',
        description: 'Создание современных веб-приложений',
        icon: Zap,
        color: 'from-cyan-500 to-blue-500',
        lessons: 18,
        duration: '9 недель',
        level: 'Продвинутый',
        students: 789,
        rating: 4.8
    },
    {
        id: 'ai',
        title: 'Искусственный интеллект',
        description: 'Машинное обучение и нейронные сети',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
        lessons: 25,
        duration: '12 недель',
        level: 'Продвинутый',
        students: 543,
        rating: 5.0
    }
]

export const CoursesPage = () => {
    const [selectedLevel, setSelectedLevel] = useState<string>('all')

    const filteredCourses = selectedLevel === 'all'
        ? courses
        : courses.filter(c => c.level === selectedLevel)

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Начальный': return 'bg-green-100 text-green-700'
            case 'Средний': return 'bg-blue-100 text-blue-700'
            case 'Продвинутый': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Курсы
                            </h1>
                            <p className="text-gray-600">Обучайтесь новым навыкам и развивайтесь</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => setSelectedLevel('all')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedLevel === 'all'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:shadow-md'
                            }`}
                    >
                        Все курсы
                    </button>
                    <button
                        onClick={() => setSelectedLevel('Начальный')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedLevel === 'Начальный'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:shadow-md'
                            }`}
                    >
                        Начальный
                    </button>
                    <button
                        onClick={() => setSelectedLevel('Средний')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedLevel === 'Средний'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:shadow-md'
                            }`}
                    >
                        Средний
                    </button>
                    <button
                        onClick={() => setSelectedLevel('Продвинутый')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedLevel === 'Продвинутый'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:shadow-md'
                            }`}
                    >
                        Продвинутый
                    </button>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const Icon = course.icon
                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105"
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="font-bold">{course.rating}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                                    <p className="text-white/90 text-sm">{course.description}</p>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>{course.students}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="text-sm">{course.lessons} уроков</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{course.duration}</span>
                                        </div>
                                    </div>

                                    <button className={`w-full py-3 bg-gradient-to-r ${course.color} text-white rounded-xl font-medium hover:shadow-lg transition-all`}>
                                        Начать обучение
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info Card */}
                <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Star className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Почему выбирают наши курсы?</h2>
                            <p className="text-indigo-100">Лучшее обучение для вашего развития</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">🎯 Практический подход</h3>
                            <p className="text-sm text-indigo-100">Реальные проекты и задачи</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">👨‍🏫 Опытные менторы</h3>
                            <p className="text-sm text-indigo-100">Поддержка на каждом шаге</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-bold mb-2">📜 Сертификаты</h3>
                            <p className="text-sm text-indigo-100">Подтвердите свои навыки</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
