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
    const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // TODO: Get from user data - for now using 'monthly' as default
    const subscriptionType: SubscriptionType = 'monthly'
    const subscriptionStartDate = new Date('2026-01-01') // TODO: Get from user data

    const subscriptionInfo = getSubscriptionInfo(subscriptionType, subscriptionStartDate)
    const progress = calculateProgress(subscriptionInfo.startDate, subscriptionInfo.expiryDate)

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
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="font-semibold text-text text-sm">{user.name}</div>
                                        <div className="text-xs text-gray-600">{user.email}</div>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <div className="font-semibold text-text">{user.name}</div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
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

                                        {/* Subscription Info - Collapsible */}
                                        <div className="border-t border-b border-purple-200">
                                            <button
                                                onClick={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">💎</span>
                                                    <p className="text-xs font-semibold text-purple-700">Подписка</p>
                                                </div>
                                                <svg
                                                    className={`w-4 h-4 text-purple-700 transition-transform ${showSubscriptionDetails ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {showSubscriptionDetails && (
                                                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-gray-700">
                                                            <span className="font-medium">Тип:</span> {getSubscriptionTypeLabel(subscriptionInfo.type)}
                                                        </p>
                                                        <p className="text-xs text-gray-700">
                                                            <span className="font-medium">Активна до:</span> <span className="font-bold text-purple-700">{formatExpiryDate(subscriptionInfo.expiryDate)}</span>
                                                        </p>
                                                        <p className="text-xs text-gray-700">
                                                            <span className="font-medium">Осталось:</span> <span className="font-bold text-green-600">{formatDaysRemaining(subscriptionInfo.daysRemaining)}</span>
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

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
