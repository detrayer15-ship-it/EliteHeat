import { motion } from 'framer-motion'
import { EliteHeatLogo } from './EliteHeatLogo'

export const LogoAnimation = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Icon with persistent floating and aura animation */}
            <div className="relative mb-3">
                <motion.div
                    animate={{
                        y: [0, -8, 0],
                        rotateY: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10"
                >
                    <EliteHeatLogo className="w-16 h-16" />
                </motion.div>

                {/* Background Glow Aura */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full -z-10"
                />
            </div>

            {/* Text with shimmering gradient */}
            <h1 className="text-4xl font-black tracking-tight flex items-center mb-1">
                <span className="bg-gradient-to-b from-[#f9a03f] to-[#f27121] bg-clip-text text-transparent">
                    Elite
                </span>
                <span className="ml-2 bg-gradient-to-b from-[#6366f1] to-[#3b82f6] bg-clip-text text-transparent">
                    Heat
                </span>
            </h1>

            {/* Underline Flow Animation */}
            <div className="relative w-24 h-[2px] bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-full"
                />
            </div>
        </div>
    )
}
