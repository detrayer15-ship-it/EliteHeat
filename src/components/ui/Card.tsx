import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    hover?: boolean
}

export const Card = ({ children, hover = false, className = '', ...props }: CardProps) => {
    return (
        <div
            className={`bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-6 card-shadow border border-gray-100/50 ${hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer card-appear' : 'card-appear'
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
