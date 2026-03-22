import { motion } from 'framer-motion'
import { BookOpen, Users, Star, Award, Zap, Globe, ShieldCheck } from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const Stats = () => {
    const stats = [
        {
            label: "Студентов",
            value: 500,
            suffix: "+",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Курсов",
            value: 3,
            suffix: "",
            icon: BookOpen,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Рейтинг",
            value: 4.9,
            suffix: "/5",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            label: "Сертификатов",
            value: 120,
            suffix: "+",
            icon: Award,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ]

    return (
        <section className="py-32 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative group"
                        >
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 relative group-hover:rotate-12 transition-transform`}>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    <div className={`absolute inset-0 rounded-2xl ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity animate-pulse`} />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                            <AnimatedCounter end={stat.value} duration={2000} />
                                        </span>
                                        <span className="text-2xl font-black text-slate-400">{stat.suffix}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
