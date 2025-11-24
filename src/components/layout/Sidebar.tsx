import { Link, useLocation } from 'react-router-dom'

const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
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

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 hidden lg:block">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary">EliteHeat</h1>
                <p className="text-sm text-gray-600 mt-1">Образовательная платформа</p>
            </div>

            <nav className="px-3">
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
        </aside>
    )
}
