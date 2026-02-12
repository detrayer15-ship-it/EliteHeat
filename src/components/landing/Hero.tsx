import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Typewriter } from '@/components/Typewriter'

export const Hero = () => {
    const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            } as any
        }
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
            {/* Dot Network Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.3]"
                    style={{
                        backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Visual Decorations - subtle colorful dots like in image */}
                <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-orange-400 opacity-40 blur-[0.5px]" />
                <div className="absolute top-[40%] right-[10%] w-2 h-2 rounded-full bg-blue-400 opacity-40 blur-[0.5px]" />
                <div className="absolute bottom-[30%] left-[25%] w-2 h-2 rounded-full bg-pink-400 opacity-40 blur-[0.5px]" />
                <div className="absolute bottom-[20%] right-[30%] w-1.5 h-1.5 rounded-full bg-green-400 opacity-40 blur-[0.5px]" />

                <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15%" y1="20%" x2="25%" y2="35%" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="25%" y1="35%" x2="15%" y2="60%" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="85%" y1="25%" x2="75%" y2="45%" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="75%" y1="45%" x2="85%" y2="55%" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-[-5vh]"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="flex justify-center mb-12">
                    <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-orange-50/30 border border-orange-100/50">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="text-[11px] font-bold tracking-[0.4em] text-orange-600/80 uppercase">
                            Новая эра образования
                        </span>
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="mb-4">
                    <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black tracking-tight leading-[0.85] flex items-center justify-center">
                        <span className="bg-gradient-to-b from-[#f9a03f] to-[#f27121] bg-clip-text text-transparent">
                            Elite
                        </span>
                        <span className="ml-6 bg-gradient-to-b from-[#6366f1] to-[#3b82f6] bg-clip-text text-transparent">
                            Heat
                        </span>
                    </h1>
                </motion.div>

                {/* Typewriter Subheading */}
                <motion.div variants={itemVariants} className="mb-12 min-h-[4.5rem] flex items-center justify-center">
                    <div className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter">
                        <Typewriter
                            texts={['Создание дизайна', 'Изучение Python', 'Освоение Figma', 'Запуск карьеры']}
                            speed={70}
                            deleteSpeed={40}
                            pauseTime={3000}
                            className="bg-gradient-to-r from-[#f27121] to-[#f9a03f] bg-clip-text text-transparent"
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-14 leading-relaxed tracking-tight"
                >
                    Профессиональное обучение программированию и дизайну с использованием технологий искусственного интеллекта. Ваш путь в IT начинается здесь.
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={itemVariants} className="mb-20">
                    <Button
                        size="lg"
                        onClick={() => navigate('/register')}
                        className="px-14 py-8 text-xl font-black rounded-[2rem] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all duration-300 shadow-2xl shadow-indigo-200 border-none scale-110 md:scale-125"
                    >
                        Начать обучение
                    </Button>
                </motion.div>

                {/* Footer Badges */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-12"
                >
                    {[
                        { label: 'Python', icon: <Check className="w-5 h-5 text-orange-500" /> },
                        { label: 'Figma', icon: <Check className="w-5 h-5 text-orange-500" /> },
                        { label: 'AI-Assistant', icon: <Check className="w-5 h-5 text-orange-500" /> }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group translate-y-0 hover:-translate-y-1 transition-transform">
                            <span className="text-gray-300 font-light text-xl">✓</span>
                            <span className="text-sm font-bold tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors uppercase">{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </main>
    )
}
