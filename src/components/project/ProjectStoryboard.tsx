import { useState } from 'react'

interface ProjectStoryboardProps {
    projectId: string
}

interface Slide {
    id: number
    title: string
    content: string
    notes: string
    status: 'locked' | 'current' | 'completed'
}

export const ProjectStoryboard = ({ projectId }: ProjectStoryboardProps) => {
    const [slides, setSlides] = useState<Slide[]>([
        {
            id: 1,
            title: 'Проблема',
            content: 'Опиши проблему, которую решает твой проект',
            notes: 'Начни с вопроса к аудитории. Например: "Кто из вас сталкивался с...?"',
            status: 'current'
        },
        {
            id: 2,
            title: 'Решение',
            content: 'Как твой проект решает эту проблему',
            notes: 'Покажи ключевые возможности. Будь конкретным.',
            status: 'locked'
        },
        {
            id: 3,
            title: 'Технологии',
            content: 'Какие технологии используешь',
            notes: 'Объясни выбор стека простыми словами.',
            status: 'locked'
        },
        {
            id: 4,
            title: 'Демо',
            content: 'Покажи как работает проект',
            notes: 'Подготовь скриншоты или видео.',
            status: 'locked'
        },
        {
            id: 5,
            title: 'Итоги',
            content: 'Что получилось и планы на будущее',
            notes: 'Будь честным. Расскажи о трудностях и выводах.',
            status: 'locked'
        },
    ])

    const completeSlide = (slideId: number) => {
        const updatedSlides = slides.map(s => {
            if (s.id === slideId && s.status === 'current') {
                return { ...s, status: 'completed' as const }
            }
            if (s.id === slideId + 1 && s.status === 'locked') {
                return { ...s, status: 'current' as const }
            }
            return s
        })

        setSlides(updatedSlides)
        alert('✅ Слайд готов! Следующий слайд разблокирован.')
    }

    const exportPDF = () => {
        const completedSlides = slides.filter(s => s.status === 'completed' || s.status === 'current')

        if (completedSlides.length === 0) {
            alert('⚠️ Сначала заполните хотя бы один слайд!')
            return
        }

        // Создаём текстовый контент для PDF
        const content = completedSlides.map(s =>
            `Слайд ${s.id}: ${s.title}\n\nКонтент:\n${s.content}\n\nЗаметки спикера:\n${s.notes}\n\n---\n\n`
        ).join('')

        // Создаём blob и скачиваем
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'presentation.txt'
        a.click()
        URL.revokeObjectURL(url)

        alert('📄 Презентация экспортирована! (Текстовый формат)')
    }

    const exportPPTX = () => {
        const completedSlides = slides.filter(s => s.status === 'completed' || s.status === 'current')

        if (completedSlides.length === 0) {
            alert('⚠️ Сначала заполните хотя бы один слайд!')
            return
        }

        // Создаём Markdown для импорта в другие сервисы
        const markdown = `# Презентация проекта\n\n${completedSlides.map(s =>
            `## ${s.title}\n\n${s.content}\n\n> **Заметки:** ${s.notes}\n\n`
        ).join('---\n\n')}`

        const blob = new Blob([markdown], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'presentation.md'
        a.click()
        URL.revokeObjectURL(url)

        alert('📊 Презентация экспортирована в Markdown! Импортируй в Google Slides или PowerPoint.')
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-6">🎞️ Storyboard</h2>

            <div className="space-y-6">
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`border-2 rounded-lg p-4 md:p-6 transition-all ${slide.status === 'completed' ? 'border-green-500 bg-green-50' :
                                slide.status === 'current' ? 'border-purple-500 bg-purple-50 shadow-lg' :
                                    'border-gray-300 bg-gray-100 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-lg md:text-xl font-bold text-purple-600">
                                Слайд {slide.id}: {slide.title}
                            </h3>
                            {slide.status === 'locked' && (
                                <span className="text-gray-400 text-2xl">🔒</span>
                            )}
                            {slide.status === 'completed' && (
                                <span className="text-green-500 text-2xl">✓</span>
                            )}
                        </div>

                        {(slide.status === 'current' || slide.status === 'completed') && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        📝 Тезисы (на экране):
                                    </label>
                                    <p className="p-3 bg-white rounded border-l-4 border-blue-500">
                                        {slide.content}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        🎤 Speaker Notes (что говорить):
                                    </label>
                                    <p className="p-3 bg-blue-50 rounded text-sm italic border-l-4 border-purple-500">
                                        {slide.notes}
                                    </p>
                                </div>

                                {slide.status === 'current' && (
                                    <button
                                        onClick={() => completeSlide(slide.id)}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                                    >
                                        ✓ Слайд готов
                                    </button>
                                )}
                            </>
                        )}

                        {slide.status === 'locked' && (
                            <p className="text-sm text-gray-500 italic">
                                Заполните предыдущий слайд, чтобы разблокировать этот
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={exportPDF}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                    📄 Export PDF
                </button>
                <button
                    onClick={exportPPTX}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                    📊 Export PPTX
                </button>
            </div>

            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>AI Mode:</strong> Speaker Coach
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    🎤 Презентация должна быть простой. 5-7 слайдов достаточно.
                </p>
            </div>
        </div>
    )
}
