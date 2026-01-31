import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { adminRanks, getRankByPoints, AdminRank } from '@/utils/adminRanks'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    ArrowLeft,
    Award,
    AlertTriangle,
    History,
    Settings2,
    UserPlus,
    Search,
    ShieldCheck,
    TrendingUp
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

interface PointsLog {
    id: string
    student: string
    points: number
    reason: string
    grantedBy: string
    date: number
}

export const AdminRanksPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)

    // UI State
    const [activeTab, setActiveTab] = useState<'assign' | 'manage' | 'logs' | 'guide'>('assign')
    const [email, setEmail] = useState('')
    const [selectedRank, setSelectedRank] = useState<number>(1)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [logs, setLogs] = useState<PointsLog[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    // Access Check
    const isDeveloper = currentUser?.role === 'developer'
    const isAdmin = currentUser?.role === 'admin'

    useEffect(() => {
        if (!isAdmin && !isDeveloper) {
            navigate('/dashboard')
            return
        }

        // Mock logs or fetch real ones if collection exists
        // For now using the logic from LiveRanksPage
        const mockLogs: PointsLog[] = [
            { id: '1', student: 'Иван', points: 10, reason: 'Выполнил задание Python #1', grantedBy: 'Учитель А', date: Date.now() },
            { id: '2', student: 'Мария', points: 15, reason: 'Отличная работа по Figma', grantedBy: 'Учитель Б', date: Date.now() - 3600000 },
            { id: '3', student: 'Алексей', points: 50, reason: '⚠️ Подозрительно много очков', grantedBy: 'Учитель А', date: Date.now() - 7200000 }
        ]
        setLogs(mockLogs)
    }, [isAdmin, isDeveloper, navigate])

    const handleAssignRank = async () => {
        if (!email.trim()) {
            setStatus({ type: 'error', message: 'Введите email' })
            return
        }

        setLoading(true)
        setStatus({ type: 'info', message: 'Обновление ранга...' })

        try {
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', email.trim().toLowerCase()))
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                setStatus({ type: 'error', message: 'Пользователь не найден' })
                return
            }

            const rank = adminRanks.find(r => r.level === selectedRank)
            if (!rank) return

            const userDoc = querySnapshot.docs[0]
            await updateDoc(doc(db, 'users', userDoc.id), {
                adminPoints: rank.minPoints,
                teacherRank: selectedRank, // Keeping both for compatibility
                updatedAt: new Date().toISOString()
            })

            setStatus({
                type: 'success',
                message: `Ранг назначен: ${rank.icon} ${rank.name} (${rank.minPoints} очков)`
            })
            setEmail('')
        } catch (error) {
            console.error('Error:', error)
            setStatus({ type: 'error', message: 'Ошибка при обновлении' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Назад
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Управление рангами</h1>
                                <p className="text-sm text-gray-500">Единая система уровней и достижений</p>
                            </div>
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <TabButton
                                active={activeTab === 'assign'}
                                onClick={() => setActiveTab('assign')}
                                icon={<UserPlus className="w-4 h-4" />}
                                label="Назначить"
                            />
                            <TabButton
                                active={activeTab === 'manage'}
                                onClick={() => setActiveTab('manage')}
                                icon={<Settings2 className="w-4 h-4" />}
                                label="Настройка"
                            />
                            <TabButton
                                active={activeTab === 'logs'}
                                onClick={() => setActiveTab('logs')}
                                icon={<History className="w-4 h-4" />}
                                label="Логи"
                            />
                            <TabButton
                                active={activeTab === 'guide'}
                                onClick={() => setActiveTab('guide')}
                                icon={<Award className="w-4 h-4" />}
                                label="Справка"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'assign' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Card className="p-8 shadow-xl border-t-4 border-indigo-500">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Email администратора / учителя
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@eliteheat.kz"
                                            className="pl-12 py-6 text-lg rounded-2xl border-2 focus:border-indigo-500 transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-4 text-center">
                                        Выберите уровень
                                    </label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {adminRanks.map((rank) => (
                                            <button
                                                key={rank.level}
                                                onClick={() => setSelectedRank(rank.level)}
                                                className={`
                                                    p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group
                                                    ${selectedRank === rank.level
                                                        ? 'border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10'
                                                        : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <span className="text-3xl group-hover:scale-110 transition-transform">{rank.icon}</span>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{rank.name}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Lvl {rank.level}</div>
                                                    </div>
                                                </div>
                                                {selectedRank === rank.level && (
                                                    <div className="absolute top-2 right-2">
                                                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-8 text-lg font-bold rounded-2xl shadow-indigo-200 shadow-lg hover:shadow-xl transition-all"
                                    onClick={handleAssignRank}
                                    disabled={loading}
                                >
                                    {loading ? 'Обработка...' : 'Подтвердить назначение'}
                                </Button>

                                {status.message && (
                                    <div className={`p-4 rounded-xl text-center font-bold animate-fade-in ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                                            status.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </Card>

                        <AlertBox
                            title="Безопасность прежде всего"
                            content="Только разработчики могут изменять ранги администраторов вручную. Все изменения логируются."
                        />
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="space-y-6">
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Пороги очков</h2>
                                    <p className="text-sm text-gray-500">Настройка автоматического повышения</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm">Сбросить</Button>
                                    <Button size="sm">Сохранить всё</Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                                            <th className="py-4">Ранг</th>
                                            <th className="py-4 text-center">Уровень</th>
                                            <th className="py-4">Мин. Очков</th>
                                            <th className="py-4">Макс. Очков</th>
                                            <th className="py-4 text-right">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {adminRanks.map((rank) => (
                                            <tr key={rank.level} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{rank.icon}</span>
                                                        <span className="font-bold text-gray-700">{rank.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-bold text-gray-500">
                                                        {rank.level}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <Input defaultValue={rank.minPoints} className="w-24 h-8 text-sm" />
                                                </td>
                                                <td className="py-4">
                                                    <Input defaultValue={rank.maxPoints === Infinity ? 999999 : rank.maxPoints} className="w-24 h-8 text-sm" />
                                                </td>
                                                <td className="py-4 text-right">
                                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                        Изменить
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="space-y-6">
                        <Card className="p-6 bg-amber-50 border-2 border-amber-300">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-amber-900">Анти-Фрод система активна</h3>
                                    <p className="text-sm text-amber-800/80">
                                        Начисления более 50 очков за одно действие помечаются флагом для проверки.
                                        Суточный лимит: 200 очков.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 gap-4">
                            {logs.map(log => (
                                <div key={log.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${log.points >= 50 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {log.points >= 50 ? '⚠️' : '🎯'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{log.student}</div>
                                            <div className="text-sm text-gray-500">{log.reason}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xl font-black ${log.points >= 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            +{log.points}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            {new Date(log.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'guide' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminRanks.map((rank) => (
                            <ScrollReveal key={rank.level} animation="fade">
                                <Card className="p-6 h-full border-b-4 border-gray-200 hover:border-indigo-400 transition-colors">
                                    <div className="text-4xl mb-4">{rank.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{rank.name}</h3>
                                    <div className="text-[10px] text-indigo-500 font-black mb-4 uppercase tracking-[0.2em]">Level {rank.level}</div>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">{rank.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-gray-400">Порог:</span>
                                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                {rank.minPoints} {rank.maxPoints !== Infinity ? `- ${rank.maxPoints}` : '+'} очков
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
            ${active
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }
        `}
    >
        {icon}
        <span className="hidden md:block">{label}</span>
    </button>
)

const AlertBox = ({ title, content }: { title: string, content: string }) => (
    <div className="bg-indigo-600 text-white rounded-3xl p-8 relative overflow-hidden">
        <TrendingUp className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10" />
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {title}
        </h3>
        <p className="text-indigo-100 text-sm leading-relaxed">{content}</p>
    </div>
)
