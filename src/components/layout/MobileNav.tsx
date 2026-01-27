import { Link, useLocation } from 'react-router-dom'

import { Home, FolderKanban, BookOpen, TrendingUp, Settings } from 'lucide-react'

const navItems = [
    { path: '/dashboard', icon: <Home className="w-6 h-6" /> },
    { path: '/projects', icon: <FolderKanban className="w-6 h-6" /> },
    { path: '/tasks', icon: <BookOpen className="w-6 h-6" /> },
    { path: '/progress', icon: <TrendingUp className="w-6 h-6" /> },
    { path: '/settings', icon: <Settings className="w-6 h-6" /> },
]

export const MobileNav = () => {
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
            <div className="flex items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center py-2 px-3 min-w-[44px] transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {item.icon}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
