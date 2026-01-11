import { useEffect, useRef, useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useNavigate } from 'react-router-dom'
import { ProjectCreationChat } from '@/components/project/ProjectCreationChat'
import { AIAvatar } from '@/components/ui/AIAvatar'
import { Sparkles, FolderKanban, BookOpen, TrendingUp, Bot, BarChart3 } from 'lucide-react'

export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [studentCount, setStudentCount] = useState(0)
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

    const recentProjects = projects.slice(-3).reverse()

    // Cities with student data - Kazakhstan cities
    const countries = [
        { name: 'Актау', lat: 43.65, lon: 51.2, students: 80, color: '#fbbf24' },      // Aktau - Yellow/Gold
        { name: 'Алматы', lat: 43.25, lon: 76.95, students: 95, color: '#22c55e' },    // Almaty - Green
        { name: 'Астана', lat: 51.17, lon: 71.47, students: 68, color: '#3b82f6' },    // Astana - Blue
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

    // Enhanced Realistic Earth with continents
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

            // Outer atmospheric glow - enhanced
            const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 50)
            atmosphereGradient.addColorStop(0, 'rgba(59, 130, 246, 0)')
            atmosphereGradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.4)')
            atmosphereGradient.addColorStop(0.9, 'rgba(139, 92, 246, 0.3)')
            atmosphereGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
            ctx.fillStyle = atmosphereGradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Ocean (enhanced blue gradient with depth)
            const oceanGradient = ctx.createRadialGradient(
                centerX - radius / 3,
                centerY - radius / 3,
                radius / 4,
                centerX,
                centerY,
                radius
            )
            oceanGradient.addColorStop(0, '#60a5fa')
            oceanGradient.addColorStop(0.3, '#3b82f6')
            oceanGradient.addColorStop(0.7, '#2563eb')
            oceanGradient.addColorStop(1, '#1e3a8a')

            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = oceanGradient
            ctx.fill()

            // Add subtle shadow for 3D effect
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
            ctx.shadowBlur = 20
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5

            // Draw continents (vibrant green with better shading)
            ctx.fillStyle = '#10b981'
            ctx.strokeStyle = '#059669'
            ctx.lineWidth = 1.5
            ctx.shadowColor = 'transparent'

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

            // Grid lines (more visible)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
            ctx.lineWidth = 0.8

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

            // Enhanced city markers with labels
            countries.forEach((country) => {
                const adjustedLon = country.lon + rotation
                const x = centerX + radius * Math.cos(country.lat * Math.PI / 180) * Math.sin(adjustedLon * Math.PI / 180)
                const y = centerY - radius * Math.sin(country.lat * Math.PI / 180)
                const z = radius * Math.cos(country.lat * Math.PI / 180) * Math.cos(adjustedLon * Math.PI / 180)

                if (z > 0) {
                    const size = 8 + (z / radius) * 6
                    const opacity = 0.7 + (z / radius) * 0.3
                    const pulseSize = Math.sin(Date.now() / 400) * 3

                    // Connection line from city to edge
                    ctx.strokeStyle = country.color
                    ctx.lineWidth = 2
                    ctx.globalAlpha = opacity * 0.4
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x, y - 40)
                    ctx.stroke()

                    // Large outer glow
                    const largeGlow = ctx.createRadialGradient(x, y, 0, x, y, size * 6)
                    largeGlow.addColorStop(0, country.color)
                    largeGlow.addColorStop(0.5, country.color + '40')
                    largeGlow.addColorStop(1, 'transparent')
                    ctx.fillStyle = largeGlow
                    ctx.globalAlpha = opacity * 0.6
                    ctx.beginPath()
                    ctx.arc(x, y, size * 6, 0, Math.PI * 2)
                    ctx.fill()

                    // Main point with gradient
                    const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
                    pointGradient.addColorStop(0, '#ffffff')
                    pointGradient.addColorStop(0.5, country.color)
                    pointGradient.addColorStop(1, country.color)
                    ctx.fillStyle = pointGradient
                    ctx.globalAlpha = opacity
                    ctx.beginPath()
                    ctx.arc(x, y, size, 0, Math.PI * 2)
                    ctx.fill()

                    // Animated pulse rings
                    for (let i = 0; i < 2; i++) {
                        ctx.strokeStyle = country.color
                        ctx.lineWidth = 3
                        ctx.globalAlpha = opacity * (0.6 - i * 0.3)
                        ctx.beginPath()
                        ctx.arc(x, y, size + pulseSize + i * 8, 0, Math.PI * 2)
                        ctx.stroke()
                    }

                    // City label with background
                    ctx.globalAlpha = opacity
                    ctx.font = 'bold 12px Inter, sans-serif'
                    const text = `${country.name} (${country.students})`
                    const textWidth = ctx.measureText(text).width

                    // Label background
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
                    ctx.beginPath()
                    ctx.roundRect(x - textWidth / 2 - 6, y - 55, textWidth + 12, 20, 8)
                    ctx.fill()

                    // Label text
                    ctx.fillStyle = country.color
                    ctx.fillText(text, x - textWidth / 2, y - 42)

                    ctx.globalAlpha = 1
                }
            })

            rotation += 0.05
        }

        const interval = setInterval(drawEarth, 1000 / 60)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section with Realistic Earth */}
                <div className="mb-12 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
                    {/* Animated background particles */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
                        {/* Text Content */}
                        <div className="space-y-6">
                            <div className="inline-block">
                                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    🚀 Образование будущего
                                </span>
                            </div>

                            <h1 className="text-6xl font-black text-white leading-tight">
                                Добро пожаловать в
                                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                                    EliteHeat
                                </span>
                            </h1>

                            <p className="text-xl text-blue-100 leading-relaxed">
                                Платформа нового поколения для обучения и развития.
                                Создавайте проекты, учитесь с AI и достигайте целей вместе с нами.
                            </p>

                            {/* Student Counter - Redesigned */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-7xl font-black text-white mb-2 tabular-nums">
                                                {studentCount.toLocaleString()}
                                            </div>
                                            <p className="text-lg text-blue-100 font-medium">учеников по всему миру 🌍</p>
                                        </div>
                                        <div className="text-6xl animate-bounce">
                                            🎓
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Realistic Earth Canvas */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <canvas
                                ref={canvasRef}
                                className="drop-shadow-2xl relative z-10"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />

                            {/* Floating Icons - Redesigned */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-1/4 animate-float">
                                    <div className="text-5xl drop-shadow-lg">📚</div>
                                </div>
                                <div className="absolute top-1/4 right-0 animate-float-delay-1">
                                    <div className="text-5xl drop-shadow-lg">🎧</div>
                                </div>
                                <div className="absolute bottom-1/4 left-0 animate-float-delay-2">
                                    <div className="text-5xl drop-shadow-lg">💻</div>
                                </div>
                                <div className="absolute bottom-0 right-1/4 animate-float-delay-3">
                                    <div className="text-5xl drop-shadow-lg">🧠</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ellie AI Showcase */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        {/* AI Avatar - Centered at top with effects */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                {/* Pulsing glow effect */}
                                <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity"></div>

                                {/* Rotating rings */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                                </div>
                                <div className="absolute inset-4 animate-spin-reverse">
                                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                </div>

                                {/* Waving hand animation inside circles */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div className="animate-wave-person">
                                        <span className="text-6xl">👋</span>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className="relative animate-fade-in-scale group-hover:scale-110 transition-transform duration-300 z-20">
                                    <AIAvatar size={180} state="idle" />
                                </div>

                                {/* Sparkles around avatar */}
                                <div className="absolute -top-4 -right-4 text-3xl animate-bounce">✨</div>
                                <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💫</div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h2 className="text-5xl font-bold text-white mb-3 animate-pulse">✨ Ellie</h2>
                            <p className="text-blue-100 text-xl">Ваш умный AI-помощник в обучении</p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">💬</span>
                                    <span className="text-white text-lg">Отвечает на любые вопросы</span>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🎯</span>
                                    <span className="text-white text-lg">Помогает с проектами</span>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🔧</span>
                                    <span className="text-white text-lg">Находит ошибки в коде</span>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">📚</span>
                                    <span className="text-white text-lg">Объясняет сложные темы</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <button
                                onClick={() => navigate('/ai-assistant')}
                                className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3"
                            >
                                <Bot className="w-7 h-7" />
                                Попробовать AI прямо сейчас →
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes fade-in-scale {
                            from {
                                opacity: 0;
                                transform: scale(0.8);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }

                        .animate-fade-in-scale {
                            animation: fade-in-scale 1s ease-out;
                        }
                        
                        @keyframes spin-slow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        
                        @keyframes spin-reverse {
                            from { transform: rotate(360deg); }
                            to { transform: rotate(0deg); }
                        }
                        
                        @keyframes wave-person {
                            0% {
                                opacity: 0;
                                transform: scale(0) rotate(-20deg);
                            }
                            10% {
                                opacity: 1;
                                transform: scale(1) rotate(0deg);
                            }
                            20% {
                                transform: scale(1) rotate(20deg);
                            }
                            30% {
                                transform: scale(1) rotate(-10deg);
                            }
                            40% {
                                transform: scale(1) rotate(15deg);
                            }
                            50% {
                                transform: scale(1) rotate(0deg);
                            }
                            70% {
                                opacity: 1;
                                transform: scale(1) rotate(0deg);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(0) rotate(20deg);
                            }
                        }
                        
                        @keyframes robot-appear-spin {
                            0% {
                                opacity: 0;
                                transform: scale(0.5) translateY(20px);
                            }
                            10% {
                                opacity: 1;
                                transform: scale(1.1) translateY(-5px);
                            }
                            15% {
                                transform: scale(1) translateY(0);
                            }
                            25% {
                                transform: scale(1.05) translateY(-3px);
                            }
                            30% {
                                transform: scale(1) translateY(0);
                            }
                            40% {
                                transform: scale(1.05) translateY(-3px);
                            }
                            45% {
                                transform: scale(1) translateY(0);
                            }
                            55% {
                                transform: scale(1.03) translateY(-2px);
                            }
                            60% {
                                transform: scale(1) translateY(0);
                            }
                            80% {
                                opacity: 1;
                                transform: scale(1) translateY(0);
                            }
                            100% {
                                opacity: 0;
                                transform: scale(0.5) translateY(20px);
                            }
                        }
                        
                        .animate-spin-slow {
                            animation: spin-slow 8s linear infinite;
                        }
                        
                        .animate-spin-reverse {
                            animation: spin-reverse 6s linear infinite;
                        }
                        
                        .animate-wave-person {
                            animation: wave-person 6s ease-in-out infinite;
                        }
                        
                        .animate-robot-appear-spin {
                            animation: robot-appear-spin 8s ease-in-out infinite;
                        }
                    `}</style>
                </div>

                {/* Project Statistics */}
                <div className="mb-12">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FolderKanban className="w-6 h-6" />
                            Статистика проектов
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-sm">Всего проектов</span>
                                    <span className="text-3xl">📁</span>
                                </div>
                                <p className="text-4xl font-bold">{projects.length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-sm">В работе</span>
                                    <span className="text-3xl">⚡</span>
                                </div>
                                <p className="text-4xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-sm">Завершено</span>
                                    <span className="text-3xl">✅</span>
                                </div>
                                <p className="text-4xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
                            </div>
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
                <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                    {/* Floating decorative circles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-2xl animate-float"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl animate-float-delay-1"></div>
                        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-300 rounded-full opacity-20 blur-2xl animate-float-delay-2"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <span className="text-4xl animate-bounce">🚀</span>
                            Быстрые действия
                        </h2>
                        <p className="text-gray-600 mb-6">Выберите, чем хотите заняться</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => navigate('/projects')}
                                className="group p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-left relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: '0.1s' }}
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>

                                {/* Pulsing circle */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <FolderKanban className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-xl mb-2">Мои проекты</h3>
                                    <p className="text-sm text-blue-100">Управляйте проектами</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/tasks')}
                                className="group p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-left relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: '0.2s' }}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <BookOpen className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-xl mb-2">Курсы</h3>
                                    <p className="text-sm text-purple-100">Обучение и развитие</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/progress')}
                                className="group p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-left relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: '0.3s' }}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <TrendingUp className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-xl mb-2">Трекер прогресса</h3>
                                    <p className="text-sm text-green-100">Отслеживайте успехи</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/ai-assistant')}
                                className="group p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-left relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <Bot className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-xl mb-2">AI Помощник</h3>
                                    <p className="text-sm text-orange-100">Умный ассистент</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/analyzer')}
                                className="group p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-left relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: '0.5s' }}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500"></div>

                                <div className="relative z-10">
                                    <BarChart3 className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-xl mb-2">Анализ презентаций</h3>
                                    <p className="text-sm text-yellow-100">Улучшайте навыки</p>
                                </div>
                            </button>
                        </div>
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
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out backwards;
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

            {/* Новости */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">📰</div>
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Новости
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 hover:bg-blue-50 p-3 rounded-r-lg transition-all cursor-pointer group">
                        <h3 className="font-bold text-base md:text-lg group-hover:text-blue-600 transition-colors">🚀 Скоро новый курс по React!</h3>
                        <p className="text-sm text-gray-600">Готовим для вас курс по React. Следите за обновлениями!</p>
                        <span className="text-xs text-gray-400">2 дня назад</span>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 hover:bg-green-50 p-3 rounded-r-lg transition-all cursor-pointer group">
                        <h3 className="font-bold text-base md:text-lg group-hover:text-green-600 transition-colors">🤖 AI-помощник обновлён</h3>
                        <p className="text-sm text-gray-600">Теперь ещё умнее! Создавайте проекты быстрее с новым AI.</p>
                        <span className="text-xs text-gray-400">5 дней назад</span>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 hover:bg-purple-50 p-3 rounded-r-lg transition-all cursor-pointer group">
                        <h3 className="font-bold text-base md:text-lg group-hover:text-purple-600 transition-colors">🎓 Новые возможности платформы</h3>
                        <p className="text-sm text-gray-600">Добавлены новые функции для удобного обучения и создания проектов.</p>
                        <span className="text-xs text-gray-400">1 неделю назад</span>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 hover:bg-orange-50 p-3 rounded-r-lg transition-all cursor-pointer group">
                        <h3 className="font-bold text-base md:text-lg group-hover:text-orange-600 transition-colors">📱 Мобильное приложение</h3>
                        <p className="text-sm text-gray-600">Скоро запуск мобильного приложения EliteHeat для iOS и Android!</p>
                        <span className="text-xs text-gray-400">2 недели назад</span>
                    </div>
                </div>
            </div>
        </div>

    )
}
