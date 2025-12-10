// Система рангов для админов
export interface AdminRank {
    level: number
    name: string
    minPoints: number
    maxPoints: number
    color: string
    icon: string
    description: string
}

export const adminRanks: AdminRank[] = [
    {
        level: 1,
        name: 'Стажёр',
        minPoints: 0,
        maxPoints: 49,
        color: 'from-gray-400 to-gray-500',
        icon: '🌱',
        description: 'Начинающий администратор, только знакомится с платформой'
    },
    {
        level: 2,
        name: 'Помощник',
        minPoints: 50,
        maxPoints: 99,
        color: 'from-blue-400 to-blue-500',
        icon: '🎯',
        description: 'Помогает в проверке заданий и поддержке учеников'
    },
    {
        level: 3,
        name: 'Модератор',
        minPoints: 100,
        maxPoints: 199,
        color: 'from-green-400 to-green-500',
        icon: '⚡',
        description: 'Активно модерирует контент и помогает ученикам'
    },
    {
        level: 4,
        name: 'Ментор',
        minPoints: 200,
        maxPoints: 349,
        color: 'from-purple-400 to-purple-500',
        icon: '🎓',
        description: 'Наставник для учеников, помогает в обучении'
    },
    {
        level: 5,
        name: 'Эксперт',
        minPoints: 350,
        maxPoints: 549,
        color: 'from-yellow-400 to-yellow-500',
        icon: '⭐',
        description: 'Эксперт в своей области, проверяет сложные задания'
    },
    {
        level: 6,
        name: 'Мастер',
        minPoints: 550,
        maxPoints: 799,
        color: 'from-orange-400 to-orange-500',
        icon: '🔥',
        description: 'Мастер своего дела, высокий уровень компетенции'
    },
    {
        level: 7,
        name: 'Гуру',
        minPoints: 800,
        maxPoints: 1099,
        color: 'from-red-400 to-red-500',
        icon: '💎',
        description: 'Гуру платформы, обладает глубокими знаниями'
    },
    {
        level: 8,
        name: 'Легенда',
        minPoints: 1100,
        maxPoints: 1499,
        color: 'from-pink-400 to-pink-500',
        icon: '👑',
        description: 'Легендарный администратор, вносит огромный вклад'
    },
    {
        level: 9,
        name: 'Архитектор',
        minPoints: 1500,
        maxPoints: 1999,
        color: 'from-indigo-400 to-indigo-500',
        icon: '🏆',
        description: 'Архитектор платформы, формирует её развитие'
    },
    {
        level: 10,
        name: 'Разработчик',
        minPoints: 2000,
        maxPoints: Infinity,
        color: 'from-cyan-400 via-blue-500 to-purple-600',
        icon: '🚀',
        description: 'Создатель платформы EliteHeat, высший ранг'
    }
]

// Действия, за которые начисляются очки
export const pointsActions = {
    REVIEW_TASK: 5,           // Проверка задания
    APPROVE_TASK: 3,          // Одобрение задания
    REJECT_TASK: 2,           // Отклонение задания
    REPLY_MESSAGE: 1,         // Ответ на сообщение
    CREATE_COURSE: 10,        // Создание курса
    ADD_LESSON: 5,            // Добавление урока
    HELP_STUDENT: 3,          // Помощь ученику
    DAILY_LOGIN: 1,           // Ежедневный вход
}

// Получить ранг по очкам
export const getRankByPoints = (points: number): AdminRank => {
    return adminRanks.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || adminRanks[0]
}

// Получить прогресс до следующего ранга
export const getProgressToNextRank = (points: number): { current: AdminRank; next: AdminRank | null; progress: number } => {
    const current = getRankByPoints(points)
    const nextRankIndex = adminRanks.findIndex(r => r.level === current.level) + 1
    const next = nextRankIndex < adminRanks.length ? adminRanks[nextRankIndex] : null

    if (!next) {
        return { current, next: null, progress: 100 }
    }

    const pointsInCurrentRank = points - current.minPoints
    const pointsNeededForNextRank = next.minPoints - current.minPoints
    const progress = Math.min(100, (pointsInCurrentRank / pointsNeededForNextRank) * 100)

    return { current, next, progress }
}
