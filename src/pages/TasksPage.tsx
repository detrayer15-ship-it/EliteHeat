import { useState } from 'react'
import { PythonTasksPage } from './PythonTasksPage'
import { FigmaTasksPage } from './FigmaTasksPage'
import {
    BookOpen,
    Code,
    Palette,
    TrendingUp,
    Award,
    Users,
    Sparkles,
    Zap,
    Star,
    ChevronRight,
    Trophy,
    Target
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const TasksPage = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'figma'>('python')

    return (
        <div className="min-h-full py-2 space-y-12">
            <ScrollReveal animation="fade">
                {/* HERO HUB */}
                <div className="relative overflow-hidden bg-[#0a0a0c] rounded-[3rem] p-12 lg:p-20 shadow-3xl group">
                    {/* Animated Mesh */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
                        <div className="lg:col-span-3 space-y-8">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Academy Hub • Phase 2</span>
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                Центр управления <br />
                                <span className="bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent italic">Развитием</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed">
                                Управляй своими курсами, отслеживай прогресс и получай сертификаты в одном месте.
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            {[
                                { count: 75, suffix: '%', label: 'General Progression', icon: <TrendingUp />, color: 'text-blue-400' },
                                { count: 3, label: 'Masters Awarded', icon: <Award />, color: 'text-purple-400' },
                                { count: 243, label: 'Active Cadets', icon: <Users />, color: 'text-pink-400' },
                                { count: 12, label: 'Daily Streaks', icon: <Star />, color: 'text-amber-400' },
                            ].map((stat, idx) => (
                                <div key={idx} className="glass-card-dark p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                                    <div className="text-2xl font-black text-white">
                                        <AnimatedCounter end={stat.count} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* INTERACTIVE NAVIGATION */}
            <ScrollReveal animation="slide-up">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                    <div className="flex bg-white/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white shadow-xl">
                        {[
                            { id: 'python', label: 'Python Protocol', icon: <Code />, color: 'bg-blue-600' },
                            { id: 'figma', label: 'Visual Interface', icon: <Palette />, color: 'bg-purple-600' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500
                                    ${activeTab === tab.id
                                        ? `${tab.color} text-white shadow-glow translate-y-[-2px]`
                                        : 'text-indigo-950/40 hover:text-indigo-950 hover:bg-white/50'
                                    }
                                `}
                            >
                                <div className={`${activeTab === tab.id ? 'text-white' : 'text-indigo-400'}`}>{tab.icon}</div>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">System Load</span>
                            <span className="text-xs font-medium text-emerald-500 italic">Core Processing Normal</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* CORE CONTENT FRAME */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[4rem] blur-2xl -z-10 group-hover:opacity-100 transition-opacity opacity-0"></div>
                <div className="glass-premium rounded-[3.5rem] border border-white/60 shadow-3xl overflow-hidden p-8 lg:p-12">
                    <div className="animate-fade-in">
                        {activeTab === 'python' ? <PythonTasksPage /> : <FigmaTasksPage />}
                    </div>
                </div>
            </div>

            {/* ACHIEVEMENT BANNER */}
            <ScrollReveal animation="fade" delay={500}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 lg:p-16 text-white shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                        <div className="space-y-8 lg:w-3/5">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 w-fit">
                                <Award className="w-12 h-12 text-yellow-300" />
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight">
                                Твой успех <br /> официально <span className="bg-white text-indigo-700 px-4 py-1 rounded-2xl italic">Подтвержден</span>
                            </h2>
                            <p className="text-lg text-white/60 font-medium max-w-xl">
                                Проходи модули, сдавай практические работы и получай профессиональные сертификаты EliteHeat Academy.
                            </p>
                        </div>

                        <div className="lg:w-2/5 flex flex-col gap-4">
                            {[
                                { title: 'Practical Driven', desc: 'Учим только тому, что нужно в работе.', icon: '🎯' },
                                { title: 'Step-by-Step', desc: 'Продуманная траектория от нуля до профи.', icon: '🎓' },
                                { title: 'Expert Review', desc: 'Обратная связь от практикующих инженеров.', icon: '🧠' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-6">
                                    <div className="text-3xl">{item.icon}</div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-tight text-xs mb-1">{item.title}</h4>
                                        <p className="text-[11px] text-white/40">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .glass-card-dark {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                }
                .shadow-glow {
                    box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.5);
                }
                .shadow-3xl {
                    box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </div>
    )
}
