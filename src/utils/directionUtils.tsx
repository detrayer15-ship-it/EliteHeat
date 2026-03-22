import {
    Globe, Gamepad2, Terminal, Layers
} from 'lucide-react'

export const directionIcons: Record<string, any> = {
    'Веб разработчик': Globe,
    'Roblox': Gamepad2,
    'Python': Terminal,
    'UI/UX Дизайн': Layers,
}

export const directionGradients: Record<string, string> = {
    'Веб разработчик': 'from-amber-400 to-orange-600',
    'Roblox': 'from-emerald-400 to-teal-600',
    'Python': 'from-blue-400 to-indigo-600',
    'UI/UX Дизайн': 'from-indigo-400 to-purple-500',
}
