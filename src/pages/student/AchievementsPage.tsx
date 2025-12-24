/**
 * Страница достижений студента
 */

import { useState } from 'react';
import { BADGES, LEVELS } from '@/data/gamification';
import { BadgesGrid } from '@/components/gamification/BadgeCard';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';

export default function AchievementsPage() {
  // TODO: Получать из API/store
  const [studentProgress] = useState({
    totalXP: 1250,
    streak: 12,
    unlockedBadges: ['first_lesson', 'first_project', 'week_streak', 'helpful'],
    stats: {
      lessonsCompleted: 24,
      assignmentsCompleted: 15,
      projectsCreated: 3,
      perfectScores: 2,
      aiQueriesCount: 45,
      helpedOthers: 6,
      totalStudyTime: 1440 // 24 часа
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Все', icon: '🏆' },
    { id: 'learning', name: 'Обучение', icon: '📚' },
    { id: 'projects', name: 'Проекты', icon: '🚀' },
    { id: 'streak', name: 'Серии', icon: '🔥' },
    { id: 'social', name: 'Социальные', icon: '👥' },
    { id: 'special', name: 'Особые', icon: '⭐' }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? BADGES 
    : BADGES.filter(b => b.category === selectedCategory);

  const unlockedCount = BADGES.filter(b => studentProgress.unlockedBadges.includes(b.id)).length;
  const totalBadges = BADGES.length;
  const completionPercentage = (unlockedCount / totalBadges) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={40} />
            Достижения
          </h1>
          <p className="text-gray-600">Отслеживай свой прогресс и получай награды!</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Уровень */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="text-blue-600" size={24} />
              Твой уровень
            </h3>
            <LevelBadge xp={studentProgress.totalXP} showProgress={true} size="medium" />
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-orange-600" size={24} />
              Твоя серия
            </h3>
            <StreakCounter streak={studentProgress.streak} size="medium" />
            <div className="mt-4 text-sm text-gray-600">
              <p>🎯 Цель: 30 дней подряд</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${(studentProgress.streak / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Прогресс достижений */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="text-purple-600" size={24} />
              Прогресс
            </h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {unlockedCount}/{totalBadges}
              </div>
              <p className="text-gray-600 mb-4">достижений получено</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {completionPercentage.toFixed(0)}% завершено
              </p>
            </div>
          </div>
        </div>

        {/* Статистика активности */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Твоя статистика</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{studentProgress.stats.lessonsCompleted}</div>
              <div className="text-sm text-gray-600">Уроков завершено</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{studentProgress.stats.assignmentsCompleted}</div>
              <div className="text-sm text-gray-600">Заданий сдано</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{studentProgress.stats.projectsCreated}</div>
              <div className="text-sm text-gray-600">Проектов создано</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600">{Math.floor(studentProgress.stats.totalStudyTime / 60)}</div>
              <div className="text-sm text-gray-600">Часов обучения</div>
            </div>
          </div>
        </div>

        {/* Фильтр категорий */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка достижений */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? 'Все достижения' : categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <BadgesGrid 
            badges={filteredBadges}
            unlockedBadgeIds={studentProgress.unlockedBadges}
            onBadgeClick={(badge) => {
              console.log('Clicked badge:', badge);
              // TODO: Показать модальное окно с деталями
            }}
          />
        </div>

        {/* Следующие достижения */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 mt-8 border-2 border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            🎯 Близко к получению
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💯</span>
                <div>
                  <div className="font-bold">Перфекционист</div>
                  <div className="text-sm text-gray-600">5 заданий на 100%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '40%' }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">2 / 5</div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🤖</span>
                <div>
                  <div className="font-bold">AI Мастер</div>
                  <div className="text-sm text-gray-600">50 запросов к AI</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '90%' }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">45 / 50</div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📚</span>
                <div>
                  <div className="font-bold">Мастер уроков</div>
                  <div className="text-sm text-gray-600">50 уроков</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '48%' }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">24 / 50</div>
            </div>
          </div>
        </div>

        {/* Информация об уровнях */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">🎯 Все уровни</h3>
          <div className="space-y-4">
            {LEVELS.map((level, index) => (
              <div 
                key={level.level}
                className={`p-4 rounded-xl border-2 ${
                  studentProgress.totalXP >= level.minXP 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{level.icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{level.name}</div>
                      <div className="text-sm text-gray-600">
                        {level.minXP} - {level.maxXP === Infinity ? '∞' : level.maxXP} XP
                      </div>
                    </div>
                  </div>
                  {studentProgress.totalXP >= level.minXP && (
                    <div className="text-green-600 font-bold">✓ Достигнут</div>
                  )}
                </div>
                <div className="text-sm text-gray-600 ml-14">
                  <strong>Преимущества:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {level.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
