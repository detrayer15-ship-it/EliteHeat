import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/i18n/useTranslation'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '@/config/firebase'

export const ProfileEditPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        username: user?.email?.split('@')[0] || '',
        email: user?.email || '',
        phone: '',
        birthday: '',
        bio: '',
        city: user?.city || '',
    })

    const [photoFile, setPhotoFile] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Размер файла не должен превышать 5 МБ')
                return
            }

            if (!file.type.startsWith('image/')) {
                setError('Пожалуйста, выберите изображение')
                return
            }

            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            setError('')
        }
    }

    const handleDeletePhoto = () => {
        setPhotoFile(null)
        setPhotoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            let photoURL = user.photoURL || ''

            // Upload photo if selected
            if (photoFile) {
                const photoRef = ref(storage, `profile-photos/${user.id}/${Date.now()}_${photoFile.name}`)
                await uploadBytes(photoRef, photoFile)
                photoURL = await getDownloadURL(photoRef)

                // Delete old photo if exists
                if (user.photoURL) {
                    try {
                        const oldPhotoRef = ref(storage, user.photoURL)
                        await deleteObject(oldPhotoRef)
                    } catch (err) {
                        console.log('Old photo deletion failed:', err)
                    }
                }
            }

            // Update user data in Firestore
            const fullName = `${formData.firstName} ${formData.lastName}`.trim()
            const updatedData = {
                name: fullName,
                email: formData.email,
                city: formData.city,
                phone: formData.phone || undefined,
                birthday: formData.birthday || undefined,
                bio: formData.bio || undefined,
                username: formData.username,
                photoURL: photoURL || undefined,
            }

            await updateDoc(doc(db, 'users', user.id), updatedData)

            // Update local state
            setUser({
                ...user,
                ...updatedData,
            })

            setSuccess(t('notifications.saved'))
            setTimeout(() => {
                navigate('/settings')
            }, 1500)
        } catch (err: any) {
            console.error('Profile update error:', err)
            setError(err.message || 'Ошибка при сохранении профиля')
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold mb-2">Требуется авторизация</h2>
                <p className="text-gray-600 mb-4">Войдите, чтобы редактировать профиль</p>
                <Button onClick={() => navigate('/login')}>Войти</Button>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 page-transition">
            {/* Заголовок */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/settings')}>
                    ← {t('common.back')}
                </Button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t('profile.editTitle')}
                    </h1>
                    <p className="text-gray-600">{t('profile.editTitle')}</p>
                </div>
            </div>

            {/* Сообщения */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    ❌ {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
                    ✅ {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Фото профиля */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">{t('profile.uploadPhoto')}</h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Превью фото */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {photoPreview || user.photoURL ? (
                                    <img
                                        src={photoPreview || user.photoURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                        </div>

                        {/* Кнопки управления фото */}
                        <div className="flex-1 space-y-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto"
                            >
                                📸 {t('profile.uploadPhoto')}
                            </Button>
                            {(photoPreview || user.photoURL) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleDeletePhoto}
                                    className="w-full sm:w-auto text-red-600 hover:bg-red-50"
                                >
                                    🗑️ {t('profile.deletePhoto')}
                                </Button>
                            )}
                            <p className="text-sm text-gray-600">
                                Максимальный размер: 5 МБ. Форматы: JPG, PNG, GIF
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Основная информация */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">Основная информация</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label={t('profile.firstName')}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label={t('profile.lastName')}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label={t('profile.username')}
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label={t('profile.email')}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled
                        />
                        <Input
                            label={`${t('profile.phone')} (${t('profile.optional')})`}
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+7 (___) ___-__-__"
                        />
                        <Input
                            label={`${t('profile.birthday')} (${t('profile.optional')})`}
                            name="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={handleInputChange}
                        />
                        <Input
                            label={t('profile.city')}
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </Card>

                {/* О себе */}
                <Card>
                    <h2 className="text-xl font-bold mb-4">{t('profile.bio')}</h2>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
                        placeholder="Расскажите о себе..."
                    />
                </Card>

                {/* Кнопки действий */}
                <div className="flex gap-3">
                    <Button type="submit" loading={loading} className="flex-1">
                        💾 {t('profile.saveChanges')}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/settings')}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                </div>
            </form>
        </div>
    )
}
