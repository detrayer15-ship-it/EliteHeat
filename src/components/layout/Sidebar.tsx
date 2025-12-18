import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { EliteHeatLogo } from '@/components/ui/EliteHeatLogo'

const navItems = [
    { path: '/dashboard', label: 'Главная', icon: '🏠' },
    { path: '/projects', label: 'Проекты', icon: '📁' },
    { path: '/tasks', label: 'Курсы', icon: '🎓' },
    { path: '/progress', label: 'Трекер Прогресса', icon: '📊' },
    { path: '/ai-assistant', label: 'AI Помощник', icon: '✨' },
    { path: '/settings', label: 'Настройки', icon: '⚙️' },
]

export const Sidebar = () => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Burger Menu Button - Mobile Only */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-smooth"
                aria-label="Toggle menu"
            >
                <div className="w-6 h-5 flex flex-col justify-between">
                    <span className={`block h-0.5 w-full bg-gray-800 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-gray-800 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-gray-800 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>

            {/* Overlay - Mobile Only */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-gradient-to-b from-white to-gray-50 h-screen fixed left-0 top-0 shadow-2xl flex flex-col z-40
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <EliteHeatLogo className="w-12 h-12" />
                        <h1 className="text-2xl font-bold flex items-center">
                            <span className="text-blue-700">Elite</span>
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Heat</span>
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600">Образовательная платформа</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 group animate-slideIn ${isActive
                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md hover:scale-105 hover:translate-x-2'
                                        }`}
                                >
                                    <span className={`text-xl transition-transform duration-300 ${isActive ? 'animate-bounce' : 'group-hover:scale-125 group-hover:rotate-12'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                                    )}
                                </Link>
                            )
                        })}

                        {/* Связаться с ментором - только для учеников */}
                        {user?.role === 'student' && (
                            <Link
                                to="/chat"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/chat'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">💬</span>
                                <span className="font-medium">Связаться с ментором</span>
                            </Link>
                        )}

                        {/* Мои задания - только для учеников */}
                        {user?.role === 'student' && (
                            <Link
                                to="/my-assignments"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/my-assignments'
                                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">📝</span>
                                <span className="font-medium">Мои задания</span>
                            </Link>
                        )}

                        {/* Задания - для админов и разработчиков */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link
                                to="/submissions"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/submissions'
                                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">📝</span>
                                <span className="font-medium">Задания</span>
                            </Link>
                        )}

                        {/* Чаты - для админов и разработчиков */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link
                                to="/admin/chat"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/admin/chat'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">💬</span>
                                <span className="font-medium">Чаты учеников</span>
                            </Link>
                        )}

                        {/* Групповой чат - для админов и разработчиков */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link
                                to="/admin/group-chat"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/admin/group-chat'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-100 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">👥</span>
                                <span className="font-medium">Чат админов</span>
                            </Link>
                        )}

                        {/* Ранги и очки - для админов и разработчиков */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link
                                to="/admin/ranks"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/admin/ranks'
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-100 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">🏆</span>
                                <span className="font-medium">Ранги и очки</span>
                            </Link>
                        )}

                        {/* Админ-панель - для админов и разработчиков */}
                        {(user?.role === 'admin' || user?.role === 'developer') && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/admin'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105'
                                    : 'text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">👑</span>
                                <span className="font-medium">Админ-панель</span>
                            </Link>
                        )}

                        {/* Developer Panel - ТОЛЬКО для разработчиков */}
                        {user?.role === 'developer' && (
                            <Link
                                to="/developer/panel"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-300 ${location.pathname === '/developer/panel'
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:shadow-md'
                                    }`}
                            >
                                <span className="text-xl">🛠️</span>
                                <span className="font-medium">Developer Panel</span>
                            </Link>
                        )}
                    </ul>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200 bg-white">
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
        </>
    )
}
