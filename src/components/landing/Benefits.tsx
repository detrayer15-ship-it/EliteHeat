import { motion } from 'framer-motion'
import { Check, BarChart, Save, Award } from 'lucide-react'

export const Benefits = () => {
    const benefits = [
        {
            icon: Check,
            title: "Практический подход",
            description: "Каждый урок включает реальные проекты и задачи. Вы не просто учите теорию, а сразу применяете знания на практике.",
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            icon: BarChart,
            title: "Трекер прогресса",
            description: "Отслеживайте свои достижения с помощью детальной аналитики. Визуализация прогресса и статистика по урокам.",
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            icon: Save,
            title: "Сохранение прогресса",
            description: "Ваши данные надёжно хранятся в облаке. Продолжайте обучение с любого устройства - прогресс синхронизируется.",
            color: "text-pink-600",
            bg: "bg-pink-100"
        },
        {
            icon: Award,
            title: "Сертификаты",
            description: "Получайте официальные сертификаты по завершению курсов. Подтвердите свои навыки для будущего.",
            color: "text-orange-600",
            bg: "bg-orange-100"
        }
    ]

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                        Почему выбирают <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">EliteHeat</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                        Современная платформа с уникальными возможностями для эффективного обучения
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex gap-6 p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`shrink-0 w-16 h-16 ${benefit.bg} rounded-2xl flex items-center justify-center`}>
                                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                            </div>

                            <div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
