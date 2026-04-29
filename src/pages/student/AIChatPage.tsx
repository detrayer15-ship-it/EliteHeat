import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import {
    Bot,
    ChevronLeft,
    Lightbulb,
    Loader2,
    MessageSquare,
    Presentation,
    Send,
    Sparkles,
    User,
    WalletCards,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { db } from '@/config/firebase'
import { sendAIChatMessage } from '@/api/mita'
import { useAuthStore } from '@/store/authStore'
import type { Project } from '@/types/project'

type LocalMessage = {
    role: 'user' | 'assistant'
    content: string
}

const quickPrompts = [
    { icon: Lightbulb, text: 'Как улучшить мою идею проекта?' },
    { icon: Presentation, text: 'Помоги составить структуру презентации.' },
    { icon: WalletCards, text: 'Как объяснить бизнес-модель простыми словами?' },
]

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
}

export const AIChatPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [messages, setMessages] = useState<LocalMessage[]>([
        {
            role: 'assistant',
            content: 'Привет! Я Elly, твой AI-помощник по проектам. Сначала пойму цель и контекст, потом дам короткий ответ по пунктам с примером.',
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [projectContext, setProjectContext] = useState<Project | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    useEffect(() => {
        const loadLatestProject = async () => {
            if (!user?.id) return

            try {
                const projectsQuery = query(collection(db, 'projects'), where('userId', '==', user.id))
                const snapshot = await getDocs(projectsQuery)
                const projects = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() } as Project))
                    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())

                setProjectContext(projects[0] || null)
            } catch (error) {
                console.warn('Could not load Elly project context', error)
            }
        }

        loadLatestProject()
    }, [user?.id])

    const sendMessage = async (override?: string) => {
        const text = (override || input).trim()
        if (!text || isLoading) return

        setMessages((current) => [...current, { role: 'user', content: text }])
        setInput('')
        setIsLoading(true)

        try {
            const contextBlock = projectContext
                ? `
Контекст последнего проекта ученика:
- Идея / название: ${projectContext.title}
- Описание: ${projectContext.description}
- Проблема: ${projectContext.problem}
- Решение: ${projectContext.solution}
- Аудитория: ${projectContext.audience}
`
                : 'Контекст проекта пока не найден. Если вопрос непонятен, задай уточняющий вопрос.'

            const prompt = `
Ты Elly, AI-помощник ученика на платформе EliteHeat.

Обязательное поведение:
- Перед ответом определи цель пользователя, уровень и контекст.
- Если запрос непонятен, задай один уточняющий вопрос.
- Объясняй простым языком, как для школьника.
- Ответ должен быть коротким, по пунктам и с примером.
- Используй контекст проекта, если он есть.

${contextBlock}

Вопрос ученика: ${text}`

            const { reply } = await sendAIChatMessage(`elly-student-chat-${user?.id || 'guest'}`, prompt, {
                mode: 'tutor',
                history: messages.slice(-10),
            })
            setMessages((current) => [...current, { role: 'assistant', content: reply }])
        } catch (error) {
            console.error('Elly chat failed:', error)
            setMessages((current) => [
                ...current,
                {
                    role: 'assistant',
                    content: 'Я правильно поняла, что ты хочешь улучшить идею или оформить презентацию? Напиши, что уже есть: идея, проблема, решение или слайды.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-full overflow-hidden bg-slate-50 px-4 py-6 md:px-8 md:py-8">
            <motion.div
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.08 }}
                className="mx-auto flex max-w-6xl flex-col gap-6"
            >
                <motion.header
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <motion.div
                        aria-hidden
                        className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-100"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:-translate-x-0.5 hover:text-blue-600"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Bot className="h-7 w-7" />
                                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
                                </motion.div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Elly AI</p>
                                    <h1 className="text-2xl font-black text-slate-950">Помощник ученика</h1>
                                </div>
                            </div>
                        </div>
                        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-600 md:flex">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Помнит проект
                        </div>
                    </div>
                </motion.header>

                <main className="grid min-h-[680px] gap-6 lg:grid-cols-[320px_1fr]">
                    <motion.aside variants={fadeUp} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <h2 className="font-black text-slate-950">Быстрые вопросы</h2>
                        </div>
                        <div className="space-y-3">
                            {quickPrompts.map((prompt, index) => (
                                <motion.button
                                    key={prompt.text}
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.08 }}
                                    whileHover={{ x: 4, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => sendMessage(prompt.text)}
                                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <prompt.icon className="h-5 w-5 shrink-0" />
                                    {prompt.text}
                                </motion.button>
                            ))}
                        </div>
                    </motion.aside>

                    <motion.section
                        variants={fadeUp}
                        className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="border-b border-slate-100 p-5">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <p className="font-black text-slate-950">Диалог с Elly</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-5 md:p-7">
                            <AnimatePresence initial={false}>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={`${message.role}-${index}`}
                                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[86%] items-end gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                                    message.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                                                }`}
                                            >
                                                {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                            </div>
                                            <div
                                                className={`whitespace-pre-wrap rounded-3xl px-5 py-4 text-sm font-medium leading-6 shadow-sm ${
                                                    message.role === 'user'
                                                        ? 'rounded-br-md bg-blue-600 text-white'
                                                        : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500"
                                >
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    Elly анализирует цель, уровень и контекст...
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="border-t border-slate-100 bg-white p-4">
                            <div className="flex gap-3">
                                <input
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                                    placeholder="Напиши вопрос по проекту, презентации или идее"
                                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                                />
                                <Button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="rounded-2xl px-5">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.section>
                </main>
            </motion.div>
        </div>
    )
}

export default AIChatPage
