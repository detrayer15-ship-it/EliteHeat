import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { EliteHeatLogo } from '@/components/ui/EliteHeatLogo'
import {
    Home,
    FolderKanban,
    BookOpen,
    TrendingUp,
    Sparkles,
    Settings,
    MessageSquare,
    LogOut,
    Crown,
    ChevronRight,
    LayoutDashboard,
    Users,
    CheckSquare,
    MessageCircle,
    Terminal,
    Globe
} from 'lucide-react'

interface NavItem {
    path: string
    labelKey: string
    icon: React.ReactNode
    roles: string[]
    isAI?: boolean
}

interface NavGroup {
    title: string
    roles?: string[]
    items: NavItem[]
}

const navGroups: NavGroup[] = [
    {
        title: 'Обучение',
        items: [
            { path: '/dashboard', labelKey: 'dashboard', icon: <Home className="w-6 h-6" />, roles: ['student', 'admin', 'developer'] },
            { path: '/projects', labelKey: 'projects', icon: <FolderKanban className="w-6 h-6" />, roles: ['student'] },
            { path: '/tasks', labelKey: 'tasks', icon: <BookOpen className="w-6 h-6" />, roles: ['student'] },
        ]
    },
    {
        title: 'Администрирование',
        roles: ['admin', 'developer'],
        items: [
            { path: '/admin', labelKey: 'adminPanel', icon: <LayoutDashboard className="w-6 h-6" />, roles: ['admin', 'developer'] },
            { path: '/admin/tasks', labelKey: 'checkTasks', icon: <CheckSquare className="w-6 h-6" />, roles: ['admin', 'developer'] },
            { path: '/admin/users', labelKey: 'students', icon: <Users className="w-6 h-6" />, roles: ['admin', 'developer'] },
            { path: '/admin/groups', labelKey: 'groups', icon: <Users className="w-6 h-6" />, roles: ['admin', 'developer'] },
            { path: '/admin/group-chat', labelKey: 'adminChat', icon: <MessageCircle className="w-6 h-6" />, roles: ['admin', 'developer'] },
        ]
    },
    {
        title: 'Развитие',
        items: [
            { path: '/skill-tree', labelKey: 'skillTree', icon: <TrendingUp className="w-6 h-6" />, roles: ['student'] },
            { path: '/progress', labelKey: 'progressTracker', icon: <TrendingUp className="w-6 h-6" />, roles: ['student'] },
            { path: '/portfolio', labelKey: 'portfolio', icon: <Globe className="w-6 h-6" />, roles: ['student'] },
        ]
    },
    {
        title: 'Система',
        items: [
            { path: '/ai-assistant', labelKey: 'aiAssistant', icon: <Sparkles className="w-6 h-6" />, roles: ['student', 'admin', 'developer'], isAI: true },
            { path: '/developer/panel', labelKey: 'developer', icon: <Terminal className="w-6 h-6" />, roles: ['developer'] },
            { path: '/settings', labelKey: 'settings', icon: <Settings className="w-6 h-6" />, roles: ['student', 'admin', 'developer'] },
        ]
    }
]

export const Sidebar = () => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Burger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl transition-all active:scale-95"
            >
                <div className="w-6 h-5 flex flex-col justify-between overflow-hidden">
                    <span className={`block h-0.5 w-full bg-indigo-500 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-blue-400 transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-indigo-300 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>

            {/* Sidebar Shell */}
            <div className={`
                w-80 h-screen fixed left-0 top-0 z-40 flex flex-col
                transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                bg-[#0f1117] border-r border-white/5 overflow-hidden
            `}>
                {/* Visual Backdrop */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                {/* Neural Lines Decor */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent top-[20%] animate-pulse-slow"></div>
                    <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-[60%] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Logo Section */}
                <div className="p-10 pb-6 relative z-10">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => (window.location.href = '/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-50 transition-all duration-700 scale-150"></div>
                            <EliteHeatLogo className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-black tracking-tighter flex items-center text-glow">
                                <span className="text-white">Elite</span>
                                <span className="text-indigo-400 italic">Heat</span>
                            </h1>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{t('platform')}</p>
                        </div>
                    </div>
                    <div className="mt-8 h-px w-full bg-gradient-to-r from-white/5 via-white/10 to-transparent"></div>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-10 custom-scrollbar relative z-10">
                    {navGroups.map((group, groupIdx) => {
                        const filteredItems = group.items.filter(item =>
                            !item.roles || item.roles.includes(user?.role || 'student')
                        )

                        if (filteredItems.length === 0) return null

                        return (
                            <div key={groupIdx} className="space-y-4">
                                <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">{group.title}</h3>
                                <div className="space-y-2">
                                    {filteredItems.map((item) => {
                                        const isActive = location.pathname === item.path
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`
                                                    relative flex items-center gap-5 px-5 py-4 rounded-2xl group transition-all duration-500
                                                    ${isActive
                                                        ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)]'
                                                        : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                                                    }
                                                `}
                                            >
                                                {/* Left Indicator */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full shadow-[0_0_15px_#fff]"></div>
                                                )}

                                                <span className={`
                                                    transition-all duration-500
                                                    ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-white group-hover:brightness-125'}
                                                    ${item.isAI ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' : ''}
                                                `}>
                                                    {item.icon}
                                                </span>

                                                <span className="text-sm font-black tracking-tight">{t(item.labelKey as any)}</span>

                                                {item.isAI && (
                                                    <div className="ml-auto flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                                                        <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_#818cf8]"></div>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Online</span>
                                                    </div>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </nav>

                {/* Profile Section */}
                <div className="p-8 relative z-10">
                    <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-3xl group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-0.5 shadow-xl group-hover:rotate-6 transition-transform">
                                <div className="w-full h-full bg-[#0f1117] rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white truncate opacity-90">{user?.email || 'Explorer'}</p>
                                <div className="inline-flex mt-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{user?.role || 'Student'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            <LogOut className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                `}</style>
            </div>
        </>
    )
}
