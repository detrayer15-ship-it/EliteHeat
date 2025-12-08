import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

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
            name: 'PDF документ',
            icon: '📄',
            description: 'Загрузите PDF для анализа',
            accept: '.pdf',
        },
        {
            id: 'presentation',
            name: 'Презентация',
            icon: '📊',
            description: 'PowerPoint или Google Slides',
            accept: '.ppt,.pptx',
        },
        {
            id: 'text',
            name: 'Текст',
            icon: '📝',
            description: 'Введите текст напрямую',
            accept: '',
        },
    ]

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    }

    const handleAnalyze = async () => {
        setIsAnalyzing(true)

        // Симуляция AI анализа
        await new Promise(resolve => setTimeout(resolve, 2000))

        const mockResult: AnalysisResult = {
            score: Math.floor(Math.random() * 30) + 70,
            strengths: [
                'Четкая структура и логичное изложение',
                'Хорошее использование примеров',
                'Профессиональное оформление',
            ],
            improvements: [
                'Добавьте больше визуальных элементов',
                'Упростите сложные термины',
                'Расширьте заключение',
            ],
            recommendations: [
                'Рассмотрите добавление инфографики',
                'Проверьте орфографию и пунктуацию',
                'Добавьте список источников',
            ],
        }

        setResult(mockResult)
        setIsAnalyzing(false)
    }

    const resetAnalysis = () => {
        setSelectedFormat(null)
        setTextContent('')
        setFileName('')
        setResult(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">🤖 AI Review</h1>
                <p className="text-gray-600">Получите AI-анализ вашего контента</p>
            </div>

            {!result ? (
                <>
                    {/* Format Selection */}
                    {!selectedFormat && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {formats.map((format) => (
                                <Card
                                    key={format.id}
                                    className="cursor-pointer hover:shadow-lg transition-smooth text-center"
                                    onClick={() => setSelectedFormat(format.id as ContentFormat)}
                                >
                                    <div className="text-6xl mb-4">{format.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{format.name}</h3>
                                    <p className="text-sm text-gray-600">{format.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Content Input */}
                    {selectedFormat && (
                        <Card>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">
                                        {formats.find(f => f.id === selectedFormat)?.name}
                                    </h2>
                                    <Button variant="secondary" onClick={() => setSelectedFormat(null)}>
                                        ← Назад
                                    </Button>
                                </div>

                                {selectedFormat === 'text' ? (
                                    <Textarea
                                        label="Введите ваш текст"
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="Вставьте текст для анализа..."
                                        rows={12}
                                    />
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept={formats.find(f => f.id === selectedFormat)?.accept}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="text-6xl mb-4">📤</div>
                                            <div className="text-lg font-semibold mb-2">
                                                {fileName || 'Нажмите для загрузки файла'}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                или перетащите файл сюда
                                            </div>
                                        </label>
                                    </div>
                                )}

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (!textContent && !fileName)}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isAnalyzing ? '⏳ Анализируем...' : '🔍 Начать анализ'}
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                /* Analysis Results */
                <div className="space-y-4">
                    {/* Score */}
                    <Card>
                        <div className="text-center">
                            <div className="text-6xl font-bold text-primary mb-2">{result.score}/100</div>
                            <div className="text-lg text-gray-600">Общая оценка</div>
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-primary to-ai-blue h-4 rounded-full transition-smooth"
                                    style={{ width: `${result.score}%` }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Strengths */}
                    <Card>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>✅</span> Сильные стороны
                        </h3>
                        <ul className="space-y-2">
                            {result.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Improvements */}
                    <Card>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🔧</span> Области для улучшения
                        </h3>
                        <ul className="space-y-2">
                            {result.improvements.map((improvement, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💡</span> Рекомендации
                        </h3>
                        <ul className="space-y-2">
                            {result.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button onClick={resetAnalysis} className="flex-1">
                            🔄 Новый анализ
                        </Button>
                        <Button variant="secondary" className="flex-1">
                            💾 Сохранить отчет
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
