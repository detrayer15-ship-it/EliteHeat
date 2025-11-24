import { useState } from 'react'
import { Task } from '@/types/project'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface TaskFormProps {
    projectId: string
    onSubmit: (data: Omit<Task, 'id'>) => void
    onCancel: () => void
}

export const TaskForm = ({ projectId, onSubmit, onCancel }: TaskFormProps) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        deadline: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title: formData.title,
            category: formData.category || undefined,
            deadline: formData.deadline || undefined,
            completed: false,
            projectId,
        })
        setFormData({ title: '', category: '', deadline: '' })
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Название задачи"
                required
                className="flex-1"
            />
            <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Категория"
                className="w-32"
            />
            <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-40"
            />
            <Button type="submit" size="md">Добавить</Button>
            {onCancel && (
                <Button type="button" variant="ghost" size="md" onClick={onCancel}>
                    Отмена
                </Button>
            )}
        </form>
    )
}
