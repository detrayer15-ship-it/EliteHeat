import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/hooks/useTranslation'
import { EliteHeatLogo } from '@/components/ui/EliteHeatLogo'
import {
    Home,
    BookOpen,
    TrendingUp,
    Settings,
    LogOut,
    LayoutDashboard,
    Users,
    CheckSquare,
    CheckCircle,
    MessageCircle,
    Terminal,
    HelpCircle,
    X,
    ShieldCheck,
    Bot,
    FolderKanban
} from 'lucide-react'

interface NavItem {
    path: string
    labelKey: string
    icon: React.ReactNode
    roles: string[]
}

interface NavGroup {
    title: string
    roles?: string[]
    items: NavItem[]
}

const navGroups: NavGroup[] = [
    {
        title: 'learning',
        items: [
            { path: '/dashboard', labelKey: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },
            { path: '/teacher/dashboard', labelKey: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['teacher'] },
            { path: '/projects', labelKey: 'projects', icon: <FolderKanban className="w-5 h-5" />, roles: ['student', 'developer'] },
            { path: '/tasks', labelKey: 'tasks', icon: <BookOpen className="w-5 h-5" />, roles: ['student', 'developer'] },

            { path: '/progress', labelKey: 'progressTracker', icon: <TrendingUp className="w-5 h-5" />, roles: ['student', 'developer'] },
        ]
    },
    {
        title: 'assistantSection',
        items: [
            { path: '/student/ai-chat', labelKey: 'aiAssistant', icon: <Bot className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'developer'] },
        ]
    },
    {
        title: 'teacherSection',
        roles: ['teacher', 'admin', 'developer'],
        items: [
            { path: '/teacher/monitoring', labelKey: 'monitoringCenter', icon: <TrendingUp className="w-5 h-5" />, roles: ['teacher', 'admin', 'developer'] },
            { path: '/teacher/groups', labelKey: 'groups', icon: <Users className="w-5 h-5" />, roles: ['teacher', 'admin', 'developer'] },
        ]
    },
    {
        title: 'adminSection',
        roles: ['admin', 'developer'],
        items: [
            { path: '/admin', labelKey: 'adminPanel', icon: <ShieldCheck className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/student-monitoring', labelKey: 'studentDatabase', icon: <Users className="w-5 h-5" />, roles: ['admin', 'developer'] },
            { path: '/admin/support-chats', labelKey: 'supportChats', icon: <MessageCircle className="w-5 h-5" />, roles: ['admin', 'developer'] },
        ]
    },
    {
        title: 'system',
        items: [
            { path: '/support', labelKey: 'support', icon: <HelpCircle className="w-5 h-5" />, roles: ['student', 'teacher'] },
            { path: '/developer/panel', labelKey: 'developer', icon: <Terminal className="w-5 h-5" />, roles: ['developer'] },
            { path: '/settings', labelKey: 'settings', icon: <Settings className="w-5 h-5" />, roles: ['student', 'teacher', 'admin', 'developer'] },
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
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Burger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 transition-all active:scale-95 hover:shadow-xl"
            >
                <div className="w-5 h-4 flex flex-col justify-between overflow-hidden">
                    <span className={`block h-0.5 w-full bg-slate-800 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-slate-600 transition-all duration-500 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-slate-400 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
            </button>

            {/* Sidebar Shell */}
            <div
                className={`
                    w-[272px] h-screen fixed left-0 top-0 z-40 flex flex-col
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    bg-white/95 backdrop-blur-xl border-r border-slate-100/80
                    shadow-xl shadow-slate-200/20
                `}
            >
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 via-transparent to-slate-50/30 pointer-events-none"></div>

                {/* Logo Section */}
                <div className="p-6 pb-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => (window.location.href = '/')}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 scale-150"></div>
                                <EliteHeatLogo className="w-9 h-9 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black tracking-tight flex items-center">
                                    <span className="text-slate-900">Elite</span><span className="text-indigo-500">Heat</span>
                                </h1>
                                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-slate-300">{t('platform')}</p>
                            </div>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Navigation Groups */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-5 custom-scrollbar relative z-10">
                    {navGroups.map((group, groupIdx) => {
                        const filteredItems = group.items.filter(item =>
                            !item.roles || item.roles.includes(user?.role || 'student')
                        )

                        if (filteredItems.length === 0) return null

                        return (
                            <div key={groupIdx} className="space-y-1">
                                <h3 className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">{t(group.title as any)}</h3>
                                <div className="space-y-0.5">
                                    {filteredItems.map((item, itemIdx) => {
                                        const isActive = location.pathname === item.path
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`
                                                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-200
                                                    ${isActive
                                                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50/50 text-indigo-700 shadow-sm shadow-indigo-100/50'
                                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                                    }
                                                `}
                                                style={{ animationDelay: `${itemIdx * 50}ms` }}
                                            >
                                                {/* Active indicator bar */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                                                )}

                                                <span className={`
                                                    transition-all duration-200
                                                    ${isActive ? 'text-indigo-500' : 'group-hover:text-slate-600'}
                                                `}>
                                                    {item.icon}
                                                </span>

                                                <span className="text-[13px] font-semibold">{t(item.labelKey as any)}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </nav>

                {/* Profile Section */}
                <div className="p-4 relative z-10 border-t border-slate-100">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200/50">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-slate-800 truncate">{user?.email || 'Explorer'}</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{user?.role || 'Student'}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-2.5 rounded-xl border border-slate-200/80 text-[11px] font-bold text-slate-400 hover:bg-white hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Выход
                        </button>
                    </div>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
                `}
                </style>
            </div>
        </>
    )
}
