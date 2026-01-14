import { useState } from 'react';
import { BADGES, LEVELS } from '@/data/gamification';
import { BadgesGrid } from '@/components/gamification/BadgeCard';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import {
  Trophy,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Crown,
  Flame,
  ShieldCheck,
  Zap,
  ChevronRight,
  Star,
  Layout
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';

export default function AchievementsPage() {
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
      totalStudyTime: 1440
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Все', icon: <Trophy /> },
    { id: 'learning', name: 'Обучение', icon: <Star /> },
    { id: 'projects', name: 'Проекты', icon: <Zap /> },
    { id: 'streak', name: 'Серии', icon: <Flame /> },
    { id: 'social', name: 'Социальные', icon: <Crown /> },
    { id: 'special', name: 'Особые', icon: <Sparkles /> }
  ];

  const filteredBadges = selectedCategory === 'all'
    ? BADGES
    : BADGES.filter(b => b.category === selectedCategory);

  const unlockedCount = BADGES.filter(b => studentProgress.unlockedBadges.includes(b.id)).length;
  const totalBadges = BADGES.length;
  const completionPercentage = (unlockedCount / totalBadges) * 100;

  return (
    <div className="min-h-full py-2 space-y-12">
      {/* HERO MODULE: THE VAULT */}
      <ScrollReveal animation="fade">
        <div className="bg-[#0a0a0c] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden group shadow-3xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="space-y-8 flex-1">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Elite Achievements Protocol</span>
              </div>
              <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter">
                Зал <br />
                <span className="bg-gradient-to-r from-amber-400 via-white to-orange-400 bg-clip-text text-transparent italic">Славы</span>
              </h1>
              <p className="text-xl text-white/40 font-medium max-w-lg leading-relaxed italic">
                Ваша цифровая коллекция достижений. Каждый бейдж — это не просто иконка, а подтверждение вашего мастерства.
              </p>
            </div>

            <div className="relative group/trophy">
              <div className="absolute inset-0 bg-amber-500 blur-[80px] opacity-20 group-hover/trophy:opacity-40 transition-opacity animate-pulse"></div>
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-[4rem] bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 relative flex items-center justify-center border border-white/20 shadow-glow-amber animate-float">
                <Trophy className="w-32 h-32 lg:w-40 lg:h-40 text-black/20 absolute bottom-4 right-4 rotate-12" />
                <Trophy className="w-32 h-32 lg:w-40 lg:h-40 text-white drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ScrollReveal animation="slide-up" delay={100}>
          <div className="bg-white rounded-[3rem] p-10 border border-indigo-50 shadow-xl space-y-8 h-full flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Target /></div>
              <h3 className="text-xl font-black text-indigo-950 tracking-tight">Текущий Уровень</h3>
            </div>
            <div className="flex flex-col items-center">
              <LevelBadge xp={studentProgress.totalXP} showProgress={true} size="large" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={200}>
          <div className="bg-white rounded-[3rem] p-10 border border-indigo-50 shadow-xl space-y-8 h-full flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><Flame /></div>
              <h3 className="text-xl font-black text-indigo-950 tracking-tight">Активность</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-center">
                <StreakCounter streak={studentProgress.streak} size="large" />
              </div>
              <div className="space-y-3 px-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-indigo-950/30">
                  <span>Goal: 30 Days</span>
                  <span>{studentProgress.streak}/30</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${(studentProgress.streak / 30) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="slide-up" delay={300}>
          <div className="bg-[#0a0a0c] rounded-[3rem] p-10 text-white space-y-8 h-full flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-purple-400 flex items-center justify-center"><Award /></div>
              <h3 className="text-xl font-black tracking-tight">Общий Прогресс</h3>
            </div>
            <div className="text-center relative z-10">
              <div className="text-8xl font-black tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                <AnimatedCounter end={unlockedCount} />
                <span className="text-2xl text-white/20 ml-2">/ {totalBadges}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-4">Unlocks Completed</p>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
              <div className="text-[10px] font-black text-center text-indigo-400 uppercase tracking-widest">{completionPercentage.toFixed(0)}% Mastery</div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ACTIVITY METRICS */}
      <ScrollReveal animation="fade">
        <div className="glass-premium rounded-[3.5rem] p-12 border border-white shadow-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Уроков', value: studentProgress.stats.lessonsCompleted, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Заданий', value: studentProgress.stats.assignmentsCompleted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Проектов', value: studentProgress.stats.projectsCreated, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Часов', value: Math.floor(studentProgress.stats.totalStudyTime / 60), color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 group">
                <div className={`text-5xl font-black ${stat.color} tracking-tighter group-hover:scale-110 transition-transform`}>
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-950/30">{stat.label}</div>
                <div className={`mx-auto w-8 h-1 rounded-full ${stat.bg} mt-2`}></div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ACHIEVEMENTS VAULT SECTION */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <h3 className="text-3xl font-black text-indigo-950 tracking-tighter flex items-center gap-4">
            <Sparkles className="text-amber-500" />
            Бейджи Мастерства
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : 'bg-white text-indigo-950/40 border border-indigo-50 hover:bg-indigo-50 hover:text-indigo-950'
                  }`}
              >
                <span className="w-4 h-4">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-premium rounded-[4rem] p-12 lg:p-20 border border-white shadow-3xl bg-white/20">
          <BadgesGrid
            badges={filteredBadges}
            unlockedBadgeIds={studentProgress.unlockedBadges}
            onBadgeClick={(badge) => console.log('Badge Info:', badge)}
          />
        </div>
      </div>

      {/* PROGRESSION TIERS */}
      <ScrollReveal animation="fade">
        <div className="relative bg-[#0a0a0c] rounded-[4rem] p-12 lg:p-20 text-white overflow-hidden shadow-3xl">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative z-10 space-y-12">
            <div className="text-center space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Path of Mastery</div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter italic">Все Уровни Прогрессии</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LEVELS.map((level, index) => {
                const isAchieved = studentProgress.totalXP >= level.minXP;
                return (
                  <div
                    key={level.level}
                    className={`relative p-8 rounded-[2.5rem] border transition-all ${isAchieved ? 'bg-white/5 border-emerald-500/50' : 'bg-white/[0.02] border-white/5 opacity-50 overflow-hidden'}`}
                  >
                    {!isAchieved && (
                      <div className="absolute top-4 right-4 text-white/10"><ShieldCheck className="w-20 h-20" /></div>
                    )}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="text-5xl lg:text-7xl group-hover:scale-110 transition-transform flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                          {level.icon}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black tracking-tight">{level.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{level.minXP} - {level.maxXP === Infinity ? '∞' : level.maxXP} XP Hub</p>
                        </div>
                      </div>
                      {isAchieved && (
                        <div className="px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Reached</div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Unlocked Benefits</div>
                      <div className="flex flex-wrap gap-2">
                        {level.benefits.map((b, i) => (
                          <div key={i} className="text-xs font-medium text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <style>{`
            .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.15); }
            .shadow-glow { box-shadow: 0 10px 40px -10px rgba(79, 70, 229, 0.4); }
            .shadow-glow-amber { box-shadow: 0 20px 60px -10px rgba(245, 158, 11, 0.5); }
            .glass-premium { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); }
        `}</style>
    </div>
  );
}
