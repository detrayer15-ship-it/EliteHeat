import { useState } from 'react'
import { Project } from '@/types/project'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { projectTemplates, ProjectTemplateId } from '@/config/projectTemplates'

interface ProjectWizardProps {
    onSubmit: (data: Partial<Project> & { templateId?: ProjectTemplateId }) => void
    onCancel: () => void
}

type Step = 1 | 2

const templateList = Object.values(projectTemplates).filter(t => t.id !== 'custom')

export const ProjectWizard = ({ onSubmit, onCancel }: ProjectWizardProps) => {
    const [step, setStep] = useState<Step>(1)
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplateId | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    })

    const currentTemplate = selectedTemplate ? projectTemplates[selectedTemplate] : null

    const handleTemplateSelect = (templateId: ProjectTemplateId) => {
        const template = projectTemplates[templateId]
        setSelectedTemplate(templateId)
        setFormData({
            ...formData,
            description: template.description,
        })
        setStep(2)
    }

    const handleBack = () => {
        if (step > 1) setStep((step - 1) as Step)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const projectData = {
            ...formData,
            problem: '',
            solution: '',
            audience: '',
            templateId: selectedTemplate || 'custom',
            externalUrl: currentTemplate?.url,
        }
        onSubmit(projectData)

        // Open IDE in new tab if URL exists
        if (currentTemplate?.url) {
            window.open(currentTemplate.url, '_blank')
        }
    }

    const isStepValid = () => {
        if (step === 1) return selectedTemplate !== null
        if (step === 2) return formData.title.trim() !== ''
        return false
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-smooth ${step >= s
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 2 && (
                                <div
                                    className={`w-12 h-1 mx-1 transition-smooth ${step > s ? 'bg-primary' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <span className="text-sm text-gray-600">Шаг {step} из 2</span>
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-text mb-2">Выберите онлайн IDE</h3>
                            <p className="text-gray-600 mb-4">Выберите среду разработки для вашего проекта</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templateList.map((template) => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-smooth hover:shadow-lg ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => handleTemplateSelect(template.id)}
                                >
                                    <div className="text-4xl mb-3">{template.icon}</div>
                                    <h4 className="font-semibold text-text mb-2">
                                        {template.title.replace(template.icon, '').trim()}
                                    </h4>
                                    <p className="text-sm text-gray-600">{template.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-text mb-2">Основная информация</h3>
                            <p className="text-gray-600 mb-4">Расскажите о вашем проекте</p>
                        </div>

                        <Input
                            label="Название проекта"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Введите название проекта"
                            required
                        />

                        <Textarea
                            label="Краткое описание"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Опишите суть проекта в нескольких предложениях"
                            rows={4}
                        />

                        <Card className="bg-ai-blue/5 border-ai-blue/20">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <h4 className="font-semibold text-text mb-1">Совет</h4>
                                    <p className="text-sm text-gray-600">
                                        После создания проекта откроется онлайн IDE. Вы сможете сразу начать писать код!
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                <div className="flex gap-3 pt-6">
                    {step > 1 && (
                        <Button type="button" variant="secondary" onClick={handleBack}>
                            ← Назад
                        </Button>
                    )}

                    {step < 2 ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setStep(2)}
                            disabled={!isStepValid()}
                        >
                            Далее →
                        </Button>
                    ) : (
                        <Button type="submit" variant="primary" disabled={!isStepValid()}>
                            ✓ Создать проект
                        </Button>
                    )}

                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    )
}
