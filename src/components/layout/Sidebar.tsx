import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const navItems = [
    { path: '/dashboard', label: 'Главная', icon: '🏠' },
    { path: '/projects', label: 'Проекты', icon: '📁' },
    { path: '/tasks', label: 'Курсы', icon: '🎓' },
    { path: '/progress', label: 'Трекер Прогресса', icon: '📊' },
    { path: '/ai-assistant', label: 'AI Помощник', icon: '🤖' },
    { path: '/analyzer', label: 'AI Review', icon: '🤖' },
    { path: '/subscription', label: 'Подписка', icon: '💎' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
]

export const Sidebar = () => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    return (
        <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-ai-blue bg-clip-text text-transparent">
                    EliteHeat
                </h1>
                <p className="text-sm text-gray-600 mt-1">Образовательная платформа</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-smooth ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}

                    {/* Задания - только для админов */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/submissions"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-smooth ${location.pathname === '/submissions'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl">📝</span>
                            <span className="font-medium">Задания</span>
                        </Link>
                    )}

                    {/* Админ-панель - только для админов */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-smooth ${location.pathname === '/admin'
                                    ? 'bg-error text-white'
                                    : 'text-error hover:bg-error/10'
                                }`}
                        >
                            <span className="text-xl">👑</span>
                            <span className="font-medium">Админ-панель</span>
                        </Link>
                    )}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t">
                {user ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-ai-blue rounded-full flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text truncate">{user.name}</p>
                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-smooth"
                        >
                            Выйти
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="block w-full px-4 py-2 bg-primary text-white text-center rounded-lg font-medium hover:bg-primary/90 transition-smooth"
                    >
                        Войти
                    </Link>
                )}
            </div>
        </div>
    )
}
