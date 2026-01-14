import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    ArrowLeft,
    User,
    Bell,
    Lock,
    Shield,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    Globe,
    ShieldCheck,
    Eye,
    ShieldAlert,
    Smartphone,
    Save,
    Trash2,
    ChevronRight,
    Camera
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

export const SettingsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [activeTab, setActiveTab] = useState('account')
    const [settings, setSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        language: 'ru',
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
        { id: 'account', name: 'Identity', icon: User },
        { id: 'notifications', name: 'Alerts', icon: Bell },
        ...(user?.role === 'student' ? [{ id: 'chats', name: 'Comms', icon: MessageSquare }] : []),
        { id: 'privacy', name: 'Privacy', icon: Eye },
        { id: 'security', name: 'Defense', icon: Shield }
    ]

    const handleSave = () => {
        alert('Config Protocol Updated!')
    }

    const handleLanguageChange = (lang: string) => {
        setSettings({ ...settings, language: lang })
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            {/* HERO MODULE: THE CONTROL DECK */}
            <ScrollReveal animation="fade">
                <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden group shadow-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-8 flex-1">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                                <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Configuration v4.0</span>
                            </div>
                            <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
                                Контроль <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent italic">Системы</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed italic">
                                Настройте свой цифровой опыт под себя. Безопасность, уведомления и визуальная составляющая в одном месте.
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
                            <div className="absolute bottom-4 -right-4 bg-emerald-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20">Online</div>
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
                            <button className="flex items-center gap-4 text-rose-500/60 hover:text-rose-500 transition-colors font-black uppercase tracking-widest text-[10px]">
                                <LogOut className="w-5 h-5" /> Sign Out Protocol
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3">
                    <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl space-y-16">
                        {/* ACCOUNT INTERFACE */}
                        {activeTab === 'account' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Личность</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Ваши основные учетные данные в системе EliteHeat.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Full Terminal Name</label>
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
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-950/30 ml-8">Registration Protocol (Email)</label>
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
                                            <h3 className="text-xl font-black text-indigo-950 tracking-tight">Язык Интерфейса</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'ru', name: 'Русский', icon: '🇷🇺' },
                                                { id: 'en', name: 'English', icon: '🇬🇧' },
                                                { id: 'kz', name: 'Қазақша', icon: '🇰🇿' }
                                            ].map(lang => (
                                                <button
                                                    key={lang.id}
                                                    onClick={() => handleLanguageChange(lang.id)}
                                                    className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 ${settings.language === lang.id ? 'bg-indigo-600 border-indigo-400 shadow-glow text-white' : 'bg-white border-indigo-50 text-indigo-950/40 hover:border-indigo-200'}`}
                                                >
                                                    <span className="text-4xl">{lang.icon}</span>
                                                    <span className="font-black uppercase tracking-widest text-[10px]">{lang.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS INTERFACE */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Оповещения</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Управляйте потоком входящей информации.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: 'deadlines', title: 'Дедлайны Заданий', desc: 'Уведомления о завершающихся сроках.' },
                                        { id: 'teacher', title: 'Фидбек Наставника', desc: 'Когда куратор проверил ваше задание.' },
                                        { id: 'progress', title: 'Развитие Системы', desc: 'Ваши достижения и поднятие уровня.' },
                                        { id: 'chat', title: 'Коммуникации', desc: 'Новые сообщения в общих и личных чатах.' },
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-8 bg-white border border-indigo-50 rounded-[2.5rem] group hover:border-indigo-400 transition-all">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black text-indigo-950 tracking-tight">{item.title}</h4>
                                                <p className="text-sm text-indigo-900/40 font-medium">{item.desc}</p>
                                            </div>
                                            <div className="relative inline-flex h-12 w-24 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none bg-gray-100 p-1">
                                                <button
                                                    onClick={() => setSettings({ ...settings, notifications: { ...settings.notifications, [item.id]: !((settings.notifications as any)[item.id]) } })}
                                                    className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${(settings.notifications as any)[item.id] ? 'translate-x-12 bg-indigo-600' : 'translate-x-0'}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY INTERFACE */}
                        {activeTab === 'security' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Безопасность</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Защита вашего цифрового следа и доступа.</p>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-[#0a0a0c] p-12 rounded-[3.5rem] space-y-10 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 text-white/5"><ShieldAlert className="w-32 h-32" /></div>
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-2xl font-black italic">Обновить Пароль</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="password" placeholder="Old Protocol Code" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-indigo-500 transition-all" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="password" placeholder="New Neural Code" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-indigo-500 transition-all" />
                                                    <input type="password" placeholder="Verify New Code" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-indigo-500 transition-all" />
                                                </div>
                                            </div>
                                            <button className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-105">Зашифровать Новый Код</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-10 bg-white border-2 border-indigo-50 rounded-[3rem] space-y-6 group hover:border-indigo-500 transition-all">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Smartphone className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black text-indigo-950 tracking-tight">2FA Authenticator</h4>
                                                <p className="text-sm text-indigo-950/40 font-medium">Двухфакторная защита аккаунта.</p>
                                            </div>
                                            <button className="w-full py-4 border-2 border-indigo-50 rounded-2xl font-black uppercase tracking-widest text-[10px] text-indigo-950/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Включить</button>
                                        </div>
                                        <div className="p-10 bg-rose-50 border-2 border-rose-100 rounded-[3rem] space-y-6 group hover:bg-rose-100 transition-all">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all"><Trash2 className="w-8 h-8" /></div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black text-rose-950 tracking-tight">Самоликвидация</h4>
                                                <p className="text-sm text-rose-950/40 font-medium italic">Удаление профиля и всех данных.</p>
                                            </div>
                                            <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all">Удалить Навсегда</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRIVACY INTERFACE */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-indigo-950 tracking-tighter">Приватность</h2>
                                    <p className="text-indigo-900/40 text-lg font-medium italic">Управление видимостью вашего профиля в экосистеме.</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: 'p1', title: 'Публичный Профиль', desc: 'Ваши достижения видны другим участникам.' },
                                        { id: 'p2', title: 'Показывать Email', desc: 'Email будет виден в карточке профиля.' },
                                        { id: 'p3', title: 'Личные Сообщения', desc: 'Разрешить другим писать вам в Direct.' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-8 bg-white border border-indigo-50 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-400 transition-all group">
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-indigo-950 tracking-tight">{item.title}</h4>
                                                <p className="text-indigo-950/40 text-sm font-medium">{item.desc}</p>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Eye className="w-6 h-6" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-10 border-t border-indigo-50 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-indigo-700 hover:shadow-glow transition-all group"
                            >
                                <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Оживить Конфигурацию
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
            `}</style>
        </div>
    )
}
