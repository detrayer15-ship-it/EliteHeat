import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react'

interface ParallaxSectionProps {
    children: ReactNode
    speed?: number
    direction?: 'up' | 'down'
    className?: string
}

export const ParallaxSection = ({
    children,
    speed = 0.5,
    direction = 'up',
    className = ''
}: ParallaxSectionProps) => {
    const [offset, setOffset] = useState(0)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return

            const rect = elementRef.current.getBoundingClientRect()
            const scrolled = window.pageYOffset
            const elementTop = rect.top + scrolled
            const windowHeight = window.innerHeight

            // Вычисляем смещение только когда элемент виден
            if (rect.top < windowHeight && rect.bottom > 0) {
                const distance = scrolled - elementTop + windowHeight
                const movement = distance * speed
                setOffset(direction === 'up' ? -movement : movement)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Инициализация

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [speed, direction])

    const style: CSSProperties = {
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s ease-out'
    }

    return (
        <div ref={elementRef} className={className} style={style}>
            {children}
        </div>
    )
}
