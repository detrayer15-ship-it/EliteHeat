import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Code2,
    Palette,
    Cpu,
    Globe,
    Lock,
    CheckCircle2,
    Sparkles,
    ChevronRight,
    ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { TranslationKey } from '@/utils/translations'

interface Assignment {
    type: 'js' | 'python' | 'figma'
    instruction: string
    reward: number
    imageUrl?: string
}

interface SkillNode {
    id: string
    titleKey: TranslationKey
    category: 'foundation' | 'creative' | 'dev' | 'ai'
    status: 'locked' | 'available' | 'completed'
    position: { x: number; y: number }
    descriptionKey: TranslationKey
    lessons: string[]
    assignment?: Assignment
}

const SKILL_NODES: SkillNode[] = [
    // Foundation
    {
        id: 'f1',
        titleKey: 'skills',
        category: 'foundation',
        status: 'completed',
        position: { x: 400, y: 800 },
        descriptionKey: 'platform',
        lessons: ['HTML Structure', 'Tags & Attributes']
    },
    {
        id: 'f2',
        titleKey: 'skills',
        category: 'foundation',
        status: 'completed',
        position: { x: 400, y: 700 },
        descriptionKey: 'platform',
        lessons: ['Flexbox', 'Grid Layout', 'Animations']
    },

    // Dev Track
    {
        id: 'd1',
        titleKey: 'analyzer',
        category: 'dev',
        status: 'available',
        position: { x: 300, y: 600 },
        descriptionKey: 'missionControl',
        lessons: ['Variables', 'Functions', 'Async/Await'],
        assignment: {
            type: 'python',
            instruction: 'Напиши скрипт на Python, который приветствует пользователя по имени.',
            reward: 500
        }
    },
    { id: 'd2', titleKey: 'tasks', category: 'dev', status: 'locked', position: { x: 250, y: 500 }, descriptionKey: 'platform', lessons: ['JSX', 'useState', 'useEffect'] },
    { id: 'd3', titleKey: 'tasks', category: 'dev', status: 'locked', position: { x: 200, y: 400 }, descriptionKey: 'platform', lessons: ['REST API', 'MongoDB', 'Authentication'] },

    // Creative Track
    {
        id: 'c1',
        titleKey: 'skillTree',
        category: 'creative',
        status: 'available',
        position: { x: 500, y: 600 },
        descriptionKey: 'platform',
        lessons: ['Auto Layout', 'Components', 'Prototyping'],
        assignment: {
            type: 'figma',
            instruction: 'Создай дизайн карточки проекта в Figma, используя Auto Layout.',
            reward: 600,
            imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=400&h=300&fit=crop'
        }
    },
    { id: 'c2', titleKey: 'skills', category: 'creative', status: 'locked', position: { x: 550, y: 500 }, descriptionKey: 'platform', lessons: ['User Flows', 'Wireframing', 'Testing'] },
    { id: 'c3', titleKey: 'skills', category: 'creative', status: 'locked', position: { x: 600, y: 400 }, descriptionKey: 'platform', lessons: ['3D Modeling', 'Materials', 'Lighting'] },

    // AI Track (Apex)
    { id: 'a1', titleKey: 'aiAssistant', category: 'ai', status: 'locked', position: { x: 400, y: 300 }, descriptionKey: 'platform', lessons: ['Context Window', 'Zero-shot', 'Chain of Thought'] },
    { id: 'a2', titleKey: 'aiAssistant', category: 'ai', status: 'locked', position: { x: 400, y: 200 }, descriptionKey: 'platform', lessons: ['Agents', 'API Integration', 'Workflows'] },
    { id: 'a3', titleKey: 'aiAssistant', category: 'ai', status: 'locked', position: { x: 400, y: 80 }, descriptionKey: 'platform', lessons: ['Innovation', 'Architecture', 'Full Deployment'] },
]

const CONNECTIONS = [
    ['f1', 'f2'],
    ['f2', 'd1'],
    ['f2', 'c1'],
    ['d1', 'd2'],
    ['d2', 'd3'],
    ['c1', 'c2'],
    ['c2', 'c3'],
    ['d3', 'a1'],
    ['c3', 'a1'],
    ['a1', 'a2'],
    ['a2', 'a3'],
]

