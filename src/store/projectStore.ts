import { create } from 'zustand'
import { Project } from '@/types/project'
import { storage } from '@/utils/storage'
import { generateId } from '@/utils/uuid'
import { calculateProgress } from '@/utils/progress'
import { getTemplateById, ProjectTemplateId } from '@/config/projectTemplates'

const STORAGE_KEY = 'eliteheat_projects'

interface ProjectStore {
    projects: Project[]
    currentProject: Project | null

    loadProjects: () => void
    createProject: (data: Partial<Project> & { templateId?: ProjectTemplateId }) => Project
    updateProject: (id: string, data: Partial<Project>) => void
    deleteProject: (id: string) => void
    setCurrentProject: (id: string | null) => void
    updateProgress: (id: string) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    currentProject: null,

    loadProjects: () => {
        const projects = storage.get<Project[]>(STORAGE_KEY) || []
        set({ projects })
    },

    createProject: (data) => {
        const templateId = data.templateId || 'custom'
        const template = getTemplateById(templateId)

        const newProject: Project = {
            id: generateId(),
            title: data.title || 'Новый проект',
            description: data.description || '',
            problem: data.problem || '',
            solution: data.solution || '',
            audience: data.audience || '',
            presentation: { slides: [] },
            tasks: [],
            progress: 0,
            stage: 'idea',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        const initialTasks = template.tasks.map(taskTemplate => ({
            ...taskTemplate,
            id: generateId(),
            projectId: newProject.id,
        }))

        newProject.tasks = initialTasks

        const projects = [...get().projects, newProject]
        storage.set(STORAGE_KEY, projects)

        const allTasks = storage.get<any[]>('eliteheat_tasks') || []
        storage.set('eliteheat_tasks', [...allTasks, ...initialTasks])

        set({ projects })
        return newProject
    },

    updateProject: (id, data) => {
        const projects = get().projects.map(p =>
            p.id === id
                ? { ...p, ...data, updatedAt: new Date().toISOString() }
                : p
        )
        storage.set(STORAGE_KEY, projects)
        set({ projects })

        if (get().currentProject?.id === id) {
            set({ currentProject: projects.find(p => p.id === id) || null })
        }
    },

    deleteProject: (id) => {
        const projects = get().projects.filter(p => p.id !== id)
        storage.set(STORAGE_KEY, projects)
        set({ projects })

        if (get().currentProject?.id === id) {
            set({ currentProject: null })
        }
    },

    setCurrentProject: (id) => {
        const project = id ? get().projects.find(p => p.id === id) || null : null
        set({ currentProject: project })
    },

    updateProgress: (id) => {
        const project = get().projects.find(p => p.id === id)
        if (project) {
            const progress = calculateProgress(project.tasks)
            get().updateProject(id, { progress })
        }
    },
}))
