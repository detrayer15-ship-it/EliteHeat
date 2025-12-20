import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Upload, FileUp } from 'lucide-react'

export const ImportPage = () => {
    const navigate = useNavigate()
    const [importing, setImporting] = useState(false)

    const handleFileUpload = (type: string) => {
        setImporting(true)
        setTimeout(() => {
            alert(`Импорт ${type} завершён!`)
            setImporting(false)
        }, 1000)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">📥 Импорт данных</h1>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">👥 Импорт пользователей</h2>
                    <p className="text-gray-600 mb-4">Загрузите CSV файл с пользователями</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Перетащите файл или нажмите для выбора</p>
                        <input type="file" accept=".csv" className="hidden" />
                    </div>
                    <Button onClick={() => handleFileUpload('пользователей')} disabled={importing} className="w-full">
                        <FileUp className="w-4 h-4 mr-2" />
                        {importing ? 'Импорт...' : 'Импортировать'}
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">📝 Импорт заданий</h2>
                    <p className="text-gray-600 mb-4">Загрузите JSON файл с заданиями</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Перетащите файл или нажмите для выбора</p>
                        <input type="file" accept=".json" className="hidden" />
                    </div>
                    <Button onClick={() => handleFileUpload('заданий')} disabled={importing} className="w-full">
                        <FileUp className="w-4 h-4 mr-2" />
                        {importing ? 'Импорт...' : 'Импортировать'}
                    </Button>
                </Card>
            </div>

            <Card className="p-6 mt-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold mb-2">ℹ️ Формат файлов</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• CSV для пользователей: name, email, role</li>
                    <li>• JSON для заданий: title, description, points</li>
                </ul>
            </Card>
        </div>
    )
}
