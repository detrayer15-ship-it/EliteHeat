import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Gamepad2, Terminal, ArrowRight, Sparkles } from 'lucide-react'

const directions = [
    {
        title: "Веб разработчик",
        desc: "Создание современных сайтов и веб-сервисов с использованием React и Node.js.",
        icon: Globe,
        color: "from-amber-400 to-orange-600",
        lightBg: "bg-amber-50",
        iconColor: "text-amber-600"
    },
    {
        title: "Roblox",
        desc: "Создание собственных игр на платформе Roblox с использованием языка Lua. От первой детали до запуска своей метавселенной.",
        icon: Gamepad2,
        color: "from-emerald-400 to-teal-600",
        lightBg: "bg-emerald-50",
        iconColor: "text-emerald-600"
    },
    {
        title: "Python",
        desc: "Разработка на самом популярном языке мира: от скриптов и игр на Pygame до backend на Django.",
        icon: Terminal,
        color: "from-blue-400 to-indigo-600",
        lightBg: "bg-blue-50",
        iconColor: "text-blue-600"
    }
]

export const CourseDirections = () => {
    const navigate = useNavigate()

    return (
        <section id="directions" className="py-24 bg-white relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6"
                    >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Выберите свой путь
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        Направления <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">обучения</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium"
                    >
                        Начните карьеру в одном из самых востребованных направлений IT индустрии уже сегодня.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {directions.map((dir, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col items-start text-left cursor-pointer"
                            onClick={() => navigate('/register', { state: { direction: dir.title } })}
                        >
                            {/* Icon block */}
                            <div className={`w-14 h-14 rounded-2xl ${dir.lightBg} flex items-center justify-center mb-6 border border-white group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <dir.icon className={`w-7 h-7 ${dir.iconColor}`} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {dir.title}
                            </h3>

                            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-1">
                                {dir.desc}
                            </p>

                            <div className="mt-auto w-full flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${dir.iconColor} px-3 py-1 rounded-full ${dir.lightBg}`}>
                                    Выбрать курс
                                </span>
                                <div className={`w-8 h-8 rounded-full ${dir.lightBg} flex items-center justify-center group-hover:bg-gradient-to-r ${dir.color} group-hover:text-white transition-all`}>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Hover effect gradient line */}
                            <div className={`absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r ${dir.color} rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 overflow-hidden`}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
