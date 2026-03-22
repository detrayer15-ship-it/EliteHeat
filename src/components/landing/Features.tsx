import { motion } from 'framer-motion'
import { Bot, Sparkles, Zap, Shield, Target, Rocket } from 'lucide-react'

const presentationItems = [
    {
        title: "ИИ-Ментор Мита",
        description: "Персональный ассистент на базе Google Gemini, который сопровождает вас на каждом этапе, объясняет сложные темы и проверяет код в реальном времени.",
        icon: Bot,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    {
        title: "Адаптивное обучение",
        description: "Платформа подстраивается под ваш темп и уровень знаний, предлагая индивидуальные задания и рекомендации для максимально быстрого роста.",
        icon: Target,
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        title: "Практика и опыт",
        description: "Никакой скучной теории. Обучение построено на создании реальных проектов, которые вы сможете добавить в свое портфолио.",
        icon: Rocket,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    }
]

export const Features = () => {
    return (
        <section className="py-24 sm:py-32 relative overflow-hidden bg-slate-50/30">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6"
                    >
                        <Sparkles className="w-3 h-3" />
                        Технологии EliteEdu
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        Инновации в каждом <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-indigo-600">клике</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium leading-relaxed"
                    >
                        Мы переосмыслили процесс онлайн-образования, сделав его интерактивным, умным и по-настоящему захватывающим.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {presentationItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-8`}>
                                <item.icon className={`w-8 h-8 ${item.color}`} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
