import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { roleLabels } from '@/types/user'

export const UsersPage = () => {
    const navigate = useNavigate()
    const users = useAuthStore((state) => state.users)
    const currentUser = useAuthStore((state) => state.user)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'developer': return 'bg-purple-100 text-purple-800'
            case 'senior_admin': return 'bg-orange-100 text-orange-800'
            case 'admin': return 'bg-red-100 text-red-800'
            default: return 'bg-blue-100 text-blue-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text mb-2">👥 Все пользователи</h1>
                <p className="text-gray-600">Сообщество EliteHeat - {users.length} пользователей</p>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="🔍 Поиск по имени или email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={roleFilter === 'all' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('all')}
                        >
                            Все
                        </Button>
                        <Button
                            variant={roleFilter === 'student' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('student')}
                        >
                            🎓 Ученики
                        </Button>
                        <Button
                            variant={roleFilter === 'admin' ? 'primary' : 'secondary'}
                            onClick={() => setRoleFilter('admin')}
                        >
                            👑 Учителя
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-smooth cursor-pointer">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-ai-blue rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-text truncate">{user.name}</h3>
                                    {user.id === currentUser?.id && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Вы</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 truncate mb-2">{user.email}</p>

                                {/* Role Badge */}
                                <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getRoleBadgeColor(user.role)}`}>
                                    {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                                </span>

                                {/* Stats */}
                                <div className="flex gap-4 mt-3 text-sm">
                                    <div>
                                        <span className="text-gray-500">Уровень:</span>
                                        <span className="ml-1 font-semibold text-primary">{user.level || 1}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Очки:</span>
                                        <span className="ml-1 font-semibold text-warning">{user.points || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-text mb-2">Пользователи не найдены</h3>
                        <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
                    </div>
                </Card>
            )}
        </div>
    )
}
