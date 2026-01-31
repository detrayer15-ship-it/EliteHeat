import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

// Fade transition
export const PageFade = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Slide up transition
export const PageSlideUp = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Scale transition
export const PageScale = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Premium slide from right
export const PageSlideRight = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Blur fade transition (premium)
export const PageBlurFade = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Default page wrapper with all animations
export const PageWrapper = ({
    children,
    className = '',
    animation = 'fade'
}: PageTransitionProps & {
    animation?: 'fade' | 'slideUp' | 'scale' | 'slideRight' | 'blur'
}) => {
    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        },
        scale: {
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.02 }
        },
        slideRight: {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -30 }
        },
        blur: {
            initial: { opacity: 0, filter: 'blur(10px)' },
            animate: { opacity: 1, filter: 'blur(0px)' },
            exit: { opacity: 0, filter: 'blur(10px)' }
        }
    }

    return (
        <motion.div
            initial={variants[animation].initial}
            animate={variants[animation].animate}
            exit={variants[animation].exit}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default PageWrapper
