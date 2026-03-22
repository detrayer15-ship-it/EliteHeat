import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { db } from '@/config/firebase'
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp,
    doc,
    onSnapshot,
    setDoc
} from 'firebase/firestore'
import { 
    Users, 
    ArrowLeft, 
    CheckCircle2, 
    Activity,
    UserCheck,
    Clock,
    Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/Toast'

interface Student {
    id: string
    name: string
    email: string
    avatar?: string
    lastActiveAt?: any
    progress?: number
    completedTasks?: number
    isPresent?: boolean
}

export const MonitoringCenterPage = () => {
    const navigate = useNavigate()
    const { success, error } = useToast()
    const currentUser = useAuthStore((state) => state.user)
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Session time states
    const [startTime, setStartTime] = useState('14:00')
    const [endTime, setEndTime] = useState('16:00')
    const [isSavingSession, setIsSavingSession] = useState(false)
    const [isEditingSession, setIsEditingSession] = useState(false)

    useEffect(() => {
        // Fetch global session time
        const sessionRef = doc(db, 'site_settings', 'session')
        const unsub = onSnapshot(sessionRef, (snap: any) => {
            if (snap.exists()) {
                const data = snap.data()
                setStartTime(data.startTime || '14:00')
                setEndTime(data.endTime || '16:00')
            }
        })
        return () => unsub()
    }, [])

    const saveSessionTime = async () => {
        setIsSavingSession(true)
        try {
            const [h, m] = startTime.split(':').map(Number)
            const endH = (h + 1) % 24
            const autoEndTime = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

            await setDoc(doc(db, 'site_settings', 'session'), {
                startTime,
                endTime: autoEndTime,
                updatedAt: serverTimestamp(),
                lastUpdatedBy: currentUser?.id,
                teacherName: currentUser?.name
            })
            setEndTime(autoEndTime)
            success('Готово', 'Время сессии обновлено на 1 час')
            setIsEditingSession(false)
        } catch (err) {
            error('Ошибка', 'Не удалось сохранить время')
        } finally {
            setIsSavingSession(false)
        }
    }

    useEffect(() => {
        if (!currentUser?.id) return

        const fetchTeacherSpecificData = async () => {
            try {
                setLoading(true)
                const groupsQ = query(collection(db, 'groups'), where('teacherId', '==', currentUser.id))
                const groupsSnap = await getDocs(groupsQ)
                const teacherGroups = groupsSnap.docs.map(d => d.data())
                
                const myStudentIds = new Set<string>()
                teacherGroups.forEach((g: any) => {
                    if (g.students) g.students.forEach((id: string) => myStudentIds.add(id))
                })

                if (myStudentIds.size === 0) {
                    setStudents([])
                    setLoading(false)
                    return
                }

                const studentsQ = query(collection(db, 'users'), where('role', '==', 'student'))
                const snapshot = await getDocs(studentsQ)
                const list = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), isPresent: false } as Student))
                    .filter(s => myStudentIds.has(s.id))
                
                setStudents(list)
            } catch (err) {
                console.error(err)
                error('Ошибка', 'Не удалось загрузить данные')
            } finally {
                setLoading(false)
            }
        }

        fetchTeacherSpecificData()
    }, [currentUser?.id])

    const togglePresence = (id: string) => {
        setStudents(prev => prev.map(s => 
            s.id === id ? { ...s, isPresent: !s.isPresent } : s
        ))
    }

    const saveAttendance = async () => {
        try {
            const presentStudents = students.filter(s => s.isPresent).map(s => s.id)
            await addDoc(collection(db, 'attendance_logs'), {
                teacherId: currentUser?.id,
                teacherName: currentUser?.name,
                timestamp: serverTimestamp(),
                presentCount: presentStudents.length,
                studentIds: presentStudents,
                type: 'manual_session',
                date: new Date().toISOString().split('T')[0]
            })
            success('Готово', 'Посещаемость успешно сохранена')
        } catch (err) {
            error('Ошибка', 'Не удалось сохранить данные')
        }
    }

    const filteredStudents = students.filter(s => 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Загрузка данных...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 p-4 md:p-10">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <button 
                            onClick={() => navigate('/teacher/dashboard')}
                            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-4 text-[10px] font-bold uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Панель управления
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Центр <span className="text-indigo-600 italic">Мониторинга</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Контроль присутствия и прогресса обучения в реальном времени</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={saveAttendance}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-[2rem] shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                        >
                            <UserCheck className="w-5 h-5" />
                            Сохранить посещаемость
                        </button>
                    </div>
                </div>

                {/* Stats & Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Мои ученики</h3>
                        </div>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter">{students.length}</div>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Сейчас здесь</h3>
                        </div>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter">
                            {students.filter(s => s.isPresent).length} 
                            <span className="text-xl text-slate-200 ml-2">/ {students.length}</span>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-indigo-100 rounded-[2.5rem] shadow-sm relative overflow-hidden group/card bg-gradient-to-br from-white to-indigo-50/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Время сессии</h3>
                            </div>
                            {!isEditingSession && (
                                <button 
                                    onClick={() => setIsEditingSession(true)}
                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                                >
                                    Изменить
                                </button>
                            )}
                        </div>
                        
                        {isEditingSession ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Начало</p>
                                        <div className="relative group/time">
                                            <input 
                                                type="time" 
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-inner"
                                            />
                                            <Clock className="w-4 h-4 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 group-hover/time:text-indigo-500 transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="mt-5 text-slate-300 font-bold">→</div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Конец (1ч)</p>
                                        <div className="bg-indigo-100/50 border border-indigo-200/50 rounded-2xl px-4 py-3 text-sm font-black text-indigo-700 italic shadow-sm">
                                            {(() => {
                                                const [h, m] = startTime.split(':').map(Number)
                                                const endH = (h + 1) % 24
                                                return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditingSession(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        X
                                    </button>
                                    <button 
                                        disabled={isSavingSession}
                                        onClick={saveSessionTime}
                                        className="flex-[3] py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100/50 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    >
                                        {isSavingSession ? '...' : 'Сохранить'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                                    {startTime} <span className="text-slate-200 mx-1">—</span> {endTime}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Активная сессия (1 час)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="relative group/search max-w-4xl mb-10">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within/search:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Поиск ученика по имени или почте..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-[2rem] pl-16 pr-8 py-5 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 text-lg font-medium transition-all shadow-sm"
                    />
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredStudents.map((student) => (
                            <motion.div
                                key={student.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => togglePresence(student.id)}
                                className={`group p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                    student.isPresent 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                                        : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg'
                                }`}
                            >
                                {student.isPresent && (
                                    <motion.div 
                                        initial={{ scale: 0 }} 
                                        animate={{ scale: 1 }} 
                                        className="absolute top-4 right-4"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </motion.div>
                                )}
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md transition-colors ${
                                        student.isPresent ? 'bg-white/20 text-white' : 'bg-slate-50 text-indigo-600 group-hover:bg-indigo-50'
                                    }`}>
                                        {student.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-sm truncate uppercase tracking-tight">{student.name}</h3>
                                        <p className={`text-[10px] font-bold truncate ${student.isPresent ? 'text-white/60' : 'text-slate-400'}`}>
                                            {student.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                        student.isPresent ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400'
                                    }`}>
                                        Student
                                    </div>
                                    {!student.isPresent && (
                                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Отметить
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredStudents.length === 0 && !loading && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Никого не нашли</h3>
                        <p className="text-slate-400 font-medium">Попробуйте изменить поисковый запрос</p>
                    </div>
                )}
            </div>
        </div>
    )
}
