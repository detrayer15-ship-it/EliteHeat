import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, AlertCircle, XCircle } from 'lucide-react'

export const ErrorMonitorPage = () => {
    const navigate = useNavigate()
    const [errors] = useState([
        { id: '1', type: 'Error', message: 'Cannot read property of undefined', file: 'App.tsx', line: 45, count: 12, critical: true },
        { id: '2', type: 'Warning', message: 'Deprecated API usage', file: 'utils.ts', line: 23, count: 5, critical: false },
        { id: '3', type: 'Error', message: 'Network request failed', file: 'api.ts', line: 67, count: 8, critical: true }
    ])

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🧯 Монитор ошибок</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6">
                    <div className="text-3xl font-bold text-red-600">{errors.filter(e => e.critical).length}</div>
                    <div className="text-sm text-gray-600">Критические</div>
                </Card>
                <Card className="p-6">
                    <div className="text-3xl font-bold text-yellow-600">{errors.filter(e => !e.critical).length}</div>
                    <div className="text-sm text-gray-600">Предупреждения</div>
                </Card>
                <Card className="p-6">
                    <div className="text-3xl font-bold text-blue-600">{errors.reduce((sum, e) => sum + e.count, 0)}</div>
                    <div className="text-sm text-gray-600">Всего событий</div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Последние ошибки</h2>
                <div className="space-y-3">
                    {errors.map(error => (
                        <div key={error.id} className={`p-4 rounded-lg border-2 ${error.critical ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                {error.critical ? (
                                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <div className="font-bold">{error.message}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {error.file}:{error.line}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Повторений: {error.count}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
