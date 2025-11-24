import { useState } from 'react'
import { Assignment } from '@/types/assignment'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface AssignmentFormProps {
    projectId: string
    onSubmit: (data: Partial<Assignment>) => void
    onCancel: () => void
    initialData?: Assignment
}

const iconOptions = ['📝', '📊', '🎯', '💡', '🔬', '🎨', '📐', '✏️']

export const AssignmentForm = ({ projectId, onSubmit, onCancel, initialData }: AssignmentFormProps) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '📝',
        category: initialData?.category || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            projectId,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text mb-2">Иконка</label>
                <div className="flex gap-2">
                    {iconOptions.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon })}
                            className={`w-12 h-12 text-2xl rounded-lg border-2 transition-smooth ${formData.icon === icon
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <Input
                label="Название задания"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите название задания"
                required
            />

            <Textarea
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите задание подробно"
                rows={4}
                required
            />

            <Input
                label="Категория (необязательно)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Например: Исследование, Разработка"
            />

            <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary">
                    {initialData ? 'Сохранить' : 'Создать задание'}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    )
}
