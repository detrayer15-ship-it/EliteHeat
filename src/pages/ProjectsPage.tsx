import { useProjectStore } from '@/store/projectStore'
import { ProjectList } from '@/modules/projects/ProjectList'
import {
    FolderKanban,
    Plus,
    TrendingUp,
    CheckCircle2,
    Clock,
    Sparkles,
    Zap,
    LayoutGrid,
    Search,
    Filter
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { useState } from 'react'

export const ProjectsPage = () => {
    const projects = useProjectStore((state) => state.projects)
    const [searchQuery, setSearchQuery] = useState('')

    const completedProjects = projects.filter(p => p.stage === 'completed').length
    const inProgressProjects = projects.filter(p => p.stage !== 'completed' && p.stage !== 'idea').length
    const plannedProjects = projects.filter(p => p.stage === 'idea').length

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-full py-2 space-y-10 group/page">
            <ScrollReveal animation="fade">
                {/* Ultra Premium Header */}
                <div className="relative overflow-hidden glass-premium rounded-[2.5rem] p-10 shadow-2xl border border-white/60">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Workspace • V2.0</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tighter">
                                Центр управления <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Проектами</span>
                            </h1>
                            <p className="text-lg text-indigo-950/40 font-medium">Создавай, управляй и масштабируй свои идеи в одном месте.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="relative group/search">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within/search:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Поиск по проектам..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-80 pl-12 pr-6 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-indigo-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-indigo-950 placeholder:text-indigo-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* HIGH-IMPACT STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Завершено', count: completedProjects, icon: <CheckCircle2 className="w-6 h-6" />, color: 'from-emerald-400 to-green-600', text: ' emerald-600' },
                    { label: 'В работе', count: inProgressProjects, icon: <TrendingUp className="w-6 h-6" />, color: 'from-indigo-400 to-blue-600', text: 'indigo-600' },
                    { label: 'Идеи', count: plannedProjects, icon: <Clock className="w-6 h-6" />, color: 'from-purple-400 to-pink-600', text: 'purple-600' },
                ].map((stat, idx) => (
                    <ScrollReveal key={idx} animation="slide-up" delay={idx * 150}>
                        <div className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl group hover:scale-[1.05] transition-all duration-500 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`}></div>

                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40`}>{stat.label}</span>
                                <div className={`p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                            </div>

                            <div className="text-5xl font-black text-indigo-950 mb-1">
                                <AnimatedCounter end={stat.count} />
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <div className={`w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse`}></div>
                                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Live Updates</span>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>

            {/* PROJECTS CONTENT AREA */}
            <ScrollReveal animation="fade" delay={500}>
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-black text-indigo-950 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-yellow-500 fill-current" />
                            Активные слоты
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2.5 glass-premium rounded-xl text-indigo-400 hover:text-indigo-600 transition-colors">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 glass-premium rounded-xl text-indigo-400 hover:text-indigo-600 transition-colors">
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-[400px]">
                        <ProjectList />
                    </div>
                </div>
            </ScrollReveal>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .shadow-glow-teal {
                    box-shadow: 0 15px 35px -10px rgba(79, 70, 229, 0.3);
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.2; }
                }
            `}</style>
        </div>
    )
}
