/**
 * Компонент для отображения достижения (Badge)
 */

import { Badge } from '@/types/gamification';
import { Lock, Check } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
  onClick?: () => void;
}

export function BadgeCard({ badge, unlocked = false, onClick }: BadgeCardProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };
  
  const rarityNames = {
    common: 'Обычное',
    rare: 'Редкое',
    epic: 'Эпическое',
    legendary: 'Легендарное'
  };
  
  return (
    <div 
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
        unlocked 
          ? 'bg-white border-gray-200 hover:shadow-lg hover:scale-105' 
          : 'bg-gray-50 border-gray-300 opacity-60 hover:opacity-80'
      }`}
      onClick={onClick}
    >
      {/* Иконка достижения */}
      <div className="flex items-center justify-center mb-3">
        <div 
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br ${rarityColors[badge.rarity]} ${
            unlocked ? '' : 'grayscale'
          }`}
        >
          {unlocked ? badge.icon : <Lock className="text-white" size={32} />}
        </div>
      </div>
      
      {/* Название */}
      <h3 className="font-bold text-center text-gray-900 mb-1">
        {badge.name}
      </h3>
      
      {/* Описание */}
      <p className="text-sm text-gray-600 text-center mb-2">
        {badge.description}
      </p>
      
      {/* Награда XP */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="font-bold text-blue-600">+{badge.xpReward} XP</span>
        <span className="text-gray-400">•</span>
        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`}>
          {rarityNames[badge.rarity]}
        </span>
      </div>
      
      {/* Прогресс (если есть) */}
      {!unlocked && badge.progress !== undefined && badge.requirement && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${rarityColors[badge.rarity]}`}
              style={{ width: `${(badge.progress / badge.requirement) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {badge.progress} / {badge.requirement}
          </div>
        </div>
      )}
      
      {/* Галочка если разблокировано */}
      {unlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
        </div>
      )}
      
      {/* Дата разблокировки */}
      {unlocked && badge.unlockedAt && (
        <div className="text-xs text-gray-400 text-center mt-2">
          Получено {new Date(badge.unlockedAt).toLocaleDateString('ru-RU')}
        </div>
      )}
    </div>
  );
}

/**
 * Сетка достижений
 */
interface BadgesGridProps {
  badges: Badge[];
  unlockedBadgeIds: string[];
  onBadgeClick?: (badge: Badge) => void;
}

export function BadgesGrid({ badges, unlockedBadgeIds, onBadgeClick }: BadgesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map(badge => (
        <BadgeCard 
          key={badge.id}
          badge={badge}
          unlocked={unlockedBadgeIds.includes(badge.id)}
          onClick={() => onBadgeClick?.(badge)}
        />
      ))}
    </div>
  );
}
