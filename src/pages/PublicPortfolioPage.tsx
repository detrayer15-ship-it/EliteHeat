import { useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import {
    Github,
    Globe,
    Award,
    Code2,
    Sparkles,
    ArrowRight,
    Search,
    ExternalLink
} from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const PublicPortfolioPage = () => {
    const { user, updateProfile } = useAuthStore()
    const projects = useProjectStore((state) => state.projects).filter(p => p.stage === 'completed' || p.progress > 50)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updateProfile({ photoURL: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-[#f8faff] via-[#ffffff] to-[#eff6ff] p-4 md:p-10 lg:p-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-6xl mx-auto space-y-20 relative z-10">
                {/* HERO SECTION */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 shadow-4xl group-hover:scale-105 transition-all duration-700">
                            <div className="w-full h-full rounded-[2.8rem] bg-white flex items-center justify-center overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-6xl font-black text-indigo-600">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-indigo-950 p-5 rounded-3xl shadow-2xl flex items-center gap-3 border border-white/20 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
                            <Award className="w-8 h-8 text-amber-400" />
                            <div className="text-left">
                                <p className="font-black text-white uppercase tracking-[0.2em] text-[10px]">ELITE OPS</p>
                                <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Global Rank #24</p>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950/40 rounded-[3rem] backdrop-blur-sm">
                            <Sparkles className="w-12 h-12 text-white animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Система оптимизирована</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-indigo-950 tracking-tighter leading-[0.85]">
                                {user?.name || 'Explorer'}
                            </h1>
                        </div>
                        <p className="text-2xl text-indigo-900/60 font-medium max-w-xl leading-relaxed italic">
                            {user?.bio || "Креативный разработчик, исследующий границы технологий."}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
                            <button className="bg-indigo-950 text-white px-10 py-5 rounded-[1.5rem] flex items-center gap-4 hover:bg-black transition-all hover:scale-105 shadow-xl group">
                                <Github className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Проекты GitHub</span>
                            </button>
                            <button className="bg-white border-2 border-indigo-50 text-indigo-950 px-10 py-5 rounded-[1.5rem] flex items-center gap-4 hover:border-indigo-200 transition-all hover:scale-105 shadow-sm group">
                                <Globe className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Сайт-портфолио</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Projects Done', value: projects.length, icon: <Code2 /> },
                        { label: 'AI Experience', value: 250, suffix: ' hrs', icon: <Sparkles /> },
                        { label: 'Success Rate', value: 98, suffix: '%', icon: <Search /> },
                        { label: 'Rank Points', value: 12450, icon: <Award /> },
                    ].map((stat, i) => (
                        <div key={i} className="glass-premium p-8 rounded-[2.5rem] border border-white/60 bg-white/40 shadow-xl text-center space-y-2">
                            <div className="text-indigo-600 flex justify-center mb-2 opacity-40">{stat.icon}</div>
                            <div className="text-4xl font-black text-indigo-950">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* PROJECTS SHOWCASE */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">Лучшие Проекты</h2>
                        <div className="h-[2px] flex-1 mx-10 bg-indigo-50/50"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {projects.map((project) => (
                            <div key={project.id} className="group glass-premium rounded-[3rem] overflow-hidden border border-white/60 shadow-xl bg-white/40 hover:scale-[1.02] transition-transform duration-500">
                                <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
                                    <div className="text-white text-5xl font-black opacity-40 group-hover:scale-125 transition-transform duration-1000">PROJECT</div>
                                </div>
                                <div className="p-10 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-indigo-950">{project.title}</h3>
                                        <p className="text-indigo-950/40 font-medium line-clamp-2">{project.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                        <span>React</span> • <span>Tailwind</span> • <span>AI SDK</span>
                                    </div>
                                    <div className="pt-6 border-t border-indigo-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                            Смотреть детали <ArrowRight className="w-4 h-4" />
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-indigo-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="text-center py-20 border-t border-indigo-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300">Created via EliteHeat Platform</p>
                </div>
            </div>
        </div>
    )
}
