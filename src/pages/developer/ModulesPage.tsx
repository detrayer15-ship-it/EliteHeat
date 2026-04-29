import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface Module {
    id: string
    name: string
    description: string
    enabled: boolean
    icon: string
    color: string
    features: string[]
}

export const ModulesPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [modules, setModules] = useState<Module[]>(() => {
        const saved = localStorage.getItem('platform_modules')
        return saved ? JSON.parse(saved) : [
            {
                id: 'courses',
                name: 'Курсы',
                description: 'Система обучения Python и Figma',
                enabled: true,
                icon: '📚',
                color: 'blue',
                features: ['Уроки', 'Задания', 'Прогресс', 'Сертификаты']
            },
            {
                id: 'projects',
                name: 'Проекты',
                description: 'Создание и управление проектами',
                enabled: true,
                icon: '📁',
                color: 'green',
                features: ['Создание проектов', 'Roadmap', 'Команды', 'Версионирование']
            },
            {
                id: 'chats',
                name: 'Чаты',
                description: 'Общение учеников и учителей',
                enabled: true,
                icon: '💬',
                color: 'purple',
                features: ['Личные чаты', 'Групповые чаты', 'Файлы', 'Уведомления']
            },
            {
                id: 'progress',
                name: 'Трекер прогресса',
                description: 'Отслеживание успехов ученика',
                enabled: true,
                icon: '📊',
                color: 'orange',
                features: ['Статистика', 'Графики', 'Достижения', 'Отчёты']
            },
            {
                id: 'analytics',
                name: 'Аналитика',
                description: 'Подробная аналитика платформы',
                enabled: false,
                icon: '📈',
                color: 'indigo',
                features: ['Дашборды', 'Метрики', 'Экспорт', 'Прогнозы']
            }
        ]
    })

    // Проверка доступа
    if (!user || user.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    const toggleModule = (id: string) => {
        const updated = modules.map(mod =>
            mod.id === id ? { ...mod, enabled: !mod.enabled } : mod
        )
        setModules(updated)
        localStorage.setItem('platform_modules', JSON.stringify(updated))
    }

    const colorClasses = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' },
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100' },
        cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100' }
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/developer/panel')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к панели
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    🧩 Менеджер модулей
                </h1>
                <p className="text-gray-600 mt-2">
                    Управление модулями платформы
                </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {modules.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Всего модулей</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {modules.filter(m => m.enabled).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Активных</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {modules.filter(m => !m.enabled).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Отключено</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {modules.reduce((acc, m) => acc + m.features.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Функций</div>
                    </div>
                </Card>
            </div>

            {/* Модули */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => {
                    const colors = colorClasses[module.color as keyof typeof colorClasses]

                    return (
                        <Card
                            key={module.id}
                            className={`p-6 border-2 ${module.enabled ? colors.border : 'border-gray-200'} ${module.enabled ? colors.bg : 'bg-gray-50'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">{module.icon}</div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${module.enabled ? colors.text : 'text-gray-700'}`}>
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${module.enabled ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${module.enabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Статус */}
                            <div className="mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${module.enabled
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                    {module.enabled ? '✅ Активен' : '⭕ Отключен'}
                                </span>
                            </div>

                            {/* Функции */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Функции модуля:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {module.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 rounded text-xs ${module.enabled ? colors.badge : 'bg-gray-200'
                                                } ${module.enabled ? colors.text : 'text-gray-600'}`}
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Информация */}
            <Card className="mt-6 p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Информация</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Отключение модуля скрывает его для всех пользователей</li>
                    <li>• Данные модуля сохраняются и восстанавливаются при включении</li>
                    <li>• Изменения применяются мгновенно</li>
                    <li>• Критические модули (Курсы, Проекты) рекомендуется не отключать</li>
                </ul>
            </Card>
        </div>
    )
}
