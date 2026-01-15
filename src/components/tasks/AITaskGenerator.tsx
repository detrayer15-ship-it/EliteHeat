import { useState } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { generateTask } from '@/api/gemini'
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    Code,
    Palette,
    Target,
    Clock,
    Lightbulb,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AITaskGeneratorProps {
    onTaskGenerated?: () => void
}

export const AITaskGenerator = ({ onTaskGenerated }: AITaskGeneratorProps) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [subject, setSubject] = useState<'python' | 'figma'>('python')
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
    const [generatedTask, setGeneratedTask] = useState<any>(null)
    const createAITask = useTaskStore((state) => state.createAITask)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setGeneratedTask(null)

        try {
            const task = await generateTask({
                subject,
                difficulty,
            })

            setGeneratedTask(task)
        } catch (error) {
            console.error('Task generation error:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSaveTask = () => {
        if (!generatedTask) return

        createAITask({
            title: generatedTask.title,
            description: generatedTask.description,
            completed: false,
            projectId: 'ai-generated',
            subject,
            difficulty,
            hints: generatedTask.hints,
            estimatedTime: generatedTask.estimatedTime,
        })

        setGeneratedTask(null)
        onTaskGenerated?.()
    }

    return (
        <div className="glass-premium rounded-[2.5rem] p-8 border border-white/60 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-indigo-950">AI Task Generator</h3>
                    <p className="text-sm text-indigo-950/40 font-medium">Персональные задачи от искусственного интеллекта</p>
                </div>
            </div>

            {!generatedTask ? (
                <div className="space-y-6">
                    {/* Subject Selection */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-3 block">
                            Предмет
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'python', label: 'Python', icon: <Code className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
                                { id: 'figma', label: 'Figma', icon: <Palette className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSubject(item.id as any)}
                                    className={`
                                        p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3
                                        ${subject === item.id
                                            ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-lg scale-105`
                                            : 'bg-white/50 border-indigo-100 text-indigo-950/60 hover:border-indigo-300'
                                        }
                                    `}
                                >
                                    {item.icon}
                                    <span className="font-bold">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-3 block">
                            Уровень сложности
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'beginner', label: 'Новичок', emoji: '🌱' },
                                { id: 'intermediate', label: 'Средний', emoji: '🔥' },
                                { id: 'advanced', label: 'Эксперт', emoji: '⚡' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setDifficulty(item.id as any)}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all duration-300
                                        ${difficulty === item.id
                                            ? 'bg-indigo-600 text-white border-transparent shadow-lg'
                                            : 'bg-white/50 border-indigo-100 text-indigo-950/60 hover:border-indigo-300'
                                        }
                                    `}
                                >
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <div className="text-xs font-bold">{item.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Генерация задачи...
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5" />
                                Сгенерировать задачу
                            </div>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Generated Task Preview */}
                    <div className="bg-white/60 rounded-2xl p-6 border border-indigo-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-indigo-950 mb-2">{generatedTask.title}</h4>
                                <p className="text-sm text-indigo-950/60 leading-relaxed">{generatedTask.description}</p>
                            </div>
                        </div>

                        {/* Task Metadata */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl">
                                <Target className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-950">{difficulty === 'beginner' ? 'Новичок' : difficulty === 'intermediate' ? 'Средний' : 'Эксперт'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold text-purple-950">~{generatedTask.estimatedTime} мин</span>
                            </div>
                        </div>

                        {/* Hints */}
                        {generatedTask.hints && generatedTask.hints.length > 0 && (
                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                                    <span className="text-xs font-black uppercase tracking-widest text-yellow-900">Подсказки</span>
                                </div>
                                <ul className="space-y-2">
                                    {generatedTask.hints.map((hint: string, i: number) => (
                                        <li key={i} className="text-sm text-yellow-900 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{hint}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSaveTask}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:scale-105 transition-all"
                        >
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Сохранить задачу
                        </Button>
                        <Button
                            onClick={() => setGeneratedTask(null)}
                            variant="ghost"
                            className="px-6 py-4 rounded-xl border-2 border-indigo-200 text-indigo-950 font-bold hover:bg-indigo-50"
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
