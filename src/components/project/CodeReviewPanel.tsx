import { useState } from 'react'
import {
    Send,
    Sparkles,
    Bot,
    CheckCircle2,
    AlertCircle,
    Zap,
    Code2,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sendTextMessage } from '@/api/gemini'

export const CodeReviewPanel = () => {
    const [code, setCode] = useState('')
    const [review, setReview] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleReview = async () => {
        if (!code.trim() || isLoading) return

        setIsLoading(true)
        try {
            const prompt = `Ты - Senior Software Engineer. Проведи профессиональный ревью следующего кода. 
            Верни ответ В ФОРМАТЕ JSON (без markdown):
            {
                "score": 0-100,
                "summary": "Краткий вывод",
                "details": [
                    {"category": "Security", "status": "ok" | "warning", "message": "..."},
                    {"category": "Performance", "status": "ok" | "warning", "message": "..."},
                    {"category": "Readability", "status": "ok" | "warning", "message": "..."}
                ],
                "improvement": "Как улучшить код (1-2 предложения)",
                "refactored": "Исправленный вариант кода"
            }

            Код для ревью:
            ${code}`

            const response = await sendTextMessage(prompt)
            const jsonMatch = response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                setReview(JSON.parse(jsonMatch[0]))
            }
        } catch (error) {
            console.error('Review error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="glass-premium bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/50 rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden">
            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-indigo-950">AI Code Review</h3>
                            <p className="text-xs text-indigo-900/40 font-bold uppercase tracking-widest">Профессиональный анализ от Миты</p>
                        </div>
                    </div>
                    {review && (
                        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                            <Zap className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-black text-indigo-950">{review.score}/100</span>
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Вставь свой код сюда для проверки..."
                        className="w-full h-48 p-6 bg-white/40 backdrop-blur-md border-2 border-indigo-100 rounded-[2rem] focus:border-indigo-600 focus:bg-white transition-all outline-none font-mono text-sm text-indigo-950 placeholder:text-indigo-200"
                    />
                    <div className="absolute top-4 right-4 text-indigo-200 group-focus-within:text-indigo-600 transition-colors">
                        <Code2 className="w-6 h-6" />
                    </div>
                </div>

                <Button
                    onClick={handleReview}
                    disabled={!code.trim() || isLoading}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-glow"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Проанализировать код
                        </div>
                    )}
                </Button>

                {review && (
                    <div className="mt-8 space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {review.details.map((detail: any, i: number) => (
                                <div key={i} className="p-4 bg-white/60 rounded-2xl border border-indigo-50 flex items-start gap-3">
                                    {detail.status === 'ok' ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-amber-500" />
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{detail.category}</p>
                                        <p className="text-xs font-bold text-indigo-950 mt-1">{detail.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-indigo-950 rounded-[2rem] text-white space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <h4 className="font-black uppercase tracking-widest text-xs">Предложение по улучшению</h4>
                            </div>
                            <p className="text-sm font-medium opacity-80 leading-relaxed">{review.improvement}</p>

                            <div className="mt-4 p-4 bg-black/30 rounded-xl overflow-x-auto">
                                <code className="text-[10px] font-mono whitespace-pre text-indigo-200 italic">
                                    {review.refactored}
                                </code>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
