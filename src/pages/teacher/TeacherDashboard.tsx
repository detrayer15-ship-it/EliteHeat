import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { db } from '@/config/firebase'
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc } from 'firebase/firestore'
import {
    Users, BookOpen, Award, ClipboardCheck,
    Calendar, BarChart3, Activity, CheckCircle2,
    ChevronRight, Flame, Star, Clock, Target,
    AlertTriangle, TrendingUp, RefreshCw, UserCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/Toast'
import { useTeacherData, TeacherStudent } from '@/hooks/useTeacherData'

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />
)

const CardSkeleton = () => (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <Skeleton className="h-10 w-10 rounded-2xl mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-24" />
    </div>
)

// ─── Direction badge ──────────────────────────────────────────────────────────
const directionColor: Record<string, string> = {
    web: 'bg-amber-50 text-amber-700 border-amber-200',
    roblox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    python: 'bg-blue-50 text-blue-700 border-blue-200',
}

const DIRECTION_COLOR: Record<string, string> = {
    web: 'bg-amber-500', roblox: 'bg-emerald-500', python: 'bg-indigo-500', other: 'bg-slate-400'
}

const today = new Date()
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']

// ─── Component ────────────────────────────────────────────────────────────────
export const TeacherDashboard = () => {
    const navigate = useNavigate()
    const { success, error: showError } = useToast()
    const currentUser = useAuthStore((state) => state.user)

    // Today's real lessons from Firestore
    const [todayLessons, setTodayLessons] = useState<{ id: string; startTime: string; groupName: string; direction: string }[]>([])
    const [sessionTime, setSessionTime] = useState({ start: '14:00', end: '16:00' })

    useEffect(() => {
        if (!currentUser?.id) return
        const todayDow = today.getDay() === 0 ? 6 : today.getDay() - 1 // Mon=0
        const q = query(collection(db, 'lessons'), where('teacherId', '==', currentUser.id), where('day', '==', todayDow))
        const unsub = onSnapshot(q, snap => {
            const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
            setTodayLessons(items.sort((a, b) => a.startTime.localeCompare(b.startTime)))
        })

        // Fetch global session time
        const sessionRef = doc(db, 'site_settings', 'session')
        const unsubSession = onSnapshot(sessionRef, (snap: any) => {
            if (snap.exists()) {
                const data = snap.data()
                setSessionTime({ start: data.startTime || '14:00', end: data.endTime || '16:00' })
            }
        })

        return () => { unsub(); unsubSession() }
    }, [currentUser?.id])

    const { groups, students, totalStudents, averageProgress, problematicStudents, isLoading, error, refetch } =
        useTeacherData(currentUser?.id)

    const [presentIds, setPresentIds] = useState<Set<string>>(new Set())
    const [savingAttendance, setSavingAttendance] = useState(false)

    // Role guard
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer' && currentUser?.role !== 'teacher') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-bold text-lg">Доступ запрещён</p>
            </div>
        )
    }

    const togglePresent = (id: string) => {
        setPresentIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const saveAttendance = async () => {
        setSavingAttendance(true)
        try {
            await addDoc(collection(db, 'attendance_logs'), {
                teacherId: currentUser?.id,
                teacherName: currentUser?.name,
                timestamp: serverTimestamp(),
                presentCount: presentIds.size,
                studentIds: Array.from(presentIds),
                type: 'dashboard_entry',
            })
            success('Сохранено', `Присутствует ${presentIds.size} из ${students.length} учеников`)
        } catch {
            showError('Ошибка', 'Не удалось сохранить посещаемость')
        } finally {
            setSavingAttendance(false)
        }
    }

    const displayStudents: TeacherStudent[] = students.length > 0
        ? students
        : isLoading ? [] : []

    const firstName = currentUser?.name?.split(' ')[0] || 'Учитель'

    return (
        <div className="min-h-full bg-slate-50/50 py-8 px-2">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── TOP BAR ─────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            {today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Привет, <span className="text-indigo-600">{firstName} 👋</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Refresh */}
                        <button
                            onClick={refetch}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                            title="Обновить данные"
                        >
                            <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Quick stat chips */}
                        {[
                            { label: 'Групп', value: isLoading ? '—' : groups.length.toString(), color: 'text-purple-600' },
                            { label: 'Учеников', value: isLoading ? '—' : (students.length || '24').toString(), color: 'text-indigo-600' },
                            { label: 'Средний %', value: isLoading ? '—' : `${averageProgress}%`, color: 'text-emerald-600' },
                        ].map((chip) => (
                            <div key={chip.label} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                                <div className={`text-xl font-black ${chip.color}`}>{chip.value}</div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{chip.label}</div>
                            </div>
                        ))}
                        
                        {/* Session Time Interval */}
                        <div className="bg-white px-5 py-3 rounded-2xl border border-indigo-100 shadow-sm text-center">
                            <div className="text-xl font-black text-indigo-600 tabular-nums">
                                {sessionTime.start}—{sessionTime.end}
                            </div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Текущая сессия</div>
                        </div>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-4 flex items-center gap-3 text-red-700 text-sm font-medium">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        {error} — <button onClick={refetch} className="underline font-bold">Попробовать снова</button>
                    </div>
                )}

                {/* ── MAIN GRID ───────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ══ LEFT 2/3 ══ */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* ─── ATTENDANCE ─── */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Журнал присутствия</h2>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        Кликните по имени → отметить присутствующего
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-500">
                                        <span className="text-indigo-700 text-xl font-black">{presentIds.size}</span>
                                        <span className="text-slate-300"> / {students.length || 24}</span>
                                    </span>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={saveAttendance}
                                        disabled={savingAttendance}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 disabled:opacity-60 transition-all"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        {savingAttendance ? 'Сохранение...' : 'Сохранить'}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="px-8 pb-4">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: students.length > 0 ? `${(presentIds.size / students.length) * 100}%` : '0%' }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Student chips */}
                            <div className="px-8 pb-8">
                                {isLoading ? (
                                    <div className="flex flex-wrap gap-2">
                                        {[...Array(12)].map((_, i) => (
                                            <Skeleton key={i} className="h-10 w-28" />
                                        ))}
                                    </div>
                                ) : displayStudents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                                        <Users className="w-10 h-10 text-slate-200" />
                                        <p className="text-sm text-slate-400 font-medium">Ученики не найдены</p>
                                        <p className="text-xs text-slate-300 max-w-xs">
                                            Создайте группу в разделе «Группы» и добавьте учеников — они появятся здесь.
                                        </p>
                                        <button onClick={() => navigate('/teacher/groups')}
                                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest mt-1">
                                            Перейти к группам
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <AnimatePresence>
                                            {displayStudents.map(student => {
                                                const isHere = presentIds.has(student.id)
                                                return (
                                                    <motion.button
                                                        key={student.id}
                                                        layout
                                                        onClick={() => togglePresent(student.id)}
                                                        whileHover={{ scale: 1.04 }}
                                                        whileTap={{ scale: 0.96 }}
                                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                                                            isHere
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                                                        }`}
                                                    >
                                                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black ${isHere ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                                                            {student.name.charAt(0)}
                                                        </span>
                                                        {student.name.split(' ')[0]}
                                                        {isHere && <CheckCircle2 className="w-3 h-3" />}
                                                    </motion.button>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ─── MY GROUPS ─── */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-500" /> Мои группы
                                </h2>
                                <button onClick={() => navigate('/teacher/groups')}
                                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                                    Все <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28" />)}
                                </div>
                            ) : groups.length === 0 ? (
                                <div className="text-center py-8 text-slate-300 text-sm font-medium">
                                    Нет групп — создайте первую в разделе «Группы»
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {groups.map(group => (
                                        <div key={group.id}
                                            className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => navigate('/teacher/groups')}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${directionColor[group.direction] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                    {group.direction}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">{group.students.length} уч.</span>
                                            </div>
                                            <div className="text-sm font-black text-slate-900 truncate">
                                                {group.name || `Группа — ${group.direction}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ─── STUDENT TABLE ─── */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Ученики
                                </h2>
                                <button onClick={() => navigate('/teacher/monitoring')}
                                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
                                    Полный список <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ученик</th>
                                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Группа</th>
                                            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Прогресс</th>
                                            <th className="px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Задания</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            [...Array(4)].map((_, i) => (
                                                <tr key={i} className="border-b border-slate-50">
                                                    <td className="px-8 py-4"><Skeleton className="h-5 w-36" /></td>
                                                    <td className="px-4 py-4"><Skeleton className="h-5 w-20" /></td>
                                                    <td className="px-4 py-4"><Skeleton className="h-5 w-32" /></td>
                                                    <td className="px-8 py-4"><Skeleton className="h-5 w-8 ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : displayStudents.slice(0, 6).map(student => (
                                            <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-black">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{student.name}</div>
                                                            <div className="text-[9px] text-slate-400 font-bold truncate max-w-[140px]">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${directionColor[student.groupName || ''] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                        {student.groupName || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${(student.progress || 0) >= 70 ? 'bg-emerald-500' : (student.progress || 0) >= 40 ? 'bg-indigo-500' : 'bg-red-400'}`}
                                                                style={{ width: `${student.progress || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500">{student.progress || 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <span className="text-sm font-black text-slate-900">{student.completedTasks || 0}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {!isLoading && displayStudents.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-slate-300 text-sm font-medium">
                                                    Нет данных. Добавьте учеников в группы.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT 1/3 ══ */}
                    <div className="space-y-8">

                        {/* ─── PROBLEMATIC STUDENTS ─── */}
                        {(problematicStudents.length > 0 || (!isLoading && students.length > 0)) && (
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mb-5">
                                    <AlertTriangle className="w-5 h-5 text-red-400" /> Внимание
                                </h2>
                                {isLoading ? (
                                    <div className="space-y-2">
                                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}
                                    </div>
                                ) : problematicStudents.length === 0 ? (
                                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-300" />
                                        <p className="text-sm text-slate-400 font-medium">Всё в порядке!</p>
                                        <p className="text-xs text-slate-300">Проблемных учеников нет</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {problematicStudents.slice(0, 5).map(s => (
                                            <div key={s.id}
                                                className="flex items-center gap-3 p-3.5 bg-red-50/50 border border-red-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-xs font-black flex-shrink-0">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-black text-slate-800 truncate">{s.name}</div>
                                                    <div className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                                                        {(s.progress || 0) < 30 ? 'Низкий прогресс' : 'Пропуски'}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-black text-red-400">{s.progress || 0}%</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── TODAY'S SCHEDULE ─── */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Сегодня</h2>
                                <button onClick={() => navigate('/teacher/schedule')}
                                    className="text-xs font-bold text-indigo-600 uppercase tracking-widest">→</button>
                            </div>
                            <div className="space-y-2.5">
                                {todayLessons.length === 0 ? (
                                    <div className="flex flex-col items-center py-6 gap-2 text-center">
                                        <Calendar className="w-8 h-8 text-slate-200" />
                                        <p className="text-xs text-slate-400 font-medium">Сегодня занятий нет</p>
                                        <button onClick={() => navigate('/teacher/schedule')}
                                            className="text-xs text-indigo-600 font-bold underline">Добавить в расписании</button>
                                    </div>
                                ) : todayLessons.map((lesson) => {
                                    const nowMin = today.getHours() * 60 + today.getMinutes()
                                    const [lh, lm] = lesson.startTime.split(':').map(Number)
                                    const done = nowMin > lh * 60 + lm + 60
                                    const color = DIRECTION_COLOR[lesson.direction] || 'bg-slate-400'
                                    return (
                                        <div key={lesson.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${done ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'}`}>
                                            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${color}`} />
                                            <div className="w-12 text-sm font-black text-slate-400 tabular-nums">{lesson.startTime}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-black ${done ? 'line-through text-slate-400' : 'text-slate-900'} truncate`}>
                                                    {lesson.groupName}
                                                </div>
                                            </div>
                                            {done && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ─── WEEK MINI-CAL ─── */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-5 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" /> Неделя
                            </h2>
                            <div className="grid grid-cols-5 gap-2">
                                {weekDays.map((d, i) => {
                                    const isToday = i === (today.getDay() - 1)
                                    const dayDate = today.getDate() - (today.getDay() - 1) + i
                                    return (
                                        <div key={d} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${isToday ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-white/70' : 'text-slate-400'}`}>{d}</span>
                                            <span className={`text-base font-black mt-1 ${isToday ? 'text-white' : 'text-slate-700'}`}>{dayDate}</span>
                                            {i < 4 && <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isToday ? 'bg-white' : 'bg-indigo-300'}`} />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ─── QUICK LINKS ─── */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100">
                            <h2 className="text-sm font-black text-white/60 uppercase tracking-widest mb-5">Быстрый доступ</h2>
                            <div className="space-y-3">
                                {[
                                    { label: 'Группы', sub: isLoading ? '...' : `${groups.length} активных`, icon: <Users className="w-4 h-4" />, nav: '/teacher/groups' },
                                    { label: 'Мониторинг', sub: 'Полный список учеников', icon: <Activity className="w-4 h-4" />, nav: '/teacher/monitoring' },
                                    { label: 'Проверка работ', sub: 'Задания учеников', icon: <ClipboardCheck className="w-4 h-4" />, nav: '/admin/enhanced-review' },
                                ].map((link, i) => (
                                    <button key={i} onClick={() => navigate(link.nav)}
                                        className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left group">
                                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition-all flex-shrink-0">
                                            {link.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-white truncate">{link.label}</div>
                                            <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{link.sub}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-all flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
