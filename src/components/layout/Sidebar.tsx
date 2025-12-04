import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'

const navItems = [
    { path: '/dashboard', label: 'Главная', icon: '🏠' },
    { path: '/projects', label: 'Проекты', icon: '📁' },
    { path: '/tasks', label: 'Задачи', icon: '✓' },
    { path: '/progress', label: 'Трекер Прогресса', icon: '📊' },
    { path: '/ai-assistant', label: 'AI Помощник', icon: '🤖' },
    { path: '/analyzer', label: 'Анализ', icon: '📈' },
    { path: '/subscription', label: 'Подписка', icon: '💎' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
]

export const Sidebar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:flex lg:flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary">EliteHeat</h1>
                <p className="text-sm text-gray-600 mt-1">Образовательная платформа</p>
            </div>

            {/* User Profile */}
            {user && (
                <div className="px-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-text truncate">{user.name}</div>
                            <div className="text-xs text-gray-600 truncate">{user.email}</div>
                        </div>
                    </div>
                </div>
            )}

            <nav className="px-3 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-smooth ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-text hover:bg-gray-100'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-gray-200">
                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleLogout}
                >
                    <span className="mr-2">🚪</span>
                    Выйти
                </Button>
            </div>
        </aside>
    )
}
