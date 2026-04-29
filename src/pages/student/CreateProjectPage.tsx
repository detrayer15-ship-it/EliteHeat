import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    FileText,
    Loader2,
    Rocket,
    Sparkles,
    Target,
    Users,
    Wand2,
    Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { sendAIChatMessage } from '@/api/mita'
import type { Project, Task } from '@/types/project'

type GeneratedProject = Pick<Project, 'title' | 'type' | 'description' | 'problem' | 'solution' | 'audience' | 'valueProposition' | 'techStack'> & {
    tasks: Array<{ title: string; stage: NonNullable<Task['stage']> }>
}

const cleanJson = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null

    try {
        return JSON.parse(match[0]) as GeneratedProject
    } catch {
        return null
    }
}

const createFallbackProject = (idea: string): GeneratedProject => ({
    title: idea.length > 42 ? `${idea.slice(0, 42)}...` : idea,
    type: 'mvp',
    description: `Учебный проект на основе идеи: ${idea}. Он помогает превратить замысел в понятный продукт с задачами, аудиторией и планом защиты.`,
    problem: 'Идея пока существует в свободной форме, поэтому ученику сложно понять, какую проблему он решает и как объяснить ценность проекта.',
    solution: 'Собрать идею в структуру: описание, проблема, решение, целевая аудитория, ценность, прототип и презентация.',
    audience: 'Ученики, наставники, жюри проектной защиты и первые пользователи, которым нужна понятная польза продукта.',
    valueProposition: 'Проект быстро переводит идею в формат, который можно показать, протестировать и защитить.',
    techStack: {
        frontend: 'React / Next.js + Tailwind CSS',
        backend: 'Firebase Auth + Firestore',
        db: 'Firestore',
    },
    tasks: [
        { title: 'Сформулировать идею одним предложением', stage: 'idea' },
        { title: 'Описать проблему и целевую аудиторию', stage: 'idea' },
        { title: 'Собрать первый прототип ключевого экрана', stage: 'prototype' },
        { title: 'Добавить сохранение данных пользователя', stage: 'prototype' },
        { title: 'Подготовить структуру презентации', stage: 'presentation' },
        { title: 'Отрепетировать защиту проекта', stage: 'presentation' },
    ],
})

export const CreateProjectPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [idea, setIdea] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [generated, setGenerated] = useState<GeneratedProject | null>(null)

    const cards = useMemo(() => {
        if (!generated) return []
        return [
            { title: 'Описание идеи', value: generated.description, icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50' },
            { title: 'Проблема', value: generated.problem, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: 'Решение', value: generated.solution, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Аудитория', value: generated.audience, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Ценность', value: generated.valueProposition || '', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
    }, [generated])

    const generateProject = async () => {
        if (!idea.trim() || isGenerating) return

        setIsGenerating(true)
        try {
            const prompt = `
Ты AI-конструктор ученических проектов. По идее ученика создай структурированный проект.

Идея ученика: "${idea}"

Верни только JSON без markdown:
{
  "title": "короткое название",
  "type": "app",
  "description": "описание идеи в 1-2 предложениях",
  "problem": "какую проблему решает проект",
  "solution": "как проект решает проблему",
  "audience": "целевая аудитория",
  "valueProposition": "ценностное предложение",
  "techStack": {
    "frontend": "React / Next.js + Tailwind CSS",
    "backend": "Firebase Auth + Firestore",
    "db": "Firestore"
  },
  "tasks": [
    {"title": "задача для этапа идеи", "stage": "idea"},
    {"title": "задача для этапа прототипа", "stage": "prototype"},
    {"title": "задача для этапа презентации", "stage": "presentation"}
  ]
}`

            const { reply } = await sendAIChatMessage('student-project-builder', prompt, { mode: 'product' })
            setGenerated(cleanJson(reply) || createFallbackProject(idea))
        } catch (error) {
            console.error('Project generation failed:', error)
            setGenerated(createFallbackProject(idea))
        } finally {
            setIsGenerating(false)
        }
    }

    const saveProject = async () => {
        if (!generated || !user || isSaving) return

        setIsSaving(true)
        try {
            const now = new Date().toISOString()
            const tasks: Task[] = generated.tasks.map((task, index) => ({
                id: `task_${Date.now()}_${index}`,
                title: task.title,
                stage: task.stage,
                completed: false,
                projectId: '',
            }))

            const docRef = await addDoc(collection(db, 'projects'), {
                userId: user.id,
                title: generated.title,
                type: generated.type || 'mvp',
                description: generated.description,
                problem: generated.problem,
                solution: generated.solution,
                audience: generated.audience,
                valueProposition: generated.valueProposition,
                techStack: generated.techStack,
                stage: 'idea',
                status: 'active',
                progress: 0,
                tasks,
                createdAt: now,
                updatedAt: now,
            })

            await navigate(`/projects/${docRef.id}`)
        } catch (error) {
            console.error('Project save failed:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-blue-600"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">AI-конструктор проекта</p>
                        <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Преврати идею в проект</h1>
                    </div>
                </motion.div>

                <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                    >
                        <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                <BrainCircuit className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-950">Опиши свою идею</h2>
                                <p className="text-sm font-medium text-slate-500">Можно написать одной фразой. AI сам разложит ее на проблему, решение, аудиторию и план задач.</p>
                            </div>
                        </div>

                        <textarea
                            value={idea}
                            onChange={(event) => setIdea(event.target.value)}
                            placeholder="Например: платформа, где школьники превращают идею стартапа в презентацию и получают советы Elly..."
                            className="h-52 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-5 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-slate-500">Путь: идея → проблема → решение → аудитория → презентация.</p>
                            <Button
                                onClick={generateProject}
                                disabled={!idea.trim() || isGenerating}
                                className="flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-black"
                            >
                                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                                Сгенерировать
                            </Button>
                        </div>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                        whileHover={{ y: -4 }}
                        className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-100"
                    >
                        <Sparkles className="mb-5 h-8 w-8 text-blue-100" />
                        <h3 className="text-xl font-black">Что получится</h3>
                        <div className="mt-5 space-y-3">
                            {['Структурированные карточки проекта', 'Трекер задач по этапам', 'Elly для защиты', 'Анализ PDF / PPT презентации'].map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-bold"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-cyan-200" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.aside>
                </section>

                {generated && (
                    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">План готов</p>
                                <h2 className="text-3xl font-black text-slate-950">{generated.title}</h2>
                            </div>
                            <Button onClick={saveProject} loading={isSaving} className="flex items-center justify-center gap-2 rounded-2xl px-7 py-3 font-black">
                                <Rocket className="h-5 w-5" />
                                Создать проект
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {cards.map((card) => (
                                <motion.article
                                    key={card.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4 }}
                                    className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg}`}>
                                            <card.icon className={`h-5 w-5 ${card.color}`} />
                                        </div>
                                        <h3 className="font-black text-slate-950">{card.title}</h3>
                                    </div>
                                    <p className="text-sm font-medium leading-7 text-slate-600">{card.value}</p>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    )
}

export default CreateProjectPage
