import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TaskComments } from '@/components/TaskComments'
import {
    Palette,
    PlayCircle,
    CheckCircle2,
    Clock,
    ChevronRight,
    Upload,
    Star,
    Layout,
    MousePointer2,
    Type,
    Box,
    Layers,
    Lock,
    BrainCircuit
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

interface FigmaTask {
    id: string
    title: string
    difficulty: 'easy' | 'medium' | 'hard'
    description: string
    videoUrl: string
    steps: string[]
    completed: boolean
}

interface TestQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
}

export const FigmaTasksPage = () => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState<FigmaTask[]>([])
    const [selectedTask, setSelectedTask] = useState<FigmaTask | null>(null)
    const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
    const [answer, setAnswer] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [submittedTasks, setSubmittedTasks] = useState<Set<string>>(
        new Set(JSON.parse(localStorage.getItem('figma_submitted_tasks') || '[]'))
    )
    const [submissionTimes, setSubmissionTimes] = useState<Record<string, number>>(
        JSON.parse(localStorage.getItem('figma_submission_times') || '{}')
    )

    // Test state
    const [showTest, setShowTest] = useState(false)
    const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<number[]>([])
    const [testCompleted, setTestCompleted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        fetch('/data/figma_tasks.json').then(res => res.json()).then(setTasks)
        fetch('/data/figma_test.json').then(res => res.json()).then(setTestQuestions)

        const interval = setInterval(checkAutoApproval, 60000)
        checkAutoApproval()
        return () => clearInterval(interval)
    }, [])

    const checkAutoApproval = () => {
        const now = Date.now()
        const oneHour = 60 * 60 * 1000
        const progress = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')
        const times = JSON.parse(localStorage.getItem('figma_submission_times') || '{}')
        let updated = false

        Object.keys(times).forEach((taskId) => {
            if (now - times[taskId] >= oneHour && !progress[taskId]) {
                progress[taskId] = true
                updated = true
            }
        })

        if (updated) {
            localStorage.setItem('figma_lessons_progress', JSON.stringify(progress))
            window.location.reload()
        }
    }

    const filteredTasks = tasks.filter((task) => filter === 'all' ? true : task.difficulty === filter)

    const handleSubmit = () => {
        if (!answer.trim() && !selectedFile) return
        if (selectedTask) {
            const newSubmitted = new Set(submittedTasks)
            newSubmitted.add(selectedTask.id)
            setSubmittedTasks(newSubmitted)
            localStorage.setItem('figma_submitted_tasks', JSON.stringify([...newSubmitted]))

            const newTimes = { ...submissionTimes, [selectedTask.id]: Date.now() }
            setSubmissionTimes(newTimes)
            localStorage.setItem('figma_submission_times', JSON.stringify(newTimes))
            setAnswer('')
            setSelectedFile(null)
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestion < testQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            const correct = testQuestions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correctAnswer ? 1 : 0), 0)
            setScore(correct)
            setTestCompleted(true)
        }
    }

    if (showTest) {
        if (testCompleted) {
            const percentage = Math.round((score / testQuestions.length) * 100)
            return (
                <div className="fixed inset-0 z-50 bg-[#0a0a0c] flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                    <div className="max-w-3xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 lg:p-16 text-center space-y-12">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-purple-500 blur-[80px] opacity-20 animate-pulse"></div>
                            <div className="text-8xl relative z-10">{percentage >= 70 ? '🎨' : '📝'}</div>
                        </div>
                        <div className="space-y-4">
                            <h2 className={`text-5xl font-black ${percentage >= 70 ? 'text-purple-400' : 'text-amber-400'} tracking-tighter`}>
                                {percentage >= 70 ? 'Дизайн Завершен!' : 'Требуется Правка'}
                            </h2>
                            <p className="text-2xl text-white/40 font-medium">Результат теста: <span className="text-white">{score} / {testQuestions.length}</span> ({percentage}%)</p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowTest(false)} className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">Закрыть</button>
                            {percentage < 70 && <button onClick={() => { setTestCompleted(false); setCurrentQuestion(0); setUserAnswers([]) }} className="px-12 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all">Попробовать снова</button>}
                        </div>
                    </div>
                </div>
            )
        }

        const q = testQuestions[currentQuestion]
        return (
            <div className="fixed inset-0 z-50 bg-[#0a0a0c] flex items-center justify-center p-6 animate-fade-in">
                <div className="max-w-4xl w-full space-y-12">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">Design Assessment v4.0</div>
                            <h3 className="text-white/40 text-sm font-medium">Вопрос {currentQuestion + 1} из {testQuestions.length}</h3>
                        </div>
                        <button onClick={() => setShowTest(false)} className="text-white/20 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Выйти</button>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[3rem] blur opacity-10"></div>
                        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-14 space-y-10">
                            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">{q?.question}</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {q?.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const na = [...userAnswers]; na[currentQuestion] = i;
                                            setUserAnswers(na);
                                        }}
                                        className={`group relative p-6 rounded-2xl border transition-all text-left flex items-center gap-6 ${userAnswers[currentQuestion] === i ? 'bg-purple-600 border-purple-400 shadow-glow-purple' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${userAnswers[currentQuestion] === i ? 'bg-white text-purple-600' : 'bg-white/10 text-white/40 group-hover:bg-white/20 group-hover:text-white'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className={`font-medium ${userAnswers[currentQuestion] === i ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {testQuestions.map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all ${i === currentQuestion ? 'w-8 bg-purple-500' : i < currentQuestion ? 'w-4 bg-emerald-500' : 'w-4 bg-white/10'}`}></div>
                            ))}
                        </div>
                        <button
                            disabled={userAnswers[currentQuestion] === undefined}
                            onClick={handleNextQuestion}
                            className="bg-white text-indigo-950 px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs disabled:opacity-30 flex items-center gap-3 hover:scale-105 transition-transform"
                        >
                            {currentQuestion < testQuestions.length - 1 ? 'Дальше' : 'Завершить'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* DIFFICULTY TABS */}
            <div className="flex gap-3 px-4">
                {['all', 'easy', 'medium', 'hard'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-glow' : 'bg-white/50 text-indigo-950/40 hover:bg-white hover:text-indigo-950'}`}
                    >
                        {f === 'all' ? 'Все уроки' : f === 'easy' ? 'Начало' : f === 'medium' ? 'Опыт' : 'Проф'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* LESSONS LIST */}
                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-none">
                    {filteredTasks.map((task) => {
                        const isSubmitted = submittedTasks.has(task.id)
                        const isCompleted = JSON.parse(localStorage.getItem('figma_lessons_progress') || '{}')[task.id]
                        const isActive = selectedTask?.id === task.id

                        return (
                            <div
                                key={task.id}
                                onClick={() => { setSelectedTask(task); navigate(`/figma-tasks/${task.id}`) }}
                                className={`
                                    group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center gap-6
                                    ${isActive ? 'bg-white shadow-3xl border-purple-100' : 'bg-white/40 border-white/60 hover:bg-white/80'}
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all
                                    ${isCompleted ? 'bg-emerald-50 text-emerald-500' : isSubmitted ? 'bg-amber-50 text-amber-500' : isActive ? 'bg-purple-600 text-white shadow-lg' : 'bg-white border border-purple-50 text-purple-300'}
                                `}>
                                    {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : isSubmitted ? <Clock className="w-8 h-8 animate-pulse" /> : <Layers className="w-8 h-8" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/30">Art Module #{task.id}</span>
                                        <div className={`w-1 h-1 rounded-full ${task.difficulty === 'easy' ? 'bg-emerald-400' : task.difficulty === 'medium' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                                    </div>
                                    <h3 className={`font-black tracking-tight text-xl line-clamp-1 ${isActive ? 'text-purple-950' : 'text-purple-950/60'}`}>{task.title}</h3>
                                </div>
                            </div>
                        )
                    })}

                    <button
                        onClick={() => setShowTest(true)}
                        className="w-full group p-10 rounded-[3rem] bg-[#0a0a0c] text-white border border-white/10 hover:border-purple-500/50 transition-all text-left relative overflow-hidden mt-8"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500"></div>
                        <div className="relative z-10 flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-12 h-12 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Designer Certification</div>
                                <h3 className="text-2xl font-black italic tracking-tighter">Финальный Грейд</h3>
                            </div>
                        </div>
                    </button>
                </div>

                {/* LESSON DETAIL */}
                <div className="lg:col-span-3">
                    {selectedTask ? (
                        <div className="space-y-8 animate-fade-in">
                            <div className="relative bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-20 text-white overflow-hidden shadow-3xl">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                <div className="relative z-10 space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-3">
                                            <div className="bg-purple-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Active Review</div>
                                            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">Class: {selectedTask.difficulty === 'easy' ? 'Beginner' : 'Expert'}</div>
                                        </div>
                                        <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.85] italic">{selectedTask.title}</h2>
                                        <p className="text-white/40 text-xl font-medium leading-relaxed max-w-2xl">{selectedTask.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <a
                                            href={selectedTask.videoUrl}
                                            target="_blank"
                                            className="flex items-center gap-6 p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 transition-all group/v"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover/v:scale-110 transition-transform">
                                                <PlayCircle className="w-10 h-10 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-tight text-xs mb-1">Открыть Урок</h4>
                                                <p className="text-[10px] text-white/30 font-medium">Design System Walkthrough</p>
                                            </div>
                                        </a>
                                        <div className="flex items-center gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                                <Palette className="w-10 h-10 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-tight text-xs mb-1">Visual XP</h4>
                                                <p className="text-[10px] text-white/30 font-medium">+300 Mastery Points</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 pt-12 border-t border-white/10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Review Checklist</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {selectedTask.steps.map((step, i) => (
                                                <div key={i} className="flex gap-8 p-6 rounded-3xl bg-white/5 border border-white/5 group/s hover:bg-white/10 transition-colors">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm shrink-0">{i + 1}</div>
                                                    <p className="text-base text-white/70 font-medium leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-premium rounded-[3.5rem] p-12 lg:p-20 border border-white shadow-3xl space-y-12">
                                <div className="space-y-3 text-center lg:text-left">
                                    <h3 className="text-4xl font-black text-indigo-950 tracking-tighter">Портфолио Ревью</h3>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Загрузите скриншоты или ссылки на Figma-проект.</p>
                                </div>

                                <div className="space-y-8">
                                    <textarea
                                        className="w-full bg-white border border-indigo-50 rounded-[2.5rem] p-10 text-indigo-950 font-medium focus:ring-8 focus:ring-indigo-100 transition-all min-h-[250px] resize-none text-lg"
                                        placeholder="Опишите ваши дизайн-решения или вставьте ссылку на Figma..."
                                        value={answer}
                                        onChange={e => setAnswer(e.target.value)}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group/up">
                                            <input type="file" className="hidden" id="figma-up" onChange={e => e.target.files && setSelectedFile(e.target.files[0])} />
                                            <label htmlFor="figma-up" className="flex items-center gap-8 p-8 bg-white rounded-[2.5rem] border-4 border-dashed border-indigo-50 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all group-hover/up:bg-purple-50">
                                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover/up:scale-110 transition-transform">
                                                    {selectedFile ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-black uppercase tracking-tight text-xs mb-1 line-clamp-1">{selectedFile ? selectedFile.name : 'Файлы Дизайна'}</h4>
                                                    <p className="text-[10px] text-indigo-300 uppercase tracking-widest">Upload Prototypes</p>
                                                </div>
                                            </label>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={(!answer.trim() && !selectedFile) || submittedTasks.has(selectedTask.id)}
                                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all p-8 group/btn shadow-glow-purple"
                                        >
                                            <Palette className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                                            Submit for Review
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-20 border-t border-indigo-100">
                                    <TaskComments taskId={selectedTask.id} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white/40 border-2 border-dashed border-indigo-100 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 space-y-10 min-h-[600px]">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-purple-50 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-purple-200 blur-3xl opacity-30 animate-pulse"></div>
                                <Layout className="w-16 h-16 text-purple-200" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase italic">Select Module</h3>
                                <p className="text-indigo-900/40 text-lg font-medium italic max-w-sm">Выберите урок из списка инструментов Figma <br />для начала проектирования.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .shadow-glow-purple { box-shadow: 0 10px 40px -10px rgba(147, 51, 234, 0.4); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.12); }
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}
