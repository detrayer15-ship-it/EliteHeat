import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, TrendingUp, Settings, Calendar } from 'lucide-react'

const navItems = [
    { path: '/dashboard', icon: Home, label: 'Главная' },
    { path: '/tasks', icon: BookOpen, label: 'Уроки' },
    { path: '/student/schedule', icon: Calendar, label: 'Расписание' },
    { path: '/progress', icon: TrendingUp, label: 'Прогресс' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
]

export const MobileNav = () => {
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-100/80 rounded-[2rem] shadow-[0_-8px_50px_rgba(0,0,0,0.06)] mx-auto max-w-md">
                <div className="flex items-center justify-around py-2.5 px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path === '/dashboard' && location.pathname === '/')
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center py-1.5 px-3 min-w-[56px] transition-all duration-300"
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNavIndicator"
                                        className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow-sm shadow-indigo-300/50"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}

                                {/* Icon Container */}
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className={`relative p-2 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100'
                                        : 'text-slate-300 hover:text-slate-500'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                                </motion.div>

                                {/* Label */}
                                <span className={`text-[9px] font-bold mt-1 uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-300'
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
