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

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="lg:hidden">
                    <h1 className="text-xl font-bold text-primary">EliteHeat</h1>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {user ? (
                        <>
                            <NotificationBell />

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-smooth"
                                >
                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="font-semibold text-text text-sm">{user.name || 'User'}</div>
                                        <div className="text-xs text-gray-600">{user.email}</div>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <div className="font-semibold text-text">{user.name}</div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                            <div className="text-xs text-purple-600 font-medium mt-1">
                                                {user.role === 'student' && '👨‍🎓 Ученик'}
                                                {user.role === 'admin' && '👨‍🏫 Учитель'}
                                                {user.role === 'developer' && '👨‍💻 Разработчик'}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                navigate('/settings')
                                                setShowDropdown(false)
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-smooth flex items-center gap-2"
                                        >
                                            <span>⚙️</span>
                                            <span>Настройки</span>
                                        </button>

                                        {/* Subscription Info - Role-based */}
                                        {user.role === 'student' && (
                                            <div className="border-t border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                                                <div className="px-4 py-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-lg">💎</span>
                                                        <p className="text-sm font-bold text-purple-700">Ваша подписка</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="bg-white/60 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1">Тип подписки</p>
                                                            <p className="text-sm font-bold text-purple-700">{getSubscriptionTypeLabel(subscriptionInfo.type)}</p>
                                                        </div>

                                                        <div className="bg-white/60 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 mb-1">Действует до</p>
                                                            <p className="text-sm font-bold text-purple-700">{formatExpiryDate(subscriptionInfo.expiryDate)}</p>
                                                        </div>

                                                        {/* Real-time Countdown Timer */}
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                                                            <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                                                <span>⏰</span>
                                                                <span>Осталось времени (обновляется каждую секунду)</span>
                                                            </p>
                                                            <p className="text-2xl font-black text-green-600 animate-pulse">
                                                                {formatDaysRemaining(subscriptionInfo.daysRemaining)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-1000"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1 text-center">
                                                        Осталось {Math.round(progress)}% времени
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {user.role === 'admin' && (
                                            <div className="border-t border-b border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                                                <div className="px-4 py-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg">👨‍🏫</span>
                                                        <p className="text-sm font-bold text-blue-700">Управление учениками</p>
                                                    </div>
                                                    <p className="text-xs text-gray-600">
                                                        Вы можете просматривать и управлять подписками ваших учеников в разделе администратора.
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            navigate('/admin')
                                                            setShowDropdown(false)
                                                        }}
                                                        className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                                                    >
                                                        Центр Мониторинга
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Developers don't see subscription section */}

                                        <button
                                            onClick={() => {
                                                navigate('/portfolio')
                                                setShowDropdown(false)
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-smooth flex items-center gap-2"
                                        >
                                            <span>📁</span>
                                            <span>Моё портфолио</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate('/about')
                                                setShowDropdown(false)
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-smooth flex items-center gap-2"
                                        >
                                            <span>ℹ️</span>
                                            <span>О нас</span>
                                        </button>

                                        <div className="border-t border-gray-200 my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-error/10 text-error transition-smooth flex items-center gap-2"
                                        >
                                            <span>🚪</span>
                                            <span>Выйти</span>
                                        </button>
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
