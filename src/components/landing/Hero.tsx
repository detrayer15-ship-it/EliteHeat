import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Layout, Code2, Rocket, Award, Star } from 'lucide-react'
import { Typewriter } from '@/components/Typewriter'

export const Hero = () => {
    const navigate = useNavigate()

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#f8faff] to-[#f0f4ff]">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/40 to-blue-100/30 rounded-full blur-[120px] animate-float-mega-slow" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-orange-100/30 to-amber-100/20 rounded-full blur-[100px] animate-pulse-slow" />
                
                <div
                    className="absolute inset-0 opacity-[0.25]"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex justify-center mb-10"
                >
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-indigo-50/80 border border-indigo-100 shadow-sm">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-600 uppercase">
                            Официальный запуск: 2024
                        </span>
                    </div>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-[5.5rem] sm:text-[7rem] md:text-[9rem] font-black tracking-tight leading-[0.85] mb-6"
                >
                    <span className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent">Elite</span><span className="bg-gradient-to-b from-indigo-500 to-indigo-700 bg-clip-text text-transparent">Heat</span>
                </motion.h1>

                {/* Typewriter */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="mb-10 min-h-[3.5rem] flex items-center justify-center"
                >
                    <div className="text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tight text-slate-800">
                        <Typewriter
                            texts={['Будущее в IT начинается здесь', 'Твой путь к успеху', 'Код, дизайн и творчество', 'Получай сертификат эксперта']}
                            speed={60}
                            deleteSpeed={30}
                            pauseTime={3500}
                            className="bg-gradient-to-r from-orange-500 to-indigo-600 bg-clip-text text-transparent"
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    EliteHeat — это современная экосистема для будущих специалистов. Освойте востребованную профессию, создавайте реальные проекты и заберите свой сертификат.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/select-role')}
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-base shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:bg-indigo-600 transition-all"
                    >
                        Начать обучение
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Active badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
                >
                    {[
                        { icon: Code2, label: 'Software', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { icon: Layout, label: 'Design', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { icon: Award, label: 'Certified', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 group hover:-translate-y-1 transition-transform cursor-default">
                            <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-5 h-8 border-2 border-slate-200 rounded-full flex items-start justify-center pt-1.5">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-1.5 bg-slate-300 rounded-full"
                    />
                </div>
            </motion.div>
        </main>
    )
}
