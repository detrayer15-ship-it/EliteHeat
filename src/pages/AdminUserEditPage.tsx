import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

export const AdminUserEditPage = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        city: '',
        level: 1,
        points: 0,
        adminPoints: 0,
        subscriptionPlan: 'free',
        subscriptionStatus: 'inactive',
        subscriptionEndDate: ''
    })

    useEffect(() => {
        loadUser()
    }, [userId])

    // Проверка доступа - только developer
    if (currentUser?.role !== 'developer') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Доступ запрещён</h1>
                <p>Только разработчики могут редактировать пользователей.</p>
                <Button onClick={() => navigate('/admin/users')} className="mt-4">
                    Назад к списку
                </Button>
            </div>
        )
    }

    const loadUser = async () => {
        if (!userId) return

        try {
            const userDoc = await getDoc(doc(db, 'users', userId))
            if (userDoc.exists()) {
                const userData = userDoc.data()
                setUser(userData)
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: userData.role || 'student',
                    city: userData.city || '',
                    level: userData.level || 1,
                    points: userData.points || 0,
                    adminPoints: userData.adminPoints || 0,
                    subscriptionPlan: userData.subscriptionPlan || 'free',
                    subscriptionStatus: userData.subscriptionStatus || 'inactive',
                    subscriptionEndDate: userData.subscriptionEndDate?.toDate?.()?.toISOString()?.split('T')[0] || userData.subscriptionEndDate || ''
                })
            }
        } catch (error) {
            console.error('Error loading user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!userId) return

        try {
            await updateDoc(doc(db, 'users', userId), formData)
            alert('✅ Пользователь обновлён!')
            navigate('/admin/users')
        } catch (error) {
            console.error('Error updating user:', error)
            alert('❌ Ошибка при обновлении')
        }
    }

    const handleDelete = async () => {
        if (!userId) return

        const confirm = window.confirm('⚠️ Вы уверены? Это действие необратимо!')
        if (!confirm) return

        try {
            await deleteDoc(doc(db, 'users', userId))
            alert('✅ Пользователь удалён!')
            navigate('/admin/users')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('❌ Ошибка при удалении')
        }
    }

    if (loading) {
        return <div className="p-6">Загрузка...</div>
    }

    if (!user) {
        return <div className="p-6">Пользователь не найден</div>
    }

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Редактирование пользователя</h1>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Роль</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                        <option value="student">🎒 Ученик</option>
                        <option value="admin">👨‍🏫 Преподаватель</option>
                        <option value="developer">👑 Разработчик</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Город</label>
                    <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Уровень</label>
                        <Input
                            type="number"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Очки</label>
                        <Input
                            type="number"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Admin Points</label>
                        <Input
                            type="number"
                            value={formData.adminPoints}
                            onChange={(e) => setFormData({ ...formData, adminPoints: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">План подписки</label>
                        <select
                            value={formData.subscriptionPlan}
                            onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="free">FREE</option>
                            <option value="monthly">MONTHLY</option>
                            <option value="yearly">YEARLY</option>
                            <option value="lifetime">LIFETIME</option>
                            <option value="family">FAMILY</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Статус</label>
                        <select
                            value={formData.subscriptionStatus}
                            onChange={(e) => setFormData({ ...formData, subscriptionStatus: e.target.value as any })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        >
                            <option value="active">✅ Active</option>
                            <option value="inactive">❌ Inactive</option>
                            <option value="trial">⏳ Trial</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Дата окончания</label>
                        <Input
                            type="date"
                            value={formData.subscriptionEndDate}
                            onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                        💾 Сохранить
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/users')} className="flex-1">
                        ← Отмена
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                        🗑️ Удалить
                    </Button>
                </div>
            </div>
        </div>
    )
}
