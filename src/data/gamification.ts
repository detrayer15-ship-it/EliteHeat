/**
 * Данные для системы геймификации
 */

import { Level, Badge } from '@/types/gamification';

// Уровни студента
export const LEVELS: Level[] = [
  {
    level: 'novice',
    name: 'Новичок',
    minXP: 0,
    maxXP: 100,
    icon: '🌱',
    color: '#10b981', // green
    benefits: [
      'Доступ к базовым курсам',
      'AI помощник (10 запросов/день)',
      'Чат с учителем'
    ]
  },
  {
    level: 'student',
    name: 'Ученик',
    minXP: 100,
    maxXP: 500,
    icon: '📚',
    color: '#3b82f6', // blue
    benefits: [
      'Все курсы доступны',
      'AI помощник (25 запросов/день)',
      'Групповые проекты',
      'Форум студентов'
    ]
  },
  {
    level: 'practitioner',
    name: 'Практик',
    minXP: 500,
    maxXP: 1500,
    icon: '💻',
    color: '#8b5cf6', // purple
    benefits: [
      'Продвинутые курсы',
      'AI помощник (50 запросов/день)',
      'Менторство новичков',
      'Приоритет в чате',
      'Публичное портфолио'
    ]
  },
  {
    level: 'expert',
    name: 'Эксперт',
    minXP: 1500,
    maxXP: 5000,
    icon: '⭐',
    color: '#f59e0b', // amber
    benefits: [
      'Все функции платформы',
      'AI помощник (безлимит)',
      'Создание курсов',
      'Сертификаты',
      'Рекомендации для работы'
    ]
  },
  {
    level: 'master',
    name: 'Мастер',
    minXP: 5000,
    maxXP: Infinity,
    icon: '👑',
    color: '#ef4444', // red
    benefits: [
      'VIP статус',
      'Все функции Expert',
      'Персональный наставник',
      'Эксклюзивные проекты',
      'Топ в лидерборде'
    ]
  }
];

// Достижения (Badges)
export const BADGES: Badge[] = [
  // Learning badges
  {
    id: 'first_lesson',
    name: 'Первый урок',
    description: 'Завершил первый урок',
    icon: '📖',
    category: 'learning',
    xpReward: 10,
    rarity: 'common',
    requirement: 1
  },
  {
    id: 'lesson_master',
    name: 'Мастер уроков',
    description: 'Завершил 50 уроков',
    icon: '📚',
    category: 'learning',
    xpReward: 100,
    rarity: 'epic',
    requirement: 50
  },
  {
    id: 'speed_learner',
    name: 'Быстрый ученик',
    description: 'Завершил курс за неделю',
    icon: '⚡',
    category: 'learning',
    xpReward: 75,
    rarity: 'rare'
  },
  
  // Project badges
  {
    id: 'first_project',
    name: 'Первый проект',
    description: 'Создал первый проект',
    icon: '🥇',
    category: 'projects',
    xpReward: 50,
    rarity: 'common',
    requirement: 1
  },
  {
    id: 'project_master',
    name: 'Мастер проектов',
    description: 'Создал 10 проектов',
    icon: '🚀',
    category: 'projects',
    xpReward: 200,
    rarity: 'epic',
    requirement: 10
  },
  {
    id: 'perfectionist',
    name: 'Перфекционист',
    description: '5 заданий на 100%',
    icon: '💯',
    category: 'projects',
    xpReward: 100,
    rarity: 'rare',
    requirement: 5
  },
  
  // Streak badges
  {
    id: 'week_streak',
    name: 'Неделя без пропусков',
    description: '7 дней подряд',
    icon: '🔥',
    category: 'streak',
    xpReward: 75,
    rarity: 'rare',
    requirement: 7
  },
  {
    id: 'month_streak',
    name: 'Месяц без пропусков',
    description: '30 дней подряд',
    icon: '🔥🔥',
    category: 'streak',
    xpReward: 300,
    rarity: 'legendary',
    requirement: 30
  },
  
  // Social badges
  {
    id: 'helpful',
    name: 'Помощник',
    description: 'Помог 5 студентам',
    icon: '👨‍🏫',
    category: 'social',
    xpReward: 50,
    rarity: 'rare',
    requirement: 5
  },
  {
    id: 'chatty',
    name: 'Общительный',
    description: '100 сообщений в чате',
    icon: '💬',
    category: 'social',
    xpReward: 30,
    rarity: 'common',
    requirement: 100
  },
  
  // Special badges
  {
    id: 'ai_master',
    name: 'AI Мастер',
    description: '50 запросов к AI',
    icon: '🤖',
    category: 'special',
    xpReward: 40,
    rarity: 'rare',
    requirement: 50
  },
  {
    id: 'early_bird',
    name: 'Ранняя пташка',
    description: 'Занимался до 8 утра',
    icon: '🌅',
    category: 'special',
    xpReward: 25,
    rarity: 'common'
  },
  {
    id: 'night_owl',
    name: 'Сова',
    description: 'Занимался после 23:00',
    icon: '🦉',
    category: 'special',
    xpReward: 25,
    rarity: 'common'
  },
  {
    id: 'dedicated',
    name: 'Целеустремленный',
    description: '10 часов за неделю',
    icon: '🎯',
    category: 'special',
    xpReward: 60,
    rarity: 'rare'
  }
];

// Функция для получения уровня по XP
export function getLevelByXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Функция для расчета прогресса до следующего уровня
export function getProgressToNextLevel(xp: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number; // 0-100
  xpNeeded: number;
} {
  const currentLevel = getLevelByXP(xp);
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
  
  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      xpNeeded: 0
    };
  }
  
  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNextLevel = nextLevel.minXP - currentLevel.minXP;
  const progress = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
  const xpNeeded = nextLevel.minXP - xp;
  
  return {
    currentLevel,
    nextLevel,
    progress,
    xpNeeded
  };
}

// XP за различные действия
export const XP_REWARDS = {
  LESSON_COMPLETED: 10,
  ASSIGNMENT_SUBMITTED: 25,
  PERFECT_SCORE: 50,
  PROJECT_CREATED: 100,
  HELPED_OTHER: 30,
  STREAK_7_DAYS: 75,
  BADGE_EARNED: 20,
  DAILY_LOGIN: 5,
  COURSE_COMPLETED: 150
};
