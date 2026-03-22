import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Zap } from 'lucide-react'

export const FinalCTA = () => {
    const navigate = useNavigate()

    return (
        <section className="py-24 sm:py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3.5rem] p-12 sm:p-24 overflow-hidden bg-slate-900 shadow-[0_32px_64px_-16px_rgba(30,41,59,0.25)]"
                >
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-10"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Твой следующий шаг
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-7xl font-black text-white mb-8 tracking-tight leading-[1.05]"
                        >
                            Готовы выбрать свой <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400">путь в IT?</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl sm:text-2xl text-indigo-100/60 font-medium mb-14 leading-relaxed max-w-2xl"
                        >
                            Начни обучение прямо сейчас и открой для себя безграничные возможности современных технологий.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/select-role')}
                                className="group flex items-center gap-3 px-12 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xl shadow-2xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all border border-indigo-400/20"
                            >
                                <Zap className="w-6 h-6 fill-white" />
                                Выбрать направление
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex items-center gap-6 justify-center"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-indigo-200/40 uppercase tracking-widest">
                                <span className="text-white">500+</span> студентов уже с нами
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
