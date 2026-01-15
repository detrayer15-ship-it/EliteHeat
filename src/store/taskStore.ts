import { create } from 'zustand'
import { Task } from '@/types/project'
import { storage } from '@/utils/storage'
import { generateId } from '@/utils/uuid'

const STORAGE_KEY = 'eliteheat_tasks'

interface TaskStore {
    tasks: Task[]

    loadTasks: () => void
    createTask: (data: Omit<Task, 'id'>) => Task
    createAITask: (data: Omit<Task, 'id'>) => Task
    updateTask: (id: string, data: Partial<Task>) => void
    deleteTask: (id: string) => void
    toggleTask: (id: string) => void
    getProjectTasks: (projectId: string) => Task[]
    getAITasks: () => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    loadTasks: () => {
        const tasks = storage.get<Task[]>(STORAGE_KEY) || []
        set({ tasks })
    },

    createTask: (data) => {
        const newTask: Task = {
            id: generateId(),
            ...data,
        }

        const tasks = [...get().tasks, newTask]
        storage.set(STORAGE_KEY, tasks)
        set({ tasks })
        return newTask
    },

    updateTask: (id, data) => {
        const tasks = get().tasks.map(t => (t.id === id ? { ...t, ...data } : t))
        storage.set(STORAGE_KEY, tasks)
        set({ tasks })
    },

    deleteTask: (id) => {
        const tasks = get().tasks.filter(t => t.id !== id)
        storage.set(STORAGE_KEY, tasks)
        set({ tasks })
    },

    toggleTask: (id) => {
        const tasks = get().tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        )
        storage.set(STORAGE_KEY, tasks)
        set({ tasks })
    },

    getProjectTasks: (projectId) => {
        return get().tasks.filter(t => t.projectId === projectId)
    },

    createAITask: (data) => {
        const newTask: Task = {
            id: generateId(),
            ...data,
            aiGenerated: true,
        }

        const tasks = [...get().tasks, newTask]
        storage.set(STORAGE_KEY, tasks)
        set({ tasks })
        return newTask
    },

    getAITasks: () => {
        return get().tasks.filter(t => t.aiGenerated === true)
    },
}))
