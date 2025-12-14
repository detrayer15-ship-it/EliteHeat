import { useEffect, useRef, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { ProjectCreationChat } from '@/components/project/ProjectCreationChat'
import { Sparkles, FolderKanban, BookOpen, TrendingUp, Bot, BarChart3 } from 'lucide-react'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [studentCount, setStudentCount] = useState(0)
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

    const stats = {
        total: projects.length,
        inProgress: projects.filter((p) => p.stage !== 'completed').length,
        completed: projects.filter((p) => p.stage === 'completed').length,
    }

    const recentProjects = projects.slice(-3).reverse()

    // Countries with student data
    const countries = [
        { name: 'Казахстан', lat: 48, lon: 68, students: 243, color: '#fbbf24' },
    ]

    // Animated student counter
    useEffect(() => {
        const target = 243 // Changed to match Kazakhstan students
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setStudentCount(target)
                clearInterval(timer)
            } else {
                setStudentCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [])

    // Realistic Earth with continents
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = 500
        canvas.height = 500

        let rotation = 0
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = 180

        // Simplified continent shapes (longitude, latitude pairs)
        const continents = [
            // North America
            [[-130, 60], [-120, 55], [-100, 50], [-80, 45], [-70, 40], [-75, 30], [-90, 25], [-100, 30], [-110, 40], [-120, 50]],
            // South America
            [[-80, 10], [-75, 0], [-70, -10], [-65, -20], [-60, -30], [-65, -40], [-70, -50], [-75, -45], [-80, -30], [-85, -10]],
            // Europe
            [[-10, 60], [0, 58], [10, 55], [20, 52], [30, 50], [25, 45], [15, 43], [5, 45], [-5, 50], [-10, 55]],
            // Africa
            [[10, 30], [20, 25], [30, 15], [40, 5], [45, -5], [40, -15], [30, -25], [20, -30], [10, -25], [5, -10], [0, 5], [5, 20]],
            // Asia
            [[40, 70], [60, 65], [80, 60], [100, 55], [120, 50], [130, 45], [140, 40], [130, 30], [110, 25], [90, 30], [70, 35], [50, 45], [40, 55]],
            // Australia
            [[115, -15], [125, -18], [135, -20], [145, -25], [150, -30], [145, -35], [135, -38], [125, -35], [115, -30], [110, -20]],
        ]

        function drawEarth() {
            if (!ctx || !canvas) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Outer glow
            const glowGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 40)
            glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
            glowGradient.addColorStop(0.8, 'rgba(59, 130, 246, 0.3)')
            glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
            ctx.fillStyle = glowGradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Ocean (blue gradient)
            const oceanGradient = ctx.createRadialGradient(
                centerX - radius / 3,
                centerY - radius / 3,
                radius / 4,
                centerX,
                centerY,
                radius
            )
            oceanGradient.addColorStop(0, '#3b82f6')
            oceanGradient.addColorStop(0.5, '#2563eb')
            oceanGradient.addColorStop(1, '#1e40af')

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = oceanGradient
            ctx.fill()

            // Draw continents (green)
            ctx.fillStyle = '#22c55e'
            ctx.strokeStyle = '#16a34a'
            ctx.lineWidth = 1

            continents.forEach(continent => {
                ctx.beginPath()
                let firstPoint = true

                continent.forEach(([lon, lat]) => {
                    const adjustedLon = lon + rotation
                    const x = centerX + radius * Math.cos(lat * Math.PI / 180) * Math.sin(adjustedLon * Math.PI / 180)
                    const y = centerY - radius * Math.sin(lat * Math.PI / 180)
                    const z = radius * Math.cos(lat * Math.PI / 180) * Math.cos(adjustedLon * Math.PI / 180)

                    if (z > 0) {
                        if (firstPoint) {
                            ctx.moveTo(x, y)
                            firstPoint = false
                        } else {
                            ctx.lineTo(x, y)
                        }
                    }
                })

                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            })

            // Grid lines (subtle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.lineWidth = 1

            // Latitude lines
            for (let lat = -60; lat <= 60; lat += 30) {
                ctx.beginPath()
                for (let lon = 0; lon < 360; lon += 5) {
                    const adjustedLon = lon + rotation
                    const x = centerX + radius * Math.cos(lat * Math.PI / 180) * Math.sin(adjustedLon * Math.PI / 180)
                    const y = centerY - radius * Math.sin(lat * Math.PI / 180)
                    const z = radius * Math.cos(lat * Math.PI / 180) * Math.cos(adjustedLon * Math.PI / 180)

                    if (z > 0) {
                        if (lon === 0) {
                            ctx.moveTo(x, y)
                        } else {
                            ctx.lineTo(x, y)
                        }
                    }
                }
                ctx.stroke()
            }

            // Student markers
            countries.forEach((country) => {
                const adjustedLon = country.lon + rotation
                const x = centerX + radius * Math.cos(country.lat * Math.PI / 180) * Math.sin(adjustedLon * Math.PI / 180)
                const y = centerY - radius * Math.sin(country.lat * Math.PI / 180)
                const z = radius * Math.cos(country.lat * Math.PI / 180) * Math.cos(adjustedLon * Math.PI / 180)

                if (z > 0) {
                    const size = 6 + (z / radius) * 4
                    const opacity = 0.6 + (z / radius) * 0.4

                    // Glow
                    const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4)
                    pointGradient.addColorStop(0, country.color)
                    pointGradient.addColorStop(1, 'transparent')
                    ctx.fillStyle = pointGradient
                    ctx.beginPath()
                    ctx.arc(x, y, size * 4, 0, Math.PI * 2)
                    ctx.fill()

                    // Point
                    ctx.fillStyle = country.color
                    ctx.globalAlpha = opacity
                    ctx.beginPath()
                    ctx.arc(x, y, size, 0, Math.PI * 2)
                    ctx.fill()

                    // Pulse ring
                    ctx.strokeStyle = country.color
                    ctx.lineWidth = 2
                    ctx.globalAlpha = opacity * 0.5
                    ctx.beginPath()
                    ctx.arc(x, y, size + 3 + Math.sin(Date.now() / 500) * 2, 0, Math.PI * 2)
                    ctx.stroke()

                    ctx.globalAlpha = 1
                }
            })

            rotation += 0.15
        }

        const interval = setInterval(drawEarth, 1000 / 60)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section with Realistic Earth */}
                <div className="mb-12 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Text Content */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
                                <h1 className="text-5xl font-bold text-white">
                                    Добро пожаловать в EliteHeat
                                </h1>
                            </div>
                            <p className="text-2xl text-blue-100 mb-6">
                                Образовательная платформа, которая объединяет учеников по всему миру
                            </p>

                            {/* Student Counter */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                                <div className="text-6xl font-bold text-white mb-2">
                                    {studentCount.toLocaleString()}
                                </div>
                                <p className="text-xl text-blue-100">учеников по всему миру 🌍</p>
                            </div>

                            {/* Country List */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                                <h3 className="text-lg font-bold text-white mb-3">Где учатся наши студенты:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {countries.map((country) => (
                                        <div key={country.name} className="flex items-center gap-2 text-white text-sm">
                                            <div
                                                className="w-3 h-3 rounded-full animate-pulse"
                                                style={{ backgroundColor: country.color }}
                                            />
                                            <span>{country.name}: <strong>{country.students}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Realistic Earth Canvas */}
                        <div className="relative flex items-center justify-center">
                            <canvas
                                ref={canvasRef}
                                className="drop-shadow-2xl"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />

                            {/* Floating Icons */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-1/4 animate-float">
                                    <div className="text-4xl">📚</div>
                                </div>
                                <div className="absolute top-1/4 right-0 animate-float-delay-1">
                                    <div className="text-4xl">🎧</div>
                                </div>
                                <div className="absolute bottom-1/4 left-0 animate-float-delay-2">
                                    <div className="text-4xl">💻</div>
                                </div>
                                <div className="absolute bottom-0 right-1/4 animate-float-delay-3">
                                    <div className="text-4xl">🧠</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Всего проектов</h3>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FolderKanban className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {stats.total}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">В работе</h3>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {stats.inProgress}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Завершено</h3>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {stats.completed}
                        </div>
                    </div>
                </div>

                {/* Project Creation Chat */}
                <div className="mb-12">
                    <ProjectCreationChat />
                </div>

                {/* Recent Projects */}
                {recentProjects.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FolderKanban className="w-6 h-6 text-purple-600" />
                            Последние проекты
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                                    onClick={() => {
                                        if (project.externalUrl) {
                                            window.open(project.externalUrl, '_blank')
                                        }
                                    }}
                                >
                                    <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {project.tasks.length} задач · {project.progress}%
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрые действия</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/projects')}
                            className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 text-left"
                        >
                            <FolderKanban className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Мои проекты</h3>
                            <p className="text-sm text-blue-100">Управляйте проектами</p>
                        </button>

                        <button
                            onClick={() => navigate('/tasks')}
                            className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 text-left"
                        >
                            <BookOpen className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Курсы</h3>
                            <p className="text-sm text-purple-100">Обучение и развитие</p>
                        </button>

                        <button
                            onClick={() => navigate('/progress')}
                            className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 text-left"
                        >
                            <TrendingUp className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Трекер прогресса</h3>
                            <p className="text-sm text-green-100">Отслеживайте успехи</p>
                        </button>

                        <button
                            onClick={() => navigate('/ai-assistant')}
                            className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 text-left"
                        >
                            <Bot className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-1">AI Помощник</h3>
                            <p className="text-sm text-orange-100">Умный ассистент</p>
                        </button>

                        <button
                            onClick={() => navigate('/analyzer')}
                            className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 text-left"
                        >
                            <BarChart3 className="w-8 h-8 mb-3" />
                            <h3 className="font-bold text-lg mb-1">Анализ презентаций</h3>
                            <p className="text-sm text-yellow-100">Улучшайте навыки</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS for animations */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-float-delay-1 {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 0.75s;
                }
                .animate-float-delay-2 {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
                .animate-float-delay-3 {
                    animation: float 3s ease-in-out infinite;
                    animation-delay: 2.25s;
                }
            `}</style>
        </div>
    )
}
