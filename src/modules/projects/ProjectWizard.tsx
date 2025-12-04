import { Project } from '@/types/project'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { projectTemplates, ProjectTemplateId } from '@/config/projectTemplates'

interface ProjectWizardProps {
    onSubmit: (data: Partial<Project> & { templateId?: ProjectTemplateId }) => void
    onCancel: () => void
}

const templateList = Object.values(projectTemplates).filter(t => t.id !== 'custom')

export const ProjectWizard = ({ onSubmit, onCancel }: ProjectWizardProps) => {
    const handleTemplateSelect = (templateId: ProjectTemplateId) => {
        const template = projectTemplates[templateId]

        // Create project immediately with default title
        const projectData = {
            title: template.title,
            description: template.description,
            problem: '',
            solution: '',
            audience: '',
            templateId: templateId,
            externalUrl: template.url,
        }

        onSubmit(projectData)

        // Open IDE in new tab if URL exists
        if (template.url) {
            window.open(template.url, '_blank')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-text mb-2">Выберите онлайн IDE</h3>
                <p className="text-gray-600 mb-4">Выберите среду разработки для вашего проекта</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateList.map((template) => (
                    <Card
                        key={template.id}
                        className="cursor-pointer hover:border-primary hover:shadow-md transition-smooth"
                        onClick={() => handleTemplateSelect(template.id)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{template.icon}</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-text mb-1">
                                    {template.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {template.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="secondary" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </div>
    )
}
