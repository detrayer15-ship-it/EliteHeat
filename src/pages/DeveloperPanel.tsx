import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export const DeveloperPanel = () => {
    const currentUser = useAuthStore((state) => state.user)
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const [logs, setLogs] = useState<string[]>([])
    const [debugMode, setDebugMode] = useState(false)

    // Проверка доступа
    const actualUser = user || currentUser

    if (!actualUser || actualUser.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Вернуться на главную
                </button>
            </div>
        )
    }

    const handleGetLogs = async () => {
        const newLogs = [
            `[${new Date().toLocaleTimeString()}] System started`,
            `[${new Date().toLocaleTimeString()}] Users online: 15`,
            `[${new Date().toLocaleTimeString()}] Active projects: 42`,
        ]
        setLogs(newLogs)
    }

    const handleClearCache = () => {
        localStorage.clear()
        alert('✅ Кэш очищен!')
    }

    const handleToggleDebug = () => {
        setDebugMode(!debugMode)
        localStorage.setItem('debug_mode', (!debugMode).toString())
        alert(`🔧 Debug режим: ${!debugMode ? 'ВКЛ' : 'ВЫКЛ'}`)
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">🛠️ Developer Panel</h1>
                <p className="text-gray-600 mt-2">Полный контроль над платформой EliteHeat</p>
            </div>

            {/* Управление пользователями */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Управление пользователями</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Управление ролями */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">👥</span>
                            <h2 className="text-xl font-bold">Управление ролями</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Изменение ролей пользователей</p>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Назначение рангов */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">👑</span>
                            <h2 className="text-xl font-bold">Назначение рангов</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Назначить ранг учителю (1-9)</p>
                        <button
                            onClick={() => navigate('/developer/assign-rank')}
                            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Блокировки пользователей */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🚫</span>
                            <h2 className="text-xl font-bold">Блокировки</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Временный / постоянный бан</p>
                        <button
                            onClick={() => navigate('/developer/blocks')}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Permission Matrix */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🛡️</span>
                            <h2 className="text-xl font-bold">Матрица доступов</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Роли → Права доступа</p>
                        <button
                            onClick={() => navigate('/developer/access-matrix')}
                            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* User Activity Live */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">👀</span>
                            <h2 className="text-xl font-bold">Активность онлайн</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Кто онлайн и где находится</p>
                        <button
                            onClick={() => navigate('/developer/live-activity')}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>
                </div>
            </div>

            {/* AI и система */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🧠 AI и система</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* AI Control Center */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-cyan-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🤖</span>
                            <h2 className="text-xl font-bold">AI Control Center</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Лимиты, логи, управление</p>
                        <button
                            onClick={() => navigate('/developer/ai-control')}
                            className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* AI Usage Stats */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-teal-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📈</span>
                            <h2 className="text-xl font-bold">AI Статистика</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Запросы по дням и пользователям</p>
                        <button
                            onClick={() => navigate('/developer/ai-stats')}
                            className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Feature Flags */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🔑</span>
                            <h2 className="text-xl font-bold">Feature Flags</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Вкл/выкл функций без деплоя</p>
                        <button
                            onClick={() => navigate('/developer/feature-flags')}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>
                </div>
            </div>

            {/* Тестирование и отладка */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🧪 Тестирование и отладка</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Debug режим */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🐛</span>
                            <h2 className="text-xl font-bold">Debug режим</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Статус: {debugMode ? '🟢 ВКЛ' : '🔴 ВЫКЛ'}
                        </p>
                        <button
                            onClick={handleToggleDebug}
                            className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${debugMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {debugMode ? 'Выключить' : 'Включить'}
                        </button>
                    </div>

                    {/* Reset User State */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🔄</span>
                            <h2 className="text-xl font-bold">Сброс прогресса</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Сброс данных ученика</p>
                        <button
                            onClick={() => navigate('/developer/reset-user')}
                            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Seed Data */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📦</span>
                            <h2 className="text-xl font-bold">Тестовые данные</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Загрузить учеников / курсы</p>
                        <button
                            onClick={() => navigate('/developer/test-data')}
                            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Error Monitor */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🧯</span>
                            <h2 className="text-xl font-bold">Монитор ошибок</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Последние ошибки системы</p>
                        <button
                            onClick={() => navigate('/developer/error-monitor')}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Логи системы */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📋</span>
                            <h2 className="text-xl font-bold">Логи системы</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Просмотр системных логов</p>
                        <button
                            onClick={handleGetLogs}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Получить логи
                        </button>
                    </div>

                    {/* Очистка кэша */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🗑️</span>
                            <h2 className="text-xl font-bold">Очистка кэша</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Очистить localStorage</p>
                        <button
                            onClick={handleClearCache}
                            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Очистить
                        </button>
                    </div>
                </div>
            </div>

            {/* Контент и данные */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Контент и данные</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Экспорт данных */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📤</span>
                            <h2 className="text-xl font-bold">Экспорт данных</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Пользователи / проекты (CSV/JSON)</p>
                        <button
                            onClick={() => navigate('/developer/export')}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Импорт данных */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📥</span>
                            <h2 className="text-xl font-bold">Импорт данных</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Массовая загрузка учеников</p>
                        <button
                            onClick={() => navigate('/developer/import')}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>
                </div>
            </div>

            {/* Архитектура платформы */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🧱 Архитектура платформы</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Modules Manager */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🧩</span>
                            <h2 className="text-xl font-bold">Менеджер модулей</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Вкл/выкл модули платформы</p>
                        <button
                            onClick={() => navigate('/developer/modules')}
                            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🕒</span>
                            <h2 className="text-xl font-bold">Режим обслуживания</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Закрыть сайт для пользователей</p>
                        <button
                            onClick={() => navigate('/developer/maintenance')}
                            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>

                    {/* Performance Monitor */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">📊</span>
                            <h2 className="text-xl font-bold">Мониторинг производительности</h2>
                        </div>
                        <p className="text-gray-600 mb-4">Время загрузки, ошибки API</p>
                        <button
                            onClick={() => navigate('/developer/performance')}
                            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            Открыть
                        </button>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📊</span>
                    <h2 className="text-xl font-bold">Статистика платформы</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">243</p>
                        <p className="text-sm text-gray-600 mt-1">Пользователей</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">127</p>
                        <p className="text-sm text-gray-600 mt-1">Проектов</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">2</p>
                        <p className="text-sm text-gray-600 mt-1">Курсов</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-3xl font-bold text-orange-600">15</p>
                        <p className="text-sm text-gray-600 mt-1">Онлайн</p>
                    </div>
                </div>
            </div>

            {/* Логи */}
            {logs.length > 0 && (
                <div className="mt-6 bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
                    <h3 className="text-white font-bold mb-4">📋 System Logs:</h3>
                    {logs.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
