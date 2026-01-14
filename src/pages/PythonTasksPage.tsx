import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PythonTask } from '@/types/pythonTask'
import { TaskComments } from '@/components/TaskComments'
import {
    CheckCircle2,
    Circle,
    Clock,
    ChevronRight,
    Youtube,
    FileText,
    Upload,
    MessageSquare,
    PlayCircle,
    BrainCircuit,
    Award,
    Code2,
    Lock
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

interface TestQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
}

export const PythonTasksPage = () => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState<PythonTask[]>([])
    const [selectedTask, setSelectedTask] = useState<PythonTask | null>(null)
    const [submittedTasks, setSubmittedTasks] = useState<Set<string>>(
        new Set(JSON.parse(localStorage.getItem('python_submitted_tasks') || '[]'))
    )
    const [submissionTimes, setSubmissionTimes] = useState<Record<string, number>>(
        JSON.parse(localStorage.getItem('python_submission_times') || '{}')
    )
    const [answer, setAnswer] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Test state
    const [showTest, setShowTest] = useState(false)
    const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userAnswers, setUserAnswers] = useState<number[]>([])
    const [testCompleted, setTestCompleted] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        fetch('/data/python_tasks.json').then(res => res.json()).then(setTasks)
        fetch('/data/python_test.json').then(res => res.json()).then(setTestQuestions)

        const interval = setInterval(checkAutoApproval, 60000)
        checkAutoApproval()
        return () => clearInterval(interval)
    }, [])

    const checkAutoApproval = () => {
        const now = Date.now()
        const oneHour = 60 * 60 * 1000
        const progress = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')
        const times = JSON.parse(localStorage.getItem('python_submission_times') || '{}')
        let updated = false

        Object.keys(times).forEach((taskId) => {
            if (now - times[taskId] >= oneHour && !progress[taskId]) {
                progress[taskId] = true
                updated = true
            }
        })

        if (updated) {
            localStorage.setItem('python_lessons_progress', JSON.stringify(progress))
            window.location.reload()
        }
    }

    const handleSubmit = () => {
        if (!answer.trim()) return
        if (selectedTask) {
            const newSubmitted = new Set(submittedTasks)
            newSubmitted.add(selectedTask.id)
            setSubmittedTasks(newSubmitted)
            localStorage.setItem('python_submitted_tasks', JSON.stringify([...newSubmitted]))

            const newTimes = { ...submissionTimes, [selectedTask.id]: Date.now() }
            setSubmissionTimes(newTimes)
            localStorage.setItem('python_submission_times', JSON.stringify(newTimes))
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
                            <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 animate-pulse"></div>
                            <div className="text-8xl relative z-10">{percentage >= 70 ? '🏆' : '📚'}</div>
                        </div>
                        <div className="space-y-4">
                            <h2 className={`text-5xl font-black ${percentage >= 70 ? 'text-indigo-400' : 'text-amber-400'} tracking-tighter`}>
                                {percentage >= 70 ? 'Курс Пройден!' : 'Нужно Повторить'}
                            </h2>
                            <p className="text-2xl text-white/40 font-medium">Ваш результат: <span className="text-white">{score} / {testQuestions.length}</span> ({percentage}%)</p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => { setShowTest(false); setTestCompleted(false); setCurrentQuestion(0); setUserAnswers([]) }} className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all">Закрыть</button>
                            {percentage < 70 && <button onClick={() => { setTestCompleted(false); setCurrentQuestion(0); setUserAnswers([]) }} className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all">Попробовать снова</button>}
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
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Terminal Identity v4.0</div>
                            <h3 className="text-white/40 text-sm font-medium">Вопрос {currentQuestion + 1} из {testQuestions.length}</h3>
                        </div>
                        <button onClick={() => setShowTest(false)} className="text-white/20 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Прервать сессию</button>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur opacity-10"></div>
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
                                        className={`group relative p-6 rounded-2xl border transition-all text-left flex items-center gap-6 ${userAnswers[currentQuestion] === i ? 'bg-indigo-600 border-indigo-400 shadow-glow' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${userAnswers[currentQuestion] === i ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/40 group-hover:bg-white/20 group-hover:text-white'}`}>
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
                                <div key={i} className={`h-1 rounded-full transition-all ${i === currentQuestion ? 'w-8 bg-indigo-500' : i < currentQuestion ? 'w-4 bg-emerald-500' : 'w-4 bg-white/10'}`}></div>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* TASK LISTSIDEBAR */}
            <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-none">
                {tasks.map((task) => {
                    const isSubmitted = submittedTasks.has(task.id)
                    const isCompleted = JSON.parse(localStorage.getItem('python_lessons_progress') || '{}')[task.id]
                    const isActive = selectedTask?.id === task.id

                    return (
                        <div
                            key={task.id}
                            onClick={() => { setSelectedTask(task); navigate(`/python-tasks/${task.id}`) }}
                            className={`
                                group relative p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center gap-6
                                ${isActive ? 'bg-white shadow-2xl border-indigo-100' : 'bg-white/40 border-white/60 hover:bg-white/80'}
                            `}
                        >
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all
                                ${isCompleted ? 'bg-emerald-50 text-emerald-500 shadow-emerald-500/20' : isSubmitted ? 'bg-amber-50 text-amber-500 shadow-amber-500/20' : isActive ? 'bg-indigo-600 text-white shadow-indigo-600/30 shadow-lg' : 'bg-white border border-indigo-50 text-indigo-300 group-hover:border-indigo-200'}
                            `}>
                                {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : isSubmitted ? <Clock className="w-7 h-7 animate-pulse" /> : <Code2 className="w-7 h-7" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30">Module #{task.id}</span>
                                    <div className={`w-1 h-1 rounded-full ${task.difficulty === 'beginner' ? 'bg-emerald-400' : task.difficulty === 'intermediate' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                                </div>
                                <h3 className={`font-black tracking-tight text-lg line-clamp-1 ${isActive ? 'text-indigo-950' : 'text-indigo-950/60'}`}>{task.title}</h3>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-all ${isActive ? 'text-indigo-600 translate-x-1' : 'text-indigo-200 group-hover:text-indigo-400'}`} />
                        </div>
                    )
                })}

                <button
                    onClick={() => setShowTest(true)}
                    className="w-full group p-8 rounded-[2.5rem] bg-[#0a0a0c] text-white border border-white/10 hover:border-indigo-500/50 transition-all text-left relative overflow-hidden mt-8"
                >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-purple-500"></div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BrainCircuit className="w-10 h-10 text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Graduation Phase</div>
                            <h3 className="text-xl font-black italic tracking-tight">Финальный Тест</h3>
                        </div>
                    </div>
                </button>
            </div>

            {/* DETAIL AREA */}
            <div className="lg:col-span-3">
                {selectedTask ? (
                    <div className="space-y-8 animate-fade-in">
                        <div className="relative bg-[#0a0a0c] rounded-[3rem] p-10 lg:p-14 text-white overflow-hidden shadow-3xl">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                            <div className="relative z-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Selected Task</div>
                                        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">Difficulty: {taskDifficultyLabel(selectedTask.difficulty)}</div>
                                    </div>
                                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight italic">{selectedTask.title}</h2>
                                    <p className="text-white/40 text-lg font-medium leading-relaxed max-w-2xl">{selectedTask.fullDescription || selectedTask.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a
                                        href={selectedTask.videoUrl}
                                        target="_blank"
                                        className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group/v"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center group-hover/v:scale-110 transition-transform">
                                            <PlayCircle className="w-8 h-8 text-rose-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase tracking-tight text-xs mb-1">Смотреть урок</h4>
                                            <p className="text-[10px] text-white/30 font-medium">Video Protocol Active</p>
                                        </div>
                                    </a>
                                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                            <Award className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase tracking-tight text-xs mb-1">XP Награда</h4>
                                            <p className="text-[10px] text-white/30 font-medium">+150 Intellectual Points</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Execution Protocol</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedTask.steps.map((step, i) => (
                                            <div key={i} className="flex gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 group/s hover:bg-white/10 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xs shrink-0">{i + 1}</div>
                                                <p className="text-sm text-white/70 font-medium leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUBMISSION DECK */}
                        <div className="glass-premium rounded-[3rem] p-10 lg:p-14 border border-white shadow-3xl space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Отправить решение</h3>
                                <p className="text-indigo-900/40 text-sm font-medium italic">Преподаватель увидит ваш код и скриншоты.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30 ml-4">Описание или код</label>
                                    <textarea
                                        className="w-full bg-white border border-indigo-50 rounded-[2rem] p-8 text-indigo-950 font-medium focus:ring-4 focus:ring-indigo-100 transition-all min-h-[200px] resize-none"
                                        placeholder="Вставьте ссылку на репозиторий, код или описание..."
                                        value={answer}
                                        onChange={e => setAnswer(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group/up">
                                        <input type="file" className="hidden" id="task-res" onChange={e => e.target.files && setSelectedFile(e.target.files[0])} />
                                        <label htmlFor="task-res" className="flex items-center gap-6 p-6 bg-white rounded-3xl border-2 border-dashed border-indigo-100 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group-hover/up:bg-indigo-50">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover/up:scale-110 transition-transform">
                                                {selectedFile ? <CheckCircle2 /> : <Upload />}
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase tracking-tight text-[10px] mb-1">{selectedFile ? selectedFile.name : 'Прикрепить файл'}</h4>
                                                <p className="text-[9px] text-indigo-300">Max size 10MB • Code/Images</p>
                                            </div>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!answer.trim() || submittedTasks.has(selectedTask.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all p-6 group/btn"
                                    >
                                        <SendIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        Отправить Протокол
                                    </button>
                                </div>
                            </div>

                            {/* COMMENTS INTEGRATION */}
                            <div className="pt-14 border-t border-indigo-100">
                                <TaskComments taskId={selectedTask.id} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full bg-white/40 border border-white rounded-[3rem] flex flex-col items-center justify-center text-center p-20 space-y-8 min-h-[600px]">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-indigo-200 blur-3xl opacity-30 animate-pulse"></div>
                            <Lock className="w-14 h-14 text-indigo-200" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Ожидание выбора</h3>
                            <p className="text-indigo-900/40 text-sm font-medium italic">Выберите программный модуль <br />из списка слева для начала работы.</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.12); }
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}

const SendIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)

const taskDifficultyLabel = (d: string) => {
    switch (d) {
        case 'beginner': return 'Beginner Protocol';
        case 'intermediate': return 'Advanced Core';
        case 'advanced': return 'Elite Level';
        default: return d;
    }
}
