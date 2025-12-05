import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const AdminPage = () => {
    const user = useAuthStore((state) => state.user)
    const users = useAuthStore((state) => state.users)
    const changeUserRole = useAuthStore((state) => state.changeUserRole)
    const [selectedTab, setSelectedTab] = useState<'users' | 'settings' | 'stats'>('users')

    const changeRole = (userId: string, newRole: 'student' | 'admin') => {
        changeUserRole(userId, newRole)
    }

    const deleteUser = (userId: string) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            // Здесь будет логика удаления
            alert('Функция удаления будет добавлена')
        }
    }

    if (user?.role !== 'admin') {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-error mb-4">Доступ запрещен</h1>
                <p className="text-gray-600">Эта страница доступна только администраторам</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">👑 Админ-панель</h1>
                <p className="text-gray-600">Управление пользователями и настройками платформы</p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">👥</div>
                        <h3 className="font-semibold text-text">Всего пользователей</h3>
                        <p className="text-2xl font-bold text-primary">{users.length}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="font-semibold text-text">Учеников</h3>
                        <p className="text-2xl font-bold text-success">
                            {users.filter(u => u.role === 'student').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">👑</div>
                        <h3 className="font-semibold text-text">Админов</h3>
                        <p className="text-2xl font-bold text-error">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <div className="text-3xl mb-2">⭐</div>
                        <h3 className="font-semibold text-text">Всего очков</h3>
                        <p className="text-2xl font-bold text-warning">
                            {users.reduce((sum, u) => sum + (u.points || 0), 0)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Вкладки */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setSelectedTab('users')}
                    className={`px-4 py-2 font-semibold transition-smooth ${selectedTab === 'users'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    👥 Пользователи
                </button>
                <button
                    onClick={() => setSelectedTab('settings')}
                    className={`px-4 py-2 font-semibold transition-smooth ${selectedTab === 'settings'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    ⚙️ Настройки
                </button>
                <button
                    onClick={() => setSelectedTab('stats')}
                    className={`px-4 py-2 font-semibold transition-smooth ${selectedTab === 'stats'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    📊 Статистика
                </button>
            </div>

            {/* Управление пользователями */}
            {selectedTab === 'users' && (
                <Card>
                    <h2 className="text-xl font-bold text-text mb-4">Управление пользователями</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3">Пользователь</th>
                                    <th className="text-left p-3">Email</th>
                                    <th className="text-center p-3">Роль</th>
                                    <th className="text-center p-3">Уровень</th>
                                    <th className="text-center p-3">Очки</th>
                                    <th className="text-center p-3">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-600">{u.email}</td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${u.role === 'admin'
                                                        ? 'bg-error/10 text-error'
                                                        : 'bg-success/10 text-success'
                                                    }`}
                                            >
                                                {u.role === 'admin' ? '👑 Админ' : '🎓 Ученик'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center font-semibold">{u.level || 1}</td>
                                        <td className="p-3 text-center font-semibold">{u.points || 0}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2 justify-center">
                                                {u.id !== user.id && (
                                                    <>
                                                        {u.role === 'student' ? (
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => changeRole(u.id, 'admin')}
                                                                className="text-sm"
                                                            >
                                                                👑 Сделать админом
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() => changeRole(u.id, 'student')}
                                                                className="text-sm"
                                                            >
                                                                🎓 Сделать учеником
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => deleteUser(u.id)}
                                                            className="text-sm text-error"
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </>
                                                )}
                                                {u.id === user.id && (
                                                    <span className="text-sm text-gray-500 italic">Это вы</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Настройки платформы */}
            {selectedTab === 'settings' && (
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-xl font-bold text-text mb-4">⚙️ Настройки платформы</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold">Регистрация новых пользователей</h3>
                                    <p className="text-sm text-gray-600">Разрешить регистрацию на платформе</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold">Автоматическая проверка заданий</h3>
                                    <p className="text-sm text-gray-600">Включить AI для проверки кода</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold">Геймификация</h3>
                                    <p className="text-sm text-gray-600">Очки, уровни и достижения</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-semibold">Email уведомления</h3>
                                    <p className="text-sm text-gray-600">Отправка писем пользователям</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-text mb-4">🎨 Настройки интерфейса</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-2">Название платформы</label>
                                <input
                                    type="text"
                                    defaultValue="EliteHeat"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">Описание</label>
                                <textarea
                                    defaultValue="Образовательная платформа для изучения программирования"
                                    className="w-full p-2 border rounded-lg"
                                    rows={3}
                                />
                            </div>
                            <Button variant="primary">💾 Сохранить изменения</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Статистика */}
            {selectedTab === 'stats' && (
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-xl font-bold text-text mb-4">📊 Детальная статистика</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                                <h3 className="font-semibold mb-2">Активность пользователей</h3>
                                <p className="text-3xl font-bold text-primary">{users.length}</p>
                                <p className="text-sm text-gray-600">Зарегистрировано всего</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                                <h3 className="font-semibold mb-2">Средний уровень</h3>
                                <p className="text-3xl font-bold text-success">
                                    {users.length > 0
                                        ? (users.reduce((sum, u) => sum + (u.level || 1), 0) / users.length).toFixed(1)
                                        : 0}
                                </p>
                                <p className="text-sm text-gray-600">По всем пользователям</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg">
                                <h3 className="font-semibold mb-2">Средние очки</h3>
                                <p className="text-3xl font-bold text-warning">
                                    {users.length > 0
                                        ? Math.round(users.reduce((sum, u) => sum + (u.points || 0), 0) / users.length)
                                        : 0}
                                </p>
                                <p className="text-sm text-gray-600">На одного пользователя</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-error/10 to-error/5 rounded-lg">
                                <h3 className="font-semibold mb-2">Администраторов</h3>
                                <p className="text-3xl font-bold text-error">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                                <p className="text-sm text-gray-600">Всего на платформе</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-text mb-4">🏆 Топ пользователей</h2>
                        <div className="space-y-2">
                            {users
                                .sort((a, b) => (b.points || 0) - (a.points || 0))
                                .slice(0, 5)
                                .map((u, index) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{u.name}</div>
                                                <div className="text-sm text-gray-600">{u.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">{u.points || 0}</div>
                                            <div className="text-sm text-gray-600">очков</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
