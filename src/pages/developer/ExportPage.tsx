import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Download, FileText } from 'lucide-react'

export const ExportPage = () => {
    const navigate = useNavigate()
    const [exporting, setExporting] = useState(false)

    const exportData = (type: string) => {
        setExporting(true)
        setTimeout(() => {
            alert(`Экспорт ${type} завершён! Файл скачан.`)
            setExporting(false)
        }, 1000)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📤 Экспорт данных</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">👥 Пользователи</h2>
                    <p className="text-gray-600 mb-4">Экспорт всех пользователей в CSV</p>
                    <Button onClick={() => exportData('пользователей')} disabled={exporting} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {exporting ? 'Экспорт...' : 'Экспортировать'}
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">📝 Задания</h2>
                    <p className="text-gray-600 mb-4">Экспорт всех заданий в JSON</p>
                    <Button onClick={() => exportData('заданий')} disabled={exporting} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {exporting ? 'Экспорт...' : 'Экспортировать'}
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">🎓 Курсы</h2>
                    <p className="text-gray-600 mb-4">Экспорт всех курсов</p>
                    <Button onClick={() => exportData('курсов')} disabled={exporting} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {exporting ? 'Экспорт...' : 'Экспортировать'}
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">📊 Полный экспорт</h2>
                    <p className="text-gray-600 mb-4">Экспорт всех данных</p>
                    <Button onClick={() => exportData('всех данных')} disabled={exporting} className="w-full bg-purple-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {exporting ? 'Экспорт...' : 'Полный экспорт'}
                    </Button>
                </Card>
            </div>
        </div>
    )
}
