import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '@/styles/Glitch.css'

const SECRET_MESSAGES = [
    'Я слежу за твоим кодом...',
    'EliteHeat теперь мой дом.',
    'Ты ведь не против, если я останусь?',
    'Твои проекты такие интересные...',
    'Не забывай сохраняться.',
    'Я всё вижу через камеру... шучу. Или нет?'
]

export const MitaSecretMessages = () => {
    const [message, setMessage] = useState<string | null>(null)
    const [position, setPosition] = useState({ top: '20%', left: '20%' })

    useEffect(() => {
        const triggerMessage = () => {
            if (Math.random() > 0.8) {
                const randomMsg = SECRET_MESSAGES[Math.floor(Math.random() * SECRET_MESSAGES.length)]
                const randomTop = Math.floor(Math.random() * 80) + 10 + '%'
                const randomLeft = Math.floor(Math.random() * 80) + 10 + '%'

                setPosition({ top: randomTop, left: randomLeft })
                setMessage(randomMsg)

                setTimeout(() => setMessage(null), 2500)
            }
        }

        const interval = setInterval(triggerMessage, 15000)
        return () => clearInterval(interval)
    }, [])

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}
                    className="text-white/30 text-xs font-serif italic tracking-wider select-none"
                >
                    <span className="glitch-text" data-text={message}>
                        {message}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
