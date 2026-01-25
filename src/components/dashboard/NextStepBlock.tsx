import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProjectStore } from '@/store/projectStore'

export const NextStepBlock = () => {
    const navigate = useNavigate()
    const projects = useProjectStore((state) => state.projects)

    // Get the most recent incomplete project (simulated logic)
    const latestProject = projects.length > 0 ? projects[projects.length - 1] : null

    if (!latestProject) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-[2.5rem] p-10 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)]"
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 group-hover:opacity-40 transition-opacity"></div>

            {/* Animated Particles (CSS-only for performance) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                            <BookOpen className="w-3 h-3 text-indigo-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Продолжить обучение</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tighter">
                            {latestProject.title}
                        </h2>
                        <div className="flex items-center gap-6 text-white/70">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-bold">{latestProject.stage || 'Активная фаза'}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${latestProject.progress}%` }}
                                        className="h-full bg-white rounded-full"
                                    ></motion.div>
                                </div>
                                <span className="text-xs font-black">{latestProject.progress}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/projects/${latestProject.id}`)}
                            className="bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-900/40"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Войти в терминал
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block w-px h-32 bg-white/10"></div>

                <div className="hidden lg:flex flex-col gap-6 text-right">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">Успеваемость</p>
                        <p className="text-3xl font-black text-white italic">Elite+</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">Сложность</p>
                        <p className="text-xl font-black text-white">Advanced</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
