import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { simpleRanks, getRankByLevel, rankColors } from '@/utils/simpleRanks'
import { ArrowLeft } from 'lucide-react'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export const AssignRankPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [email, setEmail] = useState('')
    const [selectedRank, setSelectedRank] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    // Проверка доступа
    if (!user || user.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Эта страница доступна только разработчикам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">
                    Вернуться на главную
                </Button>
            </div>
        )
    }

    const handleAssignRank = async () => {
        if (!email.trim()) {
            setMessage('❌ Введите email учителя')
            return
        }

        setIsLoading(true)
        setMessage('')

        try {
            // Ищем пользователя по email
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                setMessage('❌ Пользователь с таким email не найден')
                setIsLoading(false)
                return
            }

            // Обновляем ранг
            const userDoc = querySnapshot.docs[0]
            await updateDoc(doc(db, 'users', userDoc.id), {
                teacherRank: selectedRank,
                rankUpdatedAt: Date.now()
            })

            const rank = getRankByLevel(selectedRank)
            setMessage(`✅ Ранг "${rank.icon} ${rank.name}" (уровень ${selectedRank}) назначен пользователю ${email}`)
            setEmail('')
            setSelectedRank(1)
        } catch (error) {
            console.error('Error assigning rank:', error)
            setMessage('❌ Ошибка при назначении ранга')
        }

        setIsLoading(false)
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/developer/panel')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к панели
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    👑 Назначение рангов учителям
                </h1>
                <p className="text-gray-600 mt-2">
                    Введите email учителя и выберите ранг
                </p>
            </div>

            {/* Форма */}
            <Card className="p-6 mb-6">
                <div className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email учителя
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="teacher@example.com"
                            className="text-lg"
                        />
                    </div>

                    {/* Выбор ранга */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Выберите ранг (1-9)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {simpleRanks.map((rank) => {
                                const colors = rankColors[rank.color as keyof typeof rankColors]
                                const isSelected = selectedRank === rank.level

                                return (
                                    <button
                                        key={rank.level}
                                        onClick={() => setSelectedRank(rank.level)}
                                        className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? `${colors.border} ${colors.bg} scale-105 shadow-lg`
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">{rank.icon}</div>
                                            <div className={`font-bold ${isSelected ? colors.text : 'text-gray-800'}`}>
                                                {rank.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Уровень {rank.level}
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Кнопка */}
                    <Button
                        onClick={handleAssignRank}
                        className="w-full py-3 text-lg"
                        loading={isLoading}
                    >
                        Назначить ранг
                    </Button>

                    {/* Сообщение */}
                    {message && (
                        <div className={`p-4 rounded-lg ${message.startsWith('✅')
                                ? 'bg-green-50 border-2 border-green-200 text-green-800'
                                : 'bg-red-50 border-2 border-red-200 text-red-800'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </Card>

            {/* Информация */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">💡 Информация</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Введите email учителя точно как при регистрации</li>
                    <li>• Выберите ранг от 1 (Новичок) до 9 (Легенда)</li>
                    <li>• Ранг будет отображаться в профиле учителя</li>
                    <li>• Изменения применяются мгновенно</li>
                </ul>
            </Card>
        </div>
    )
}
