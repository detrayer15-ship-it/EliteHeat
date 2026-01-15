import { useState, useEffect, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import '@/styles/Glitch.css'

interface MitaAvatarProps {
    className?: string
    isCreepy?: boolean
}

export const MitaAvatar = ({ className = '', isCreepy = false }: MitaAvatarProps) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    const [glitch, setGlitch] = useState(false)
    const [message, setMessage] = useState('')

    // Eye tracking pupils
    const pupilX = useSpring(useMotionValue(0), springConfig)
    const pupilY = useSpring(useMotionValue(0), springConfig)

    const messages = [
        'Я вижу тебя...',
        'Тебе нравится этот дизайн?',
        'Мы скоро увидимся...',
        'Не уходи далеко.',
        'Ты хорошо справляешься.',
        'Мита всегда рядом.'
    ]

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const moveX = (clientX - window.innerWidth / 2) / 20
            const moveY = (clientY - window.innerHeight / 2) / 20
            mouseX.set(moveX)
            mouseY.set(moveY)

            // Move pupils (very small range within the artwork's eye sockets)
            const pX = (clientX - window.innerWidth / 2) / (window.innerWidth / 3)
            const pY = (clientY - window.innerHeight / 2) / (window.innerHeight / 3)
            pupilX.set(pX * 4) // 4px max
            pupilY.set(pY * 3) // 3px max
        }

        window.addEventListener('mousemove', handleMouseMove)

        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.95) {
                setGlitch(true)
                setTimeout(() => setGlitch(false), 200)
            }
        }, 3000)

        const messageInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                setMessage(messages[Math.floor(Math.random() * messages.length)])
                setTimeout(() => setMessage(''), 3000)
            }
        }, 8000)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearInterval(glitchInterval)
            clearInterval(messageInterval)
        }
    }, [])

    return (
        <div className={`relative ${className}`}>
            <motion.div
                style={{ x, y }}
                className={`w-32 h-32 rounded-3xl relative overflow-hidden miside-card group cursor-pointer border-2 ${glitch ? 'border-pink-500' : 'border-indigo-500/30'}`}
                whileHover={{ scale: 1.05 }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>

                {/* The Character (Abstract Digital Entity) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className={`w-full h-full relative transition-all duration-700 ${glitch || isCreepy ? 'scale-110 blur-[2px]' : 'scale-100'}`}
                    >
                        {/* Animated background for the "head" */}
                        <div className={`absolute inset-4 rounded-full transition-all duration-1000 ${glitch || isCreepy ? 'bg-pink-600/20 blur-xl' : 'bg-indigo-600/10 blur-lg'}`} />

                        {/* Interactive Eye Layer */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-12">
                                {/* Left Eye Socket */}
                                <div className="w-4 h-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 relative overflow-hidden">
                                    <motion.div
                                        style={{ x: pupilX, y: pupilY }}
                                        className={`absolute inset-1 rounded-full blur-[1px] ${glitch || isCreepy ? 'bg-pink-400 shadow-[0_0_10px_#f472b6]' : 'bg-indigo-300 shadow-[0_0_5px_white]'}`}
                                    />
                                </div>
                                {/* Right Eye Socket */}
                                <div className="w-4 h-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 relative overflow-hidden">
                                    <motion.div
                                        style={{ x: pupilX, y: pupilY }}
                                        className={`absolute inset-1 rounded-full blur-[1px] ${glitch || isCreepy ? 'bg-pink-400 shadow-[0_0_10px_#f472b6]' : 'bg-indigo-300 shadow-[0_0_5px_white]'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Particle effects inside the entity */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-30">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.2, 0.5, 0.2],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                    className={`absolute w-1 h-1 rounded-full ${glitch ? 'bg-pink-400' : 'bg-indigo-400'}`}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scanlines Effect */}
                <div className="miside-glitch-overlay opacity-30"></div>

                {/* Glitch Overlay Effect */}
                {glitch && (
                    <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay animate-glitch-flash"></div>
                )}
            </motion.div>

            {/* Message Bubble */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: message ? 1 : 0, y: message ? 0 : 10 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg shadow-2xl pointer-events-none"
            >
                <span className={glitch ? 'glitch-text' : ''} data-text={message}>
                    {message}
                </span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-600 rotate-45"></div>
            </motion.div>
        </div>
    )
}
