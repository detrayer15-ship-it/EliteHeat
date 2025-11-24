import { Link, useLocation } from 'react-router-dom'

const navItems = [
    { path: '/', icon: '🏠' },
    { path: '/projects', icon: '📁' },
    { path: '/tasks', icon: '✓' },
    { path: '/progress', icon: '📊' },
    { path: '/subscription', icon: '💎' },
    { path: '/settings', icon: '⚙️' },
]

export const MobileNav = () => {
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center py-3 px-4 transition-smooth ${isActive ? 'text-primary' : 'text-gray-500'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
