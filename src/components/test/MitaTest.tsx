import { useState } from 'react'
import { sendTextMessage } from '@/api/mita'

export const MitaTest = () => {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleTest = async () => {
        if (!input.trim()) return

        setLoading(true)
        setError('')
        setResponse('')

        try {
            const result = await sendTextMessage(input)
            setResponse(result)
        } catch (err: any) {
            setError(err.message || 'Ошибка')
            console.error('Mita Error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">🧪 Тест Mita AI</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Вопрос для Миты:
                    </label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                        placeholder="Например: Что такое Python?"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button
                    onClick={handleTest}
                    disabled={loading || !input.trim()}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Отправка...' : 'Отправить'}
                </button>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">❌ Ошибка: {error}</p>
                    </div>
                )}

                {response && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-semibold text-green-900 mb-2">✅ Ответ Миты:</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                    💡 Этот компонент тестирует прямое подключение к Mita AI (OpenAI)
                </p>
            </div>
        </div>
    )
}
