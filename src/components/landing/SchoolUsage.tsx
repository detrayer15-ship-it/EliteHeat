import { motion } from 'framer-motion'
import { GraduationCap, Users, CheckCircle, ArrowRight } from 'lucide-react'

export const SchoolUsage = () => {
    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                        Как это работает в <span className="text-indigo-600">школе</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Один проект = одна учебная четверть. Полный цикл от идеи до защиты.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[150px] -z-0 transition-transform group-hover:scale-110" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-indigo-600 text-white">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Ученик</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    "Выбирает тему проекта из каталога",
                                    "Работает пошагово в Project Hub",
                                    "Получает мгновенную помощь AI",
                                    "Защищает проект перед классом"
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                                            {idx + 1}
                                        </div>
                                        <span className="text-lg text-gray-700 font-medium">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Teacher Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-[150px] -z-0 transition-transform group-hover:scale-110" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-purple-600 text-white">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Учитель</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    "Видит прогресс каждого в реальном времени",
                                    "Проверяет автоматически оцененные задания",
                                    "Комментирует и направляет через чат",
                                    "Выставляет финальную оценку в журнал"
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="text-lg text-gray-700 font-medium">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
