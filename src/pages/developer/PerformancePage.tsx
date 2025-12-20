import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Activity, Zap, Database } from 'lucide-react'

export const PerformancePage = () => {
    const navigate = useNavigate()
    const [metrics, setMetrics] = useState({
        loadTime: 0,
        memory: 0,
        fps: 60
    })

    useEffect(() => {
        // Симуляция метрик
        setMetrics({
            loadTime: Math.random() * 3 + 1,
            memory: Math.random() * 50 + 20,
            fps: Math.floor(Math.random() * 10) + 55
        })
    }, [])

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📊 Мониторинг производительности</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        <div className="text-sm text-gray-600">Время загрузки</div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">{metrics.loadTime.toFixed(2)}s</div>
                    <div className={`text-sm mt-2 ${metrics.loadTime < 2 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.loadTime < 2 ? '✅ Отлично' : '⚠️ Медленно'}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-6 h-6 text-blue-600" />
                        <div className="text-sm text-gray-600">Использование памяти</div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{metrics.memory.toFixed(0)} MB</div>
                    <div className={`text-sm mt-2 ${metrics.memory < 40 ? 'text-green-600' : 'text-orange-600'}`}>
                        {metrics.memory < 40 ? '✅ Нормально' : '⚠️ Высокое'}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-6 h-6 text-green-600" />
                        <div className="text-sm text-gray-600">FPS</div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{metrics.fps}</div>
                    <div className={`text-sm mt-2 ${metrics.fps >= 55 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.fps >= 55 ? '✅ Плавно' : '⚠️ Лаги'}
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">📈 График производительности</h2>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400">График будет здесь</div>
                </div>
            </Card>

            <Card className="p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">🔍 Рекомендации</h2>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Время загрузки в норме</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <span>FPS стабильный</span>
                    </li>
                    {metrics.memory > 40 && (
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600">⚠️</span>
                            <span>Рассмотрите оптимизацию использования памяти</span>
                        </li>
                    )}
                </ul>
            </Card>
        </div>
    )
}
