import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export const MaintenancePage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
        return localStorage.getItem('maintenance_mode') === 'true'
    })
    const [message, setMessage] = useState(() => {
        return localStorage.getItem('maintenance_message') || 'Платформа временно недоступна. Ведутся технические работы.'
    })
    const [estimatedTime, setEstimatedTime] = useState(() => {
        return localStorage.getItem('maintenance_time') || '30 минут'
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

    const toggleMaintenanceMode = () => {
        const newValue = !isMaintenanceMode
        setIsMaintenanceMode(newValue)
        localStorage.setItem('maintenance_mode', newValue.toString())
        localStorage.setItem('maintenance_message', message)
        localStorage.setItem('maintenance_time', estimatedTime)

        if (newValue) {
            alert('⚠️ Режим обслуживания ВКЛЮЧЕН!\n\nПользователи не смогут войти на сайт.')
        } else {
            alert('✅ Режим обслуживания ВЫКЛЮЧЕН!\n\nСайт снова доступен для всех.')
        }
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
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
                    🕒 Режим обслуживания
                </h1>
                <p className="text-gray-600 mt-2">
                    Временное отключение сайта для пользователей
                </p>
            </div>

            {/* Статус */}
            <Card className={`p-8 mb-6 border-2 ${isMaintenanceMode
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`text-6xl ${isMaintenanceMode ? 'animate-pulse' : ''}`}>
                            {isMaintenanceMode ? '🚫' : '✅'}
                        </div>
                        <div>
                            <h2 className={`text-3xl font-bold mb-2 ${isMaintenanceMode ? 'text-red-700' : 'text-green-700'
                                }`}>
                                {isMaintenanceMode ? 'Режим обслуживания АКТИВЕН' : 'Сайт работает нормально'}
                            </h2>
                            <p className={`text-lg ${isMaintenanceMode ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {isMaintenanceMode
                                    ? 'Пользователи не могут войти на сайт'
                                    : 'Все пользователи имеют доступ'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleMaintenanceMode}
                        className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${isMaintenanceMode ? 'bg-red-500' : 'bg-green-500'
                            }`}
                    >
                        <span
                            className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${isMaintenanceMode ? 'translate-x-12' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </Card>

            {/* Настройки */}
            <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    ⚙️ Настройки сообщения
                </h2>

                <div className="space-y-4">
                    {/* Сообщение */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Сообщение для пользователей
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                            placeholder="Введите сообщение..."
                        />
                    </div>

                    {/* Время */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Примерное время работ
                        </label>
                        <Input
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            placeholder="Например: 30 минут, 2 часа"
                        />
                    </div>

                    {/* Кнопка сохранения */}
                    <Button
                        onClick={() => {
                            localStorage.setItem('maintenance_message', message)
                            localStorage.setItem('maintenance_time', estimatedTime)
                            alert('✅ Настройки сохранены!')
                        }}
                        className="w-full"
                    >
                        Сохранить настройки
                    </Button>
                </div>
            </Card>

            {/* Предпросмотр */}
            <Card className="p-6 mb-6 bg-gray-900 text-white">
                <h2 className="text-xl font-bold mb-4">
                    👁️ Предпросмотр страницы обслуживания
                </h2>

                <div className="bg-gray-800 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">🔧</div>
                    <h1 className="text-3xl font-bold mb-4">
                        Технические работы
                    </h1>
                    <p className="text-lg text-gray-300 mb-4">
                        {message}
                    </p>
                    <div className="inline-block px-4 py-2 bg-blue-600 rounded-lg">
                        <p className="text-sm">
                            ⏱️ Примерное время: {estimatedTime}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Предупреждение */}
            <Card className="p-6 bg-yellow-50 border-2 border-yellow-300">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-yellow-900 mb-2">⚠️ Важно!</h3>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• При включении режима обслуживания все пользователи будут выкинуты с сайта</li>
                            <li>• Только разработчики смогут войти на платформу</li>
                            <li>• Используйте эту функцию только для критических обновлений</li>
                            <li>• Не забудьте выключить режим после завершения работ!</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Информация */}
            <Card className="mt-6 p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Как использовать</h3>
                <ol className="text-sm text-blue-800 space-y-2">
                    <li>1. Настройте сообщение и время работ</li>
                    <li>2. Нажмите переключатель для включения режима</li>
                    <li>3. Выполните необходимые работы</li>
                    <li>4. Выключите режим обслуживания</li>
                    <li>5. Пользователи снова смогут войти на сайт</li>
                </ol>
            </Card>
        </div>
    )
}
