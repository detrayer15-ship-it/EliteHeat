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
        primary: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]',
        secondary: 'bg-white/[0.03] text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-xl',
        ghost: 'text-white/60 hover:bg-white/[0.05] hover:text-white',
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
