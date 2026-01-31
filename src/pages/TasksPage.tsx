import { useState } from 'react'
import { PythonTasksPage } from './PythonTasksPage'
import { FigmaTasksPage } from './FigmaTasksPage'
import {
    BookOpen,
    Code,
    Palette,
    TrendingUp,
    Award,
    CheckCircle,
    Clock,
    Flame
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { useTaskStore } from '@/store/taskStore'

export const TasksPage = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'figma'>('python')

    // Stats data
    const stats = [
        { value: '75%', label: 'Прогресс', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
        { value: '12', label: 'Завершено', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { value: '5', label: 'В работе', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        { value: '7', label: 'Дней подряд', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    ]

    return (
        <div className="min-h-full py-4 space-y-8">
            {/* Compact Header */}
            <ScrollReveal animation="fade">
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-400" />
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Обучение</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-white">
                                    Мои <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">задания</span>
                                </h1>
                                <p className="text-white/40 text-sm">
                                    Проходи уроки и получай сертификаты
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-3 flex-wrap">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 min-w-[90px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        </div>
                                        <p className="text-xl font-black text-white">{stat.value}</p>
                                        <p className="text-[10px] font-medium text-white/40 uppercase">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Tab Navigation */}
            <ScrollReveal animation="slide-up">
                <div className="flex justify-center">
                    <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('python')}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
                                ${activeTab === 'python'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            <Code className="w-4 h-4" />
                            Python
                        </button>
                        <button
                            onClick={() => setActiveTab('figma')}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
                                ${activeTab === 'figma'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-700'
                                }
                            `}
                        >
                            <Palette className="w-4 h-4" />
                            Figma
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Content */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
                {activeTab === 'python' ? <PythonTasksPage /> : <FigmaTasksPage />}
            </div>

            {/* Compact Info Banner */}
            <ScrollReveal animation="fade">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Получай сертификаты</h3>
                            <p className="text-sm text-white/60">Завершай модули и подтверждай свои навыки</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white/10 px-4 py-2 rounded-lg text-center">
                            <p className="text-2xl font-black text-white">3</p>
                            <p className="text-[10px] text-white/60 uppercase">Доступно</p>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg text-center">
                            <p className="text-2xl font-black text-white">1</p>
                            <p className="text-[10px] text-white/60 uppercase">Получено</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}
