import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export interface ProjectTask {
    id: string
    projectId: string
    tab: 'roadmap' | 'prompts' | 'storyboard' | 'ide'
    title: string
    description: string
    isCompleted: boolean
    completedAt?: string
    evidence?: {
        type: 'code' | 'file' | 'screenshot' | 'text'
        content: string
    }
}

interface ProjectProgressState {
    tasks: Record<string, ProjectTask[]> // projectId -> tasks

    // Actions
    initializeProjectTasks: (projectId: string) => void
    completeTask: (projectId: string, taskId: string, evidence?: any) => Promise<void>
    uncompleteTask: (projectId: string, taskId: string) => void
    getProjectProgress: (projectId: string) => number
    getTabProgress: (projectId: string, tab: string) => number
    syncToFirebase: (projectId: string) => Promise<void>
}

export const useProjectProgress = create<ProjectProgressState>()(
    persist(
        (set, get) => ({
            tasks: {},

            initializeProjectTasks: (projectId: string) => {
                const existingTasks = get().tasks[projectId]
                if (existingTasks && existingTasks.length > 0) return

                const defaultTasks: ProjectTask[] = [
                    // Roadmap tasks
                    {
                        id: 'roadmap-1',
                        projectId,
                        tab: 'roadmap',
                        title: 'Сформировать идею проекта',
                        description: 'Определить проблему, решение и целевую аудиторию',
                        isCompleted: true, // Уже выполнено при создании
                    },
                    {
                        id: 'roadmap-2',
                        projectId,
                        tab: 'roadmap',
                        title: 'Выбрать технологический стек',
                        description: 'Определить frontend, backend и базу данных',
                        isCompleted: true, // Уже выполнено при создании
                    },

                    // Prompts tasks
                    {
                        id: 'prompts-1',
                        projectId,
                        tab: 'prompts',
                        title: 'Сгенерировать промпт для базы данных',
                        description: 'Использовать Database Schema Prompt и получить схему БД',
                        isCompleted: false,
                    },
                    {
                        id: 'prompts-2',
                        projectId,
                        tab: 'prompts',
                        title: 'Сгенерировать промпт для backend',
                        description: 'Использовать Backend API Prompt и получить код API',
                        isCompleted: false,
                    },
                    {
                        id: 'prompts-3',
                        projectId,
                        tab: 'prompts',
                        title: 'Сгенерировать промпт для frontend',
                        description: 'Использовать Frontend Components Prompt и получить компоненты',
                        isCompleted: false,
                    },

                    // IDE tasks
                    {
                        id: 'ide-1',
                        projectId,
                        tab: 'ide',
                        title: 'Создать структуру проекта',
                        description: 'Создать файлы и папки в IDE',
                        isCompleted: false,
                    },
                    {
                        id: 'ide-2',
                        projectId,
                        tab: 'ide',
                        title: 'Написать код компонентов',
                        description: 'Реализовать основные компоненты приложения',
                        isCompleted: false,
                    },
                    {
                        id: 'ide-3',
                        projectId,
                        tab: 'ide',
                        title: 'Протестировать приложение',
                        description: 'Запустить и протестировать основной функционал',
                        isCompleted: false,
                    },

                    // Storyboard tasks
                    {
                        id: 'storyboard-1',
                        projectId,
                        tab: 'storyboard',
                        title: 'Создать слайды презентации',
                        description: 'Заполнить все слайды контентом',
                        isCompleted: false,
                    },
                    {
                        id: 'storyboard-2',
                        projectId,
                        tab: 'storyboard',
                        title: 'Написать заметки спикера',
                        description: 'Подготовить текст для выступления',
                        isCompleted: false,
                    },
                    {
                        id: 'storyboard-3',
                        projectId,
                        tab: 'storyboard',
                        title: 'Отрепетировать презентацию',
                        description: 'Провести репетицию с таймером (7-10 минут)',
                        isCompleted: false,
                    },
                ]

                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [projectId]: defaultTasks,
                    },
                }))
            },

            completeTask: async (projectId: string, taskId: string, evidence?: any) => {
                set((state) => {
                    const projectTasks = state.tasks[projectId] || []
                    const updatedTasks = projectTasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                isCompleted: true,
                                completedAt: new Date().toISOString(),
                                evidence,
                            }
                            : task
                    )

                    return {
                        tasks: {
                            ...state.tasks,
                            [projectId]: updatedTasks,
                        },
                    }
                })

                // Sync to Firebase
                await get().syncToFirebase(projectId)
            },

            uncompleteTask: (projectId: string, taskId: string) => {
                set((state) => {
                    const projectTasks = state.tasks[projectId] || []
                    const updatedTasks = projectTasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                isCompleted: false,
                                completedAt: undefined,
                                evidence: undefined,
                            }
                            : task
                    )

                    return {
                        tasks: {
                            ...state.tasks,
                            [projectId]: updatedTasks,
                        },
                    }
                })
            },

            getProjectProgress: (projectId: string) => {
                const projectTasks = get().tasks[projectId] || []
                if (projectTasks.length === 0) return 0

                const completed = projectTasks.filter((t) => t.isCompleted).length
                return Math.round((completed / projectTasks.length) * 100)
            },

            getTabProgress: (projectId: string, tab: string) => {
                const projectTasks = get().tasks[projectId] || []
                const tabTasks = projectTasks.filter((t) => t.tab === tab)

                if (tabTasks.length === 0) return 0

                const completed = tabTasks.filter((t) => t.isCompleted).length
                return Math.round((completed / tabTasks.length) * 100)
            },

            syncToFirebase: async (projectId: string) => {
                try {
                    const projectTasks = get().tasks[projectId] || []
                    const progress = get().getProjectProgress(projectId)

                    const projectRef = doc(db, 'projects', projectId)
                    await updateDoc(projectRef, {
                        progress,
                        tasks: projectTasks,
                        updatedAt: new Date().toISOString(),
                    })
                } catch (error) {
                    console.error('Error syncing to Firebase:', error)
                }
            },
        }),
        {
            name: 'project-progress-storage',
        }
    )
)
