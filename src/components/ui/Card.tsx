import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    hover?: boolean
}

export const Card = ({ children, hover = false, className = '', ...props }: CardProps) => {
    return (
        <div
            className={`bg-gradient-to-br from-[#1c1d25] to-[#0c0d11] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/[0.05] ${hover ? 'hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] hover:scale-[1.01] hover:border-white/[0.1] transition-all duration-300 cursor-pointer' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
