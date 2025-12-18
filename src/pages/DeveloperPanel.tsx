import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export const DeveloperPanel = () => {
    const currentUser = useAuthStore((state) => state.currentUser)
    const user = useAuthStore((state) => state.user) // Добавляем user
    const navigate = useNavigate()
    const [logs, setLogs] = useState<string[]>([])
    const [debugMode, setDebugMode] = useState(false)

    // Проверка доступа - используем user вместо currentUser
    const actualUser = user || currentUser
    
    console.log('DeveloperPanel - user:', actualUser)
    
    if (!actualUser || actualUser.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <p className="mt-2 text-sm text-gray-600">
                    Текущая роль: {actualUser?.role || 'не определена'}
                </p>
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
                <p className="text-gray-600 mt-2">Скрытые функции для разработчиков</p>
            </div>

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

                {/* Тестовые функции */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pink-200">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🧪</span>
                        <h2 className="text-xl font-bold">Тестовые функции</h2>
                    </div>
                    <p className="text-gray-600 mb-4">Экспериментальные фичи</p>
                    <button
                        className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        onClick={() => alert('🧪 Тестовая функция выполнена!')}
                    >
                        Запустить тест
                    </button>
                </div>

                {/* Статистика */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📊</span>
                        <h2 className="text-xl font-bold">Статистика</h2>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>👥 Пользователей: 243</p>
                        <p>📁 Проектов: 127</p>
                        <p>🎓 Курсов: 2</p>
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
