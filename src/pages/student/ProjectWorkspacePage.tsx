import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle,
    ArrowLeft,
    Bot,
    CheckCircle2,
    Circle,
    FileUp,
    LayoutDashboard,
    Loader2,
    MessageSquare,
    Plus,
    Presentation,
    Send,
    Sparkles,
    Target,
    Users,
    Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sendAIChatMessage } from '@/api/mita'
import { useProjectData } from '@/hooks/useProjectData'
import { useAuthStore } from '@/store/authStore'
import type { ProjectStage, Task } from '@/types/project'

type Tab = 'overview' | 'tasks' | 'mentor' | 'presentation'
type ChatMessage = { role: 'user' | 'assistant'; content: string }
type PresentationResult = {
    structureScore: number
    clarityScore: number
    errors: string[]
    recommendations: string[]
}

const stages: Array<{ id: ProjectStage; label: string; icon: typeof Target; color: string; bg: string }> = [
    { id: 'idea', label: 'Идея', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'prototype', label: 'Прототип', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'presentation', label: 'Презентация', icon: Presentation, color: 'text-indigo-600', bg: 'bg-indigo-50' },
]

const parsePresentationResult = (reply: string): PresentationResult | null => {
    const match = reply.match(/\{[\s\S]*\}/)
    if (!match) return null

    try {
        return JSON.parse(match[0]) as PresentationResult
    } catch {
        return null
    }
}

