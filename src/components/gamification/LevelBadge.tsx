/**
 * Компонент для отображения уровня студента
 */

import { getLevelByXP, getProgressToNextLevel } from '@/data/gamification';

interface LevelBadgeProps {
  xp: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function LevelBadge({ xp, showProgress = true, size = 'medium' }: LevelBadgeProps) {
  const { currentLevel, nextLevel, progress, xpNeeded } = getProgressToNextLevel(xp);
  
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const iconSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };
  
  return (
    <div className={`${sizeClasses[size]}`}>
      {/* Уровень */}
      <div 
        className="inline-flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd)` }}
      >
        <span className={iconSizes[size]}>{currentLevel.icon}</span>
        <div>
          <div className="text-xs opacity-80">Уровень</div>
          <div className="font-bold">{currentLevel.name}</div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-80">XP</div>
          <div className="font-bold">{xp.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Прогресс до следующего уровня */}
      {showProgress && nextLevel && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>До уровня {nextLevel.icon} {nextLevel.name}</span>
            <span className="font-bold">{xpNeeded} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {progress.toFixed(0)}% завершено
          </div>
        </div>
      )}
    </div>
  );
}
