import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export const ProfileEditPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const updateProfile = useAuthStore((state) => state.updateProfile)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        address: user?.address || '',
        age: user?.age?.toString() || '',
        birthday: user?.birthday || '',
    })

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) return

        updateProfile({
            name: formData.name,
            email: formData.email,
            bio: formData.bio,
            address: formData.address,
            age: formData.age ? parseInt(formData.age) : undefined,
            birthday: formData.birthday,
            avatar: avatarPreview || user.avatar,
        })

        alert('✅ Профиль успешно обновлён!')
        navigate('/settings')
    }

    if (!user) {
        navigate('/login')
        return null
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/settings')}>
                    ← Назад к настройкам
                </Button>
            </div>

            <Card>
                <h1 className="text-3xl font-bold text-text mb-2">Редактирование профиля</h1>
                <p className="text-gray-600 mb-6">Обновите свою личную информацию</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Фото профиля
                        </label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center font-bold text-4xl overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label htmlFor="avatar-upload">
                                    <Button type="button" variant="secondary" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                        Загрузить фото
                                    </Button>
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG или GIF. Максимум 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <Input
                        label="Имя и Фамилия"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Иван Иванов"
                        required
                    />

                    {/* Email */}
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                    />

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            О себе
                        </label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Расскажите немного о себе..."
                            rows={4}
                        />
                    </div>

                    {/* Address */}
                    <Input
                        label="Адрес"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Город, Страна"
                    />

                    {/* Age and Birthday */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Возраст"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            placeholder="25"
                            min="6"
                            max="100"
                        />

                        <Input
                            label="День рождения"
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="submit">
                            Сохранить изменения
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/settings')}>
                            Отмена
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
