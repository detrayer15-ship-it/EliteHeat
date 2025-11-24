import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/settingsStore'
import { useNavigate } from 'react-router-dom'

export const SettingsPage = () => {
    const theme = useSettingsStore((state) => state.theme)
    const language = useSettingsStore((state) => state.language)
    const setTheme = useSettingsStore((state) => state.setTheme)
    const setLanguage = useSettingsStore((state) => state.setLanguage)
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState(true)

    // Временно: проверка авторизации (позже будет из userStore)
    const isLoggedIn = false // Измените на true для тестирования авторизованного состояния

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme)
    }

    const handleLanguageChange = (newLanguage: 'ru' | 'en') => {
        setLanguage(newLanguage)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">Настройки</h1>
                <p className="text-gray-600">Управление вашим профилем и предпочтениями</p>
            </div>

            {/* Профиль / Авторизация */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">👤 Профиль</h2>
                {isLoggedIn ? (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Управляйте своим профилем, аватаром и личной информацией
                        </p>
                        <Button onClick={() => navigate('/profile/edit')}>
                            Редактировать профиль
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Войдите в аккаунт, чтобы сохранять свой прогресс и настройки
                        </p>
                        <div className="flex gap-3">
                            <Button onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                            <Button variant="secondary" onClick={() => navigate('/register')}>
                                Зарегистрироваться
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Язык */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">🌐 Язык интерфейса</h2>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="language"
                            value="ru"
                            checked={language === 'ru'}
                            onChange={(e) => handleLanguageChange(e.target.value as 'ru' | 'en')}
                            className="w-4 h-4"
                        />
                        <span>Русский</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="language"
                            value="en"
                            checked={language === 'en'}
                            onChange={(e) => handleLanguageChange(e.target.value as 'ru' | 'en')}
                            className="w-4 h-4"
                        />
                        <span>English</span>
                    </label>
                </div>
            </Card>

            {/* Уведомления */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">🔔 Уведомления</h2>
                <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <span>Получать напоминания и уведомления</span>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="w-5 h-5"
                    />
                </label>
            </Card>

            {/* Тема оформления */}
            <Card>
                <h2 className="text-xl font-bold text-text mb-4">🎨 Тема оформления</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={theme === 'light'}
                            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            className="w-4 h-4"
                        />
                        <div className="w-full h-12 bg-white border rounded"></div>
                        <span className="text-sm font-medium">☀️ Светлая</span>
                    </label>
                    <label className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            className="w-4 h-4"
                        />
                        <div className="w-full h-12 bg-gray-900 border rounded"></div>
                        <span className="text-sm font-medium">🌙 Тёмная</span>
                    </label>
                </div>
            </Card>
        </div>
    )
}
