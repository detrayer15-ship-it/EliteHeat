// Система рангов для учителей/админов
export interface Rank {
    id: string
    name: string
    minPoints: number
    maxPoints: number
    color: string
    icon: string
}

export const defaultRanks: Rank[] = [
    {
        id: 'novice',
        name: 'Новичок',
        minPoints: 0,
        maxPoints: 99,
        color: 'gray',
        icon: '🌱'
    },
    {
        id: 'apprentice',
        name: 'Ученик',
        minPoints: 100,
        maxPoints: 299,
        color: 'blue',
        icon: '📚'
    },
    {
        id: 'skilled',
        name: 'Опытный',
        minPoints: 300,
        maxPoints: 599,
        color: 'green',
        icon: '⭐'
    },
    {
        id: 'expert',
        name: 'Эксперт',
        minPoints: 600,
        maxPoints: 999,
        color: 'purple',
        icon: '💎'
    },
    {
        id: 'master',
        name: 'Мастер',
        minPoints: 1000,
        maxPoints: 1999,
        color: 'orange',
        icon: '👑'
    },
    {
        id: 'legend',
        name: 'Легенда',
        minPoints: 2000,
        maxPoints: Infinity,
        color: 'red',
        icon: '🔥'
    }
]

// Получить ранг по количеству очков
export const getRankByPoints = (points: number, customRanks?: Rank[]): Rank => {
    const ranks = customRanks || defaultRanks
    return ranks.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || ranks[0]
}

// Получить следующий ранг
export const getNextRank = (currentPoints: number, customRanks?: Rank[]): Rank | null => {
    const ranks = customRanks || defaultRanks
    const currentRank = getRankByPoints(currentPoints, ranks)
    const currentIndex = ranks.findIndex(r => r.id === currentRank.id)

    if (currentIndex === -1 || currentIndex === ranks.length - 1) {
        return null // Уже максимальный ранг
    }

    return ranks[currentIndex + 1]
}

// Прогресс до следующего ранга (0-100)
export const getProgressToNextRank = (currentPoints: number, customRanks?: Rank[]): number => {
    const currentRank = getRankByPoints(currentPoints, customRanks)
    const nextRank = getNextRank(currentPoints, customRanks)

    if (!nextRank) {
        return 100 // Максимальный ранг достигнут
    }

    const pointsInCurrentRank = currentPoints - currentRank.minPoints
    const pointsNeededForNextRank = nextRank.minPoints - currentRank.minPoints

    return Math.min(100, Math.round((pointsInCurrentRank / pointsNeededForNextRank) * 100))
}

// Очки до следующего ранга
export const getPointsToNextRank = (currentPoints: number, customRanks?: Rank[]): number => {
    const nextRank = getNextRank(currentPoints, customRanks)

    if (!nextRank) {
        return 0 // Максимальный ранг достигнут
    }

    return nextRank.minPoints - currentPoints
}

// Цвета для рангов
export const rankColors = {
    gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        gradient: 'from-gray-400 to-gray-600'
    },
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        gradient: 'from-blue-400 to-blue-600'
    },
    green: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        gradient: 'from-green-400 to-green-600'
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
        gradient: 'from-purple-400 to-purple-600'
    },
    orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300',
        gradient: 'from-orange-400 to-orange-600'
    },
    red: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        gradient: 'from-red-400 to-red-600'
    }
}