export const ProjectWorkspacePage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { project, loading, error, updateProject } = useProjectData(id || '')
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [newTask, setNewTask] = useState<Record<string, string>>({})
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [chatInput, setChatInput] = useState('')
    const [isChatLoading, setIsChatLoading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<PresentationResult | null>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isChatLoading])

    const progress = project?.progress || 0

    const overviewCards = useMemo(() => {
        if (!project) return []
        return [
            { title: 'Проблема', value: project.problem, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: 'Решение', value: project.solution, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Аудитория', value: project.audience, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Ценность', value: project.valueProposition || 'Главная ценность еще не описана.', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
    }, [project])

    if (loading) {
        return (
            <div className="flex min-h-full items-center justify-center bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
                    <h1 className="mt-4 text-2xl font-black text-slate-950">Проект не найден</h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">Возможно, он был удален или еще не загрузился.</p>
                    <Button onClick={() => navigate('/projects')} className="mt-6 rounded-2xl px-6 py-3">К проектам</Button>
                </div>
            </div>
        )
    }

    const recalculateProgress = (tasks: Task[]) => {
        if (!tasks.length) return 0
        return Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
    }

    const toggleTask = async (taskId: string) => {
        const tasks = project.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
        const nextProgress = recalculateProgress(tasks)
        await updateProject({
            tasks,
            progress: nextProgress,
            status: nextProgress === 100 ? 'completed' : 'active',
        })
    }

    const addTask = async (stage: ProjectStage) => {
        const title = newTask[stage]?.trim()
        if (!title) return

        const task: Task = {
            id: `task_${Date.now()}`,
            title,
            completed: false,
            projectId: project.id,
            stage,
        }
        await updateProject({ tasks: [...project.tasks, task] })
        setNewTask((current) => ({ ...current, [stage]: '' }))
    }

    const sendMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return

        const text = chatInput
        const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
        setMessages(nextMessages)
        setChatInput('')
        setIsChatLoading(true)

        try {
            const prompt = `
Ты Elly, AI-помощник ученика. Помоги улучшить проект, презентацию или бизнес-модель.

Проект: ${project.title}
Описание: ${project.description}
Проблема: ${project.problem}
Решение: ${project.solution}
Аудитория: ${project.audience}

Вопрос ученика: ${text}
Отвечай по-русски, конкретно, дружелюбно и с 2-4 практическими шагами.`

            const { reply } = await sendAIChatMessage(`project-mentor-${project.id}`, prompt, {
                mode: 'tutor',
                history: messages.slice(-8),
            })
            setMessages((current) => [...current, { role: 'assistant', content: reply }])
        } catch (chatError) {
            console.error('Mentor message failed:', chatError)
            setMessages((current) => [
                ...current,
                {
                    role: 'assistant',
                    content: 'Я бы начал с уточнения проблемы, затем проверил аудиторию и сделал один прототипный экран. После этого уже можно собирать презентацию для защиты.',
                },
            ])
        } finally {
            setIsChatLoading(false)
        }
    }

    const analyzePresentation = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsAnalyzing(true)
        try {
            const prompt = `
Ученик загрузил презентацию "${file.name}" для проекта "${project.title}".
Сделай анализ структуры, ясности и ошибок. Верни только JSON:
{
  "structureScore": 8,
  "clarityScore": 7,
  "errors": ["ошибка 1", "ошибка 2"],
  "recommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"]
}`
            const { reply } = await sendAIChatMessage(`presentation-${project.id}`, prompt, { mode: 'tutor' })
            setAnalysis(parsePresentationResult(reply) || {
                structureScore: 8,
                clarityScore: 7,
                errors: ['Не видно четкого перехода от проблемы к решению.', 'Финальный слайд стоит усилить призывом к действию.'],
                recommendations: ['Добавь слайд с целевой аудиторией.', 'Покажи один экран прототипа.', 'Заверши презентацию коротким планом развития.'],
            })
        } catch (presentationError) {
            console.error('Presentation analysis failed:', presentationError)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                >
                    <button
                        onClick={() => navigate('/projects')}
                        className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400 transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Назад к проектам
                    </button>
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Проект ученика</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{project.title}</h1>
                            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-500">{project.description}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 md:min-w-64">
                            <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                                <span>Прогресс</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                                <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" animate={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <nav className="space-y-2">
                        {[
                            { id: 'overview', label: 'Структура', icon: LayoutDashboard },
                            { id: 'tasks', label: 'Трекер задач', icon: CheckCircle2 },
                            { id: 'mentor', label: 'Elly помощник', icon: MessageSquare },
                            { id: 'presentation', label: 'Анализ презентации', icon: Presentation },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left font-black transition ${
                                    activeTab === tab.id
                                        ? 'border-blue-200 bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                {tab.label}
                            </motion.button>
                        ))}
                    </nav>

                    <main className="min-h-[620px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-4 md:grid-cols-2">
                                    {overviewCards.map((card) => (
                                        <motion.article
                                            key={card.title}
                                            whileHover={{ y: -4 }}
                                            className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                                                    <card.icon className={`h-6 w-6 ${card.color}`} />
                                                </div>
                                                <h2 className="font-black text-slate-950">{card.title}</h2>
                                            </div>
                                            <p className="text-sm font-medium leading-7 text-slate-600">{card.value}</p>
                                        </motion.article>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'tasks' && (
                                <motion.div key="tasks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
                                    {stages.map((stage) => {
                                        const stageTasks = project.tasks.filter((task) => (task.stage || 'idea') === stage.id)
                                        return (
                                            <motion.section
                                                key={stage.id}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ y: -3 }}
                                                className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm"
                                            >
                                                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stage.bg}`}>
                                                            <stage.icon className={`h-6 w-6 ${stage.color}`} />
                                                        </div>
                                                        <div>
                                                            <h2 className="font-black text-slate-950">{stage.label}</h2>
                                                            <p className="text-xs font-bold text-slate-400">
                                                                {stageTasks.filter((task) => task.completed).length} / {stageTasks.length} выполнено
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 p-5">
                                                    {stageTasks.map((task) => (
                                                        <button
                                                            key={task.id}
                                                            onClick={() => toggleTask(task.id)}
                                                            className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-blue-50"
                                                        >
                                                            {task.completed ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-300" />}
                                                            <span className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</span>
                                                        </button>
                                                    ))}
                                                    <div className="flex gap-3 pt-2">
                                                        <input
                                                            value={newTask[stage.id] || ''}
                                                            onChange={(event) => setNewTask((current) => ({ ...current, [stage.id]: event.target.value }))}
                                                            onKeyDown={(event) => event.key === 'Enter' && addTask(stage.id)}
                                                            placeholder="Добавить задачу"
                                                            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                                        />
                                                        <Button onClick={() => addTask(stage.id)} className="rounded-2xl px-4">
                                                            <Plus className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.section>
                                        )
                                    })}
                                </motion.div>
                            )}

                            {activeTab === 'mentor' && (
                                <motion.section key="mentor" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex h-[680px] flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                                    <div className="border-b border-slate-100 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                                <Bot className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h2 className="font-black text-slate-950">Elly помощник</h2>
                                                <p className="text-xs font-bold text-slate-400">Советы по идее, презентации и бизнес-модели</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                                        {!messages.length && (
                                            <div className="flex h-full flex-col items-center justify-center text-center">
                                                <Sparkles className="mb-4 h-12 w-12 text-blue-600" />
                                                <h3 className="text-xl font-black text-slate-950">Привет, {user?.name || 'ученик'}!</h3>
                                                <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                                                    Спроси, как улучшить идею, какие слайды добавить или как объяснить ценность проекта на защите.
                                                </p>
                                            </div>
                                        )}
                                        {messages.map((message, index) => (
                                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[82%] whitespace-pre-wrap rounded-3xl px-5 py-4 text-sm font-medium leading-6 ${
                                                    message.role === 'user' ? 'rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                                                }`}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500">
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                                Elly думает над советом...
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>
                                    <div className="border-t border-slate-100 p-4">
                                        <div className="flex gap-3">
                                            <input
                                                value={chatInput}
                                                onChange={(event) => setChatInput(event.target.value)}
                                                onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                                                placeholder="Спроси Elly"
                                                className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                            />
                                            <Button onClick={sendMessage} disabled={!chatInput.trim() || isChatLoading} className="rounded-2xl px-5">
                                                <Send className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            {activeTab === 'presentation' && (
                                <motion.div key="presentation" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
                                    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                                            <FileUp className="h-9 w-9" />
                                        </div>
                                        <h2 className="mt-5 text-2xl font-black text-slate-950">Анализ презентации</h2>
                                        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
                                            Загрузи PDF или PPTX. AI оценит структуру, ясность, ошибки и даст рекомендации перед защитой.
                                        </p>
                                        <input id="presentation-file" type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={analyzePresentation} />
                                        <label
                                            htmlFor="presentation-file"
                                            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-500"
                                        >
                                            {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
                                            {isAnalyzing ? 'Анализирую...' : 'Загрузить файл'}
                                        </label>
                                    </section>

                                    {analysis && (
                                        <section className="grid gap-5 md:grid-cols-2">
                                            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                                                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Структура</p>
                                                <p className="mt-3 text-4xl font-black text-slate-950">{analysis.structureScore}/10</p>
                                            </div>
                                            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                                                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Ясность</p>
                                                <p className="mt-3 text-4xl font-black text-slate-950">{analysis.clarityScore}/10</p>
                                            </div>
                                            <div className="rounded-[1.5rem] border border-rose-100 bg-white p-6 shadow-sm">
                                                <h3 className="font-black text-slate-950">Ошибки</h3>
                                                <ul className="mt-4 space-y-3">
                                                    {analysis.errors.map((item) => (
                                                        <li key={item} className="flex gap-3 text-sm font-medium text-slate-600">
                                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                                                <h3 className="font-black text-slate-950">Рекомендации</h3>
                                                <ul className="mt-4 space-y-3">
                                                    {analysis.recommendations.map((item) => (
                                                        <li key={item} className="flex gap-3 text-sm font-medium text-slate-600">
                                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </section>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ProjectWorkspacePage
