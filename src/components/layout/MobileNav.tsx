import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bot, FolderKanban, Home, Settings, TrendingUp } from 'lucide-react'

const navItems = [
    { path: '/dashboard', icon: Home, label: 'Главная' },
    { path: '/projects', icon: FolderKanban, label: 'Проекты' },
    { path: '/student/ai-chat', icon: Bot, label: 'Elly' },
    { path: '/progress', icon: TrendingUp, label: 'Прогресс' },
    { path: '/settings', icon: Settings, label: 'Профиль' },
]

export const MobileNav = () => {
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="mx-auto max-w-md rounded-[2rem] border border-slate-100/80 bg-white/90 shadow-[0_-8px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl">
                <div className="flex items-center justify-around px-2 py-2.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path === '/projects' && location.pathname.startsWith('/projects/'))
                        const Icon = item.icon

                        return (
                            <Link key={item.path} to={item.path} className="relative flex min-w-[56px] flex-col items-center px-2 py-1.5 transition-all duration-300">
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNavIndicator"
                                        className="absolute -top-1.5 h-1 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm shadow-indigo-300/50"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className={`rounded-xl p-2 transition-all duration-300 ${
                                        isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' : 'text-slate-300 hover:text-slate-500'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                                </motion.div>
                                <span className={`mt-1 text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`}>
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
