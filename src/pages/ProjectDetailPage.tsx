import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { ProjectRoadmap } from '@/components/project/ProjectRoadmap'
import { ProjectPrompts } from '@/components/project/ProjectPrompts'
import { ProjectStoryboard } from '@/components/project/ProjectStoryboard'
import { AICopilot } from '@/components/project/AICopilot'
import {
    ChevronLeft,
    Save,
    Download,
    Zap,
    Target,
    Layout,
    Settings,
    Cpu,
    Sparkles,
    Briefcase,
    History,
    Share2,
    CheckCircle2
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

type TabType = 'roadmap' | 'prompts' | 'storyboard'

export const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [activeTab, setActiveTab] = useState<TabType>('roadmap')
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProject()
    }, [projectId])

    const loadProject = async () => {
        if (!projectId) {
            setLoading(false)
            return
        }
        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId))
            if (projectDoc.exists()) {
                setProject({ id: projectDoc.id, ...projectDoc.data() })
            }
        } catch (error) {
            console.error('Error loading project:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0a0c]">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 animate-pulse"></div>
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    const displayProject = project || {
        id: projectId,
        title: 'Новый проект',
        description: 'Ожидание конфигурации системы...',
        status: 'planning' as const,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#f0f2f5]">
            {/* LEFT CONTROL PANEL */}
            <div className="w-72 bg-white/80 backdrop-blur-3xl border-r border-indigo-50 flex flex-col shadow-2xl relative z-20">
                <div className="p-8 space-y-8 flex-1 overflow-y-auto scrollbar-none">
                    <button
                        onClick={() => navigate('/projects')}
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-950/40 hover:text-indigo-950 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Terminal
                    </button>

                    <div className="space-y-6 pt-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30">Management Hub</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-indigo-50 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Save className="w-5 h-5" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950">Save Protocol</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-indigo-50 rounded-2xl hover:border-emerald-400 hover:shadow-lg transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><Download className="w-5 h-5" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950">Export Data</span>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 bg-white border border-indigo-50 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all"><Share2 className="w-5 h-5" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950">Share Access</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30">System Status</h3>
                        <div className="bg-[#0a0a0c] p-6 rounded-[2rem] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity"><Cpu className="w-16 h-16" /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Efficiency</span>
                                    <span className="text-xl font-black italic">45%</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-emerald-400">
                                    <Zap className="w-3 h-3" /> System Stable
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-indigo-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[10px]">P</div>
                        <div className="min-w-0">
                            <h4 className="text-[10px] font-black uppercase tracking-tight truncate text-indigo-950">{currentUser?.name || 'Project Lead'}</h4>
                            <p className="text-[9px] text-indigo-950/30 uppercase tracking-widest">Master Architect</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT DECK */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* CINEMATIC HEADER */}
                <div className="bg-white border-b border-indigo-50 p-10 lg:p-14 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-indigo-50/30 blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tighter italic leading-none">{displayProject.title}</h1>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${displayProject.status === 'planning' ? 'bg-amber-50 text-amber-600' :
                                        displayProject.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600' :
                                            'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {displayProject.status} Phase
                                </span>
                            </div>
                            <p className="text-indigo-950/40 text-lg font-medium italic max-w-2xl">{displayProject.description}</p>
                        </div>

                        {/* TAB NAVIGATOR */}
                        <div className="flex bg-indigo-50/50 p-1.5 rounded-[1.8rem] gap-1 shrink-0">
                            {[
                                { id: 'roadmap', label: 'Roadmap', icon: <Target className="w-4 h-4" /> },
                                { id: 'prompts', label: 'Prompts', icon: <Cpu className="w-4 h-4" /> },
                                { id: 'storyboard', label: 'Board', icon: <Layout className="w-4 h-4" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-3 rounded-[1.4rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-lg' : 'text-indigo-950/40 hover:text-indigo-950'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SCROLLABLE STAGE */}
                <div className="flex-1 overflow-y-auto p-10 lg:p-14 bg-white/40 backdrop-blur-sm relative custom-scroll">
                    <ScrollReveal key={activeTab} animation="fade">
                        <div className="max-w-7xl mx-auto pb-20">
                            {activeTab === 'roadmap' && <ProjectRoadmap projectId={projectId!} />}
                            {activeTab === 'prompts' && <ProjectPrompts projectId={projectId!} />}
                            {activeTab === 'storyboard' && <ProjectStoryboard projectId={projectId!} />}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* AI COPILOT DOCK */}
            <div className="w-96 bg-white border-l border-indigo-50 shrink-0 hidden xl:flex flex-col shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Sparkles className="w-32 h-32" /></div>
                <AICopilot activeTab={activeTab} />
            </div>

            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    )
}
