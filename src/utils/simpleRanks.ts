// Упрощённая система рангов (1-9)
export interface SimpleRank {
    level: number
    name: string
    icon: string
    color: string
}

export const simpleRanks: SimpleRank[] = [
    { level: 1, name: 'Новичок', icon: '🌱', color: 'gray' },
    { level: 2, name: 'Стажёр', icon: '📚', color: 'blue' },
    { level: 3, name: 'Практикант', icon: '💼', color: 'cyan' },
    { level: 4, name: 'Специалист', icon: '⭐', color: 'green' },
    { level: 5, name: 'Профессионал', icon: '💎', color: 'teal' },
    { level: 6, name: 'Эксперт', icon: '🎯', color: 'purple' },
    { level: 7, name: 'Мастер', icon: '👑', color: 'orange' },
    { level: 8, name: 'Гуру', icon: '🔥', color: 'red' },
    { level: 9, name: 'Легенда', icon: '⚡', color: 'yellow' }
]

// Получить ранг по уровню
export const getRankByLevel = (level: number): SimpleRank => {
    return simpleRanks.find(r => r.level === level) || simpleRanks[0]
}

// Цвета для рангов
export const rankColors = {
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
    red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
}
