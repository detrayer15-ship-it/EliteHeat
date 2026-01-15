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

const navItems = [
    { path: '/dashboard', labelKey: 'dashboard', icon: <Home className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },

    // Admin Sections
    { path: '/admin', labelKey: 'adminPanel', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['admin', 'developer'] },
    { path: '/admin/tasks', labelKey: 'checkTasks', icon: <CheckSquare className="w-5 h-5" />, roles: ['admin', 'developer'] },
    { path: '/admin/users', labelKey: 'students', icon: <Users className="w-5 h-5" />, roles: ['admin', 'developer'] },
    { path: '/admin/groups', labelKey: 'groups', icon: <Users className="w-5 h-5" />, roles: ['admin', 'developer'] },
    { path: '/admin/group-chat', labelKey: 'adminChat', icon: <MessageCircle className="w-5 h-5" />, roles: ['admin', 'developer'] },

    // Developer Sections
    { path: '/developer/panel', labelKey: 'developer', icon: <Terminal className="w-5 h-5" />, roles: ['developer'] },

    // Student Sections
    { path: '/projects', labelKey: 'projects', icon: <FolderKanban className="w-5 h-5" />, roles: ['student'] },
    { path: '/tasks', labelKey: 'tasks', icon: <BookOpen className="w-5 h-5" />, roles: ['student'] },
    { path: '/skill-tree', labelKey: 'skillTree', icon: <TrendingUp className="w-5 h-5" />, roles: ['student'] },
    { path: '/progress', labelKey: 'progressTracker', icon: <TrendingUp className="w-5 h-5" />, roles: ['student'] },
    { path: '/portfolio', labelKey: 'portfolio', icon: <Globe className="w-5 h-5" />, roles: ['student'] },

    // Shared Sections
    { path: '/ai-assistant', labelKey: 'aiAssistant', icon: <Sparkles className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },
    { path: '/settings', labelKey: 'settings', icon: <Settings className="w-5 h-5" />, roles: ['student', 'admin', 'developer'] },
]

export const Sidebar = () => {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { t, language, setLanguage } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const filteredNavItems = navItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || 'student')
    )

    return (
        <>
            {/* Ultra Premium Burger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 glass-premium rounded-2xl shadow-glow transition-all active:scale-95"
            >
                <div className="w-6 h-5 flex flex-col justify-between overflow-hidden">
                    <span className={`block h-0.5 w-full bg-indigo-600 transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-2 scale-x-125' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-blue-500 transition-all duration-500 ${isOpen ? 'opacity-0 -translate-x-10' : ''}`}></span>
                    <span className={`block h-0.5 w-full bg-indigo-400 transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-2 scale-x-125' : ''}`}></span>
                </div>
            </button>

            {/* Premium Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-indigo-950/20 z-40 backdrop-blur-md animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Shell */}
            <div className={`
                w-72 h-screen fixed left-0 top-0 z-40 flex flex-col
                transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:border-r border-white/20
            `}>
                {/* Glass Background with Mesh */}
                <div className="absolute inset-0 glass-premium -z-10">
                    <div className="absolute inset-0 gradient-mesh opacity-10 animate-pulse-slow"></div>
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
                </div>

                {/* Logo Section */}
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => (window.location.href = '/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                            <EliteHeatLogo className="w-14 h-14 drop-shadow-2xl animate-float-subtle group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight flex items-center">
                                <span className="text-indigo-600">Elite</span>
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">Heat</span>
                            </h1>
                            <div className="flex items-center gap-1.5 opacity-60">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">{t('platform')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 overflow-y-auto px-6 py-2">
                    <div className="space-y-1.5">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 opacity-50">{t('menu')}</p>

                        {filteredNavItems.map((item, index) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        relative flex items-center gap-4 px-5 py-3.5 rounded-2xl group transition-all duration-500 overflow-hidden
                                        ${isActive
                                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow scale-[1.02]'
                                            : 'text-indigo-900/70 hover:text-indigo-600 hover:bg-white/40'
                                        }
                                    `}
                                    style={{
                                        animation: `slideIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards`,
                                        animationDelay: `${index * 0.08}s`
                                    }}
                                >
                                    {/* Active Glow */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                    )}

                                    <span className={`
                                        transition-all duration-500 z-10
                                        ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-120 group-hover:-rotate-6'}
                                    `}>
                                        {item.icon}
                                    </span>

                                    <span className="font-bold tracking-wide z-10">{t(item.labelKey as any)}</span>

                                    {isActive ? (
                                        <div className="ml-auto animate-pulse-slow z-10">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
                                        </div>
                                    ) : (
                                        <ChevronRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-40 group-hover:translate-x-1 transition-all" />
                                    )}
                                </Link>
                            )
                        })}

                        {/* Special Actions Section */}
                        <div className="mt-8 pt-8 border-t border-indigo-100/50">
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 opacity-50">Support</p>

                            {user?.role === 'student' && (
                                <Link
                                    to="/chat"
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center gap-4 px-5 py-3.5 rounded-2xl group transition-all duration-500
                                        ${location.pathname === '/chat'
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-glow'
                                            : 'text-indigo-900/70 hover:text-blue-600 hover:bg-white/40'
                                        }
                                    `}
                                >
                                    <MessageSquare className={`w-5 h-5 transition-transform group-hover:scale-120 ${location.pathname === '/chat' ? 'animate-bounce-subtle' : ''}`} />
                                    <span className="font-bold tracking-wide">{t('support')}</span>
                                </Link>
                            )}

                            {user?.subscriptionPlan && (
                                <div className="mt-4 px-4 py-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 group cursor-pointer hover:shadow-lg transition-all active:scale-95 overflow-hidden relative">
                                    <div className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                        <Crown className="w-12 h-12 text-amber-600" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Crown className="w-4 h-4 text-amber-600 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase text-amber-700">{t('premiumPlan')}</span>
                                    </div>
                                    <p className="text-xs font-bold text-amber-900 truncate">{t('eliteAccess')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Profile Footer */}
                <div className="p-6 mt-auto">
                    <div className="p-4 rounded-2xl glass-premium border border-white/40 shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-white flex items-center justify-center text-white font-black shadow-lg">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-indigo-900 truncate">{user?.email || 'User'}</p>
                                <p className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-tighter">{user?.role || 'Student'}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-active:scale-95"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Custom Styles */}
                <style>{`
                    .glass-premium {
                        background: rgba(255, 255, 255, 0.45);
                        backdrop-filter: blur(20px) saturate(180%);
                        border-right: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .shadow-glow {
                        box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.3);
                    }
                    .shadow-glow-teal {
                        box-shadow: 0 15px 35px -10px rgba(13, 148, 136, 0.4);
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(-30px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes shimmer {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(200%); }
                    }
                `}</style>
            </div>
        </>
    )
}
