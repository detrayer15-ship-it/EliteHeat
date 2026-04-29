import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useLanguageStore, Language } from '@/store/languageStore'
import { useSettingsStore } from '@/store/settingsStore'
import {
    ArrowLeft,
    User,
    Bell,
    Lock,
    Shield,
    MessageSquare,
    Settings,
    LogOut,
    Globe,
    ShieldCheck,
    Eye,
    ShieldAlert,
    Smartphone,
    Save,
    Trash2,
    ChevronRight,
    Camera,
    CheckCircle
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

export const SettingsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const logout = useAuthStore((state) => state.logout)
    const { language, setLanguage } = useLanguageStore()
    const uiScale = useSettingsStore(s => s.uiScale)
    const fontFamily = useSettingsStore(s => s.fontFamily)
    const setUiScale = useSettingsStore(s => s.setUiScale)
    const setFontFamily = useSettingsStore(s => s.setFontFamily)
    const [activeTab, setActiveTab] = useState('account')
    const [saved, setSaved] = useState(false)
    const [settings, setSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        notifications: {
            deadlines: true,
            teacher: true,
            progress: true,
            chat: true
        },
        privacy: {
            profileVisible: true,
            showEmail: false,
            allowMessages: true
        },
        security: {
            twoFactor: false,
            loginAlerts: true
        }
    })

    const tabs = [
        { id: 'account', name: 'Профиль', icon: User },
        { id: 'notifications', name: 'Уведомления', icon: Bell },
        { id: 'privacy', name: 'Приватность', icon: Eye },
        { id: 'security', name: 'Безопасность', icon: Shield }
    ]

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang)
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-8 flex-1">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                                <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Настройки</span>
                            </div>
                            <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
                                Контроль <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Системы</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed italic">
                                Настройте свой опыт обучения. Язык, уведомления и безопасность в одном месте.
                            </p>
                        </div>

                        <div className="relative group/profile flex-shrink-0">
                            <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 group-hover/profile:opacity-40 transition-all"></div>
                            <div className="w-64 h-64 rounded-full border border-white/10 p-2 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/30 animate-spin-slow"></div>
                                <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center relative group">
                                    <User className="w-24 h-24 text-white/20 group-hover:text-white/40 transition-colors" />
                                    <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 -right-4 bg-emerald-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20">Онлайн</div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* SETTINGS MENU */}
                <div className="lg:col-span-1">
                    <div className="glass-premium rounded-[3rem] p-6 border border-white shadow-3xl sticky top-24">
                        <div className="space-y-3">
                            {tabs.map(tab => {
                                const Icon = tab.icon
                                const isActive = activeTab === tab.id
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left p-6 rounded-3xl flex items-center gap-6 transition-all group ${isActive ? 'bg-indigo-600 text-white shadow-glow translate-x-3' : 'bg-white/40 text-indigo-950/40 hover:bg-white hover:text-indigo-950'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
                                            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-[10px]">{tab.name}</span>
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-40" />}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-10 pt-10 border-t border-indigo-50 px-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 text-rose-500/60 hover:text-rose-500 transition-colors font-black uppercase tracking-widest text-[10px]"
                            >
                                <LogOut className="w-5 h-5" /> Выйти из аккаунта
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3">
                    <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl space-y-16">
                        {/* ACCOUNT / PROFILE */}
                        {activeTab === 'account' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Профиль</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Ваши данные в системе EliteHeat.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Ваше имя</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-8 flex items-center text-indigo-400"><User className="w-5 h-5" /></div>
                                            <input
                                                className="w-full bg-white border border-indigo-50 rounded-[2rem] p-8 pl-18 text-indigo-950 font-medium text-lg focus:ring-8 focus:ring-indigo-100 transition-all shadow-sm"
                                                value={settings.name}
                                                onChange={e => setSettings({ ...settings, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Email (не изменяется)</label>
                                        <div className="relative opacity-60">
                                            <div className="absolute inset-y-0 left-8 flex items-center text-indigo-300"><ShieldCheck className="w-5 h-5" /></div>
                                            <input
                                                className="w-full bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 pl-18 text-indigo-950/40 font-medium text-lg cursor-not-allowed"
                                                value={settings.email}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8 pt-8 border-t border-indigo-50">
                                        <div className="flex items-center gap-4">
                                            <Globe className="w-6 h-6 text-indigo-400" />
                                            <h3 className="text-xl font-black text-indigo-950 tracking-tight">Язык интерфейса</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'ru' as Language, name: 'Русский', icon: '🇷🇺' },
                                                { id: 'en' as Language, name: 'English', icon: '🇬🇧' },
                                                { id: 'kz' as Language, name: 'Қазақша', icon: '🇰🇿' }
                                            ].map(lang => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() => handleLanguageChange(lang.id)}
                                                    className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${language === lang.id ? 'bg-indigo-600 border-indigo-400 shadow-glow text-white' : 'bg-white border-indigo-50 text-indigo-950/40 hover:border-indigo-200'}`}
                                                >
                                                    <span className="text-4xl">{lang.icon}</span>
                                                    <span className="font-black uppercase tracking-widest text-[10px]">{lang.name}</span>
                                                    {language === lang.id && <CheckCircle className="w-5 h-5 text-white/80" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8 pt-8 border-t border-indigo-50">
                                        <div className="flex items-center gap-4">
                                            <Settings className="w-6 h-6 text-indigo-400" />
                                            <h3 className="text-xl font-black text-indigo-950 tracking-tight">Дизайн интерфейса</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-8 bg-white border border-indigo-50 rounded-[2.5rem] space-y-4 hover:border-indigo-200 transition-all">
                                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30">Масштаб</div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    {([
                                                        { v: 0.9 as const, label: '90%' },
                                                        { v: 1 as const, label: '100%' },
                                                        { v: 1.1 as const, label: '110%' },
                                                        { v: 1.2 as const, label: '120%' },
                                                    ]).map(opt => (
                                                        <button
                                                            key={opt.v}
                                                            onClick={() => setUiScale(opt.v)}
                                                            className={`py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${uiScale === opt.v
                                                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow'
                                                                : 'bg-indigo-50 border-indigo-100 text-indigo-950/50 hover:border-indigo-300'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-indigo-950/40 font-medium">
                                                    Увеличивает/уменьшает интерфейс под разные устройства и зрение.
                                                </p>
                                            </div>

                                            <div className="p-8 bg-white border border-indigo-50 rounded-[2.5rem] space-y-4 hover:border-indigo-200 transition-all">
                                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30">Шрифт</div>
                                                <div className="space-y-3">
                                                    {([
                                                        { v: 'inter' as const, label: 'Inter (рекомендуется)' },
                                                        { v: 'system' as const, label: 'System' },
                                                        { v: 'mono' as const, label: 'Mono' },
                                                    ]).map(opt => (
                                                        <button
                                                            key={opt.v}
                                                            onClick={() => setFontFamily(opt.v)}
                                                            className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${fontFamily === opt.v
                                                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow'
                                                                : 'bg-indigo-50 border-indigo-100 text-indigo-950/50 hover:border-indigo-300'
                                                            }`}
                                                        >
                                                            <span className="font-black uppercase tracking-widest text-[10px]">{opt.label}</span>
                                                            {fontFamily === opt.v && <CheckCircle className="w-5 h-5 text-white/80" />}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-indigo-950/40 font-medium">
                                                    Меняет ощущение “строго/мягко” и удобство чтения.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Уведомления</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Управляйте потоком входящей информации.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: 'deadlines', title: 'Дедлайны заданий', desc: 'Уведомления о завершающихся сроках сдачи.' },
                                        { id: 'teacher', title: 'Оценки от учителя', desc: 'Когда учитель проверил ваше задание.' },
                                        { id: 'progress', title: 'Прогресс обучения', desc: 'Ваши достижения и поднятие уровня.' },
                                        { id: 'chat', title: 'Сообщения', desc: 'Новые сообщения в чатах.' },
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-8 bg-white border border-indigo-50 rounded-[2.5rem] group hover:border-indigo-400 transition-all">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-indigo-950 tracking-tight">{item.title}</h4>
                                                <p className="text-sm text-indigo-900/40 font-medium">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setSettings({
                                                    ...settings,
                                                    notifications: {
                                                        ...settings.notifications,
                                                        [item.id]: !((settings.notifications as any)[item.id])
                                                    }
                                                })}
                                                className={`relative w-16 h-9 rounded-full transition-all duration-300 ${(settings.notifications as any)[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300 ${(settings.notifications as any)[item.id] ? 'left-8' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY */}
                        {activeTab === 'security' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Безопасность</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Защита вашего аккаунта и данных.</p>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-[#0a0a0c] p-12 rounded-[3.5rem] space-y-10 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 text-white/5"><ShieldAlert className="w-32 h-32" /></div>
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-2xl font-black italic">Смена пароля</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="password" placeholder="Текущий пароль" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/30 focus:border-indigo-500 transition-all" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="password" placeholder="Новый пароль" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/30 focus:border-indigo-500 transition-all" />
                                                    <input type="password" placeholder="Подтвердите пароль" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/30 focus:border-indigo-500 transition-all" />
                                                </div>
                                            </div>
                                            <button className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105">Сменить пароль</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-10 bg-white border-2 border-indigo-50 rounded-[3rem] space-y-6 group hover:border-indigo-500 transition-all">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Smartphone className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black text-indigo-950 tracking-tight">Двухфакторная защита</h4>
                                                <p className="text-sm text-indigo-950/40 font-medium">Дополнительная защита аккаунта через SMS.</p>
                                            </div>
                                            <button className="w-full py-4 border-2 border-indigo-50 rounded-2xl font-black uppercase tracking-widest text-[10px] text-indigo-950/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Включить</button>
                                        </div>
                                        <div className="p-10 bg-rose-50 border-2 border-rose-100 rounded-[3rem] space-y-6 group hover:bg-rose-100 transition-all">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all"><Trash2 className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black text-rose-950 tracking-tight">Удаление аккаунта</h4>
                                                <p className="text-sm text-rose-950/40 font-medium italic">Удаление профиля и всех данных навсегда.</p>
                                            </div>
                                            <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all">Удалить навсегда</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRIVACY */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Приватность</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Управление видимостью вашего профиля.</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: 'profileVisible', title: 'Публичный профиль', desc: 'Ваши достижения видны другим ученикам.' },
                                        { id: 'showEmail', title: 'Показывать Email', desc: 'Email будет виден в карточке профиля.' },
                                        { id: 'allowMessages', title: 'Личные сообщения', desc: 'Разрешить другим отправлять вам сообщения.' },
                                    ].map((item) => (
                                        <div key={item.id} className="p-8 bg-white border border-indigo-50 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-400 transition-all group">
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-indigo-950 tracking-tight">{item.title}</h4>
                                                <p className="text-indigo-950/40 text-sm font-medium">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setSettings({
                                                    ...settings,
                                                    privacy: {
                                                        ...settings.privacy,
                                                        [item.id]: !((settings.privacy as any)[item.id])
                                                    }
                                                })}
                                                className={`relative w-16 h-9 rounded-full transition-all duration-300 ${(settings.privacy as any)[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300 ${(settings.privacy as any)[item.id] ? 'left-8' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SAVE BUTTON */}
                        <div className="pt-10 border-t border-indigo-50 flex justify-end">
                            <button
                                onClick={handleSave}
                                className={`px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 transition-all group ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-glow'}`}
                            >
                                {saved ? (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        Сохранено!
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        Сохранить настройки
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
                .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                .pl-18 { padding-left: 4.5rem; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    )
}
