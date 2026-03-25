import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, ChevronRight, PlayCircle, Award,
    CheckCircle2, Code2, Layers, FlaskConical, BookOpen, Lock,
    Info, AlertCircle, Clock, MessageSquare,
    Menu, X, Play, Activity, ClipboardList, Code, HelpCircle,
} from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import { useAuthStore } from '@/store/authStore'
import { useSubmissionStore } from '@/store/submissionStore'
import { getCurriculumByDirection } from '@/data/directionCurriculum'
import type { Lesson } from '@/data/directionCurriculum'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

const STORAGE_KEY = 'direction_lessons_completed'

const getCompleted = (): Set<string> =>
    new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

const markCompleted = (id: string) => {
    const set = getCompleted()
    set.add(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

const typeLabel: Record<string, string> = {
    theory: 'Теория',
    practice: 'Практика',
    project: 'Проект',
}

const typeColor: Record<string, string> = {
    theory: 'bg-blue-50/10 text-blue-400 border-blue-500/20',
    practice: 'bg-amber-50/10 text-amber-400 border-amber-500/20',
    project: 'bg-purple-50/10 text-purple-400 border-purple-500/20',
}

const typeIcon: Record<string, React.FC<{ className?: string }>> = {
    theory: BookOpen,
    practice: Code2,
    project: FlaskConical,
}

export const DirectionLessonPage = () => {
    const { lessonId } = useParams<{ lessonId: string }>()
    const navigate = useNavigate()
    const user = useAuthStore(s => s.user)
    const direction = user?.selectedDirection || 'Веб разработчик'
    const curriculum = useMemo(() => getCurriculumByDirection(direction), [direction])

    const createSubmission = useSubmissionStore(s => s.createSubmission)
    const mySubmissions = useSubmissionStore(s => s.getMySubmissions())

    const [completed, setCompleted] = useState<Set<string>>(getCompleted)
    const [submissionText, setSubmissionText] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    if (!curriculum) return null

    const allLessons: Lesson[] = curriculum.modules.flatMap(m => m.lessons)
    const lesson = allLessons.find(l => l.id === lessonId)

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Lock className="w-16 h-16 text-indigo-200" />
                <p className="text-slate-500 font-medium">Урок не найден</p>
                <Button onClick={() => navigate('/tasks')}>Назад к программе</Button>
            </div>
        )
    }

    const module = curriculum.modules.find(m => m.index === lesson.moduleIndex)
    const currentIndex = allLessons.indexOf(lesson)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
    const isCompleted = completed.has(lesson.id)
    const lessonSubmission = mySubmissions.find(s => s.taskId === lesson.id)

    const handleComplete = () => {
        markCompleted(lesson.id)
        setCompleted(getCompleted())
    }

    const handleSubmitWork = () => {
        if (!submissionText.trim()) return
        createSubmission(lesson.id, lesson.title, submissionText)
        setSubmissionText('')
        handleComplete()
    }

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#f8fafc] -m-6">
            {/* Sidebar Navigation */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden relative"
                    >
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Курс</h3>
                            <h2 className="font-black text-slate-900 line-clamp-1">{curriculum.title}</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin">
                            {curriculum.modules.map((mod) => (
                                <div key={mod.id} className="space-y-2">
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">M0{mod.index}</span>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest truncate">{mod.title}</h4>
                                    </div>
                                    <div className="space-y-1">
                                        {mod.lessons.map((l) => {
                                            const active = l.id === lessonId
                                            const done = completed.has(l.id)
                                            return (
                                                <button
                                                    key={l.id}
                                                    onClick={() => navigate(`/direction-lesson/${l.id}`)}
                                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' : 'hover:bg-slate-50 text-slate-600'}`}
                                                >
                                                    <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${active ? 'bg-white/20' : done ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                                        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : active ? <Play className="w-3 h-3 fill-current" /> : <span className="text-[9px] font-bold">{l.lessonIndex}</span>}
                                                    </div>
                                                    <span className={`text-xs font-bold truncate ${active ? 'text-white' : done ? 'text-slate-500' : 'text-slate-700'}`}>{l.title}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Lesson Header */}
                <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <h2 className="font-black text-slate-900 truncate max-w-[200px] md:max-w-md italic tracking-tight">{lesson.title}</h2>
                    </div>

                    <div className="flex gap-2">
                        {prevLesson && (
                            <button
                                onClick={() => navigate(`/direction-lesson/${prevLesson.id}`)}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Назад
                            </button>
                        )}
                        {nextLesson && (
                            <button
                                onClick={() => navigate(`/direction-lesson/${nextLesson.id}`)}
                                className="bg-indigo-600 hover:bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                            >
                                Дальше <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Scrolling Area */}
                <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-10 scrollbar-thin">
                    <div className="max-w-4xl mx-auto space-y-10 pb-20">
                        {/* Video / Visual Hero */}
                        <div className="aspect-video bg-[#0a0a0c] rounded-[2.5rem] relative overflow-hidden shadow-2xl group border-4 border-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-2xl"
                                >
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </motion.button>
                            </div>
                            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                                <div className="space-y-2">
                                    <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${typeColor[lesson.type]}`}>
                                        {typeLabel[lesson.type]}
                                    </div>
                                    <h1 className="text-3xl font-black text-white italic tracking-tighter">{lesson.title}</h1>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white/60 text-[10px] font-bold">
                                    {lesson.duration}
                                </div>
                            </div>
                        </div>

                        {/* Lesson Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Text Content */}
                            <div className="lg:col-span-2 space-y-10">
                                {/* 1. Explanation Section */}
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-2 mb-8 text-indigo-600">
                                        <Info className="w-5 h-5" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Объяснение темы</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-slate-600 text-xl font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                                            {lesson.description}
                                        </p>
                                        {lesson.fullExplanation && (
                                            <p className="text-slate-700 text-lg leading-relaxed font-normal">
                                                {lesson.fullExplanation}
                                            </p>
                                        )}
                                    </div>

                                    {/* 2. Steps Section */}
                                    {lesson.steps && (
                                        <div className="mt-12 space-y-6">
                                            <div className="flex items-center gap-2 text-indigo-600">
                                                <ClipboardList className="w-5 h-5" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Пошаговый разбор</h4>
                                            </div>
                                            <div className="grid gap-4">
                                                {lesson.steps.map((step, idx) => (
                                                    <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-md transition-all">
                                                        <span className="shrink-0 w-8 h-8 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xs shadow-sm">
                                                            {idx + 1}
                                                        </span>
                                                        <p className="text-slate-700 font-bold text-sm pt-1.5">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Flowchart Section */}
                                {lesson.flowchart && (
                                    <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <Activity className="w-5 h-5" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Визуализация алгоритма</h4>
                                            </div>
                                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                                                <div className="flex flex-wrap items-center justify-center gap-4 text-white/80">
                                                    {lesson.flowchart.split('->').map((item, i, array) => (
                                                        <div key={i} className="flex items-center gap-4">
                                                            <div className={`px-5 py-3 rounded-xl font-bold text-sm tracking-tight ${item.trim().startsWith('[') ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white border border-white/10'}`}>
                                                                {item.trim().replace('[', '').replace(']', '')}
                                                            </div>
                                                            {i < array.length - 1 && (
                                                                <ChevronRight className="w-5 h-5 text-indigo-400/50" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-white/30 text-[10px] font-medium text-center italic">
                                                Схема работы программы на текущем этапе обучения
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 4. Code Example Section */}
                                {lesson.codeExample && (
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Code className="w-5 h-5" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Пример кода</h4>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                            </div>
                                        </div>
                                        <div className="h-[200px] relative">
                                            <Editor
                                                height="100%"
                                                defaultLanguage="python"
                                                theme="vs-light"
                                                value={lesson.codeExample}
                                                options={{
                                                    readOnly: true,
                                                    minimap: { enabled: false },
                                                    fontSize: 14,
                                                    lineNumbers: 'on',
                                                    scrollBeyondLastLine: false,
                                                    padding: { top: 20, bottom: 20 },
                                                    fontFamily: 'JetBrains Mono, Menlo, Monaco, Lucida Console, monospace',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 5. Practice Task Card */}
                                {lesson.practiceTask && (
                                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 md:p-12 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                                                    <HelpCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black italic tracking-tight">Практическое задание</h3>
                                                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Твой вызов на сегодня</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                                                <p className="text-xl font-bold leading-relaxed tracking-tight italic">
                                                    "{lesson.practiceTask}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submission Area */}
                                {(lesson.type === 'practice' || lesson.type === 'project') && (
                                    <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-indigo-50">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Code2 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Твоё решение</h3>
                                                <p className="text-slate-400 text-sm font-medium">Отправь ссылку на работу или описание результата</p>
                                            </div>
                                        </div>

                                        {lessonSubmission ? (
                                            <div className="space-y-4">
                                                <div className={`p-8 rounded-[2rem] border flex items-center justify-between ${lessonSubmission.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : lessonSubmission.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                    <div className="flex items-center gap-4">
                                                        {lessonSubmission.status === 'approved' ? <CheckCircle2 className="w-8 h-8" /> : lessonSubmission.status === 'rejected' ? <AlertCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Статус решения</p>
                                                            <p className="text-xl font-black">{lessonSubmission.status === 'approved' ? 'Принято' : lessonSubmission.status === 'rejected' ? 'Нужны правки' : 'На проверке'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {lessonSubmission.feedback && (
                                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Отзыв преподавателя</p>
                                                        <p className="text-lg font-medium italic text-slate-700 leading-relaxed">"{lessonSubmission.feedback}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <Textarea
                                                    placeholder="Вставь ссылку на GitHub/Figma или опиши решение..."
                                                    value={submissionText}
                                                    onChange={e => setSubmissionText(e.target.value)}
                                                    rows={6}
                                                    className="rounded-[2rem] p-8 text-lg"
                                                />
                                                <Button onClick={handleSubmitWork} className="w-full rounded-[1.5rem] py-8 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200">
                                                    Отправить готовую работу
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!lessonSubmission && lesson.type === 'theory' && (
                                    <div className="bg-emerald-50 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-100">
                                        <div className="flex items-center gap-6 text-emerald-800">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg shadow-emerald-100">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-2xl italic tracking-tight leading-none">Урок изучен?</h4>
                                                <p className="text-sm font-medium opacity-60 mt-1">Отметь для продвижения по программе</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleComplete}
                                            className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all ${isCompleted ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-slate-100'}`}
                                        >
                                            {isCompleted ? 'Урок завершен' : 'Завершить изучение'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Sidebar Info */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Твой прогресс в модуле</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-3xl font-black italic tracking-tighter">
                                                {module?.lessons.filter(l => completed.has(l.id)).length}
                                                <span className="text-white/20">/{module?.lessons.length}</span>
                                            </p>
                                            <span className="text-[10px] font-bold text-indigo-400">Уроков пройдено</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(module?.lessons.filter(l => completed.has(l.id)).length || 0) / (module?.lessons.length || 1) * 100}%` }}
                                                className="h-full bg-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Нужна помощь?</h4>
                                    <button
                                        onClick={() => navigate('/support')}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-indigo-500" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Написать куратору</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .italic { font-style: italic; }
            `}</style>
        </div>
    )
}

export default DirectionLessonPage
