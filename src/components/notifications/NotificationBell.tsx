import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { db, auth } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

interface Notification {
    id: string
    type: 'task_submitted' | 'task_approved' | 'task_rejected' | 'new_message'
    title: string
    message: string
    timestamp: Date
    read: boolean
    link?: string
    studentName?: string
}

export const NotificationBell = () => {
    const user = useAuthStore((state) => state.user)
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const currentUser = auth.currentUser
        if (!user || !currentUser) return

        // Subscribe to notifications
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.id),
            orderBy('timestamp', 'desc'),
            limit(10)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs: Notification[] = []
            let unread = 0

            snapshot.forEach((doc) => {
                const data = doc.data()
                const notif: Notification = {
                    id: doc.id,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    read: data.read || false,
                    link: data.link,
                    studentName: data.studentName,
                }
                notifs.push(notif)
                if (!notif.read) unread++
            })

            setNotifications(notifs)
            setUnreadCount(unread)

            // Show browser notification for new unread notifications
            if (unread > 0 && notifs[0] && !notifs[0].read) {
                showBrowserNotification(notifs[0])
            }
        })

        return () => unsubscribe()
    }, [user])

    const showBrowserNotification = (notif: Notification) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notif.title, {
                body: notif.message,
                icon: '/logo.png',
            })
        }
    }

    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }

    const handleNotificationClick = (notif: Notification) => {
        if (notif.link) {
            navigate(notif.link)
        }
        setShowDropdown(false)
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_submitted':
                return '📝'
            case 'task_approved':
                return '✅'
            case 'task_rejected':
                return '❌'
            case 'new_message':
                return '💬'
            default:
                return '🔔'
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'task_submitted':
                return 'from-blue-50 to-blue-100 border-blue-200'
            case 'task_approved':
                return 'from-green-50 to-green-100 border-green-200'
            case 'task_rejected':
                return 'from-red-50 to-red-100 border-red-200'
            case 'new_message':
                return 'from-purple-50 to-purple-100 border-purple-200'
            default:
                return 'from-gray-50 to-gray-100 border-gray-200'
        }
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Только что'
        if (minutes < 60) return `${minutes} мин назад`
        if (hours < 24) return `${hours} ч назад`
        if (days < 7) return `${days} д назад`
        return date.toLocaleDateString('ru-RU')
    }

    useEffect(() => {
        requestNotificationPermission()
    }, [])

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Notifications Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-purple-600">
                            <h3 className="text-lg font-bold text-white">
                                🔔 Уведомления
                            </h3>
                            {unreadCount > 0 && (
                                <p className="text-sm text-white/80">
                                    {unreadCount} непрочитанных
                                </p>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="text-4xl mb-2">📭</div>
                                    <p>Нет уведомлений</p>
                                </div>
                            ) : (
                                <div className="p-2">
                                    {notifications.map((notif) => (
                                        <button
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`w-full p-4 mb-2 rounded-xl border-2 transition-all hover:shadow-lg text-left ${notif.read
                                                ? 'bg-white border-gray-200'
                                                : `bg-gradient-to-r ${getNotificationColor(notif.type)}`
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">
                                                    {getNotificationIcon(notif.type)}
                                                </span>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="font-bold text-sm">
                                                            {notif.title}
                                                        </h4>
                                                        {!notif.read && (
                                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {notif.message}
                                                    </p>
                                                    {notif.studentName && (
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            👤 {notif.studentName}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-400">
                                                        {formatTime(notif.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
