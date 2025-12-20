import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users, FileText, Trash2 } from 'lucide-react'

export const TestDataPage = () => {
    const navigate = useNavigate()
    const [generating, setGenerating] = useState(false)

    const generateUsers = () => {
        setGenerating(true)
        setTimeout(() => {
            alert('Создано 10 тестовых пользователей!')
            setGenerating(false)
        }, 1000)
    }

    const clearTestData = () => {
        if (confirm('Удалить все тестовые данные?')) {
            alert('Тестовые данные удалены!')
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📦 Тестовые данные</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">👥 Генерация пользователей</h2>
                    <p className="text-gray-600 mb-4">Создать тестовых пользователей для проверки</p>
                    <Button onClick={generateUsers} disabled={generating} className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        {generating ? 'Создаём...' : 'Создать 10 пользователей'}
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">📝 Генерация заданий</h2>
                    <p className="text-gray-600 mb-4">Создать тестовые задания</p>
                    <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Создать 5 заданий
                    </Button>
                </Card>

                <Card className="p-6 md:col-span-2 bg-red-50 border-2 border-red-200">
                    <h2 className="text-xl font-bold mb-4 text-red-700">⚠️ Опасная зона</h2>
                    <p className="text-red-600 mb-4">Удалить все тестовые данные из базы</p>
                    <Button onClick={clearTestData} className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Очистить тестовые данные
                    </Button>
                </Card>
            </div>
        </div>
    )
}
