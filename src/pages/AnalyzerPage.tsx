import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import {
    FileText,
    Presentation,
    Type,
    ChevronLeft,
    Search,
    Sparkles,
    Cpu,
    ShieldCheck,
    Zap,
    Lightbulb,
    Trash2,
    Download,
    RefreshCw,
    Maximize2
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { CodeReviewPanel } from '@/components/project/CodeReviewPanel'

type ContentFormat = 'pdf' | 'presentation' | 'text'

interface AnalysisResult {
    score: number
    strengths: string[]
    improvements: string[]
    recommendations: string[]
}

export const AIReviewPage = () => {
    const [selectedFormat, setSelectedFormat] = useState<ContentFormat | null>(null)
    const [textContent, setTextContent] = useState('')
    const [fileName, setFileName] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const formats = [
        {
            id: 'pdf',
            name: 'PDF Protocol',
            icon: <FileText />,
            description: 'Deep scan for documents',
            color: 'from-blue-500 to-indigo-600',
            accept: '.pdf',
        },
        {
            id: 'presentation',
            name: 'Visual Deck',
            icon: <Presentation />,
            description: 'Slide-deck optimization',
            color: 'from-purple-500 to-pink-600',
            accept: '.ppt,.pptx',
        },
        {
            id: 'text',
            name: 'Plain Logic',
            icon: <Type />,
            description: 'Direct string analysis',
            color: 'from-emerald-500 to-teal-600',
            accept: '',
        },
    ]

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setFileName(file.name)
    }

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        await new Promise(resolve => setTimeout(resolve, 3000))
        setResult({
            score: Math.floor(Math.random() * 30) + 70,
            strengths: ['Четкая структура и логичное изложение', 'Хорошее использование примеров', 'Профессиональное оформление'],
            improvements: ['Добавьте больше визуальных элементов', 'Упростите сложные термины', 'Расширьте заключение'],
            recommendations: ['Рассмотрите добавление инфографики', 'Проверьте орфографию и пунктуацию', 'Добавьте список источников'],
        })
        setIsAnalyzing(false)
    }

    const resetAnalysis = () => {
        setSelectedFormat(null)
        setTextContent('')
        setFileName('')
        setResult(null)
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO MODULE */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                            <Cpu className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Analyzer v4.0.5</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                            Анализ <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Интеллекта</span>
                        </h1>
                        <p className="text-xl text-white/40 font-medium max-w-xl leading-relaxed italic">
                            Загрузи свой проект, текст или презентацию. Наша нейросеть проверит логику, структуру и даст рекомендации.
                        </p>
                    </div>
                </div>
            </ScrollReveal>

            {/* SELECTION AREA */}
            {!result && !isAnalyzing && (
                <ScrollReveal animation="slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {formats.map((f, i) => (
                            <div
                                key={f.id}
                                onClick={() => setSelectedFormat(f.id as any)}
                                className={`
                                    group relative p-10 rounded-[3rem] border transition-all cursor-pointer h-full
                                    ${selectedFormat === f.id ? 'bg-white border-indigo-100 shadow-3xl translate-y-[-10px]' : 'bg-white/40 border-white/60 hover:bg-white/80 hover:border-white shadow-xl'}
                                `}
                            >
                                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-10 transform group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-3xl font-black text-indigo-950 mb-4 h-16 flex items-end tracking-tighter">{f.name}</h3>
                                <p className="text-indigo-900/40 font-medium italic mb-2 line-clamp-2">{f.description}</p>
                                <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronLeft className="w-6 h-6 text-indigo-300 rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            )}

            {/* ACTION FRAME */}
            {selectedFormat && !result && !isAnalyzing && (
                <ScrollReveal animation="fade">
                    <div className="glass-premium rounded-[3.5rem] border border-white shadow-3xl p-12 lg:p-20 space-y-12">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Ввод Данных</h2>
                                <p className="text-indigo-900/40 text-sm font-medium italic">Подготовьте контент для нейронной обработки.</p>
                            </div>
                            <button onClick={() => setSelectedFormat(null)} className="p-4 bg-white rounded-2xl border border-indigo-50 text-indigo-400 hover:text-indigo-950 transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {selectedFormat === 'text' ? (
                                <textarea
                                    className="w-full bg-white border border-indigo-50 rounded-[3rem] p-12 text-indigo-950 font-medium text-lg leading-relaxed focus:ring-8 focus:ring-indigo-100 transition-all min-h-[400px] resize-none"
                                    placeholder="Вставьте ваш текст здесь..."
                                    value={textContent}
                                    onChange={e => setTextContent(e.target.value)}
                                />
                            ) : (
                                <div className="group/up relative h-[400px]">
                                    <input type="file" id="f-analyzer" className="hidden" onChange={handleFileUpload} accept={formats.find(f => f.id === selectedFormat)?.accept} />
                                    <label htmlFor="f-analyzer" className="absolute inset-0 bg-white/40 border-4 border-dashed border-indigo-50 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 cursor-pointer group-hover/up:bg-indigo-50/30 group-hover/up:border-indigo-400 transition-all">
                                        <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover/up:scale-110 transition-transform">
                                            <Download className="w-14 h-14" />
                                        </div>
                                        <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">{fileName || 'Перетащите файл'}</h3>
                                        <p className="text-indigo-900/40 font-medium italic mt-2">Maximum file size: 25MB Protocols</p>
                                    </label>
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={!textContent && !fileName}
                                className="w-full py-10 bg-[#0a0a0c] text-white rounded-[3rem] font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 hover:shadow-glow transition-all disabled:opacity-30 group"
                            >
                                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Начать Глубокое Сканирование
                            </button>
                        </div>
                    </div>
                </ScrollReveal>
            )}

            {/* PROCESSING OVERLAY */}
            {isAnalyzing && (
                <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-12 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white shadow-3xl animate-fade-in relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 animate-pulse"></div>
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center animate-spin-slow">
                            <RefreshCw className="w-16 h-16" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full border-8 border-white flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-indigo-950 tracking-tighter uppercase italic animate-pulse">Processing Neural Nodes...</h3>
                        <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.5em]">Checking Logic Integrity • Structure Analysis</p>
                    </div>
                    <div className="w-64 h-1 bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 animate-progress"></div>
                    </div>
                </div>
            )}

            {/* RESULT HUB */}
            {result && (
                <ScrollReveal animation="fade">
                    <div className="space-y-10 animate-fade-in">
                        {/* SCORE CARD */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 bg-[#0a0a0c] rounded-[3.5rem] p-14 text-white flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group shadow-3xl">
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                                <div className="text-sm font-black uppercase tracking-[0.4em] text-white/30">Total Score</div>
                                <div className="text-[120px] font-black leading-none bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent italic tracking-tighter">
                                    <AnimatedCounter end={result.score} />
                                </div>
                                <div className="px-6 py-2 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">Platinum Quality</div>
                            </div>

                            <div className="lg:col-span-2 glass-premium rounded-[3.5rem] p-12 border border-white shadow-3xl flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Вердикт Системы</h3>
                                    <p className="text-indigo-950/60 text-lg font-medium leading-relaxed italic">Ваш контент прошел валидацию. Мы обнаружили высокую степень структурированности, однако графическая часть требует доработки для достижения идеального результата.</p>
                                </div>
                                <div className="flex gap-4 pt-8">
                                    <button onClick={resetAnalysis} className="flex-1 bg-white border border-indigo-50 p-6 rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] text-indigo-400 hover:text-indigo-950 transition-colors flex items-center justify-center gap-3">
                                        <RefreshCw className="w-4 h-4" /> Новый Анализ
                                    </button>
                                    <button className="flex-1 bg-indigo-600 text-white p-6 rounded-[1.8rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-glow">
                                        <Download className="w-4 h-4" /> Экспорт Отчета
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* TRIPTYCH RESULTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {[
                                { title: 'Сильные стороны', items: result.strengths, icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-400' },
                                { title: 'Нужны доработки', items: result.improvements, icon: <Zap className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', dot: 'bg-amber-400' },
                                { title: 'Рекомендации', items: result.recommendations, icon: <Lightbulb className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', dot: 'bg-blue-400' },
                            ].map((col, idx) => (
                                <div key={idx} className={`bg-white rounded-[2.5rem] p-10 border ${col.border} shadow-xl hover:shadow-2xl transition-all h-full`}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-12 h-12 rounded-2xl ${col.color} flex items-center justify-center`}>{col.icon}</div>
                                        <h4 className="text-xl font-black text-indigo-950 tracking-tight">{col.title}</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {col.items.map((it, i) => (
                                            <li key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 group/item hover:bg-white transition-colors">
                                                <div className={`w-2 h-2 rounded-full ${col.dot} mt-2 group-hover:scale-150 transition-transform`}></div>
                                                <p className="text-sm text-indigo-950/70 font-medium leading-relaxed">{it}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            )}

            {/* CODE REVIEW LAB SECTION */}
            <ScrollReveal animation="slide-up">
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-indigo-100"></div>
                        <h2 className="text-3xl font-black text-indigo-950 tracking-tighter whitespace-nowrap">Лаборатория Кода</h2>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-indigo-100"></div>
                    </div>
                    <CodeReviewPanel />
                </div>
            </ScrollReveal>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 45px 100px -25px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress { animation: progress 3s linear infinite; }
                .animate-spin-slow { animation: spin 4s linear infinite; }
            `}</style>
        </div>
    )
}
