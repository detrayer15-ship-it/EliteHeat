import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
    end: number
    start?: number
    duration?: number
    decimals?: number
    prefix?: string
    suffix?: string
    className?: string
    separator?: string
}

export const AnimatedCounter = ({
    end,
    start = 0,
    duration = 2000,
    decimals = 0,
    prefix = '',
    suffix = '',
    className = '',
    separator = ''
}: AnimatedCounterProps) => {
    const [count, setCount] = useState(start)
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    setIsVisible(true)
                    hasAnimated.current = true
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const startTime = Date.now()
        const range = end - start

        const easeOutQuart = (t: number): number => {
            return 1 - Math.pow(1 - t, 4)
        }

        const animate = () => {
            const now = Date.now()
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easedProgress = easeOutQuart(progress)
            const currentCount = start + range * easedProgress

            setCount(currentCount)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, start, end, duration])

    const formatNumber = (num: number): string => {
        const fixed = num.toFixed(decimals)

        if (separator) {
            const parts = fixed.split('.')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
            return parts.join('.')
        }

        return fixed
    }

    return (
        <span ref={elementRef} className={className}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    )
}
