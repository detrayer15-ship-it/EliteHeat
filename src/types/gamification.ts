/**
 * Типы для системы геймификации
 */

// Уровни студента
export type StudentLevel = 'novice' | 'student' | 'practitioner' | 'expert' | 'master';

// Категории достижений
export type BadgeCategory = 'learning' | 'projects' | 'social' | 'streak' | 'special';

// Достижение (Badge)
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number; // 0-100
  requirement?: number; // Сколько нужно для разблокировки
}

// Уровень
export interface Level {
  level: StudentLevel;
  name: string;
  minXP: number;
  maxXP: number;
  icon: string;
  color: string;
  benefits: string[];
}

// Прогресс студента
export interface StudentProgress {
  userId: string;
  totalXP: number;
  currentLevel: StudentLevel;
  badges: Badge[];
  streak: number; // Дни подряд
  lastActivityDate: Date;
  stats: {
    lessonsCompleted: number;
    assignmentsCompleted: number;
    projectsCreated: number;
    perfectScores: number; // Заданий на 100%
    aiQueriesCount: number;
    helpedOthers: number;
    totalStudyTime: number; // В минутах
  };
}

// Событие для начисления XP
export interface XPEvent {
  type: 'lesson_completed' | 'assignment_submitted' | 'perfect_score' | 
        'project_created' | 'helped_other' | 'streak_bonus' | 'badge_earned';
  xpAmount: number;
  timestamp: Date;
  description: string;
}

// Уведомление о достижении
export interface AchievementNotification {
  type: 'badge_unlocked' | 'level_up' | 'streak_milestone';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  seen: boolean;
}
