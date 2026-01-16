import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/config/firebase'
import type { Project } from '@/types/project'

interface UseProjectDataReturn {
    project: Project | null
    loading: boolean
    error: string | null
    updateProject: (updates: Partial<Project>) => Promise<void>
}

export function useProjectData(projectId: string): UseProjectDataReturn {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const currentUser = auth.currentUser
        if (!projectId || !currentUser) {
            if (!projectId) setError('Project ID is required')
            setLoading(false)
            return
        }

        const projectRef = doc(db, 'projects', projectId)

        const unsubscribe = onSnapshot(
            projectRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setProject({ id: snapshot.id, ...(snapshot.data() as any) } as Project)
                    setError(null)
                } else {
                    setError('Проект не найден')
                }
                setLoading(false)
            },
            (err) => {
                console.error('Error fetching project:', err)
                setError('Ошибка загрузки проекта')
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [projectId])

    const updateProject = async (updates: Partial<Project>) => {
        if (!projectId) return

        try {
            const projectRef = doc(db, 'projects', projectId)
            await updateDoc(projectRef, {
                ...updates,
                updatedAt: new Date().toISOString(),
            })
        } catch (err) {
            console.error('Error updating project:', err)
            throw new Error('Не удалось обновить проект')
        }
    }

    return { project, loading, error, updateProject }
}
