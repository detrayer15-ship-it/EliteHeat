import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, FolderKanban, BookOpen, TrendingUp, Settings, Bot } from 'lucide-react'

const navItems = [
    { path: '/dashboard', icon: Home, label: 'Главная' },
    { path: '/projects', icon: FolderKanban, label: 'Проекты' },
    { path: '/ai-assistant', icon: Bot, label: 'Мита' },
    { path: '/progress', icon: TrendingUp, label: 'Прогресс' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
]

export const MobileNav = () => {
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[1.75rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] mx-auto max-w-md">
                <div className="flex items-center justify-around py-2 px-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path === '/dashboard' && location.pathname === '/')
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center py-2 px-3 min-w-[60px] transition-all duration-300"
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNavIndicator"
                                        className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}

                                {/* Icon Container */}
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative p-2 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />

                                    {/* Pulse effect for AI */}
                                    {item.path === '/ai-assistant' && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    )}
                                </motion.div>

                                {/* Label */}
                                <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400'
                                    }`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

