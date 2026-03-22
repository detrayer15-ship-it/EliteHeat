import { useAuthStore } from '@/store/authStore'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

interface ScheduleLesson {
    id: number
    day: number       // 0=Пн .. 6=Вс
    startTime: string // e.g. '17:00'
    duration: number  // in minutes
    title: string
    color: string     // tailwind color name
    type: 'lesson' | 'homework'
}

// Mock data removed, fetching from Firestore

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
    pink: { bg: 'bg-pink-400', text: 'text-white', border: 'border-pink-500' },
    amber: { bg: 'bg-amber-400', text: 'text-amber-900', border: 'border-amber-500' },
    rose: { bg: 'bg-rose-400', text: 'text-white', border: 'border-rose-500' },
    emerald: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
    violet: { bg: 'bg-violet-500', text: 'text-white', border: 'border-violet-600' },
    orange: { bg: 'bg-orange-400', text: 'text-white', border: 'border-orange-500' },
    cyan: { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-600' },
    blue: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
}

const getRowFromTime = (time: string): number => {
    const [h] = time.split(':').map(Number)
    return h - 10 // 10:00 = row 0
}

export const StudentSchedulePage = () => {
    const user = useAuthStore(s => s.user)
    const [lessons, setLessons] = useState<ScheduleLesson[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user?.id) return

        const docRef = doc(db, 'schedules', user.id)
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setLessons(docSnap.data().lessons || [])
            } else {
                setLessons([])
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user?.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Загрузка расписания...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8faff] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Расписание уроков</h1>
                        <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Занятия 3 раза в неделю • {user?.name || 'Ученик'}
                        </p>
                    </div>
                </motion.div>

                {/* Schedule Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <div className="min-w-[900px]">
                            {/* Header row */}
                            <div className="grid grid-cols-8 border-b border-slate-100">
                                <div className="p-4 text-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Время</span>
                                </div>
                                {DAYS.map((day, i) => {
                                    const isToday = i === ((new Date().getDay() || 7) - 1)
                                    return (
                                        <div
                                            key={i}
                                            className={`p-4 text-center border-l border-slate-50 ${isToday ? 'bg-indigo-50/50' : ''}`}
                                        >
                                            <span className={`text-xs font-black uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                <span className="hidden md:inline">{day}</span>
                                                <span className="md:hidden">{DAYS_SHORT[i]}</span>
                                            </span>
                                            {isToday && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mx-auto mt-1" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Time rows */}
                            <div className="relative">
                                {HOURS.map((hour, rowIdx) => (
                                    <div key={hour} className="grid grid-cols-8 border-b border-slate-50 last:border-b-0" style={{ height: '64px' }}>
                                        <div className="flex items-start justify-center pt-2 text-slate-300 text-sm font-bold">
                                            {hour}
                                        </div>
                                        {DAYS.map((_, dayIdx) => {
                                            const isToday = dayIdx === ((new Date().getDay() || 7) - 1)
                                            return (
                                                <div
                                                    key={dayIdx}
                                                    className={`border-l border-slate-50 relative ${isToday ? 'bg-indigo-50/30' : ''}`}
                                                />
                                            )
                                        })}
                                    </div>
                                ))}

                                {/* Lesson blocks overlaid */}
                                {lessons.map(lesson => {
                                    const row = getRowFromTime(lesson.startTime)
                                    const heightSlots = lesson.duration / 60
                                    const colors = colorClasses[lesson.color] || colorClasses.indigo

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`absolute ${colors.bg} ${colors.text} rounded-xl px-2 py-1.5 mx-1 shadow-md cursor-default transition-all hover:scale-[1.03] hover:shadow-lg border ${colors.border}`}
                                            style={{
                                                top: `${row * 64 + 4}px`,
                                                height: `${heightSlots * 64 - 8}px`,
                                                left: `${(lesson.day + 1) * (100 / 8)}%`,
                                                width: `calc(${100 / 8}% - 8px)`,
                                            }}
                                        >
                                            <span className="text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-sm">
                                                {lesson.title}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500" />
                        <span className="text-xs font-bold text-slate-400">Основные уроки</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-rose-400" />
                        <span className="text-xs font-bold text-slate-400">Практические задания</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-violet-500" />
                        <span className="text-xs font-bold text-slate-400">Доп. занятия</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default StudentSchedulePage
