import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Bot, Power, Settings } from 'lucide-react'

export const AIControlPage = () => {
    const navigate = useNavigate()
    const [aiEnabled, setAiEnabled] = useState(true)
    const [settings, setSettings] = useState({
        maxRequests: 100,
        timeout: 30,
        model: 'gpt-4'
    })

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🤖 AI Control Center</h1>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Статус AI</h2>
                            <p className="text-gray-600">
                                {aiEnabled ? '✅ AI активен и работает' : '❌ AI отключен'}
                            </p>
                        </div>
                        <Button
                            onClick={() => setAiEnabled(!aiEnabled)}
                            className={aiEnabled ? 'bg-red-600' : 'bg-green-600'}
                        >
                            <Power className="w-4 h-4 mr-2" />
                            {aiEnabled ? 'Отключить' : 'Включить'}
                        </Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">⚙️ Настройки AI</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Макс. запросов в день</label>
                            <input
                                type="number"
                                value={settings.maxRequests}
                                onChange={(e) => setSettings({ ...settings, maxRequests: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border-2 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Таймаут (сек)</label>
                            <input
                                type="number"
                                value={settings.timeout}
                                onChange={(e) => setSettings({ ...settings, timeout: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border-2 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Модель</label>
                            <select
                                value={settings.model}
                                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                                className="w-full px-4 py-2 border-2 rounded-xl"
                            >
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-3.5">GPT-3.5</option>
                            </select>
                        </div>
                        <Button className="w-full">Сохранить настройки</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
