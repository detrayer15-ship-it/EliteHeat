import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export const Header = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Закрытие dropdown при клике вне его
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
                        // Показываем профиль если пользователь авторизован
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

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
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

                                    <button
                                        onClick={() => {
                                            navigate('/progress')
                                            setShowDropdown(false)
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-smooth flex items-center gap-2"
                                    >
                                        <span>📊</span>
                                        <span>Мой прогресс</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate('/subscription')
                                            setShowDropdown(false)
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-smooth flex items-center gap-2"
                                    >
                                        <span>💎</span>
                                        <span>Подписка</span>
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
                    ) : (
                        // Показываем кнопки входа если не авторизован
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
