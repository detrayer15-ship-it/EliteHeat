import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FolderKanban,
    Lightbulb,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import type { Project } from '@/types/project'

type Filter = 'all' | 'active' | 'completed'

export const ProjectsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<Filter>('all')

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const projectQuery = query(collection(db, 'projects'), where('userId', '==', user.id))
                const snapshot = await getDocs(projectQuery)
                const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Project))
                setProjects(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            } catch (error) {
                console.error('Projects loading failed:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [user])

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const text = `${project.title} ${project.description}`.toLowerCase()
            const matchesSearch = text.includes(search.toLowerCase())
            const matchesFilter =
                filter === 'all' ||
                (filter === 'active' && project.status !== 'completed') ||
                (filter === 'completed' && project.status === 'completed')

            return matchesSearch && matchesFilter
        })
    }, [projects, search, filter])

    const stats = useMemo(() => {
        const completed = projects.filter((project) => project.status === 'completed').length
        const average = projects.length
            ? Math.round(projects.reduce((sum, project) => sum + (project.progress || 0), 0) / projects.length)
            : 0

        return [
            { label: 'Проекты', value: projects.length, icon: FolderKanban },
            { label: 'Завершены', value: completed, icon: CheckCircle2 },
            { label: 'Средний прогресс', value: `${average}%`, icon: Target },
        ]
    }, [projects])

    const deleteProject = async (projectId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        if (!window.confirm('Удалить этот проект?')) return

        await deleteDoc(doc(db, 'projects', projectId))
        setProjects((current) => current.filter((project) => project.id !== projectId))
    }

    return (
        <div className="min-h-full bg-slate-50 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-6 text-white shadow-xl shadow-blue-100 md:p-8"
                >
                    <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                                <Sparkles className="h-4 w-4" />
                                Рабочее пространство ученика
                            </div>
                            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Мои проекты</h1>
                            <p className="mt-4 text-base font-medium leading-7 text-blue-100">
                                Создавай идею, превращай ее в структуру, веди задачи по этапам и готовься к защите вместе с AI-наставником.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/projects/create')}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-slate-950 hover:bg-blue-50"
                        >
                            <Plus className="h-5 w-5" />
                            Новый проект
                        </Button>
                    </div>
                </motion.section>

                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * index }}
                            whileHover={{ y: -4 }}
                            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-black text-slate-950">{stat.value}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Поиск по названию или описанию"
                            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                    <div className="flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                        {[
                            ['all', 'Все'],
                            ['active', 'В работе'],
                            ['completed', 'Готовые'],
                        ].map(([id, label]) => (
                            <button
                                key={id}
                                onClick={() => setFilter(id as Filter)}
                                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                                    filter === id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="h-72 animate-pulse rounded-[1.5rem] border border-slate-200 bg-white" />
                            ))
                        ) : filteredProjects.length ? (
                            filteredProjects.map((project) => (
                                <motion.article
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    whileHover={{ y: -6 }}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="group cursor-pointer rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <Lightbulb className="h-6 w-6" />
                                        </div>
                                        <button
                                            onClick={(event) => deleteProject(project.id, event)}
                                            className="rounded-xl p-2 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <h2 className="line-clamp-2 text-xl font-black text-slate-950">{project.title}</h2>
                                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">{project.description}</p>

                                    <div className="mt-6 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                                            <span>Прогресс</span>
                                            <span>{project.progress || 0}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                                style={{ width: `${project.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <Clock3 className="h-4 w-4" />
                                            {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-600">
                                            Открыть
                                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className="col-span-full rounded-[2rem] border border-dashed border-blue-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <FolderKanban className="h-8 w-8" />
                                </div>
                                <h2 className="mt-5 text-2xl font-black text-slate-950">Пока нет проектов</h2>
                                <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
                                    Начни с одной идеи. AI-конструктор поможет превратить ее в проект, задачи и основу презентации.
                                </p>
                                <Button onClick={() => navigate('/projects/create')} className="mt-6 rounded-2xl px-7 py-3 font-black">
                                    Создать первый проект
                                </Button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default ProjectsPage
