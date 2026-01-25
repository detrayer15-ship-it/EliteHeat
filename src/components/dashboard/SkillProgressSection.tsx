import { motion } from 'framer-motion'
import { Code, Database, Layout, ShieldCheck, Zap } from 'lucide-react'

const skills = [
    { name: 'Frontend Architecture', progress: 85, color: 'bg-blue-500', icon: <Layout className="w-4 h-4" /> },
    { name: 'Backend Scalability', progress: 65, color: 'bg-indigo-500', icon: <Database className="w-4 h-4" /> },
    { name: 'AI Integration', progress: 40, color: 'bg-emerald-400', icon: <Zap className="w-4 h-4" /> },
    { name: 'Security & Cloud', progress: 50, color: 'bg-orange-500', icon: <ShieldCheck className="w-4 h-4" /> },
]

export const SkillProgressSection = () => {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Векторы Развития</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ваш текущий профиль: Full-Stack Architect</p>
                </div>
                <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                            <Code className="w-4 h-4 text-slate-400" />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black">+12</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills.map((skill, idx) => (
                    <div key={skill.name} className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl ${skill.color}/10 flex items-center justify-center text-${skill.color.split('-')[1]}-600`}>
                                    {skill.icon}
                                </div>
                                <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">{skill.name}</span>
                            </div>
                            <span className="text-lg font-black italic text-slate-300">{skill.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.progress}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className={`h-full ${skill.color} rounded-full`}
                            ></motion.div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-emerald-900">Бонус за активность: x2 к опыту</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Действует еще 2 часа</p>
                    </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-white px-4 py-2 rounded-xl shadow-sm">Подробнее</button>
            </div>
        </div>
    )
}
