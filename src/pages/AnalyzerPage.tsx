import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface AnalysisComment {
    slideNumber: number
    type: 'error' | 'warning' | 'success'
    message: string
    suggestion: string | null
}

export const AnalyzerPage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [analysis, setAnalysis] = useState<AnalysisComment[]>([])
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleAnalyze = async () => {
        if (!file) return

        setLoading(true)

        setTimeout(async () => {
            const response = await fetch('/data/analysis_templates.json')
            const data = await response.json()
            setAnalysis(data)
            setLoading(false)
        }, 1500)
    }

    const typeColors = {
        error: 'border-error bg-error/5',
        warning: 'border-primary bg-primary/5',
        success: 'border-success bg-success/5',
    }

    const typeIcons = {
        error: '❌',
        warning: '⚠️',
        success: '✅',
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-2">Анализ презентаций</h1>
            <p className="text-gray-600 mb-6">Загрузите презентацию для AI-анализа</p>

            <Card className="mb-6">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-gray-600 mb-2">
                                {file ? file.name : 'Нажмите для выбора файла'}
                            </p>
                            <p className="text-sm text-gray-500">PDF, PPT, PPTX</p>
                        </label>
                    </div>

                    {file && (
                        <Button onClick={handleAnalyze} loading={loading} className="w-full">
                            Анализировать презентацию
                        </Button>
                    )}
                </div>
            </Card>

            {analysis.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-text">Результаты анализа</h2>

                    {analysis.map((comment, index) => (
                        <Card key={index} className={`border-l-4 ${typeColors[comment.type]}`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{typeIcons[comment.type]}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-text">Слайд {comment.slideNumber}</span>
                                    </div>
                                    <p className="text-text mb-2">{comment.message}</p>
                                    {comment.suggestion && (
                                        <p className="text-sm text-gray-600">
                                            <strong>Рекомендация:</strong> {comment.suggestion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
