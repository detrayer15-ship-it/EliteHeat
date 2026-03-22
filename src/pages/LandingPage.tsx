import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FloatingParticles } from '@/components/FloatingParticles'
import { Rocket, Sparkles, Layout, Code2, Globe, Gamepad2, Smartphone, ShieldAlert, BrainCircuit, Terminal } from 'lucide-react'

// Import core landing components
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { Benefits } from '@/components/landing/Benefits'
import { Stats } from '@/components/landing/Stats'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'

export const LandingPage = () => {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin' || user.role === 'developer' || user.role === 'teacher') {
                navigate('/admin')
            } else {
                navigate('/dashboard')
            }
        }
    }, [isAuthenticated, user, navigate])

    const quickDirectionIcons = [
        { icon: Terminal, color: "text-blue-500", label: "Python" },
        { icon: Globe, color: "text-amber-500", label: "Web" },
        { icon: Gamepad2, color: "text-emerald-500", label: "Roblox" }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden smooth-scroll bg-white font-sans text-slate-900">
            {/* Background Layer: Floating Particles */}
            <FloatingParticles />

            {/* Header & Hero: Initial Viewport */}
            <div className="relative min-h-screen flex flex-col">
                <Header />
                <Hero />
            </div>

            {/* Main Content Sections */}
            <div className="relative z-10 bg-white">

                {/* Simplified Directions Count Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col items-center text-center space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-4"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Твой выбор — твой успех</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
                                    <span className="text-indigo-600">3</span> Уникальных направления
                                </h2>
                                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                                    От разработки приложений до современного дизайна. Выберите путь, который вдохновляет вас.
                                </p>
                            </motion.div>

                            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                                {quickDirectionIcons.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -10, rotate: 5 }}
                                        className="flex flex-col items-center gap-3"
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center group cursor-pointer transition-all hover:bg-slate-900 shadow-indigo-100">
                                            <item.icon className={`w-8 h-8 md:w-10 md:h-10 ${item.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1 }}
                                onClick={() => navigate('/select-role')}
                                className="group flex items-center gap-3 py-4 px-8 rounded-2xl bg-slate-50 hover:bg-slate-100 text-indigo-600 font-black transition-all border border-slate-100 shadow-sm"
                            >
                                Посмотреть все программы
                                <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-orange-50/30 rounded-full blur-[100px] pointer-events-none" />
                </section>

                <div id="about">
                    <Benefits />
                </div>
                <Stats />
                <FinalCTA />
                <div id="footer">
                    <Footer />
                </div>
            </div>

            <style>{`
                .smooth-scroll {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    )
}

export default LandingPage
