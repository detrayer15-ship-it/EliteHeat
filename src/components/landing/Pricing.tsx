import { motion } from 'framer-motion'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useNavigate } from 'react-router-dom'

export const Pricing = () => {
    const navigate = useNavigate()

    const plans = [
        {
            id: 'monthly',
            name: 'Месячная',
            price: 2990,
            period: 'месяц',
            duration: '1 месяц',
            icon: '📆',
            color: 'from-blue-500 to-cyan-500',
            features: ['Доступ ко всем курсам', 'AI-помощник', 'Поддержка 24/7', 'Мобильное приложение'],
            popular: false,
        },
        {
            id: 'yearly',
            name: 'Годовая',
            price: 29990,
            period: 'год',
            duration: '12 месяцев',
            icon: '🎯',
            color: 'from-purple-500 to-pink-500',
            features: ['Все функции месячной', 'Приоритетная поддержка', 'Сертификаты', 'Эксклюзивные курсы'],
            popular: true,
        },
        {
            id: 'lifetime',
            name: 'Пожизненная',
            price: 99990,
            period: 'навсегда',
            duration: 'Навсегда',
            icon: '💎',
            color: 'from-yellow-500 to-orange-500',
            features: ['Все функции годовой', 'Доступ навсегда', 'VIP поддержка', 'Все будущие курсы', 'Персональный ментор'],
            popular: false,
        }
    ]

    return (
        <section id="pricing" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-50 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-[100px] opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-6">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Тарифные планы</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                        Начните свой путь к <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">успеху</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                        Выберите подходящий тариф и получите полный доступ к инновационной платформе обучения
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative"
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                        <Crown className="w-3 h-3" />
                                        Популярный выбор
                                    </div>
                                </div>
                            )}

                            <Card className={`h-full flex flex-col p-8 rounded-[2.5rem] border ${plan.popular ? 'border-purple-200 shadow-2xl scale-105 ring-1 ring-purple-100' : 'border-gray-100 shadow-xl'} bg-white transition-all duration-300 hover:shadow-2xl`}>
                                <div className="mb-8">
                                    <div className="text-4xl mb-4">{plan.icon}</div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-gray-900">{plan.price.toLocaleString()}₸</span>
                                        <span className="text-gray-400 font-medium">/ {plan.period}</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 mb-10">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 p-0.5 rounded-full bg-green-50">
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => navigate('/register')}
                                    className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-200 hover:scale-[1.02] transform'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Начать обучение
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                        Нужен корпоративный тариф? <button onClick={() => navigate('/support')} className="text-purple-600 font-bold hover:underline">Свяжитесь с нами</button>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
