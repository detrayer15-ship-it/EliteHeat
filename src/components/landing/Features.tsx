import { motion } from 'framer-motion'
import { Code2, PenTool, Bot, CheckCircle2 } from 'lucide-react'

export const Features = () => {
    const features = [
        {
            title: "Python Programming",
            description: "15 профессиональных уроков от основ до продвинутых концепций. Изучите переменные, функции, ООП, работу с данными и создание реальных проектов.",
            icon: Code2,
            color: "text-indigo-600",
            gradient: "from-indigo-500/20 to-blue-500/20",
            border: "border-indigo-100",
            delay: 0,
            items: [
                "Основы синтаксиса и структуры данных",
                "Объектно-ориентированное программирование",
                "Работа с файлами и базами данных",
                "Практические проекты и задачи"
            ]
        },
        {
            title: "Figma Design",
            description: "17 детальных уроков по созданию профессиональных интерфейсов. Освойте UI/UX дизайн, прототипирование и создание дизайн-систем.",
            icon: PenTool,
            color: "text-purple-600",
            gradient: "from-purple-500/20 to-pink-500/20",
            border: "border-purple-100",
            delay: 0.1,
            items: [
                "Основы UI/UX дизайна и композиции",
                "Создание адаптивных макетов",
                "Работа с компонентами и Auto Layout",
                "Прототипирование и анимации"
            ]
        },
        {
            title: "AI-Помощник 24/7",
            description: "Персональный AI-ассистент для помощи в обучении. Получайте мгновенные ответы на вопросы, проверку кода и рекомендации.",
            icon: Bot,
            color: "text-emerald-600",
            gradient: "from-emerald-500/20 to-teal-500/20",
            border: "border-emerald-100",
            delay: 0.2,
            items: [
                "Ответы на вопросы в режиме реального времени",
                "Проверка и объяснение кода",
                "Помощь в создании проектов",
                "Персональные рекомендации"
            ]
        }
    ]

    return (
        <section className="py-24 bg-gray-50/50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                        Что вы <span className="text-indigo-600">получите</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Комплексная образовательная программа, созданная для вашего стремительного профессионального роста
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            whileHover={{ y: -8 }}
                            className={`group relative bg-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border ${feature.border}`}
                        >
                            {/* Gradient Background Blob */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.gradient} rounded-bl-[150px] opacity-50 transition-transform duration-500 group-hover:scale-110`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-900 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="space-y-3">
                                    {feature.items.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className={`mt-1 p-0.5 rounded-full bg-indigo-50`}>
                                                <CheckCircle2 className={`w-4 h-4 ${feature.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
