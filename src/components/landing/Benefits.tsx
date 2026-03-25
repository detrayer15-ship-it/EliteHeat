import { motion } from 'framer-motion'
import { Rocket, Target, Shield, Zap, Globe, Users, Sparkles, Code2, GraduationCap } from 'lucide-react'

const benefits = [
    {
        title: "Глубокое погружение",
        desc: "Мы верим в обучение через действие. Каждый модуль — это шаг к созданию вашего первого серьезного проекта.",
        icon: GraduationCap,
        color: "bg-orange-50 text-orange-600",
        border: "border-orange-100"
    },
    {
        title: "Экспертная поддержка",
        desc: "Наши опытные менторы всегда готовы подсказать, направить и помочь с любой сложной задачей.",
        icon: Users,
        color: "bg-indigo-50 text-indigo-600",
        border: "border-indigo-100"
    },
    {
        title: "Гибкий график",
        desc: "Учитесь в своем ритме. Платформа адаптируется под ваш прогресс и свободное время.",
        icon: Zap,
        color: "bg-emerald-50 text-emerald-600",
        border: "border-emerald-100"
    },
    {
        title: "Мировое комьюнити",
        desc: "Станьте частью сообщества единомышленников. Делитесь опытом и растите вместе с нами.",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
        border: "border-blue-100"
    }
]

export const Benefits = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    {/* Left side text */}
                    <div className="lg:w-[45%] space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                            EliteHeat Experience
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl sm:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight"
                        >
                            Твой новый <br /> уровень <br /> <span className="text-indigo-600">развития</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            Мы создали среду, где обучение превращается в увлекательное путешествие. Никаких рамок, только ваши идеи и лучшие инструменты для их воплощения.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-6 justify-center lg:justify-start pt-6"
                        >
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-900">100%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Практики</span>
                            </div>
                            <div className="w-[1px] h-10 bg-slate-100" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-900">24/7</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Поддержки</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side benefits grid */}
                    <div className="lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden`}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${benefit.color} flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500`}>
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{benefit.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">{benefit.desc}</p>

                                {/* Decorative gradient hover */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${benefit.color === 'bg-indigo-50 text-indigo-600' ? 'from-indigo-600 to-blue-500' : 'from-orange-500 to-amber-400'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
