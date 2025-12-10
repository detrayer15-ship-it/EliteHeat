import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/settingsStore'
import { useAuthStore } from '@/store/authStore'

export const SettingsPage = () => {
    const theme = useSettingsStore((state) => state.theme)
    const language = useSettingsStore((state) => state.language)
    const setTheme = useSettingsStore((state) => state.setTheme)
    const setLanguage = useSettingsStore((state) => state.setLanguage)
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()

    // Состояния настроек
    const [pushNotifications, setPushNotifications] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [messageNotifications, setMessageNotifications] = useState(true)
    const [assignmentNotifications, setAssignmentNotifications] = useState(true)
    const [fontSize, setFontSize] = useState('medium')
    const [animations, setAnimations] = useState(true)
    const [compactMode, setCompactMode] = useState(false)

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    const handleLanguageChange = (newLanguage: 'ru' | 'en' | 'kz') => {
        setLanguage(newLanguage as 'ru' | 'en')
    }

    const handleFontSizeChange = (size: string) => {
        setFontSize(size)
        const root = document.documentElement
        if (size === 'small') root.style.fontSize = '14px'
        else if (size === 'medium') root.style.fontSize = '16px'
        else if (size === 'large') root.style.fontSize = '18px'
    }

    return (
        <div className="space-y-6 page-transition">
            {/* Заголовок */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        ⚙️ Настройки
                    </h1>
                    <p className="text-gray-600">Управление вашим профилем и предпочтениями</p>
                </div>
                {user?.role === 'admin' && (
                    <Button onClick={() => navigate('/admin/users')} variant="primary">
                        👑 Управление пользователями
                    </Button>
                )}
            </div>

            {/* Роль пользователя */}
            {user && (
                <Card hover>
                    <h2 className="text-xl font-bold text-text mb-4">👤 Роль пользователя</h2>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-xl border border-primary/20">
                        <div className="text-5xl">
                            {user.role === 'admin' ? '👑' : '🎓'}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                                {user.role === 'admin' ? 'Администратор' : 'Ученик'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {user.role === 'admin'
                                    ? 'У вас есть доступ к админ-панели и управлению пользователями'
                                    : 'Вы можете проходить курсы и выполнять задания'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Профиль */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">👤 Профиль</h2>
                {user ? (
                    <div>
                        <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-lg text-text">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                                <div className="text-xs text-gray-500 mt-1">📍 {user.city}</div>
                            </div>
                        </div>
                        <Button onClick={() => navigate('/profile/edit')}>
                            ✏️ Редактировать профиль
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

            {/* Уведомления */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">🔔 Настройки уведомлений</h2>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <div className="font-medium">Push-уведомления</div>
                                <div className="text-sm text-gray-600">Получать уведомления на устройство</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={pushNotifications}
                            onChange={(e) => setPushNotifications(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            <div>
                                <div className="font-medium">Email-уведомления</div>
                                <div className="text-sm text-gray-600">Получать письма на почту</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💬</span>
                            <div>
                                <div className="font-medium">Уведомления о сообщениях</div>
                                <div className="text-sm text-gray-600">Новые сообщения в чате</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={messageNotifications}
                            onChange={(e) => setMessageNotifications(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <div>
                                <div className="font-medium">Уведомления о заданиях</div>
                                <div className="text-sm text-gray-600">Новые задания и обновления</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={assignmentNotifications}
                            onChange={(e) => setAssignmentNotifications(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>
                </div>
            </Card>

            {/* Тема оформления */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">🎨 Тема оформления</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col items-center gap-3 p-6 border-2 rounded-xl cursor-pointer hover:shadow-lg transition-all">
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={theme === 'light'}
                            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            className="w-5 h-5 accent-primary"
                        />
                        <div className="w-full h-16 bg-gradient-to-br from-white to-gray-100 border-2 rounded-lg shadow-inner"></div>
                        <span className="text-base font-semibold">☀️ Светлая тема</span>
                    </label>
                    <label className="flex flex-col items-center gap-3 p-6 border-2 rounded-xl cursor-pointer hover:shadow-lg transition-all">
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
                            className="w-5 h-5 accent-primary"
                        />
                        <div className="w-full h-16 bg-gradient-to-br from-gray-800 to-gray-900 border-2 rounded-lg shadow-inner"></div>
                        <span className="text-base font-semibold">🌙 Тёмная тема</span>
                    </label>
                </div>
            </Card>

            {/* Язык интерфейса */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">🌐 Язык интерфейса</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <input
                            type="radio"
                            name="language"
                            value="ru"
                            checked={language === 'ru'}
                            onChange={(e) => handleLanguageChange(e.target.value as 'ru' | 'en' | 'kz')}
                            className="w-5 h-5 accent-primary"
                        />
                        <span className="text-2xl">🇷🇺</span>
                        <span className="font-medium">Русский</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <input
                            type="radio"
                            name="language"
                            value="kz"
                            checked={language === 'kz'}
                            onChange={(e) => handleLanguageChange(e.target.value as 'ru' | 'en' | 'kz')}
                            className="w-5 h-5 accent-primary"
                        />
                        <span className="text-2xl">🇰🇿</span>
                        <span className="font-medium">Қазақша</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <input
                            type="radio"
                            name="language"
                            value="en"
                            checked={language === 'en'}
                            onChange={(e) => handleLanguageChange(e.target.value as 'ru' | 'en' | 'kz')}
                            className="w-5 h-5 accent-primary"
                        />
                        <span className="text-2xl">🇬🇧</span>
                        <span className="font-medium">English</span>
                    </label>
                </div>
            </Card>

            {/* Настройки интерфейса */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">🖥️ Настройки интерфейса</h2>
                <div className="space-y-4">
                    {/* Размер текста */}
                    <div>
                        <label className="block font-medium mb-3">📏 Размер текста</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['small', 'medium', 'large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFontSizeChange(size)}
                                    className={`p-3 border-2 rounded-xl font-medium transition-all ${fontSize === size
                                            ? 'border-primary bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary'
                                            : 'border-gray-200 hover:border-primary/50'
                                        }`}
                                >
                                    {size === 'small' && 'Маленький'}
                                    {size === 'medium' && 'Средний'}
                                    {size === 'large' && 'Большой'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Анимации */}
                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✨</span>
                            <div>
                                <div className="font-medium">Анимации</div>
                                <div className="text-sm text-gray-600">Плавные переходы и эффекты</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={animations}
                            onChange={(e) => setAnimations(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    {/* Компактный режим */}
                    <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📐</span>
                            <div>
                                <div className="font-medium">Компактный режим</div>
                                <div className="text-sm text-gray-600">Уменьшенные отступы между элементами</div>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={compactMode}
                            onChange={(e) => setCompactMode(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>
                </div>
            </Card>

            {/* Интеграции (скоро) */}
            <Card hover>
                <h2 className="text-xl font-bold text-text mb-4">🔗 Интеграции</h2>
                <div className="space-y-3">
                    <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🔐</span>
                            <span className="font-medium">Вход через Google</span>
                            <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Скоро</span>
                        </div>
                        <p className="text-sm text-gray-600">Быстрый вход с помощью Google аккаунта</p>
                    </div>

                    <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">💳</span>
                            <span className="font-medium">Kaspi & Stripe</span>
                            <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Скоро</span>
                        </div>
                        <p className="text-sm text-gray-600">Оплата подписки через Kaspi или банковскую карту</p>
                    </div>

                    <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🗺️</span>
                            <span className="font-medium">2ГИС / Google Maps</span>
                            <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Скоро</span>
                        </div>
                        <p className="text-sm text-gray-600">Интеграция с картами для поиска офисов</p>
                    </div>
                </div>
            </Card>

            {/* Опасная зона */}
            <Card>
                <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Опасная зона</h2>
                <div className="space-y-3">
                    <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50">
                        🗑️ Удалить все данные
                    </Button>
                    <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50">
                        ❌ Удалить аккаунт
                    </Button>
                </div>
            </Card>
        </div>
    )
}
