import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen,
    Code,
    Palette,
    Database,
    Globe,
    Zap,
    Star,
    Clock,
    Users,
    TrendingUp,
    Award,
    Play,
    Sparkles,
    ChevronRight,
    Trophy
} from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface Course {
    id: string
    title: string
    description: string
    icon: any
    color: string
    lessons: number
    duration: string
    level: 'Начальный' | 'Средний' | 'Продвинутый'
    students: number
    rating: number
    progress?: number
}

const courses: Course[] = [
    {
        id: 'python',
        title: 'Python для начинающих',
        description: 'Изучите основы программирования на Python с нуля',
        icon: Code,
        color: 'indigo',
        lessons: 15,
        duration: '6 недель',
        level: 'Начальный',
        students: 1234,
        rating: 4.8,
        progress: 45
    },
    {
        id: 'figma',
        title: 'Дизайн в Figma',
        description: 'Создавайте профессиональные дизайны интерфейсов',
        icon: Palette,
        color: 'purple',
        lessons: 17,
        duration: '8 недель',
        level: 'Начальный',
        students: 987,
        rating: 4.9,
        progress: 30
    },
    {
        id: 'database',
        title: 'Работа с базами данных',
        description: 'SQL, NoSQL и управление данными',
        icon: Database,
        color: 'emerald',
        lessons: 12,
        duration: '5 недель',
        level: 'Средний',
        students: 654,
        rating: 4.7
    },
    {
        id: 'web',
        title: 'Веб-разработка',
        description: 'HTML, CSS, JavaScript и современные фреймворки',
        icon: Globe,
        color: 'blue',
        lessons: 20,
        duration: '10 недель',
        level: 'Средний',
        students: 1456,
        rating: 4.9
    },
    {
        id: 'react',
        title: 'React и TypeScript',
        description: 'Создание современных веб-приложений',
        icon: Zap,
        color: 'cyan',
        lessons: 18,
        duration: '9 недель',
        level: 'Продвинутый',
        students: 789,
        rating: 4.8
    },
    {
        id: 'ai',
        title: 'Искусственный интеллект',
        description: 'Машинное обучение и нейронные сети',
        icon: Star,
        color: 'amber',
        lessons: 25,
        duration: '12 недель',
        level: 'Продвинутый',
        students: 543,
        rating: 5.0
    }
]

