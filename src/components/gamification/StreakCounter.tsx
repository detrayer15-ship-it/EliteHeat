/**
 * Компонент для отображения Streak (дни подряд)
 */

import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
}

export function StreakCounter({ streak, size = 'medium' }: StreakCounterProps) {
  const sizeClasses = {
    small: 'text-sm px-3 py-2',
    medium: 'text-base px-4 py-3',
    large: 'text-lg px-6 py-4'
  };
  
  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  // Цвет огня в зависимости от streak
  const getFlameColor = () => {
    if (streak >= 30) return 'text-red-500'; // Месяц+
    if (streak >= 14) return 'text-orange-500'; // 2 недели+
    if (streak >= 7) return 'text-yellow-500'; // Неделя+
    return 'text-gray-400'; // Меньше недели
  };
  
  const getMessage = () => {
    if (streak === 0) return 'Начни серию!';
    if (streak === 1) return 'Отличное начало!';
    if (streak < 7) return 'Продолжай в том же духе!';
    if (streak < 14) return 'Неделя без пропусков! 🎉';
    if (streak < 30) return 'Невероятно! Так держать!';
    return 'Легенда! Месяц подряд! 👑';
  };
  
  return (
    <div className={`inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 ${sizeClasses[size]}`}>
      <Flame 
        className={`${getFlameColor()} ${streak > 0 ? 'animate-pulse' : ''}`}
        size={iconSizes[size]}
      />
      <div>
        <div className="font-bold text-gray-900">
          {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
        </div>
        <div className="text-xs text-gray-600">
          {getMessage()}
        </div>
      </div>
    </div>
  );
}
