import { useState, useEffect } from 'react'
import { db } from '@/config/firebase'
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    orderBy,
    doc,
    getDoc,
    Unsubscribe
} from 'firebase/firestore'

export interface TeacherGroup {
    id: string
    name?: string
    direction: 'web' | 'roblox' | 'python' | string
    teacherId: string
    students: string[]
    schedule?: string
    createdAt?: any
}

export interface TeacherStudent {
    id: string
    name: string
    email: string
    direction?: string
    progress?: number
    completedTasks?: number
    lastActiveAt?: any
    isPresent?: boolean
    groupId?: string
    groupName?: string
    submissionsCount?: number
    missedLessons?: number
}

interface TeacherDataState {
    groups: TeacherGroup[]
    students: TeacherStudent[]
    attendanceLogs: any[]
    totalStudents: number
    averageProgress: number
    problematicStudents: TeacherStudent[]  // low progress or missed lessons
    isLoading: boolean
    error: string | null
    refetch: () => void
}

export const useTeacherData = (teacherId: string | undefined): TeacherDataState => {
    const [groups, setGroups] = useState<TeacherGroup[]>([])
    const [students, setStudents] = useState<TeacherStudent[]>([])
    const [attendanceLogs, setAttendanceLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    const refetch = () => setRefreshKey(k => k + 1)

    useEffect(() => {
        if (!teacherId) {
            setIsLoading(false)
            return
        }

        let unsubGroups: Unsubscribe | null = null

        const load = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // ── 1. Realtime listener on teacher's groups ──────────────────
                const groupsQ = query(
                    collection(db, 'groups'),
                    where('teacherId', '==', teacherId)
                )

                unsubGroups = onSnapshot(groupsQ, async (groupSnap) => {
                    const fetchedGroups = groupSnap.docs.map(d => ({
                        id: d.id,
                        ...d.data()
                    })) as TeacherGroup[]

                    setGroups(fetchedGroups)

                    // ── 2. Collect all student IDs from all groups ─────────────
                    const allStudentIds = Array.from(
                        new Set(fetchedGroups.flatMap(g => g.students || []))
                    )

                    if (allStudentIds.length === 0) {
                        setStudents([])
                        setIsLoading(false)
                        return
                    }

                    // ── 3. Load students in batches of 10 (Firestore "in" limit) ──
                    const BATCH = 10
                    const batches: Promise<TeacherStudent[]>[] = []

                    for (let i = 0; i < allStudentIds.length; i += BATCH) {
                        const chunk = allStudentIds.slice(i, i + BATCH)
                        const batchQ = query(
                            collection(db, 'users'),
                            where('__name__', 'in', chunk)
                        )
                        batches.push(
                            getDocs(batchQ).then(snap =>
                                snap.docs.map(d => {
                                    // find which group this student belongs to
                                    const group = fetchedGroups.find(g => g.students.includes(d.id))
                                    return {
                                        id: d.id,
                                        ...d.data(),
                                        groupId: group?.id,
                                        groupName: group?.name || group?.direction,
                                        isPresent: false,
                                        missedLessons: 0
                                    } as TeacherStudent
                                })
                            )
                        )
                    }

                    const results = await Promise.all(batches)
                    const allStudents = results.flat()
                    setStudents(allStudents)
                    setIsLoading(false)
                }, (err) => {
                    console.error('Groups listener error', err)
                    setError('Ошибка загрузки групп')
                    setIsLoading(false)
                })

                // ── 4. Recent attendance logs for this teacher ─────────────────
                try {
                    const logsQ = query(
                        collection(db, 'attendance_logs'),
                        where('teacherId', '==', teacherId),
                        orderBy('timestamp', 'desc')
                    )
                    const logsSnap = await getDocs(logsQ)
                    setAttendanceLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })))
                } catch {
                    // Ignore if index not set up; non-critical
                }

            } catch (err: any) {
                console.error('useTeacherData error', err)
                setError(err.message || 'Ошибка загрузки данных')
                setIsLoading(false)
            }
        }

        load()

        return () => {
            if (unsubGroups) unsubGroups()
        }
    }, [teacherId, refreshKey])

    const averageProgress =
        students.length > 0
            ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length)
            : 0

    const problematicStudents = students.filter(
        s => (s.progress || 0) < 30 || (s.missedLessons || 0) >= 2
    )

    return {
        groups,
        students,
        attendanceLogs,
        totalStudents: students.length,
        averageProgress,
        problematicStudents,
        isLoading,
        error,
        refetch
    }
}
