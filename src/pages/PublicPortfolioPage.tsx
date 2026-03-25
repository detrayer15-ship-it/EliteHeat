import { useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
    Github,
    Globe,
    Code2,
    ArrowRight,
    ExternalLink,
    FileCode,
    Layout,
    Layers,
    UserCircle2,
} from 'lucide-react'

export const PublicPortfolioPage = () => {
    const { user, updateProfile } = useAuthStore()
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

    // Mock projects for now since we removed the dynamic projects store
    const projects = [
        {
            id: '1',
            title: 'Интерфейс мобильного приложения',
            description: 'Разработка современного UI/UX дизайна для фитнес-трекера в Figma.',
            tags: ['Figma', 'UI/UX', 'Mobile'],
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            id: '2',
            title: 'Система анализа данных на Python',
            description: 'Скрипт для обработки больших массивов данных и визуализации результатов.',
            tags: ['Python', 'Pandas', 'Data'],
            gradient: 'from-blue-500 to-indigo-500'
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 lg:p-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[140px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                {/* HERO SECTION */}
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="w-56 h-56 md:w-80 md:h-80 rounded-[4rem] bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 p-2 shadow-2xl group-hover:rotate-3 transition-all duration-700">
                            <div className="w-full h-full rounded-[3.8rem] bg-white flex items-center justify-center overflow-hidden border-8 border-white">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <UserCircle2 className="w-32 h-32 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center gap-4 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <Layers className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="text-left pr-4">
                                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Level Up</p>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Digital Architect</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Система активна</span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.8]">
                                {user?.name || 'Explorer'}
                            </h1>
                        </div>
                        <p className="text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed italic">
                            {user?.bio || "Студент платформы EliteHeat. Проектирую будущее, код за кодом."}
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                            <button className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] flex items-center gap-4 hover:bg-indigo-600 transition-all hover:scale-105 shadow-2xl group">
                                <Github className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Проекты GitHub</span>
                            </button>
                            <button className="bg-white border-2 border-slate-100 text-slate-900 px-12 py-6 rounded-[2rem] flex items-center gap-4 hover:border-indigo-200 transition-all hover:scale-105 shadow-xl group">
                                <Globe className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Мой сайт</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Проектов', value: '2', icon: <FileCode className="w-8 h-8" />, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Курсов', value: '2', icon: <Layout className="w-8 h-8" />, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Дней обучения', value: '14', icon: <Code2 className="w-8 h-8" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-8 group hover:-translate-y-2 transition-all duration-500">
                            <div className={`w-20 h-20 rounded-[1.8rem] ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className="text-left space-y-1">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SKILLS SHOWCASE */}
                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Стек технологий</h2>
                        <div className="h-[2px] flex-1 bg-slate-100"></div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {['Python', 'Figma', 'UI/UX Design', 'React', 'Tailwind CSS', 'Git', 'Data Analysis'].map((skill, i) => (
                            <div key={i} className="px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-sm text-slate-600 shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default">
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>

                {/* PROJECTS SHOWCASE */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Мои работы</h2>
                        <div className="h-[2px] flex-1 mx-10 bg-slate-100"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((project) => (
                            <div key={project.id} className="group bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
                                <div className={`h-64 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                                    <div className="text-white text-6xl font-black opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000 uppercase tracking-tighter">Work</div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                                </div>
                                <div className="p-12 space-y-8">
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{project.title}</h3>
                                        <p className="text-slate-500 font-medium text-lg leading-relaxed">{project.description}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-indigo-600 font-black text-sm uppercase tracking-widest cursor-pointer hover:gap-5 transition-all">
                                            Смотреть проект <ArrowRight className="w-5 h-5" />
                                        </div>
                                        <ExternalLink className="w-6 h-6 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="text-center py-24 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Платформа EliteHeat • 2028</p>
                </div>
            </div>

            <style>{`
                .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                }
            `}</style>
        </div>
    )
}
