import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    hover?: boolean
}

export const Card = ({ children, hover = false, className = '', ...props }: CardProps) => {
    return (
        <div
            className={`bg-white rounded-xl p-6 card-shadow ${hover ? 'hover:shadow-lg transition-smooth cursor-pointer' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
