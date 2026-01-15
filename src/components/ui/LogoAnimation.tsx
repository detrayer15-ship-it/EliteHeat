import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const LogoAnimation = () => {
    const [isSpinning, setIsSpinning] = useState(true)

    useEffect(() => {
        const timer = setInterval(() => {
            setIsSpinning(prev => !prev)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative flex items-center justify-center h-24 w-full select-none pointer-events-none">
            <AnimatePresence mode="wait">
                {isSpinning ? (
                    <motion.div
                        key="spinning-elite"
                        initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
                        animate={{ rotateY: 360, opacity: 1, scale: 1 }}
                        exit={{ rotateY: 720, opacity: 0, scale: 0.8 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="flex items-center gap-2"
                    >
                        <div className="text-5xl font-black bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500 bg-clip-text text-transparent italic tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            EliteHeat
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="static-elite"
                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                        transition={{ duration: 1 }}
                        className="text-5xl font-black tracking-widest uppercase flex items-center gap-4"
                    >
                        <span className="bg-orange-500 text-white px-4 py-1 rounded-sm rotate-[-3deg] shadow-lg shadow-orange-500/20">ELITE</span>
                        <span className="text-blue-600">HEAT</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Atmospheric particles around logo */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] animate-pulse"></div>
            </div>
        </div>
    )
}
