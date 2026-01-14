import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
    Bell,
    MessageSquare,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    Filter,
    Search
} from 'lucide-react'

interface Appeal {
    id: string
    studentId: string
    studentName: string
    message: string
    status: 'open' | 'in-progress' | 'resolved'
    createdAt: Date
    respondedBy?: string
    response?: string
    respondedAt?: Date
}

export const AppealsPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [appeals, setAppeals] = useState<Appeal[]>([])
    const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null)
    const [response, setResponse] = useState('')
    const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        // TODO: Load appeals from Firestore
        // For now, using mock data
        setAppeals([])
    }, [])

    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещён</h1>
                    <p className="text-gray-600">Эта страница доступна только администраторам</p>
                </div>
            </div>
        )
    }

    const filteredAppeals = appeals.filter(appeal => {
        const matchesFilter = filter === 'all' || appeal.status === filter
        const matchesSearch = appeal.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appeal.message.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleRespond = async () => {
        if (!selectedAppeal || !response.trim()) return

        // TODO: Save response to Firestore
        setResponse('')
        setSelectedAppeal(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-700 border-red-200'
            case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <AlertCircle className="w-4 h-4" />
            case 'in-progress': return <Clock className="w-4 h-4" />
            case 'resolved': return <CheckCircle2 className="w-4 h-4" />
            default: return null
        }
    }

    return (
        <div className="min-h-full py-2 space-y-8">
            {/* Header */}
            <div className="glass-premium rounded-[2.5rem] p-10 shadow-2xl border border-white/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm mb-3">
                            <Bell className="w-4 h-4 text-indigo-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Система обращений</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tighter">
                            Обращения учеников
                        </h1>
                        <p className="text-lg text-indigo-950/40 font-medium mt-2">
                            Отвечайте на вопросы и помогайте ученикам
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {['all', 'open', 'in-progress', 'resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white/40 text-indigo-950/40 hover:bg-white'
                                    }`}
                            >
                                {f === 'all' ? 'Все' : f === 'open' ? 'Новые' : f === 'in-progress' ? 'В работе' : 'Решённые'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="mt-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                    <input
                        type="text"
                        placeholder="Поиск по обращениям..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-indigo-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-indigo-950 placeholder:text-indigo-200"
                    />
                </div>
            </div>

            {/* Appeals List */}
            {filteredAppeals.length === 0 ? (
                <div className="glass-premium rounded-[2.5rem] p-20 text-center border border-white/60">
                    <Bell className="w-20 h-20 text-indigo-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-indigo-950 mb-2">Нет обращений</h3>
                    <p className="text-indigo-950/40 font-medium">
                        {filter === 'all' ? 'Пока нет обращений от учеников' : `Нет обращений со статусом "${filter}"`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAppeals.map((appeal) => (
                        <div
                            key={appeal.id}
                            onClick={() => setSelectedAppeal(appeal)}
                            className="glass-premium p-6 rounded-[2rem] border border-white/60 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-indigo-950">{appeal.studentName}</h4>
                                        <p className="text-xs text-indigo-950/40 font-medium">
                                            {new Date(appeal.createdAt).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${getStatusColor(appeal.status)}`}>
                                    {getStatusIcon(appeal.status)}
                                    {appeal.status === 'open' ? 'Новое' : appeal.status === 'in-progress' ? 'В работе' : 'Решено'}
                                </div>
                            </div>

                            <p className="text-indigo-950/60 font-medium line-clamp-3">{appeal.message}</p>

                            {appeal.response && (
                                <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
                                    <p className="text-xs font-black text-indigo-600 mb-1">Ответ от {appeal.respondedBy}</p>
                                    <p className="text-sm text-indigo-950/60 font-medium">{appeal.response}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            {selectedAppeal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-premium rounded-[2.5rem] p-8 max-w-2xl w-full border border-white/60 shadow-2xl">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-indigo-950 mb-2">Обращение от {selectedAppeal.studentName}</h3>
                                <p className="text-sm text-indigo-950/40 font-medium">
                                    {new Date(selectedAppeal.createdAt).toLocaleString('ru-RU')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAppeal(null)}
                                className="p-2 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/40 rounded-2xl">
                                <p className="text-indigo-950 font-medium">{selectedAppeal.message}</p>
                            </div>

                            {selectedAppeal.status !== 'resolved' && (
                                <div>
                                    <label className="block text-sm font-black text-indigo-950 mb-2 uppercase tracking-wide">
                                        Ваш ответ
                                    </label>
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="Напишите ответ ученику..."
                                        className="w-full p-4 bg-white/50 border border-indigo-50 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-indigo-950 placeholder:text-indigo-200 min-h-[150px]"
                                    />
                                    <button
                                        onClick={handleRespond}
                                        disabled={!response.trim()}
                                        className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Отправить ответ
                                    </button>
                                </div>
                            )}

                            {selectedAppeal.response && (
                                <div className="p-6 bg-indigo-50 rounded-2xl">
                                    <p className="text-xs font-black text-indigo-600 mb-2 uppercase tracking-wide">
                                        Ответ от {selectedAppeal.respondedBy}
                                    </p>
                                    <p className="text-indigo-950 font-medium">{selectedAppeal.response}</p>
                                    <p className="text-xs text-indigo-950/40 font-medium mt-2">
                                        {selectedAppeal.respondedAt && new Date(selectedAppeal.respondedAt).toLocaleString('ru-RU')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
            `}</style>
        </div>
    )
}
