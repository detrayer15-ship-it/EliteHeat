import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
    children: ReactNode
    animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'rotate'
    delay?: number
    duration?: number
    threshold?: number
    className?: string
}

export const ScrollReveal = ({
    children,
    animation = 'fade',
    delay = 0,
    duration = 800,
    threshold = 0.1,
    className = ''
}: ScrollRevealProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    // Отключаем наблюдатель после первого появления
                    if (elementRef.current) {
                        observer.unobserve(elementRef.current)
                    }
                }
            },
            {
                threshold,
                rootMargin: '0px'
            }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current)
            }
        }
    }, [threshold])

    const getAnimationClass = () => {
        if (!isVisible) return 'opacity-0'

        switch (animation) {
            case 'fade':
                return 'animate-fade-in'
            case 'slide-up':
                return 'animate-slide-up'
            case 'slide-left':
                return 'animate-slide-in-left'
            case 'slide-right':
                return 'animate-slide-in-right'
            case 'scale':
                return 'animate-scale-in'
            case 'rotate':
                return 'animate-rotate-in'
            default:
                return 'animate-fade-in'
        }
    }

    return (
        <div
            ref={elementRef}
            className={`${getAnimationClass()} ${className}`}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
                animationFillMode: 'both'
            }}
        >
            {children}
        </div>
    )
}
