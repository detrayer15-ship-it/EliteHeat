import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { ProjectCard } from './ProjectCard'

export const ProjectList = () => {
    const navigate = useNavigate()
    const projects = useProjectStore((state) => state.projects)
    const deleteProject = useProjectStore((state) => state.deleteProject)

    const handleDelete = (id: string) => {
        deleteProject(id)
    }

    const handleProjectClick = (projectId: string) => {
        // Navigate to project detail page
        navigate(`/projects/${projectId}`)
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-text mb-2">Нет проектов</h3>
                <p className="text-gray-600">Создайте свой первый проект, чтобы начать</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project.id)}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}
