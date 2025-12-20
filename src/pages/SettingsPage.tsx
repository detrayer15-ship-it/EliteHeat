import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, User, Bell, Lock, Shield, MessageSquare } from 'lucide-react'

export const SettingsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [activeTab, setActiveTab] = useState('account')
    const [settings, setSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        language: 'ru',
        notifications: {
            deadlines: true,
            teacher: true,
            progress: true,
            chat: true
        },
        privacy: {
            profileVisible: true,
            showEmail: false,
            allowMessages: true
        },
        security: {
            twoFactor: false,
            loginAlerts: true
        }
    })

    // Вкладки зависят от роли пользователя
    const tabs = [
        { id: 'account', name: 'Аккаунт', icon: User },
        { id: 'notifications', name: 'Уведомления', icon: Bell },
        // Чаты только для учеников
        ...(user?.role === 'student' ? [{ id: 'chats', name: 'Чаты', icon: MessageSquare }] : []),
        { id: 'privacy', name: 'Приватность', icon: Lock },
        { id: 'security', name: 'Безопасность', icon: Shield }
    ]

    const handleSave = () => {
        // Здесь будет сохранение в Firestore
        alert('Настройки сохранены!')
    }

    const handleLanguageChange = (lang: string) => {
        setSettings({ ...settings, language: lang })
        // Здесь будет реальная смена языка
        alert(`Язык изменён на: ${lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : 'Қазақша'}`)
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">⚙️ Настройки</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Вкладки */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <div className="space-y-2">
                            {tabs.map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === tab.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </Card>
                </div>

                {/* Контент */}
                <div className="lg:col-span-3">
                    <Card className="p-6">
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">👤 Аккаунт</h2>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Имя</label>
                                    <Input
                                        value={settings.name}
                                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                        placeholder="Введите ваше имя"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <Input
                                        value={settings.email}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Язык интерфейса</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => handleLanguageChange('ru')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.language === 'ru'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">🇷🇺</div>
                                            <div className="font-bold">Русский</div>
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('en')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.language === 'en'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">🇬🇧</div>
                                            <div className="font-bold">English</div>
                                        </button>
                                        <button
                                            onClick={() => handleLanguageChange('kz')}
                                            className={`p-4 rounded-lg border-2 transition-all ${settings.language === 'kz'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">🇰🇿</div>
                                            <div className="font-bold">Қазақша</div>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-3">
                                        Текущий язык: {
                                            settings.language === 'ru' ? 'Русский' :
                                                settings.language === 'en' ? 'English' :
                                                    'Қазақша'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">🔔 Уведомления</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Дедлайны заданий</div>
                                            <div className="text-sm text-gray-600">Уведомления о приближающихся дедлайнах</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.deadlines}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, deadlines: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Ответы наставника</div>
                                            <div className="text-sm text-gray-600">Когда наставник отвечает в чате</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.teacher}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, teacher: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Напоминания о прогрессе</div>
                                            <div className="text-sm text-gray-600">Еженедельные отчёты о вашем прогрессе</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.progress}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, progress: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Новые сообщения в чате</div>
                                            <div className="text-sm text-gray-600">Уведомления о новых сообщениях</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.chat}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                notifications: { ...settings.notifications, chat: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'chats' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">💬 Чаты с наставниками</h2>

                                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mb-6">
                                    <div className="font-bold mb-2">📌 Ваши чаты</div>
                                    <p className="text-sm text-gray-700 mb-3">
                                        У вас есть доступ к чатам с наставниками. Перейдите в раздел "Чаты" для общения.
                                    </p>
                                    <Button onClick={() => navigate('/student/chats')}>
                                        Перейти к чатам
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Звук уведомлений</div>
                                            <div className="text-sm text-gray-600">Звуковой сигнал при новом сообщении</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Показывать статус "онлайн"</div>
                                            <div className="text-sm text-gray-600">Другие видят когда вы онлайн</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Автоматические ответы</div>
                                            <div className="text-sm text-gray-600">Показывать быстрые ответы</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">🔒 Приватность</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Видимость профиля</div>
                                            <div className="text-sm text-gray-600">Другие ученики могут видеть ваш профиль</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.profileVisible}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                privacy: { ...settings.privacy, profileVisible: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Показывать email</div>
                                            <div className="text-sm text-gray-600">Email виден в профиле</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.showEmail}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                privacy: { ...settings.privacy, showEmail: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Разрешить сообщения</div>
                                            <div className="text-sm text-gray-600">Другие ученики могут писать вам</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.allowMessages}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                privacy: { ...settings.privacy, allowMessages: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">🛡️ Безопасность</h2>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="font-medium mb-2">Изменить пароль</div>
                                        <div className="space-y-3">
                                            <Input type="password" placeholder="Текущий пароль" />
                                            <Input type="password" placeholder="Новый пароль" />
                                            <Input type="password" placeholder="Повторите новый пароль" />
                                            <Button>Изменить пароль</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Двухфакторная аутентификация</div>
                                            <div className="text-sm text-gray-600">Дополнительная защита аккаунта</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.security.twoFactor}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                security: { ...settings.security, twoFactor: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium">Уведомления о входе</div>
                                            <div className="text-sm text-gray-600">Получать уведомления при входе в аккаунт</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.security.loginAlerts}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                security: { ...settings.security, loginAlerts: e.target.checked }
                                            })}
                                            className="w-5 h-5"
                                        />
                                    </div>

                                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                                        <div className="font-bold text-red-700 mb-2">⚠️ Опасная зона</div>
                                        <p className="text-sm text-red-600 mb-3">
                                            Удаление аккаунта необратимо. Все ваши данные будут потеряны.
                                        </p>
                                        <Button className="bg-red-600 hover:bg-red-700">
                                            Удалить аккаунт
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button onClick={handleSave} className="mt-6 w-full">
                            💾 Сохранить изменения
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
