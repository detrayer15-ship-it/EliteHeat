import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

interface FeatureFlag {
    id: string
    name: string
    description: string
    enabled: boolean
    category: 'courses' | 'ai' | 'projects' | 'social' | 'other'
}

export const FeatureFlagsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [flags, setFlags] = useState<FeatureFlag[]>(() => {
        const saved = localStorage.getItem('feature_flags')
        return saved ? JSON.parse(saved) : [
            { id: 'python_course', name: 'Курс Python', description: 'Доступ к курсу Python', enabled: true, category: 'courses' },
            { id: 'figma_course', name: 'Курс Figma', description: 'Доступ к курсу Figma', enabled: true, category: 'courses' },
            { id: 'ai_assistant', name: 'AI Ассистент', description: 'Помощник на базе AI', enabled: true, category: 'ai' },
            { id: 'ai_code_review', name: 'AI проверка кода', description: 'Автоматическая проверка кода', enabled: false, category: 'ai' },
            { id: 'projects', name: 'Проекты', description: 'Модуль проектов', enabled: true, category: 'projects' },
            { id: 'chat', name: 'Чаты', description: 'Система чатов', enabled: true, category: 'social' },
            { id: 'comments', name: 'Комментарии', description: 'Комментарии к заданиям', enabled: true, category: 'social' },
            { id: 'leaderboard', name: 'Таблица лидеров', description: 'Рейтинг учеников', enabled: false, category: 'other' },
            { id: 'achievements', name: 'Достижения', description: 'Система достижений', enabled: false, category: 'other' },
            { id: 'notifications', name: 'Уведомления', description: 'Push уведомления', enabled: false, category: 'other' },
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

    const toggleFlag = (id: string) => {
        const updated = flags.map(flag =>
            flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
        )
        setFlags(updated)
        localStorage.setItem('feature_flags', JSON.stringify(updated))
    }

    const enableAll = () => {
        const updated = flags.map(flag => ({ ...flag, enabled: true }))
        setFlags(updated)
        localStorage.setItem('feature_flags', JSON.stringify(updated))
    }

    const disableAll = () => {
        const updated = flags.map(flag => ({ ...flag, enabled: false }))
        setFlags(updated)
        localStorage.setItem('feature_flags', JSON.stringify(updated))
    }

    const categories = {
        courses: { name: 'Курсы', color: 'blue', icon: '📚' },
        ai: { name: 'AI', color: 'purple', icon: '🤖' },
        projects: { name: 'Проекты', color: 'green', icon: '📁' },
        social: { name: 'Социальное', color: 'pink', icon: '💬' },
        other: { name: 'Другое', color: 'gray', icon: '⚙️' }
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

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            🔑 Feature Flags
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Управление функциями платформы без деплоя
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={disableAll}>
                            Выключить все
                        </Button>
                        <Button onClick={enableAll}>
                            Включить все
                        </Button>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {flags.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Всего флагов</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {flags.filter(f => f.enabled).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Включено</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">
                            {flags.filter(f => !f.enabled).length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Выключено</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {Math.round((flags.filter(f => f.enabled).length / flags.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Активность</div>
                    </div>
                </Card>
            </div>

            {/* Флаги по категориям */}
            {Object.entries(categories).map(([key, cat]) => {
                const categoryFlags = flags.filter(f => f.category === key)
                if (categoryFlags.length === 0) return null

                return (
                    <div key={key} className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                            <span className="text-sm text-gray-500 font-normal">
                                ({categoryFlags.filter(f => f.enabled).length}/{categoryFlags.length})
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryFlags.map((flag) => (
                                <Card key={flag.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {flag.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {flag.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${flag.enabled
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {flag.enabled ? '✅ Включено' : '⭕ Выключено'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFlag(flag.id)}
                                            className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${flag.enabled ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* Информация */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Как это работает</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Feature Flags позволяют включать/выключать функции без деплоя</li>
                    <li>• Идеально для A/B тестирования и постепенного rollout</li>
                    <li>• Изменения применяются мгновенно для всех пользователей</li>
                    <li>• Данные сохраняются в localStorage (в продакшене - в БД)</li>
                </ul>
            </Card>
        </div>
    )
}
