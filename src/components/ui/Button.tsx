import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    children: ReactNode
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = 'font-medium rounded-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 btn-animate mobile-full mobile-text-sm mobile-p-2'

    const variants = {
        primary: 'bg-gradient-to-r from-primary via-purple-600 to-purple-700 text-white hover:shadow-2xl hover:from-primary-dark hover:via-purple-700 hover:to-purple-800',
        secondary: 'bg-white text-text border-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-primary hover:shadow-lg',
        ghost: 'text-text hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-600/10 hover:text-primary',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-7 py-3.5 text-lg',
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    )
}
