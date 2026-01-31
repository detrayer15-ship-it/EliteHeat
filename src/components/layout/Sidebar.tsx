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
    LogOut,
    LayoutDashboard,
    Users,
    CheckSquare,
    MessageCircle,
    Terminal,
    HelpCircle,
    Award
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
            { path: '/dashboard', labelKey: 'dashboard', icon: <Home className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },
            { path: '/projects', labelKey: 'projects', icon: <FolderKanban className="w-5 h-5" />, roles: ['student'] },
            { path: '/tasks', labelKey: 'tasks', icon: <BookOpen className="w-5 h-5" />, roles: ['student'] },
        ]
    },
    {
        title: 'Администрирование',
        roles: ['admin', 'developer'],
        items: [
            { path: '/admin', labelKey: 'adminPanel', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/tasks', labelKey: 'checkTasks', icon: <CheckSquare className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/users', labelKey: 'students', icon: <Users className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/groups', labelKey: 'groups', icon: <Users className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/group-chat', labelKey: 'adminChat', icon: <MessageCircle className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/ranks', labelKey: 'ranks', icon: <Award className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/support-chats', labelKey: 'supportChats', icon: <HelpCircle className="w-5 h-5" />, roles: ['admin', 'developer'] },
        ]
    },
    {
        title: 'Развитие',
        items: [
            { path: '/progress', labelKey: 'progressTracker', icon: <TrendingUp className="w-5 h-5" />, roles: ['student'] },
        ]
    },
    {
        title: 'Система',
        items: [
            { path: '/ai-assistant', labelKey: 'aiAssistant', icon: <Sparkles className="w-5 h-5" />, roles: ['student', 'admin', 'developer'], isAI: true },
            { path: '/support', labelKey: 'support', icon: <HelpCircle className="w-5 h-5" />, roles: ['student'] },
            { path: '/developer/panel', labelKey: 'developer', icon: <Terminal className="w-5 h-5" />, roles: ['developer'] },
            { path: '/settings', labelKey: 'settings', icon: <Settings className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },
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
                <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
                    <span className={`block h-0.5 w-full bg-indigo-500 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-blue-400 transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-indigo-300 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
            </button>

            {/* Sidebar Shell - масштаб 85% */}
            <div className={`
                w-[272px] h-screen fixed left-0 top-0 z-40 flex flex-col
                transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                bg-[#0c0d10] border-r border-white/[0.03]
            `}>
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>

                {/* Logo Section */}
                <div className="p-6 pb-4 relative z-10">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => (window.location.href = '/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-125"></div>
                            <EliteHeatLogo className="w-9 h-9 relative z-10 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight flex items-center">
                                <span className="text-white">Elite</span>
                                <span className="text-indigo-400">Heat</span>
                            </h1>
                            <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/25">{t('platform')}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar relative z-10">
                    {navGroups.map((group, groupIdx) => {
                        const filteredItems = group.items.filter(item =>
                            !item.roles || item.roles.includes(user?.role || 'student')
                        )

                        if (filteredItems.length === 0) return null

                        return (
                            <div key={groupIdx} className="space-y-1.5">
                                <h3 className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">{group.title}</h3>
                                <div className="space-y-0.5">
                                    {filteredItems.map((item) => {
                                        const isActive = location.pathname === item.path
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`
                                                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-gradient-to-r from-indigo-600/20 to-blue-600/10 text-white border-l-2 border-indigo-500'
                                                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                                                    }
                                                `}
                                            >
                                                <span className={`
                                                    transition-all duration-300
                                                    ${isActive ? 'text-indigo-400' : 'group-hover:text-white/60'}
                                                    ${item.isAI ? 'text-indigo-400' : ''}
                                                `}>
                                                    {item.icon}
                                                </span>

                                                <span className="text-[13px] font-semibold">{t(item.labelKey as any)}</span>

                                                {item.isAI && (
                                                    <div className="ml-auto flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                                        <span className="text-[7px] font-bold uppercase text-emerald-400">AI</span>
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
                <div className="p-4 relative z-10 border-t border-white/[0.03]">
                    <div className="p-3 rounded-xl bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-white/80 truncate">{user?.email || 'Explorer'}</p>
                                <p className="text-[9px] font-medium text-white/30 uppercase tracking-wider">{user?.role || 'Student'}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-2 rounded-lg border border-white/5 text-[10px] font-semibold text-white/30 hover:bg-white/5 hover:text-white/60 transition-all flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-3 h-3" />
                            Выход
                        </button>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.08); }
                `}</style>
            </div>
        </>
    )
}
