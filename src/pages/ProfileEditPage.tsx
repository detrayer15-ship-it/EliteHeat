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
import {
    User,
    Camera,
    ChevronLeft,
    Trash2,
    Save,
    ShieldCheck,
    Zap,
    Sparkles,
    Fingerprint,
    Smartphone,
    Globe,
    Calendar,
    Briefcase
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

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
            if (photoFile) {
                const photoRef = ref(storage, `profile-photos/${user.id}/${Date.now()}_${photoFile.name}`)
                await uploadBytes(photoRef, photoFile)
                photoURL = await getDownloadURL(photoRef)
                if (user.photoURL) {
                    try {
                        const oldPhotoRef = ref(storage, user.photoURL)
                        await deleteObject(oldPhotoRef)
                    } catch (err) {
                        console.log('Old photo deletion failed:', err)
                    }
                }
            }

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
            setUser({ ...user, ...updatedData })
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

    if (!user) return null;

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO MODULE: BIOMETRIC DECK */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-8 flex-1">
                            <button
                                onClick={() => navigate('/settings')}
                                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Return to Config
                            </button>
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                                <Fingerprint className="w-5 h-5 text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Biometric Identification Module</span>
                            </div>
                            <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
                                Редактор <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Личности</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed italic">
                                Обновите свои идентификационные данные. Ваш профиль — это ваше лицо в экосистеме EliteHeat.
                            </p>
                        </div>

                        {/* HOLOGRAPHIC AVATAR RING */}
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-dashed border-indigo-500/30 animate-spin-slow absolute inset-0"></div>
                            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full p-4 relative">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center relative shadow-glow">
                                    {(photoPreview || user.photoURL) ? (
                                        <img src={photoPreview || user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-6xl font-black text-white/20 uppercase tracking-tighter">{(user.name || 'U').charAt(0)}</div>
                                    )}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-indigo-600/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2"
                                    >
                                        <Camera className="w-10 h-10 text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Update Core</span>
                                    </div>
                                </div>
                            </div>
                            {user.photoURL && (
                                <button
                                    onClick={handleDeletePhoto}
                                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white p-3 rounded-full hover:bg-rose-600 transition-all shadow-lg scale-90 hover:scale-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* ERROR / SUCCESS FEEDBACK */}
            {(error || success) && (
                <ScrollReveal animation="fade">
                    <div className={`p-8 rounded-[2rem] border-2 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 ${error ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                        {error ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                        {error || success}
                    </div>
                </ScrollReveal>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* CORE IDENTITY PANEL */}
                    <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm"><User className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Identity Core</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { name: 'firstName', label: 'First Terminal Name', icon: <User /> },
                                { name: 'lastName', label: 'Last Terminal Name', icon: <User /> },
                                { name: 'username', label: 'Handle / Username', icon: <Smartphone /> },
                                { name: 'email', label: 'Secure Email Access', icon: <Globe />, disabled: true },
                            ].map(field => (
                                <div key={field.name} className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">{field.label}</label>
                                    <div className={`relative ${field.disabled ? 'opacity-40' : ''}`}>
                                        <input
                                            className={`w-full bg-white border border-indigo-50 rounded-[2rem] p-8 pl-12 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all ${field.disabled ? 'cursor-not-allowed bg-indigo-50/50' : ''}`}
                                            name={field.name as any}
                                            value={(formData as any)[field.name]}
                                            onChange={handleInputChange}
                                            disabled={field.disabled}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BIO PANEL */}
                    <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm"><Briefcase className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase italic">Bio-Metric Narrative</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Profile Transmission Text</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-indigo-50 rounded-[3rem] p-10 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all min-h-[250px] resize-none"
                                placeholder="Describe your technical profile journey..."
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-10">
                    {/* ORIGIN PANEL */}
                    <div className="glass-premium rounded-[3.5rem] p-10 border border-white shadow-3xl space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm"><Globe className="w-6 h-6" /></div>
                            <h4 className="text-xl font-black text-indigo-950 tracking-tight uppercase italic">Origin Data</h4>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-4">Terminal Location</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full bg-indigo-50/30 border border-indigo-50 rounded-2xl p-6 text-indigo-950 font-medium text-lg"
                                    placeholder="City Hub"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-4">Comms Phone (Optional)</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-indigo-50/30 border border-indigo-50 rounded-2xl p-6 text-indigo-950 font-medium text-lg"
                                    placeholder="+7 (___) ___"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-4">Inception Date (Optional)</label>
                                <input
                                    name="birthday"
                                    type="date"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                    className="w-full bg-indigo-50/30 border border-indigo-50 rounded-2xl p-6 text-indigo-950 font-medium text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SAVE MODULE */}
                    <div className="space-y-4 sticky top-24">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-10 bg-[#0a0a0c] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-glow hover:scale-[1.02] group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            )}
                            <span>Commit Core Changes</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/settings')}
                            className="w-full py-6 border-2 border-indigo-50 text-indigo-950/30 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 hover:text-indigo-950 transition-all"
                        >
                            Abort Protocol
                        </button>
                        <div className="bg-indigo-50/50 p-6 rounded-[2rem] text-center border border-indigo-100 italic">
                            <p className="text-[10px] font-medium text-indigo-950/40">Your data is stored in the secure Firestore terminal with military-grade encryption.</p>
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 2s linear infinite; }
            `}</style>
        </div>
    )
}
