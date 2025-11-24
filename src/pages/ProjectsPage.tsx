import { useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { ProjectList } from '@/modules/projects/ProjectList'
import { ProjectWizard } from '@/modules/projects/ProjectWizard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export const ProjectsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const createProject = useProjectStore((state) => state.createProject)

    const handleCreate = (data: any) => {
        createProject(data)
        setIsModalOpen(false)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-text">Мои проекты</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Создать проект
                </Button>
            </div>

            <ProjectList />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Создание нового проекта"
            >
                <ProjectWizard
                    onSubmit={handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    )
}
