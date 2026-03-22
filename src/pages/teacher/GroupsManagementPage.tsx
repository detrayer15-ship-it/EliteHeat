import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { db } from '@/config/firebase'
import { 
    collection, addDoc, query, where, onSnapshot, 
    serverTimestamp, doc, updateDoc, getDocs, deleteDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore'
import {
    Users, Plus, Search, MoreHorizontal, 
    Trash2, ChevronDown, ChevronUp, UserPlus,
    Calendar, CheckCircle2, Clock, Check, AlertCircle, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/Toast'

interface Group {
    id: string
    name: string
    teacherId: string
    direction: 'web' | 'roblox' | 'python' | 'other'
    students: string[]
    days?: number[]
    defaultTime?: string
}

interface Student {
    id: string
    name: string
    email: string
}

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const formatNow = () => {
    const d = new Date()
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export const GroupsManagementPage = () => {
    const navigate = useNavigate()
    const { success, error, warning } = useToast()
    const currentUser = useAuthStore((state) => state.user)

    const [groups, setGroups] = useState<Group[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    
    // UI States
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [addStudentGroup, setAddStudentGroup] = useState<Group | null>(null)
    const [studentSearch, setStudentSearch] = useState('')
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<Record<string, boolean>>({})
    const [lastSaved, setLastSaved] = useState<Record<string, boolean>>({})

    const [currentTimeStr, setCurrentTimeStr] = useState(formatNow())
    const now = new Date()

    // Real-time clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTimeStr(formatNow()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Load Teacher's Groups
    useEffect(() => {
        if (!currentUser?.id) return
        const q = query(collection(db, 'groups'), where('teacherId', '==', currentUser.id))
        const unsub = onSnapshot(q, snap => {
            setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() } as Group)))
            setIsLoading(false)
        })
        return unsub
    }, [currentUser?.id])

    // Load Global Student List for adding to groups
    useEffect(() => {
        const fetchStudents = async () => {
            const q = query(collection(db, 'users'), where('role', '==', 'student'))
            const snap = await getDocs(q)
            setAllStudents(snap.docs.map(d => ({ id: d.id, name: d.data().name, email: d.data().email } as Student)))
        }
        fetchStudents()
    }, [])

    // Load Attendance for expanded group (Live Session)
    useEffect(() => {
        if (!expandedGroup) {
            setAttendance({})
            return
        }

        const dateStr = now.toISOString().split('T')[0]
        const q = query(
            collection(db, 'attendance_logs'), 
            where('groupId', '==', expandedGroup),
            where('date', '==', dateStr)
        )

        const unsub = onSnapshot(q, snap => {
            if (!snap.empty) {
                const data = snap.docs[0].data()
                const map: Record<string, boolean> = {}
                data.presentIds.forEach((id: string) => map[id] = true)
                setAttendance(map)
            } else {
                setAttendance({})
            }
        })
        return unsub
    }, [expandedGroup])

    const handleDeleteGroup = async (id: string) => {
        if (!window.confirm('Удалить группу?')) return
        try {
            await deleteDoc(doc(db, 'groups', id))
            success('Удалено', 'Группа успешно удалена')
        } catch {
            error('Ошибка', 'Не удалось удалить группу')
        }
    }

    const toggleDay = async (groupId: string, dayIdx: number) => {
        const group = groups.find(g => g.id === groupId)
        if (!group) return

        let currentDays = [...(group.days || [])]
        if (currentDays.includes(dayIdx)) {
            currentDays = currentDays.filter(d => d !== dayIdx)
        } else {
            if (currentDays.length >= 3) {
                warning('Внимание', 'Занятия проводятся только 3 раза в неделю')
                return
            }
            currentDays.push(dayIdx)
        }

        try {
            await updateDoc(doc(db, 'groups', groupId), { days: currentDays })
            setLastSaved(prev => ({ ...prev, [groupId]: true }))
            setTimeout(() => setLastSaved(prev => ({ ...prev, [groupId]: false })), 2000)
        } catch {
            error('Ошибка', 'Не удалось сохранить настройки')
        }
    }

    const updateStartTime = async (groupId: string, time: string) => {
        try {
            await updateDoc(doc(db, 'groups', groupId), {
                defaultTime: time
            })
            setLastSaved(prev => ({ ...prev, [groupId]: true }))
            setTimeout(() => setLastSaved(prev => ({ ...prev, [groupId]: false })), 2000)
        } catch (err) {
            error('Ошибка', 'Не удалось обновить время')
        }
    }

    const toggleAttendance = async (studentId: string) => {
        if (!expandedGroup) return
        const dateStr = now.toISOString().split('T')[0]
        const isPresent = attendance[studentId]

        try {
            const q = query(
                collection(db, 'attendance_logs'), 
                where('groupId', '==', expandedGroup),
                where('date', '==', dateStr)
            )
            const snap = await getDocs(q)

            if (snap.empty) {
                await addDoc(collection(db, 'attendance_logs'), {
                    groupId: expandedGroup,
                    date: dateStr,
                    timestamp: serverTimestamp(),
                    teacherId: currentUser?.id,
                    presentIds: [studentId]
                })
            } else {
                const logDoc = snap.docs[0].ref
                await updateDoc(logDoc, {
                    presentIds: isPresent ? arrayRemove(studentId) : arrayUnion(studentId)
                })
            }
        } catch {
            error('Ошибка', 'Не удалось сохранить посещаемость')
        }
    }

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.direction.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            Мои <span className="text-indigo-600 italic">Группы</span>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-black border border-indigo-100">{groups.length}</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Управление составом групп и расписанием в реальном времени</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Создать группу
                    </button>
                </div>

                {/* Filters */}
                <div className="relative group/search max-w-2xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-hover/search:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Поиск по названию или направлению..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-[1.5rem] pl-16 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm font-medium transition-all"
                    />
                </div>

                {/* Groups List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-white/50 animate-pulse rounded-[2rem] border border-white" />
                            ))}
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 border-dashed">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Здесь пока пусто</h3>
                            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 font-medium">Создайте свою первую группу, чтобы начать мониторинг и управление расписанием</p>
                            <button onClick={() => setShowCreateModal(true)}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                                Начать работу
                            </button>
                        </div>
                    ) : (
                        filteredGroups.map(group => {
                            const isExpanded = expandedGroup === group.id
                            return (
                                <div key={group.id} className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-200 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/5' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>
                                    <div className="p-6 md:p-8 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6 min-w-0">
                                            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-xl flex-shrink-0 ${
                                                group.direction === 'web' ? 'bg-amber-500' :
                                                group.direction === 'roblox' ? 'bg-emerald-500' :
                                                group.direction === 'python' ? 'bg-blue-600' : 'bg-slate-500'
                                            }`}>
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-xl font-black text-slate-900 truncate uppercase tracking-tight">{group.name}</h3>
                                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{group.direction}</span>
                                                    <div className="flex -space-x-2">
                                                        {group.students?.slice(0, 3).map((sId, idx) => (
                                                            <div key={idx} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                                                                {allStudents.find(s => s.id === sId)?.name?.charAt(0) || '?'}
                                                            </div>
                                                        ))}
                                                        {group.students?.length > 3 && (
                                                            <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                                                                +{group.students.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={e => { e.stopPropagation(); setAddStudentGroup(group); setStudentSearch('') }}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all">
                                                <UserPlus className="w-3.5 h-3.5" /><span className="hidden sm:inline">Добавить</span>
                                            </button>

                                            <div className="relative">
                                                <button onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === group.id ? null : group.id) }}
                                                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 transition-all">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                <AnimatePresence>
                                                    {menuOpen === group.id && (
                                                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute right-0 top-10 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 min-w-[160px]">
                                                            <button onClick={e => { e.stopPropagation(); handleDeleteGroup(group.id); setMenuOpen(null) }}
                                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest">
                                                                <Trash2 className="w-3.5 h-3.5" /> Удалить
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button onClick={e => { e.stopPropagation(); setExpandedGroup(isExpanded ? null : group.id) }}
                                                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 transition-all">
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="border-t border-slate-100">

                                                    {/* Step 1: Live Status & Weekly Schedule */}
                                                    <div className="px-6 py-6 bg-indigo-50/30 border-b border-slate-100 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                                                        
                                                        <div className="relative z-10 space-y-6">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                                <div className="flex items-center gap-6">
                                                                    <div className="flex flex-col">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                                                                            <Calendar className="w-3.5 h-3.5" /> Дата занятия
                                                                        </p>
                                                                        <div className="bg-white border border-indigo-100 rounded-2xl px-6 py-4 shadow-sm">
                                                                            <span className="text-xl font-black text-slate-900 tracking-tight">
                                                                                {now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                            </span>
                                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                                                {now.toLocaleDateString('ru-RU', { weekday: 'long' })} · Сегодня
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="h-12 w-px bg-slate-200 hidden md:block" />

                                                                    <div className="flex flex-col">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2">
                                                                            <Clock className="w-3.5 h-3.5" /> Текущее время
                                                                        </p>
                                                                        <div className="bg-white border border-indigo-100 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-3">
                                                                            <span className="text-2xl font-black text-indigo-600 tabular-nums leading-none">
                                                                                {currentTimeStr}
                                                                            </span>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-white/50 backdrop-blur border border-white p-4 rounded-2xl flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                                                                        <Zap className="w-5 h-5 text-white animate-pulse" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Режим сессии</p>
                                                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Отметка в реальном времени</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Weekly Schedule Settings */}
                                                            <div className="p-5 bg-white rounded-3xl border border-indigo-50 shadow-sm border-dashed relative">
                                                                <div className="flex items-center justify-between mb-3 ml-1">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Выходные дни и расписание (3 раза в неделю по 1 часу)</p>
                                                                    <AnimatePresence>
                                                                        {lastSaved[group.id] && (
                                                                            <motion.span initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                                                className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                                                <Check className="w-3 h-3" /> Сохранено
                                                                            </motion.span>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                                
                                                                <div className="flex flex-wrap gap-4 items-center">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {DAYS_RU.map((day, dIdx) => {
                                                                            const isSelected = (group.days || []).includes(dIdx)
                                                                            return (
                                                                                <button
                                                                                    key={day}
                                                                                    onClick={() => toggleDay(group.id, dIdx)}
                                                                                    className={`w-12 h-12 rounded-2xl text-xs font-black transition-all border flex flex-col items-center justify-center ${
                                                                                        isSelected 
                                                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                                                                                            : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
                                                                                    }`}
                                                                                >
                                                                                    {day}
                                                                                    {isSelected && <div className="w-1 h-1 bg-white rounded-full mt-0.5" />}
                                                                                </button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    
                                                                    <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-[1.5rem] border border-slate-100 group/time transition-all hover:bg-white hover:shadow-sm">
                                                                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-indigo-500 transition-colors group-hover/time:bg-indigo-600 group-hover/time:text-white group-hover/time:border-indigo-600">
                                                                            <Clock className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 ml-1">Время занятия (Длительность 1ч)</p>
                                                                            <div className="flex items-center gap-2">
                                                                                <select
                                                                                    value={group.defaultTime || '14:00'}
                                                                                    onChange={(e) => updateStartTime(group.id, e.target.value)}
                                                                                    className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M2.5%204.5L6%208L9.5%204.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:12px_12px] bg-[right_12px_center] bg-no-repeat"
                                                                                >
                                                                                    {Array.from({ length: 24 * 2 }).map((_, i) => {
                                                                                        const h = Math.floor(i / 2)
                                                                                        const m = (i % 2) * 30
                                                                                        const t = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                                                                                        return <option key={t} value={t}>{t}</option>
                                                                                    })}
                                                                                </select>
                                                                                <span className="text-slate-300 font-black">→</span>
                                                                                <div className="bg-indigo-50 border border-indigo-100/50 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 italic shadow-inner">
                                                                                    {(() => {
                                                                                        const [h, m] = (group.defaultTime || '14:00').split(':').map(Number)
                                                                                        const endH = (h + 1) % 24
                                                                                        return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                                                                                    })()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Step 2: Mark attendance */}
                                                    <div className="px-6 py-5">
                                                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                Шаг 2 — Отметьте посещаемость
                                                            </p>
                                                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                                                {group.students?.length || 0} учеников всего
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                            {group.students?.map(sId => {
                                                                const student = allStudents.find(s => s.id === sId)
                                                                if (!student) return null
                                                                const isPresent = attendance[student.id]
                                                                return (
                                                                    <button
                                                                        key={student.id}
                                                                        onClick={() => toggleAttendance(student.id)}
                                                                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                                                                            isPresent 
                                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                                                                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                                                            isPresent ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                                                        }`}>
                                                                            {student.name.charAt(0)}
                                                                        </div>
                                                                        <div className="flex-1 text-left">
                                                                            <div className="text-xs font-bold truncate max-w-[120px]">{student.name}</div>
                                                                            <div className="text-[8px] font-black uppercase text-slate-300 tracking-tighter">Student</div>
                                                                        </div>
                                                                        {isPresent && <Check className="w-3.5 h-3.5" />}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 relative shadow-2xl overflow-hidden">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Новая <span className="text-indigo-600">Группа</span></h2>
                            <p className="text-slate-400 font-medium mb-8">Заполните данные для создания учебной единицы</p>
                            
                            <form className="space-y-6" onSubmit={async (e) => {
                                e.preventDefault()
                                const form = e.target as any
                                try {
                                    await addDoc(collection(db, 'groups'), {
                                        name: form.groupName.value,
                                        direction: form.direction.value,
                                        teacherId: currentUser?.id,
                                        students: [],
                                        days: [0, 2, 4], // Default Mon, Wed, Fri
                                        defaultTime: '14:00'
                                    })
                                    success('Ура!', 'Группа успешно создана')
                                    setShowCreateModal(false)
                                } catch {
                                    error('Упс', 'Ошибка при создании группы')
                                }
                            }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Название группы</label>
                                    <input name="groupName" required placeholder="Например: Продвинутый Python B1"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"/>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Направление</label>
                                    <select name="direction" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer">
                                        <option value="web">Web Development</option>
                                        <option value="roblox">Roblox Studio</option>
                                        <option value="python">Python Data</option>
                                        <option value="other">General Course</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-all">Отмена</button>
                                    <button type="submit"
                                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Создать</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Student Modal */}
            <AnimatePresence>
                {addStudentGroup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setAddStudentGroup(null)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden ring-1 ring-white/20">
                            
                            <div className="p-8 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                                        Добавить <span className="text-indigo-600">Студента</span>
                                    </h2>
                                    <button onClick={() => setAddStudentGroup(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                        <AlertCircle className="w-5 h-5 text-slate-300" />
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="Начните вводить имя или почту ученика..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-2 custom-scrollbar">
                                {allStudents
                                    .filter(s => (s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())) && !addStudentGroup.students.includes(s.id))
                                    .map(student => (
                                        <div key={student.id} className="group flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-600 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {student.name?.charAt(0) || student.email?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 leading-none mb-1">{student.name || 'Student Without Name'}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await updateDoc(doc(db, 'groups', addStudentGroup.id), {
                                                            students: arrayUnion(student.id)
                                                        })
                                                        setAddStudentGroup(prev => prev ? ({ ...prev, students: [...prev.students, student.id] }) : null)
                                                        success('Добавлено', 'Ученик присоединен к группе')
                                                    } catch {
                                                        error('Ошибка', 'Не удалось добавить ученика')
                                                    }
                                                }}
                                                className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                {studentSearch.length > 0 && allStudents.filter(s => (s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())) && !addStudentGroup.students.includes(s.id)).length === 0 && (
                                    <div className="text-center py-20 text-slate-400 font-medium">Никого не нашли... попробуйте другой запрос</div>
                                )}
                            </div>
                            
                            <div className="p-8 border-t border-slate-100 bg-slate-50/30">
                                <button
                                    onClick={() => setAddStudentGroup(null)}
                                    className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-50 transition-all active:scale-[0.98]"
                                >
                                    Завершить выбор
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
