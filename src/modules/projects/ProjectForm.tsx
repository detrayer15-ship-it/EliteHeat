import { useState } from 'react'
import { Project } from '@/types/project'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ProjectFormProps {
    project?: Project
    onSubmit: (data: Partial<Project>) => void
    onCancel: () => void
}

type ProjectCategory = 'mini' | 'extended' | 'game'

const categories = [
    {
        id: 'mini' as ProjectCategory,
        title: 'Мини-проекты с кастомизацией',
        icon: '🎨',
        description: 'Ученик может выбирать дизайн, тему, названия переменных, оформление вывода',
        examples: 'Анкету можно оформить как "Тетрадь героя", чат-бот можно сделать персонажем',
    },
    {
        id: 'extended' as ProjectCategory,
        title: 'Проекты с расширением',
        icon: '🚀',
        description: 'Основная задача есть, но ученик может добавить свои функции, улучшения или дополнительные проверки',
        examples: 'Программа «Палиндром» + счётчик слов, «Список покупок» + сортировка по категориям',
    },
    {
        id: 'game' as ProjectCategory,
        title: 'Игровые творческие проекты',
        icon: '🎮',
        description: 'Можно сделать игру более интересной: добавить уровни сложности, таймер, очки',
        examples: 'Ученики учатся комбинировать код и идеи, пробовать свои варианты',
    },
]

export const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
    const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null)
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        problem: project?.problem || '',
        solution: project?.solution || '',
        audience: project?.audience || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCategory) {
            alert('Пожалуйста, выберите категорию проекта')
            return
        }
        onSubmit({ ...formData, category: selectedCategory })
    }

    if (!selectedCategory) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-text mb-4">Выберите тип проекта</h3>

                <div className="grid grid-cols-1 gap-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            hover
                            onClick={() => setSelectedCategory(category.id)}
                            className="cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{category.icon}</div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-text mb-2">{category.title}</h4>
                                    <p className="text-sm text-gray-700 mb-2">{category.description}</p>
                                    <p className="text-xs text-gray-500 italic">Пример: {category.examples}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Отмена
                    </Button>
                </div>
            </div>
        )
    }

    const selectedCategoryData = categories.find(c => c.id === selectedCategory)

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-3xl">{selectedCategoryData?.icon}</span>
                <div>
                    <h4 className="font-bold text-text">{selectedCategoryData?.title}</h4>
                    <p className="text-xs text-gray-600">{selectedCategoryData?.description}</p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                >
                    Изменить
                </Button>
            </div>

            <Input
                label="Название проекта"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите название"
                required
            />

            <Textarea
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание проекта"
                rows={3}
            />

            <Textarea
                label="Что будет делать проект?"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="Опишите основную функцию проекта"
                rows={3}
            />

            <Textarea
                label="Варианты кастомизации"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Какие варианты оформления или расширений можно добавить?"
                rows={3}
            />

            <Textarea
                label="Для кого этот проект?"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="Целевая аудитория"
                rows={2}
            />

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                    {project ? 'Сохранить' : 'Создать проект'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    )
}
