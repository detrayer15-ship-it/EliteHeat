import { useState } from 'react'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { adminRanks } from '@/utils/adminRanks'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export const AdminRanksPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [email, setEmail] = useState('')
    const [selectedRank, setSelectedRank] = useState<number>(0)
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)

    // Проверка доступа - для admin и developer
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
                    <p className="text-gray-600 mb-6">
                        Эта страница доступна только администраторам
                    </p>
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Вернуться в админ-панель
                    </button>
                </div>
            </div>
        )
    }

    const isDeveloper = currentUser?.role === 'developer'

    const handleChangeRank = async () => {
        if (!email.trim()) {
            setStatus('❌ Введите email')
            return
        }

        setLoading(true)
        setStatus('⏳ Обновление ранга...')

        try {
            // Найти пользователя по email
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', email.trim()))
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                setStatus('❌ Пользователь с таким email не найден')
                setLoading(false)
                return
            }

            // Получить выбранный ранг
            const rank = adminRanks.find(r => r.level === selectedRank)
            if (!rank) {
                setStatus('❌ Ранг не найден')
                setLoading(false)
                return
            }

            // Обновить очки пользователя (устанавливаем минимум для этого ранга)
            for (const userDoc of querySnapshot.docs) {
                const userRef = doc(db, 'users', userDoc.id)
                await updateDoc(userRef, {
                    adminPoints: rank.minPoints,
                    updatedAt: new Date().toISOString()
                })
            }

            setStatus(`✅ Ранг изменён на "${rank.name}" (${rank.minPoints} очков)`)
            setEmail('')
        } catch (error) {
            console.error('Error updating rank:', error)
            setStatus('❌ Ошибка при обновлении ранга')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Изменение рангов</h1>
                    <p className="text-gray-600 mt-2">Измените ранг администратора по email</p>
                </div>

                {/* Form - только для developer */}
                {isDeveloper && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email пользователя
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Rank Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Выберите ранг
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {adminRanks.map((rank) => (
                                        <button
                                            key={rank.level}
                                            onClick={() => setSelectedRank(rank.level)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${selectedRank === rank.level
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">{rank.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {rank.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        Уровень {rank.level}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {rank.minPoints} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints} очков
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleChangeRank}
                                disabled={loading || !email.trim() || selectedRank === 0}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? '⏳ Обновление...' : 'Изменить ранг'}
                            </button>

                            {/* Status */}
                            {status && (
                                <div className={`p-4 rounded-lg ${status.includes('✅')
                                    ? 'bg-green-50 text-green-800'
                                    : status.includes('❌')
                                        ? 'bg-red-50 text-red-800'
                                        : 'bg-blue-50 text-blue-800'
                                    }`}>
                                    <p className="text-sm font-medium">{status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Информация</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Ранг определяется количеством очков (adminPoints)</li>
                        <li>• При изменении ранга устанавливается минимум очков для этого уровня</li>
                        <li>• Очки можно заработать за проверку заданий и помощь ученикам</li>
                    </ul>
                </div>

                {/* Ranks Reference */}
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">📊 Справка по рангам</h3>
                    <div className="space-y-2">
                        {adminRanks.map((rank) => (
                            <div key={rank.level} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{rank.icon}</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{rank.name}</p>
                                        <p className="text-xs text-gray-500">{rank.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">
                                        {rank.minPoints} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints}
                                    </p>
                                    <p className="text-xs text-gray-500">очков</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Responsibilities Guide */}
                <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 border-2 border-purple-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        📋 Обязанности и права по рангам
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                            <h4 className="font-semibold text-gray-900 mb-2">🌱 Стажёр (0-49 очков)</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Доступ к базовым функциям админ-панели</li>
                                <li>• Просмотр списка учеников</li>
                                <li>• Ответы в чате с учениками</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                            <h4 className="font-semibold text-gray-900 mb-2">⚡ Модератор (100-199 очков)</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Все права Стажёра</li>
                                <li>• Управление группами учеников</li>
                                <li>• Проверка простых заданий</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                            <h4 className="font-semibold text-gray-900 mb-2">⭐ Эксперт (350-549 очков)</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Все права Модератора</li>
                                <li>• Проверка сложных заданий</li>
                                <li>• Создание учебных материалов</li>
                                <li>• Менторство новых админов</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                            <h4 className="font-semibold text-gray-900 mb-2">🏆 Архитектор (1500+ очков)</h4>
                            <ul className="text-sm text-gray-600 space-y-1 ml-4">
                                <li>• Все права Эксперта</li>
                                <li>• Управление всеми админами</li>
                                <li>• Доступ к аналитике</li>
                                <li>• Принятие стратегических решений</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Developer Note */}
                <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                        ⚠️ Важно для разработчика
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p>• Только разработчик может изменять ранги администраторов</p>
                        <p>• Очки начисляются автоматически за выполнение задач</p>
                        <p>• Разработчик может вручную добавлять/убавлять очки при необходимости</p>
                        <p>• Понижение ранга возможно только в исключительных случаях</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