export const CoursesPage = () => {
    const navigate = useNavigate()
    const [selectedLevel, setSelectedLevel] = useState<string>('all')

    const filteredCourses = selectedLevel === 'all'
        ? courses
        : courses.filter(c => c.level === selectedLevel)

    const getColorClass = (color: string) => {
        const classes: Record<string, string> = {
            indigo: 'from-indigo-500 to-blue-600 shadow-indigo-500/20 text-indigo-600 bg-indigo-50',
            purple: 'from-purple-500 to-pink-600 shadow-purple-500/20 text-purple-600 bg-purple-50',
            emerald: 'from-emerald-400 to-green-600 shadow-emerald-500/20 text-emerald-600 bg-emerald-50',
            blue: 'from-blue-400 to-indigo-600 shadow-blue-500/20 text-blue-600 bg-blue-50',
            cyan: 'from-cyan-400 to-blue-500 shadow-cyan-500/20 text-cyan-600 bg-cyan-50',
            amber: 'from-amber-400 to-orange-600 shadow-amber-500/20 text-amber-600 bg-amber-50',
        }
        return classes[color] || classes.indigo
    }

    const handleCourseClick = (courseId: string) => {
        if (courseId === 'python') navigate('/python-tasks')
        else if (courseId === 'figma') navigate('/figma-tasks')
    }

    return (
        <div className="min-h-full py-2 space-y-12">
            <ScrollReveal animation="fade">
                {/* HERO SECTION */}
                <div className="relative overflow-hidden bg-[#0a0a0c] rounded-[3rem] p-12 lg:p-20 shadow-3xl group">
                    {/* Animated Mesh */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
                        <div className="lg:col-span-3 space-y-8">
                            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Academy V4.0 • Level Up</span>
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                Твой путь к <br />
                                <span className="bg-gradient-to-r from-yellow-200 via-white to-cyan-200 bg-clip-text text-transparent italic">Мастерству</span>
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed">
                                Лучшие курсы для тех, кто хочет создавать будущее. От основ Python до архитектуры ИИ.
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            {[
                                { count: 32, label: 'Curriculums', icon: <BookOpen />, color: 'text-indigo-400' },
                                { count: 4663, label: 'Alumni', icon: <Users />, color: 'text-cyan-400' },
                                { count: 4.8, label: 'Rating', icon: <Star />, color: 'text-amber-400' },
                                { count: 12, label: 'Expert Mentors', icon: <Award />, color: 'text-emerald-400' },
                            ].map((stat, idx) => (
                                <div key={idx} className="glass-card-dark p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                                    <div className="text-2xl font-black text-white">
                                        <AnimatedCounter end={stat.count} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* FILTERS & NAVIGATION */}
            <ScrollReveal animation="slide-up">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'Начальный', 'Средний', 'Продвинутый'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`
                                    px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300
                                    ${selectedLevel === level
                                        ? 'bg-indigo-600 text-white shadow-glow translate-y-[-4px]'
                                        : 'bg-white/40 text-indigo-950/40 hover:bg-white hover:text-indigo-950 shadow-sm'
                                    }
                                `}
                            >
                                {level === 'all' ? 'Все уровни' : level}
                            </button>
                        ))}
                    </div>

                    <div className="h-0.5 flex-1 mx-8 bg-indigo-50 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-950/20 italic">Curated by Mita AI</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
                    </div>
                </div>
            </ScrollReveal>

            {/* COURSE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredCourses.map((course, idx) => {
                    const Icon = course.icon
                    const theme = getColorClass(course.color)
                    const [themeFrom, themeTo, , textClass, bgClass] = theme.split(' ')

                    return (
                        <ScrollReveal key={course.id} animation="scale" delay={idx * 100}>
                            <div
                                onClick={() => handleCourseClick(course.id)}
                                className="group cursor-pointer perspective-1000"
                            >
                                <div className="glass-premium rounded-[3rem] p-4 border border-white/60 shadow-xl overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transform-3d group-hover:rotate-y-[-5deg] group-hover:rotate-x-2">
                                    {/* Cover / Header */}
                                    <div className={`aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br ${themeFrom} ${themeTo} relative overflow-hidden p-10 flex flex-col justify-between`}>
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-[60px] animate-pulse"></div>
                                        </div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-[1.5rem] border border-white/20 text-white transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-black">
                                                <Star className="w-3.5 h-3.5 fill-current text-yellow-300" />
                                                {course.rating}
                                            </div>
                                        </div>

                                        <div className="relative z-10 mt-auto">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/20">
                                                    {course.level}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black text-white leading-tight">{course.title}</h3>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 space-y-6">
                                        <p className="text-indigo-950/40 text-sm font-medium leading-relaxed line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Progress Arc / Bar */}
                                        {course.progress !== undefined && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Progression</span>
                                                    <span className="text-xs font-black text-indigo-950">{course.progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-indigo-50 rounded-full overflow-hidden p-0.5 border border-indigo-100/50">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r ${themeFrom} ${themeTo} transition-all duration-1000 ease-out`}
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { icon: <Clock className="w-3.5 h-3.5" />, val: course.duration },
                                                { icon: <BookOpen className="w-3.5 h-3.5" />, val: course.lessons },
                                                { icon: <Users className="w-3.5 h-3.5" />, val: course.students },
                                            ].map((item, i) => (
                                                <div key={i} className="bg-indigo-50/50 p-3 rounded-2xl flex flex-col items-center gap-1">
                                                    <div className="text-indigo-400">{item.icon}</div>
                                                    <span className="text-[10px] font-black text-indigo-950/60 truncate w-full text-center">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button className={`w-full py-5 rounded-[1.8rem] bg-indigo-950 group-hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all duration-500`}>
                                            <Play className="w-4 h-4" />
                                            {course.progress ? 'Continue Drive' : 'Launch Session'}
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )
                })}
            </div>

            {/* CURATED INFO BANNER */}
            <ScrollReveal animation="fade" delay={500}>
                <div className="glass-premium rounded-[3rem] p-12 lg:p-16 border border-white/60 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] -z-10"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tighter">
                                Почему наши <br /> <span className="text-indigo-600">Курсы</span> другие?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'AI Personalized', desc: 'Мита адаптирует задания под твой темп и текущие знания.', icon: <Sparkles className="text-yellow-500" /> },
                                    { title: 'Project-First', desc: 'Ты не просто смотришь видео, ты строишь реальные продукты.', icon: <Zap className="text-indigo-600" /> },
                                ].map((feat, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-50 transition-all hover:scale-110">
                                            {feat.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-indigo-950 text-lg uppercase tracking-tight">{feat.title}</h4>
                                            <p className="text-indigo-900/60 font-medium">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="aspect-square bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[4rem] p-1 shadow-3xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                <div className="w-full h-full bg-[#0a0a0c] rounded-[3.8rem] flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
                                    <div className="text-center space-y-4 relative z-10 p-12">
                                        <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 animate-bounce-subtle">
                                            <Trophy className="w-10 h-10 text-yellow-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white">Стань Pro с EliteHeat</h3>
                                        <p className="text-white/40 font-medium">Получай сертификаты, которые ценятся в топовых IT компаниях.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <style>{`
                .glass-premium {
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px) saturate(180%);
                }
                .glass-card-dark {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                }
                .shadow-glow {
                    box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.5);
                }
                .transform-3d { transform-style: preserve-3d; }
                .shadow-3xl {
                    box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div >
    )
}
