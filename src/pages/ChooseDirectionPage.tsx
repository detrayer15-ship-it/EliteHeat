import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Gamepad2, Terminal, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react'
import { LogoAnimation } from '@/components/ui/LogoAnimation'

const directions = [
    {
        id: 'web',
        title: "Веб разработчик",
        desc: "Создание современных сайтов и веб-сервисов с использованием React и Node.js.",
        icon: Globe,
        color: "from-amber-400 to-orange-600",
        lightBg: "bg-amber-50",
        iconColor: "text-amber-600"
    },
    {
        id: 'game',
        title: "Roblox",
        desc: "Создание собственных игр на платформе Roblox с использованием языка Lua. От первой детали до запуска своей метавселенной.",
        icon: Gamepad2,
        color: "from-emerald-400 to-teal-600",
        lightBg: "bg-emerald-50",
        iconColor: "text-emerald-600"
    },
    {
        id: 'python',
        title: "Python",
        desc: "Разработка на самом популярном языке мира: от скриптов и игр на Pygame до backend на Django.",
        icon: Terminal,
        color: "from-blue-400 to-indigo-600",
        lightBg: "bg-blue-50",
        iconColor: "text-blue-600"
    }
]

export const ChooseDirectionPage = () => {
    const navigate = useNavigate()

    const handleSelect = (directionTitle: string) => {
        // Move to subscription selection with the chosen direction
        navigate('/subscription', { state: { direction: directionTitle } })
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col pt-10 pb-20">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Header Area */}
                <div className="w-full flex justify-between items-center mb-16">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Назад
                    </button>
                    <LogoAnimation />
                    <div className="w-20" /> {/* Spacer */}
                </div>

                {/* Title Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 shadow-sm"
                    >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Шаг 2 из 4
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
                    >
                        В каком <span className="text-indigo-600">направлении</span> <br /> будем развиваться?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-medium text-lg leading-relaxed"
                    >
                        Выберите специализацию, которая вам по душе. Мы подготовили индивидуальную программу обучения для каждого пути.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {directions.map((dir, idx) => (
                        <motion.button
                            key={dir.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 + 0.3 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(dir.title)}
                            className="group relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-300 text-left flex flex-col"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${dir.lightBg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                <dir.icon className={`w-7 h-7 ${dir.iconColor}`} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {dir.title}
                                </h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                                    {dir.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">
                                    Выбрать этот путь
                                </span>
                                <div className={`w-10 h-10 rounded-full ${dir.lightBg} flex items-center justify-center group-hover:bg-gradient-to-r ${dir.color} group-hover:text-white transition-all`}>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Decorative line */}
                            <div className={`absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r ${dir.color} rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                        </motion.button>
                    ))}
                </div>

                {/* Footer hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-16 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    Все программы включают проверку заданий экспертами
                </motion.p>
            </div>
        </div>
    )
}

export default ChooseDirectionPage
