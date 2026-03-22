import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
    children: ReactNode
    /** If provided, only these roles can access the route. Others are redirected. */
    allowedRoles?: string[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const location = useLocation()

    // Not logged in → send to landing page (preserving intended destination)
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Role check — if roles are restricted and user's role is not in the list
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        // Redirect teachers to their dashboard, students to theirs
        if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
        if (user.role === 'student') return <Navigate to="/dashboard" replace />
        if (user.role === 'admin') return <Navigate to="/admin" replace />
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
