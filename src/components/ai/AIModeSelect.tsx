import { Lightbulb, BookOpen, Code, Wrench, Bug, Palette } from 'lucide-react'

interface AIModeSelectProps {
    selectedMode: 'tutor' | 'hint' | 'solution' | 'developer' | 'debug' | 'product'
    onModeChange: (mode: 'tutor' | 'hint' | 'solution' | 'developer' | 'debug' | 'product') => void
}

const MODES = [
    {
        id: 'tutor' as const,
        name: 'Наставник',
        icon: BookOpen,
        description: 'Подсказки и направление',
        color: 'from-blue-500 to-indigo-600',
        emoji: '🎓'
    },
    {
        id: 'hint' as const,
        name: 'Подсказка',
        icon: Lightbulb,
        description: 'Только идея, без кода',
        color: 'from-yellow-400 to-orange-500',
        emoji: '💡'
    },
    {
        id: 'solution' as const,
        name: 'Решение',
        icon: Code,
        description: 'Полный код с разбором',
        color: 'from-purple-500 to-pink-600',
        emoji: '📝'
    },
    {
        id: 'developer' as const,
        name: 'Разработчик',
        icon: Wrench,
        description: 'Best practices',
        color: 'from-emerald-500 to-teal-600',
        emoji: '🛠️'
    },
    {
        id: 'debug' as const,
        name: 'Отладка',
        icon: Bug,
        description: 'Поиск и исправление ошибок',
        color: 'from-red-500 to-rose-600',
        emoji: '🐛'
    },
    {
        id: 'product' as const,
        name: 'UI/UX',
        icon: Palette,
        description: 'Дизайн и продукт',
        color: 'from-pink-500 to-purple-600',
        emoji: '🎨'
    }
]

export const AIModeSelect = ({ selectedMode, onModeChange }: AIModeSelectProps) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-indigo-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="px-2 border-r border-indigo-100 mr-2 flex-shrink-0">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Режим AI</h3>
            </div>

            <div className="flex gap-2 flex-nowrap">
                {MODES.map((mode) => {
                    const isSelected = selectedMode === mode.id

                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`
                                relative p-2 px-3 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                                ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                                    : 'border-transparent bg-transparent text-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600'
                                }
                            `}
                            title={mode.description}
                        >
                            <span className="text-sm">{mode.emoji}</span>
                            <span className="text-[11px] font-bold">{mode.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
