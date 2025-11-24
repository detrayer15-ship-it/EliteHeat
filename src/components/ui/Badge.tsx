import { ReactNode } from 'react'

interface BadgeProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error'
    className?: string
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
    const variants = {
        default: 'bg-gray-100 text-text',
        success: 'bg-success/10 text-success',
        warning: 'bg-primary/10 text-primary',
        error: 'bg-error/10 text-error',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