export const SkillTreePage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
    const [isMissionOpen, setIsMissionOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getCategoryColors = (category: string) => {
        switch (category) {
            case 'foundation': return 'text-indigo-600 bg-indigo-100 border-indigo-200 shadow-indigo-100'
            case 'creative': return 'text-pink-600 bg-pink-100 border-pink-200 shadow-pink-100'
            case 'dev': return 'text-blue-600 bg-blue-100 border-blue-200 shadow-blue-100'
            case 'ai': return 'text-purple-600 bg-purple-100 border-purple-200 shadow-purple-100'
            default: return 'text-slate-600 bg-slate-100 border-slate-200 shadow-slate-100'
        }
    }

    const getIcon = (category: string) => {
        switch (category) {
            case 'foundation': return <Globe className="w-5 h-5" />
            case 'creative': return <Palette className="w-5 h-5" />
            case 'dev': return <Code2 className="w-5 h-5" />
            case 'ai': return <Cpu className="w-5 h-5" />
            default: return <Sparkles className="w-5 h-5" />
        }
    }

    return (
        <div className="min-h-full py-2 space-y-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-indigo-950 tracking-tighter flex items-center gap-4">
                        {t('skillTree')}
                        <div className="px-3 py-1 bg-indigo-600 text-[10px] text-white rounded-full uppercase tracking-widest animate-pulse">Alpha</div>
                    </h1>
                    <p className="text-indigo-900/40 font-bold uppercase text-[10px] tracking-[0.3em]">Визуализируй свой путь к мастерству</p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="group text-indigo-400">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t('viewAll')} {/* Adjust key if needed */}
                </Button>
            </div>

            <div className="relative flex flex-col lg:flex-row gap-10">
                {/* SVG SKILL TREE */}
                <div className="flex-1 glass-premium rounded-[3rem] border border-white/60 shadow-2xl overflow-hidden bg-white/20 p-4 min-h-[900px] cursor-grab active:cursor-grabbing">
                    <svg width="100%" height="900" viewBox="150 0 500 900" className="w-full h-full drop-shadow-2xl">
                        {/* Lines */}
                        {CONNECTIONS.map(([fromId, toId], idx) => {
                            const from = SKILL_NODES.find(n => n.id === fromId)!
                            const to = SKILL_NODES.find(n => n.id === toId)!
                            const isActive = from.status === 'completed' && (to.status === 'completed' || to.status === 'available')

                            return (
                                <line
                                    key={idx}
                                    x1={from.position.x}
                                    y1={from.position.y}
                                    x2={to.position.x}
                                    y2={to.position.y}
                                    stroke={isActive ? '#6366f1' : '#e2e8f0'}
                                    strokeWidth={isActive ? 3 : 2}
                                    strokeDasharray={isActive ? "none" : "8,8"}
                                    opacity={isActive ? 0.8 : 0.3}
                                />
                            )
                        })}

                        {/* Nodes */}
                        {SKILL_NODES.map((node) => (
                            <g
                                key={node.id}
                                onClick={() => setSelectedNode(node)}
                                className="cursor-pointer group/node"
                            >
                                <motion.circle
                                    cx={node.position.x}
                                    cy={node.position.y}
                                    r={node.status === 'completed' ? 28 : 24}
                                    fill={node.status === 'completed' ? '#6366f1' : node.status === 'available' ? '#fff' : '#f8fafc'}
                                    stroke={node.status === 'locked' ? '#e2e8f0' : '#6366f1'}
                                    strokeWidth={3}
                                    whileHover={{ scale: 1.15 }}
                                    className="transition-all duration-300 shadow-xl"
                                />

                                <foreignObject
                                    x={node.position.x - 12}
                                    y={node.position.y - 12}
                                    width="24"
                                    height="24"
                                    className="pointer-events-none"
                                >
                                    <div className={`flex items-center justify-center w-6 h-6 ${node.status === 'completed' ? 'text-white' : node.status === 'locked' ? 'text-slate-300' : 'text-indigo-600'}`}>
                                        {node.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : node.status === 'locked' ? <Lock className="w-4 h-4" /> : getIcon(node.category)}
                                    </div>
                                </foreignObject>

                                <text
                                    x={node.position.x}
                                    y={node.position.y + 45}
                                    textAnchor="middle"
                                    className={`text-[10px] font-black uppercase tracking-tighter ${node.status === 'locked' ? 'fill-slate-300' : 'fill-indigo-950'}`}
                                >
                                    {t(node.titleKey as any)}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Info Panel */}
                <div className="w-full lg:w-96 space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedNode ? (
                            <motion.div
                                key={selectedNode.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass-premium p-8 rounded-[2.5rem] border border-white/60 shadow-xl space-y-6 bg-gradient-to-br from-indigo-50/50 to-white/50"
                            >
                                <div className="space-y-4">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getCategoryColors(selectedNode.category)}`}>
                                        {getIcon(selectedNode.category)}
                                        {selectedNode.category}
                                    </div>
                                    <h2 className="text-3xl font-black text-indigo-950">{t(selectedNode.titleKey as any)}</h2>
                                    <p className="text-indigo-900/60 font-medium leading-relaxed">{t(selectedNode.descriptionKey as any)}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Что ты узнаешь:</p>
                                    <div className="space-y-2">
                                        {selectedNode.lessons.map((lesson, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-indigo-50 group hover:border-indigo-200 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                <span className="text-sm font-bold text-indigo-900">{lesson}</span>
                                                <ChevronRight className="w-4 h-4 ml-auto text-indigo-200 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200"
                                    disabled={selectedNode.status === 'locked'}
                                    onClick={() => setIsMissionOpen(true)}
                                >
                                    {selectedNode.status === 'completed' ? 'Пройти снова' : selectedNode.status === 'locked' ? 'Заблокировано' : 'Начать миссию'}
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="glass-premium p-12 rounded-[2.5rem] border border-white/60 shadow-xl flex flex-col items-center justify-center text-center space-y-6 bg-white/20 h-full min-h-[400px]">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center animate-bounce-subtle">
                                    <Sparkles className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tighter">{t('skillTree')}</h3>
                                    <p className="text-sm text-indigo-900/40 font-bold">Нажми на любой доступный навык, чтобы увидеть детали и начать обучение</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Mission Modal */}
                    <AnimatePresence>
                        {isMissionOpen && selectedNode?.assignment && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsMissionOpen(false)}
                                    className="absolute inset-0 bg-indigo-950/40 backdrop-blur-xl"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-4xl overflow-hidden"
                                >
                                    <div className="p-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Миссия: {selectedNode.assignment.type}</p>
                                                    <h3 className="text-2xl font-black text-indigo-950">{t(selectedNode.titleKey as any)}</h3>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsMissionOpen(false)}
                                                className="p-2 hover:bg-indigo-50 rounded-full transition-colors"
                                            >
                                                <Lock className="w-6 h-6 text-indigo-300" /> {/* Close icon needed */}
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                                                <p className="text-indigo-950 font-medium leading-relaxed">
                                                    {selectedNode.assignment.instruction}
                                                </p>
                                            </div>

                                            {selectedNode.assignment.imageUrl && (
                                                <div className="rounded-3xl overflow-hidden border border-indigo-100 shadow-lg">
                                                    <img src={selectedNode.assignment.imageUrl} alt="Reference" className="w-full h-48 object-cover" />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-6 rounded-3xl border border-dashed border-indigo-200 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-indigo-50/50 transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Globe className="w-5 h-5" /> {/* Upload icon needed */}
                                                    </div>
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase">Загрузить файл</span>
                                                </div>
                                                <div className="bg-indigo-950 p-6 rounded-3xl text-white flex flex-col items-center justify-center gap-1">
                                                    <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Награда</span>
                                                    <p className="text-2xl font-black">+{selectedNode.assignment.reward} XP</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full py-8 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white text-base font-black uppercase tracking-widest shadow-2xl shadow-indigo-300 disabled:opacity-50"
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                setIsSubmitting(true)
                                                setTimeout(() => {
                                                    setIsSubmitting(false)
                                                    setIsMissionOpen(false)
                                                    setSelectedNode(prev => prev ? { ...prev, status: 'completed' } : null)
                                                }, 2000)
                                            }}
                                        >
                                            {isSubmitting ? 'Отправка...' : 'Отправить на проверку'}
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Stats */}
                    <div className="glass-premium p-8 rounded-[2.5rem] border border-white/60 bg-indigo-950 text-white shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Твой прогресс</span>
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-black">12/45</span>
                            <span className="text-sm font-bold opacity-60 mb-1">Завершено</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                            <div className="w-[28%] h-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-bounce-subtle {
                    animation: bounceSubtle 2s infinite ease-in-out;
                }
                @keyframes bounceSubtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    )
}
