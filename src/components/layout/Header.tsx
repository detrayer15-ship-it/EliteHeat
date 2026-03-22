import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import {
    getSubscriptionInfo,
    formatExpiryDate,
    formatDaysRemaining,
    getSubscriptionTypeLabel,
    calculateProgress,
    type SubscriptionType
} from '@/utils/subscription'
import { Settings, User, LogOut, ChevronDown, Crown, Shield, Code2 } from 'lucide-react'

export const Header = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Helper to convert Firestore Timestamp to Date
    const toDate = (date: any): Date => {
        if (!date) return new Date();
        if (date.toDate && typeof date.toDate === 'function') return date.toDate();
        if (date instanceof Date) return date;
        return new Date(date);
    };

    // Subscription info - logic based on real user data
    const [subscriptionInfo, setSubscriptionInfo] = useState(() => {
        if (user?.role === 'student' && user.subscriptionPlan) {
            const startDate = toDate(user.subscriptionStartDate);
            return getSubscriptionInfo(user.subscriptionPlan as SubscriptionType, startDate);
        }
        return getSubscriptionInfo('monthly', new Date()); // Default fallback
    });

    const [progress, setProgress] = useState(() => {
        if (subscriptionInfo.expiryDate && subscriptionInfo.startDate) {
            return calculateProgress(subscriptionInfo.startDate, subscriptionInfo.expiryDate);
        }
        return 0;
    });

    // Real-time countdown for students
    useEffect(() => {
        if (user?.role === 'student' && user.subscriptionPlan) {
            const updateInfo = () => {
                const startDate = toDate(user.subscriptionStartDate);
                const newInfo = getSubscriptionInfo(user.subscriptionPlan as SubscriptionType, startDate);
                setSubscriptionInfo(newInfo);
                setProgress(calculateProgress(newInfo.startDate, newInfo.expiryDate));
            };

            updateInfo(); // Initial calculation
            const interval = setInterval(updateInfo, 1000); // Update every second

            return () => clearInterval(interval);
        }
    }, [user?.role, user?.subscriptionPlan, user?.subscriptionStartDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const getRoleInfo = () => {
        switch (user?.role) {
            case 'student': return { label: '👨‍🎓 Ученик', icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' }
            case 'admin': return { label: '👨‍🏫 Учитель', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' }
            case 'developer': return { label: '👨‍💻 Разработчик', icon: Code2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
            default: return { label: '📚 Студент', icon: User, color: 'text-slate-600', bg: 'bg-slate-50' }
        }
    }

    const roleInfo = getRoleInfo()

    return (
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100/80 px-4 sm:px-6 py-3 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="lg:hidden">
                    <h1 className="text-xl font-black tracking-tight">
                        <span className="text-slate-900">Elite</span><span className="text-indigo-500">Edu</span>
                    </h1>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <>
                            <NotificationBell />

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-slate-100"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-200/50">
                                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="font-semibold text-slate-800 text-sm leading-tight">{user.name || 'User'}</div>
                                        <div className="text-[11px] text-slate-400 leading-tight">{user.email}</div>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 py-2 animate-scale-in origin-top-right">
                                        {/* User Profile Section */}
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200/50">
                                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-400">{user.email}</div>
                                                    <div className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${roleInfo.bg} ${roleInfo.color}`}>
                                                        {roleInfo.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    navigate('/settings')
                                                    setShowDropdown(false)
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                                                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                </div>
                                                <span className="text-slate-700 font-medium">Настройки</span>
                                            </button>

                                            {/* Subscription Info - Role-based */}
                                            {user.role === 'student' && (
                                                <div className="mx-3 my-2 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 overflow-hidden">
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Crown className="w-4 h-4 text-indigo-500" />
                                                            <p className="text-xs font-bold text-indigo-700">Ваша подписка</p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-slate-500">Тип</span>
                                                                <span className="font-bold text-indigo-600">{getSubscriptionTypeLabel(subscriptionInfo.type)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-slate-500">До</span>
                                                                <span className="font-semibold text-slate-700">{formatExpiryDate(subscriptionInfo.expiryDate)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-slate-500">Осталось</span>
                                                                <span className="font-black text-emerald-600">
                                                                    {formatDaysRemaining(subscriptionInfo.daysRemaining)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className="mt-3 w-full bg-white/70 rounded-full h-1.5">
                                                            <div
                                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {user.role === 'admin' && (
                                                <div className="mx-3 my-2 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50 p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Shield className="w-4 h-4 text-blue-500" />
                                                        <p className="text-xs font-bold text-blue-700">Управление учениками</p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mb-2">
                                                        Просматривайте и управляйте подписками учеников.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigate('/admin')
                                                            setShowDropdown(false)
                                                        }}
                                                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all active:scale-[0.98]"
                                                    >
                                                        Центр Мониторинга
                                                    </button>
                                                </div>
                                            )}


                                        </div>

                                        <div className="border-t border-slate-50 pt-1 mt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors flex items-center gap-3 text-sm group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                                                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                </div>
                                                <span className="text-slate-700 group-hover:text-red-600 font-medium">Выйти</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
