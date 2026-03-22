import { useAuthStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Plus, Trash2, Check, X, Users, Settings2, Zap, AlertTriangle, ChevronRight } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { db } from '@/config/firebase'
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    onSnapshot,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS_RU = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
const CELL_HEIGHT = 64
const NUM_COLS = 8

const DIRECTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    web:    { bg: 'bg-amber-500',   text: 'text-white', border: 'border-amber-600' },
    roblox: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
    python: { bg: 'bg-indigo-500',  text: 'text-white', border: 'border-indigo-600' },
    other:  { bg: 'bg-slate-500',   text: 'text-white', border: 'border-slate-600' },
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface AvailabilitySlot { day: string; start: string; end: string }
interface TeacherGroup {
    id: string; name: string; direction: string; teacherId: string; students: string[]
    schedule?: { day: string; time: string; duration: number }
}
interface ScheduledLesson {
    id: string; groupId: string; groupName: string; direction: string
    day: number; startTime: string; duration: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const getRowFromTime = (t: string) => { const [h] = t.split(':').map(Number); return h - 9 }
const timeToMinutes = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

const hasConflict = (lessons: ScheduledLesson[], incoming: { day: number; startTime: string; duration: number; id?: string }) => {
    const inStart = timeToMinutes(incoming.startTime)
    const inEnd = inStart + incoming.duration
    return lessons.some(l => {
        if (incoming.id && l.id === incoming.id) return false
        if (l.day !== incoming.day) return false
        const lStart = timeToMinutes(l.startTime)
        const lEnd = lStart + l.duration
        return inStart < lEnd && inEnd > lStart
    })
}

const isWithinAvailability = (avail: AvailabilitySlot[], dayIdx: number, time: string, duration: number) => {
    if (avail.length === 0) return true // no restriction set
    const dayEn = DAYS_EN[dayIdx]
    const slot = avail.find(a => a.day === dayEn)
    if (!slot) return false
    const start = timeToMinutes(time)
    const end = start + duration
    return start >= timeToMinutes(slot.start) && end <= timeToMinutes(slot.end)
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Sk = ({ className = '' }) => <div className={`animate-pulse bg-slate-100 rounded-2xl ${className}`} />

// ── Main Component ────────────────────────────────────────────────────────────
export const TeacherSchedulePage = () => {
    const user = useAuthStore(s => s.user)
    const { success, error } = useToast()

    // Tab state
    const [tab, setTab] = useState<'schedule' | 'availability' | 'groups'>('schedule')

    // Data
    const [groups, setGroups] = useState<TeacherGroup[]>([])
    const [lessons, setLessons] = useState<ScheduledLesson[]>([])
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
    const [loading, setLoading] = useState(true)

    // UI state
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState<ScheduledLesson | null>(null)
    const [saving, setSaving] = useState(false)

    // Add lesson form
    const [form, setForm] = useState({ groupId: '', day: 0, startTime: '17:00', duration: 60 })

    // Availability form
    const [availForm, setAvailForm] = useState<AvailabilitySlot[]>(
        DAYS_EN.slice(0, 5).map(d => ({ day: d, start: '16:00', end: '20:00' }))
    )
    const [availEnabled, setAvailEnabled] = useState<Set<string>>(new Set())

    // Group schedule assignment
    const [editingGroup, setEditingGroup] = useState<TeacherGroup | null>(null)
    const [groupScheduleForm, setGroupScheduleForm] = useState({ day: 'Monday', time: '17:00', duration: 60 })

    // Drag state
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dragGhost, setDragGhost] = useState<{ x: number; y: number } | null>(null)
    const [dropTarget, setDropTarget] = useState<{ day: number; row: number } | null>(null)
    const gridRef = useRef<HTMLDivElement>(null)

    // ── Load data ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user?.id) return
        setLoading(true)

        // Groups
        const groupsQ = query(collection(db, 'groups'), where('teacherId', '==', user.id))
        const unsubGroups = onSnapshot(groupsQ, snap => {
            setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })) as TeacherGroup[])
        })

        // Teacher's lessons (from `lessons` collection)
        const lessonsQ = query(collection(db, 'lessons'), where('teacherId', '==', user.id))
        const unsubLessons = onSnapshot(lessonsQ, snap => {
            setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() })) as ScheduledLesson[])
            setLoading(false)
        })

        // Availability
        const availRef = doc(db, 'teacher_availability', user.id)
        const unsubAvail = onSnapshot(availRef, snap => {
            if (snap.exists()) {
                const data = snap.data()
                setAvailability(data.days || [])
                setAvailEnabled(new Set((data.days as AvailabilitySlot[]).map(d => d.day)))
            }
        })

        return () => { unsubGroups(); unsubLessons(); unsubAvail() }
    }, [user?.id])

    // ── Add lesson ─────────────────────────────────────────────────────────────
    const handleAddLesson = async () => {
        if (!form.groupId) { error('Ошибка', 'Выберите группу'); return }

        const group = groups.find(g => g.id === form.groupId)
        if (!group) return

        const incoming = { day: form.day, startTime: form.startTime, duration: form.duration }

        if (hasConflict(lessons, incoming)) {
            error('Конфликт', 'В это время уже есть другое занятие')
            return
        }

        if (!isWithinAvailability(availability, form.day, form.startTime, form.duration)) {
            error('Недоступно', `Вы не указали доступность в ${DAYS_RU[form.day]} в это время`)
            return
        }

        setSaving(true)
        try {
            await addDoc(collection(db, 'lessons'), {
                teacherId: user!.id,
                groupId: form.groupId,
                groupName: group.name || group.direction,
                direction: group.direction,
                day: form.day,
                startTime: form.startTime,
                duration: form.duration,
                status: 'scheduled',
                createdAt: serverTimestamp(),
            })

            // Also auto-generate dated lessons for next 4 weeks
            const today = new Date()
            const currentDow = today.getDay() === 0 ? 6 : today.getDay() - 1 // Mon=0
            for (let week = 0; week < 4; week++) {
                const daysUntil = ((form.day - currentDow) + 7) % 7 + week * 7
                const lessonDate = new Date(today)
                lessonDate.setDate(today.getDate() + daysUntil)
                const dateStr = lessonDate.toISOString().split('T')[0]
                await addDoc(collection(db, 'scheduled_lessons'), {
                    teacherId: user!.id,
                    groupId: form.groupId,
                    groupName: group.name || group.direction,
                    direction: group.direction,
                    date: dateStr,
                    startTime: form.startTime,
                    endTime: `${String(parseInt(form.startTime) + Math.floor(form.duration / 60)).padStart(2, '0')}:00`,
                    status: 'scheduled',
                })
            }

            setShowAddForm(false)
            setForm({ groupId: '', day: 0, startTime: '17:00', duration: 60 })
            success('Добавлено', `${DAYS_RU[form.day]}, ${form.startTime} — занятие запланировано на 4 недели`)
        } catch (e) {
            console.error(e)
            error('Ошибка', 'Не удалось сохранить')
        } finally { setSaving(false) }
    }

    // ── Delete lesson ──────────────────────────────────────────────────────────
    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'lessons', id))
            setSelectedLesson(null)
            success('Удалено', 'Занятие удалено из расписания')
        } catch { error('Ошибка', 'Не удалось удалить') }
    }

    // ── Save availability ──────────────────────────────────────────────────────
    const saveAvailability = async () => {
        if (!user?.id) return
        setSaving(true)
        const enabledSlots = availForm.filter(s => availEnabled.has(s.day))
        try {
            await setDoc(doc(db, 'teacher_availability', user.id), {
                teacherId: user.id,
                days: enabledSlots,
                updatedAt: serverTimestamp()
            })
            success('Сохранено', `Доступность настроена на ${enabledSlots.length} дней`)
        } catch { error('Ошибка', 'Не удалось сохранить') }
        finally { setSaving(false) }
    }

    // ── Assign schedule to group ───────────────────────────────────────────────
    const saveGroupSchedule = async () => {
        if (!editingGroup) return
        setSaving(true)
        try {
            await updateDoc(doc(db, 'groups', editingGroup.id), {
                schedule: groupScheduleForm
            })
            setEditingGroup(null)
            success('Назначено', `${editingGroup.name || editingGroup.direction}: ${DAYS_RU[DAYS_EN.indexOf(groupScheduleForm.day)]}, ${groupScheduleForm.time}`)
        } catch { error('Ошибка', 'Не удалось сохранить') }
        finally { setSaving(false) }
    }

    // ── Drag & Drop ────────────────────────────────────────────────────────────
    const getCellFromPoint = useCallback((cx: number, cy: number) => {
        if (!gridRef.current) return null
        const rect = gridRef.current.getBoundingClientRect()
        const col = Math.floor(((cx - rect.left) / rect.width) * NUM_COLS)
        const row = Math.floor((cy - rect.top) / CELL_HEIGHT)
        if (col < 1 || col > 7 || row < 0 || row >= HOURS.length) return null
        return { day: col - 1, row }
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingId) return
        setDragGhost({ x: e.clientX, y: e.clientY })
        setDropTarget(getCellFromPoint(e.clientX, e.clientY))
    }, [draggingId, getCellFromPoint])

    const handleMouseUp = useCallback(async () => {
        if (!draggingId || !dropTarget) { setDraggingId(null); setDragGhost(null); setDropTarget(null); return }
        const lesson = lessons.find(l => l.id === draggingId)
        if (!lesson) { setDraggingId(null); setDragGhost(null); setDropTarget(null); return }

        const newTime = `${String(dropTarget.row + 9).padStart(2, '0')}:00`
        const conflict = hasConflict(lessons, { day: dropTarget.day, startTime: newTime, duration: lesson.duration, id: draggingId })
        if (conflict) { error('Конфликт', 'В это время уже есть занятие'); }
        else {
            await updateDoc(doc(db, 'lessons', draggingId), { day: dropTarget.day, startTime: newTime })
            success('Перемещено', `${DAYS_RU[dropTarget.day]}, ${newTime}`)
        }
        setDraggingId(null); setDragGhost(null); setDropTarget(null)
    }, [draggingId, dropTarget, lessons])

    useEffect(() => {
        if (draggingId) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
        }
    }, [draggingId, handleMouseMove, handleMouseUp])

    const draggingLesson = lessons.find(l => l.id === draggingId)

    const todayLessons = lessons.filter(l => l.day === ((new Date().getDay() || 7) - 1))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 select-none">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Расписание</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
                                <span className="text-slate-200 mx-1">·</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{groups.length} групп · {lessons.length} занятий</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's quick view */}
                    <div className="flex flex-wrap gap-2">
                        {todayLessons.length === 0 ? (
                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Сегодня занятий нет
                            </div>
                        ) : todayLessons.map(l => (
                            <div key={l.id} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white ${DIRECTION_COLORS[l.direction]?.bg || 'bg-slate-500'}`}>
                                <Clock className="w-3 h-3" />
                                {l.startTime} — {l.groupName}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
                    {([
                        { id: 'schedule', label: 'Расписание', icon: <Calendar className="w-4 h-4" /> },
                        { id: 'availability', label: 'Моё время', icon: <Clock className="w-4 h-4" /> },
                        { id: 'groups', label: 'Группы', icon: <Users className="w-4 h-4" /> },
                    ] as const).map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                tab === t.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ══ TAB: SCHEDULE ══ */}
                    {tab === 'schedule' && (
                        <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            {/* Add lesson button */}
                            <div className="flex justify-end">
                                <button onClick={() => { setShowAddForm(s => !s); setSelectedLesson(null) }}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-7 py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
                                    <Plus className="w-5 h-5" /> Добавить занятие
                                </button>
                            </div>

                            {/* Add form */}
                            <AnimatePresence>
                                {showAddForm && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="bg-white border border-indigo-100 rounded-[2rem] p-8 shadow-sm space-y-6">
                                            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Новое занятие</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Group */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Группа</label>
                                                    <select value={form.groupId} onChange={e => setForm({ ...form, groupId: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                        <option value="">Выбрать группу</option>
                                                        {groups.map(g => (
                                                            <option key={g.id} value={g.id}>{g.name || g.direction}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Day */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">День</label>
                                                    <select value={form.day} onChange={e => setForm({ ...form, day: +e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                        {DAYS_RU.map((d, i) => {
                                                            const dayEn = DAYS_EN[i]
                                                            const isAvail = availability.length === 0 || availability.some(a => a.day === dayEn)
                                                            return (
                                                                <option key={i} value={i} disabled={!isAvail}>
                                                                    {d}{!isAvail ? ' (нет доступности)' : ''}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                {/* Time */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Время</label>
                                                    <select value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                        {HOURS.map(h => {
                                                            const conflict = hasConflict(lessons, { day: form.day, startTime: h, duration: form.duration })
                                                            return (
                                                                <option key={h} value={h} disabled={conflict}>
                                                                    {h}{conflict ? ' ✗ занято' : ''}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                {/* Duration */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Длительность</label>
                                                    <select value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                        <option value={60}>1 час</option>
                                                        <option value={90}>1.5 часа</option>
                                                        <option value={120}>2 часа</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Conflict / availability warning */}
                                            {form.groupId && hasConflict(lessons, { day: form.day, startTime: form.startTime, duration: form.duration }) && (
                                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                    Конфликт! В {DAYS_RU[form.day]} в {form.startTime} уже есть занятие
                                                </div>
                                            )}
                                            {form.groupId && !isWithinAvailability(availability, form.day, form.startTime, form.duration) && availability.length > 0 && (
                                                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-bold">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                    Выходит за рамки вашей доступности. Настройте своё время во вкладке «Моё время»
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button onClick={handleAddLesson} disabled={saving}
                                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-md shadow-indigo-100 disabled:opacity-60">
                                                    <Check className="w-4 h-4" /> Сохранить
                                                </button>
                                                <button onClick={() => setShowAddForm(false)}
                                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black px-8 py-4 rounded-2xl transition-all">
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Selected lesson detail */}
                            <AnimatePresence>
                                {selectedLesson && !draggingId && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 flex-wrap shadow-sm">
                                        <div className={`w-4 h-4 rounded-full ${DIRECTION_COLORS[selectedLesson.direction]?.bg || 'bg-slate-500'}`} />
                                        <div className="flex-1">
                                            <div className="font-black text-slate-900 text-sm">{selectedLesson.groupName}</div>
                                            <div className="text-slate-400 text-xs font-medium">
                                                {DAYS_RU[selectedLesson.day]} · {selectedLesson.startTime} · {selectedLesson.duration} мин
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(selectedLesson.id)}
                                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-black px-4 py-2 rounded-xl text-sm transition-all">
                                            <Trash2 className="w-4 h-4" /> Удалить
                                        </button>
                                        <button onClick={() => setSelectedLesson(null)}
                                            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Schedule Grid */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[900px]">
                                        {/* Day headers */}
                                        <div className="grid grid-cols-8 border-b border-slate-100">
                                            <div className="p-4 flex items-center justify-center">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Время</span>
                                            </div>
                                            {DAYS_RU.map((day, i) => {
                                                const isToday = i === ((new Date().getDay() || 7) - 1)
                                                const count = lessons.filter(l => l.day === i).length
                                                const dayEn = DAYS_EN[i]
                                                const avail = availability.find(a => a.day === dayEn)
                                                return (
                                                    <div key={i} className={`p-4 text-center border-l border-slate-50 ${isToday ? 'bg-indigo-50/50' : ''}`}>
                                                        <div className={`text-[10px] font-black uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                            <span className="hidden md:block">{day}</span>
                                                            <span className="md:hidden">{DAYS_SHORT[i]}</span>
                                                        </div>
                                                        {avail && (
                                                            <div className="text-[8px] text-emerald-500 font-bold mt-0.5">{avail.start}–{avail.end}</div>
                                                        )}
                                                        {count > 0 && <div className="text-[8px] text-slate-300 font-bold">{count} зан.</div>}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Grid body */}
                                        <div className="relative" ref={gridRef}>
                                            {HOURS.map((hour, hourIdx) => (
                                                <div key={hour} className="grid grid-cols-8 border-b border-slate-50 last:border-0" style={{ height: `${CELL_HEIGHT}px` }}>
                                                    <div className="flex items-start justify-center pt-2 text-slate-300 text-xs font-bold">{hour}</div>
                                                    {DAYS_EN.map((dayEn, dayIdx) => {
                                                        const isToday = dayIdx === ((new Date().getDay() || 7) - 1)
                                                        const isDropHere = dropTarget?.day === dayIdx && dropTarget?.row === hourIdx
                                                        const avail = availability.find(a => a.day === dayEn)
                                                        const inAvail = !avail || (
                                                            timeToMinutes(hour) >= timeToMinutes(avail.start) &&
                                                            timeToMinutes(hour) < timeToMinutes(avail.end)
                                                        )
                                                        return (
                                                            <div key={dayIdx} className={`border-l border-slate-50 relative transition-colors ${
                                                                isToday ? 'bg-indigo-50/10' : ''
                                                            } ${!inAvail && availability.length > 0 ? 'bg-slate-50/80' : ''} ${
                                                                isDropHere ? 'bg-indigo-100/60 ring-2 ring-inset ring-indigo-300 rounded-lg' : ''
                                                            }`}>
                                                                {/* Availability indicator stripe */}
                                                                {inAvail && availability.length > 0 && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-200 opacity-50" />
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ))}

                                            {/* Lesson blocks */}
                                            {loading ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-slate-300 text-sm font-bold uppercase tracking-widest">Загрузка...</div>
                                                </div>
                                            ) : lessons.map(lesson => {
                                                const row = getRowFromTime(lesson.startTime)
                                                const colors = DIRECTION_COLORS[lesson.direction] || DIRECTION_COLORS.other
                                                const isSelected = selectedLesson?.id === lesson.id
                                                const isDragging = draggingId === lesson.id
                                                return (
                                                    <div key={lesson.id}
                                                        onMouseDown={e => { e.preventDefault(); setDraggingId(lesson.id); setSelectedLesson(null); setDragGhost({ x: e.clientX, y: e.clientY }) }}
                                                        onClick={() => !draggingId && setSelectedLesson(isSelected ? null : lesson)}
                                                        className={`absolute ${colors.bg} ${colors.text} rounded-2xl px-2.5 py-2 mx-1 shadow-md border-2 ${colors.border} transition-all cursor-grab active:cursor-grabbing hover:shadow-lg ${
                                                            isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' : 'hover:scale-[1.02]'
                                                        } ${isDragging ? 'opacity-20 scale-95' : ''}`}
                                                        style={{
                                                            top: `${row * CELL_HEIGHT + 4}px`,
                                                            height: `${(lesson.duration / 60) * CELL_HEIGHT - 8}px`,
                                                            left: `${(lesson.day + 1) * (100 / NUM_COLS)}%`,
                                                            width: `calc(${100 / NUM_COLS}% - 8px)`,
                                                        }}
                                                    >
                                                        <div className="text-[10px] font-black leading-tight truncate">{lesson.groupName}</div>
                                                        <div className="text-[8px] opacity-70 font-bold uppercase truncate">{lesson.direction}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-slate-300 text-[9px] font-bold uppercase tracking-widest pt-2">
                                Перетащите занятие для изменения времени · Нажмите для просмотра
                            </div>
                        </motion.div>
                    )}

                    {/* ══ TAB: AVAILABILITY ══ */}
                    {tab === 'availability' && (
                        <motion.div key="avail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Моё рабочее время</h2>
                                    <p className="text-slate-400 font-medium text-sm">Укажите в какие дни и часы вы доступны для занятий. Система не позволит поставить урок вне этого времени.</p>
                                </div>

                                <div className="space-y-4">
                                    {DAYS_EN.slice(0, 6).map((dayEn, i) => {
                                        const isEnabled = availEnabled.has(dayEn)
                                        const slot = availForm.find(s => s.day === dayEn) || { day: dayEn, start: '16:00', end: '20:00' }

                                        return (
                                            <div key={dayEn} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-3xl border transition-all ${isEnabled ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-100 opacity-70'}`}>
                                                <div className="flex items-center gap-3 min-w-[160px]">
                                                    <button
                                                        onClick={() => {
                                                            setAvailEnabled(prev => {
                                                                const next = new Set(prev)
                                                                next.has(dayEn) ? next.delete(dayEn) : next.add(dayEn)
                                                                return next
                                                            })
                                                            if (!availForm.find(s => s.day === dayEn)) {
                                                                setAvailForm(prev => [...prev, { day: dayEn, start: '16:00', end: '20:00' }])
                                                            }
                                                        }}
                                                        className={`w-12 h-6 rounded-full transition-all flex-shrink-0 relative ${isEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
                                                    </button>
                                                    <span className={`text-sm font-black ${isEnabled ? 'text-slate-900' : 'text-slate-400'}`}>
                                                        {DAYS_RU[i]}
                                                    </span>
                                                </div>

                                                {isEnabled && (
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5">
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">С</span>
                                                            <select value={slot.start}
                                                                onChange={e => setAvailForm(prev => prev.map(s => s.day === dayEn ? { ...s, start: e.target.value } : s))}
                                                                className="text-sm font-black text-slate-900 bg-transparent outline-none cursor-pointer">
                                                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                            </select>
                                                        </div>
                                                        <span className="text-slate-300 font-bold">—</span>
                                                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5">
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">До</span>
                                                            <select value={slot.end}
                                                                onChange={e => setAvailForm(prev => prev.map(s => s.day === dayEn ? { ...s, end: e.target.value } : s))}
                                                                className="text-sm font-black text-slate-900 bg-transparent outline-none cursor-pointer">
                                                                {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="px-3 py-2 bg-emerald-100 rounded-xl text-xs font-bold text-emerald-700">
                                                            {Math.max(0, timeToMinutes(slot.end) - timeToMinutes(slot.start))} мин
                                                        </div>
                                                    </div>
                                                )}

                                                {!isEnabled && (
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Выходной</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <button onClick={saveAvailability} disabled={saving}
                                    className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-3xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-60">
                                    <Check className="w-5 h-5" />
                                    {saving ? 'Сохранение...' : 'Сохранить расписание доступности'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ══ TAB: GROUPS ══ */}
                    {tab === 'groups' && (
                        <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Назначить время группам</h2>
                                    <p className="text-slate-400 font-medium text-sm">Назначьте каждой группе постоянный день и время занятия. Система автоматически создаст уроки.</p>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => <Sk key={i} className="h-20" />)}
                                    </div>
                                ) : groups.length === 0 ? (
                                    <div className="text-center py-16 space-y-3">
                                        <Users className="w-12 h-12 text-slate-200 mx-auto" />
                                        <p className="text-slate-400 font-medium">Нет групп</p>
                                        <p className="text-xs text-slate-300">Создайте группы в разделе «Управление группами»</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {groups.map(group => {
                                            const colors = DIRECTION_COLORS[group.direction] || DIRECTION_COLORS.other
                                            return (
                                                <div key={group.id} className="border border-slate-100 rounded-3xl overflow-hidden">
                                                    <div className="flex items-center justify-between p-5 bg-slate-50/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                                                                <Users className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-900">{group.name || group.direction}</div>
                                                                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{group.students?.length || 0} учеников · {group.direction}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {group.schedule && (
                                                                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-bold text-indigo-600">
                                                                    {DAYS_RU[DAYS_EN.indexOf(group.schedule.day)]} · {group.schedule.time}
                                                                </div>
                                                            )}
                                                            <button onClick={() => {
                                                                setEditingGroup(group)
                                                                setGroupScheduleForm(group.schedule || { day: 'Monday', time: '17:00', duration: 60 })
                                                            }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                                                                <Settings2 className="w-3.5 h-3.5" />
                                                                {group.schedule ? 'Изменить' : 'Назначить'}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Inline edit form */}
                                                    <AnimatePresence>
                                                        {editingGroup?.id === group.id && (
                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                                <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">День</label>
                                                                        <select value={groupScheduleForm.day} onChange={e => setGroupScheduleForm({ ...groupScheduleForm, day: e.target.value })}
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                                            {DAYS_EN.slice(0, 6).map((d, i) => (
                                                                                <option key={d} value={d}>{DAYS_RU[i]}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Время</label>
                                                                        <select value={groupScheduleForm.time} onChange={e => setGroupScheduleForm({ ...groupScheduleForm, time: e.target.value })}
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Длительность</label>
                                                                        <select value={groupScheduleForm.duration} onChange={e => setGroupScheduleForm({ ...groupScheduleForm, duration: +e.target.value })}
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                                                                            <option value={60}>1 час</option>
                                                                            <option value={90}>1.5 часа</option>
                                                                            <option value={120}>2 часа</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="sm:col-span-3 flex gap-3">
                                                                        <button onClick={saveGroupSchedule} disabled={saving}
                                                                            className="flex items-center gap-2 bg-indigo-600 text-white font-black px-7 py-3 rounded-2xl text-sm transition-all hover:bg-indigo-700 disabled:opacity-60">
                                                                            <Zap className="w-4 h-4" />
                                                                            {saving ? 'Сохранение...' : 'Сохранить и создать уроки'}
                                                                        </button>
                                                                        <button onClick={() => setEditingGroup(null)}
                                                                            className="flex items-center gap-2 bg-slate-100 text-slate-600 font-black px-7 py-3 rounded-2xl text-sm transition-all hover:bg-slate-200">
                                                                            Отмена
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Drag ghost */}
            {draggingId && dragGhost && draggingLesson && (
                <div className="fixed pointer-events-none z-[9999]" style={{ left: dragGhost.x - 60, top: dragGhost.y - 20 }}>
                    <div className={`${DIRECTION_COLORS[draggingLesson.direction]?.bg || 'bg-slate-500'} text-white rounded-2xl px-4 py-2 shadow-2xl min-w-[120px] opacity-90 border-2 border-white/30`}>
                        <div className="text-xs font-black">{draggingLesson.groupName}</div>
                        <div className="text-[8px] opacity-70 uppercase">{draggingLesson.direction}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherSchedulePage
