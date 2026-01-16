import { motion } from 'framer-motion';
import { Flame, Award, Star, Crown, Heart, Sparkles, Trophy, Zap } from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

interface MilestonesBadgesProps {
  currentStreak: number;
  longestStreak: number;
  totalReflections: number;
  milestonesEarned: string[];
}

const MILESTONES = [
  { id: 'first_reflection', name: 'Erster Schritt', description: 'Erste Reflexion abgeschlossen', icon: 'sparkles', threshold: { type: 'reflections', value: 1 } },
  { id: 'week_streak', name: 'Eine Woche', description: '7 Tage in Folge reflektiert', icon: 'flame', threshold: { type: 'streak', value: 7 } },
  { id: 'month_streak', name: 'Ein Monat', description: '30 Tage in Folge reflektiert', icon: 'award', threshold: { type: 'streak', value: 30 } },
  { id: 'ten_reflections', name: 'Entdecker', description: '10 Reflexionen gespeichert', icon: 'star', threshold: { type: 'reflections', value: 10 } },
  { id: 'twenty_five', name: 'Beständig', description: '25 Reflexionen gespeichert', icon: 'heart', threshold: { type: 'reflections', value: 25 } },
  { id: 'fifty_reflections', name: 'Tieftaucher', description: '50 Reflexionen gespeichert', icon: 'trophy', threshold: { type: 'reflections', value: 50 } },
  { id: 'hundred_reflections', name: 'Weiser', description: '100 Reflexionen gespeichert', icon: 'crown', threshold: { type: 'reflections', value: 100 } },
  { id: 'three_month_streak', name: 'Meister', description: '90 Tage in Folge reflektiert', icon: 'zap', threshold: { type: 'streak', value: 90 } },
];

const iconMap: Record<string, any> = {
  flame: Flame,
  award: Award,
  star: Star,
  crown: Crown,
  heart: Heart,
  sparkles: Sparkles,
  trophy: Trophy,
  zap: Zap,
};

export const MilestonesBadges = ({ 
  currentStreak, 
  longestStreak, 
  totalReflections,
  milestonesEarned 
}: MilestonesBadgesProps) => {
  const isEarned = (milestone: typeof MILESTONES[0]) => {
    if (milestonesEarned.includes(milestone.id)) return true;
    if (milestone.threshold.type === 'streak') {
      return longestStreak >= milestone.threshold.value;
    }
    if (milestone.threshold.type === 'reflections') {
      return totalReflections >= milestone.threshold.value;
    }
    return false;
  };

  const getProgress = (milestone: typeof MILESTONES[0]) => {
    if (milestone.threshold.type === 'streak') {
      return Math.min(100, (currentStreak / milestone.threshold.value) * 100);
    }
    if (milestone.threshold.type === 'reflections') {
      return Math.min(100, (totalReflections / milestone.threshold.value) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Streak Display */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-3 border border-orange-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{currentStreak} Tage Streak</p>
            <p className="text-xs text-muted-foreground">Längster: {longestStreak} Tage</p>
          </div>
        </div>
        {currentStreak >= 7 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            🔥
          </motion.div>
        )}
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-4 gap-2">
        {MILESTONES.map((milestone, index) => {
          const earned = isEarned(milestone);
          const progress = getProgress(milestone);
          const Icon = iconMap[milestone.icon] || Star;
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                earned 
                  ? 'bg-gradient-to-b from-amber-100 to-yellow-100 border-amber-300 shadow-sm' 
                  : 'bg-muted/30 border-border/50 opacity-60'
              }`}
              title={`${milestone.name}: ${milestone.description}`}
            >
              {/* Progress ring for unearned */}
              {!earned && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/20"
                    strokeDasharray={`${progress * 2.51} 251`}
                  />
                </svg>
              )}
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                earned ? 'bg-amber-400/30' : 'bg-muted'
              }`}>
                <Icon className={`w-4 h-4 ${earned ? 'text-amber-700' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-[10px] font-medium text-center mt-1 leading-tight">
                {milestone.name}
              </p>
              
              {earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-[8px] text-white">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestonesBadges;
