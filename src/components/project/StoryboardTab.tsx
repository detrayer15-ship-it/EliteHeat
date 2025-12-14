import { useState } from 'react'
import { Plus, Trash2, FileDown } from 'lucide-react'

interface Slide {
    id: string
    order: number
    title: string
    bullets: string[]
    speakerNotes: string
}

interface StoryboardTabProps {
    slides: Slide[]
    onUpdate: (updates: any) => Promise<void>
}

export const StoryboardTab = ({ slides, onUpdate }: StoryboardTabProps) => {
    const [localSlides, setLocalSlides] = useState<Slide[]>(slides.length > 0 ? slides : getDefaultSlides())

    function getDefaultSlides(): Slide[] {
        return [
            {
                id: '1',
                order: 1,
                title: 'Проблема',
                bullets: ['Опишите проблему, которую решает ваш проект'],
                speakerNotes: 'Начните с вопроса к аудитории или статистики'
            },
            {
                id: '2',
                order: 2,
                title: 'Решение',
                bullets: ['Как ваш проект решает эту проблему'],
                speakerNotes: 'Покажите ключевые преимущества вашего решения'
            },
            {
                id: '3',
                order: 3,
                title: 'Технологии',
                bullets: ['Используемый стек технологий'],
                speakerNotes: 'Объясните почему выбрали именно эти технологии'
            },
            {
                id: '4',
                order: 4,
                title: 'Демо',
                bullets: ['Демонстрация работы проекта'],
                speakerNotes: 'Покажите основной функционал в действии'
            },
        ]
    }

    const handleAddSlide = () => {
        const newSlide: Slide = {
            id: Date.now().toString(),
            order: localSlides.length + 1,
            title: 'Новый слайд',
            bullets: [''],
            speakerNotes: ''
        }
        const updated = [...localSlides, newSlide]
        setLocalSlides(updated)
        onUpdate({ slides: updated })
    }

    const handleDeleteSlide = (slideId: string) => {
        const updated = localSlides
            .filter(s => s.id !== slideId)
            .map((s, idx) => ({ ...s, order: idx + 1 }))
        setLocalSlides(updated)
        onUpdate({ slides: updated })
    }

    const handleUpdateSlide = (slideId: string, updates: Partial<Slide>) => {
        const updated = localSlides.map(s =>
            s.id === slideId ? { ...s, ...updates } : s
        )
        setLocalSlides(updated)
    }

    const handleSaveSlide = () => {
        onUpdate({ slides: localSlides })
    }

    const handleExportPDF = () => {
        alert('Экспорт в PDF будет доступен после подключения библиотеки jsPDF')
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Презентация ({localSlides.length} слайдов)
                </h3>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                    <FileDown className="w-4 h-4" />
                    Экспорт в PDF
                </button>
            </div>

            {/* Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localSlides
                    .sort((a, b) => a.order - b.order)
                    .map((slide) => (
                        <div key={slide.id} className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                            {/* Slide Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                                        {slide.order}
                                    </span>
                                    <input
                                        type="text"
                                        value={slide.title}
                                        onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                                        onBlur={handleSaveSlide}
                                        className="flex-1 text-lg font-semibold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none px-2 py-1"
                                        placeholder="Название слайда"
                                    />
                                </div>
                                <button
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Slide Content */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Содержание слайда
                                    </label>
                                    <textarea
                                        value={slide.bullets.join('\n')}
                                        onChange={(e) => handleUpdateSlide(slide.id, {
                                            bullets: e.target.value.split('\n').filter(b => b.trim())
                                        })}
                                        onBlur={handleSaveSlide}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        rows={4}
                                        placeholder="• Пункт 1&#10;• Пункт 2&#10;• Пункт 3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Заметки спикера (что говорить)
                                    </label>
                                    <textarea
                                        value={slide.speakerNotes}
                                        onChange={(e) => handleUpdateSlide(slide.id, { speakerNotes: e.target.value })}
                                        onBlur={handleSaveSlide}
                                        className="w-full px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Что вы будете говорить во время этого слайда..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Add Slide Button */}
            <button
                onClick={handleAddSlide}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Добавить слайд
            </button>
        </div>
    )
}
