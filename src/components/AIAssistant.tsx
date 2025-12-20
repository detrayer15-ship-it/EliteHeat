import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sparkles, HelpCircle, Lightbulb, Code } from 'lucide-react'

interface AIMode {
    id: 'learning' | 'project' | 'defense' | 'training'
    name: string
    description: string
    icon: any
}

export const AIAssistant = () => {
    const [mode, setMode] = useState<AIMode['id']>('learning')
    const [question, setQuestion] = useState('')
    const [response, setResponse] = useState('')

    const modes: AIMode[] = [
        { id: 'learning', name: '🧭 Обучающий', description: 'Объясняет шагами', icon: HelpCircle },
        { id: 'project', name: '🛠️ Проектный', description: 'Помощь с проектом', icon: Code },
        { id: 'defense', name: '🎤 Защита', description: 'Подготовка к ответу', icon: Lightbulb },
        { id: 'training', name: '🧪 Тренировка', description: 'Практика и задачи', icon: Sparkles }
    ]

    const handleAsk = () => {
        // Имитация AI ответа
        setResponse(`Давай разберём твой вопрос по шагам:\n\n1. Сначала нужно понять...\n2. Затем попробуй...\n3. Если не получается...`)
    }

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI Помощник
            </h2>

            {/* Режимы */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {modes.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${mode === m.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl mb-2">{m.name.split(' ')[0]}</div>
                        <div className="font-bold text-sm">{m.name.split(' ')[1]}</div>
                        <div className="text-xs text-gray-600 mt-1">{m.description}</div>
                    </button>
                ))}
            </div>

            {/* Вопрос */}
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl mb-4"
                rows={4}
                placeholder="Задай свой вопрос..."
            />

            <Button onClick={handleAsk} className="w-full mb-4 bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Спросить AI
            </Button>

            {/* Ответ */}
            {response && (
                <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <div className="font-bold mb-2">🤖 Ответ AI:</div>
                    <div className="whitespace-pre-line text-sm">{response}</div>
                    <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="secondary">Объясни проще</Button>
                        <Button size="sm" variant="secondary">Покажи пример</Button>
                        <Button size="sm" variant="secondary">Я застрял</Button>
                    </div>
                </div>
            )}
        </Card>
    )
}
