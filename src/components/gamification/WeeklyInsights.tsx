import { motion } from 'framer-motion';
import { Calendar, TrendingUp, MessageCircle, Target } from 'lucide-react';

interface WeeklyTopic {
  topic: string;
  count: number;
}

interface WeeklyInsightsProps {
  weeklyReflectionCount: number;
  weeklyTopics: WeeklyTopic[];
  weekStartDate?: string;
}

export const WeeklyInsights = ({ 
  weeklyReflectionCount, 
  weeklyTopics,
  weekStartDate 
}: WeeklyInsightsProps) => {
  const sortedTopics = [...weeklyTopics].sort((a, b) => b.count - a.count);
  const topTopic = sortedTopics[0];
  
  // Calculate days progress (assuming week starts on Monday)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysIntoWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  // Simple goal: 5 reflections per week
  const weeklyGoal = 5;
  const goalProgress = Math.min(100, (weeklyReflectionCount / weeklyGoal) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-foreground">Diese Woche</h3>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Reflection Count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 border border-blue-200/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700">Reflexionen</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{weeklyReflectionCount}</p>
          <p className="text-xs text-blue-600/70">in {daysIntoWeek} Tagen</p>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-3 border border-green-200/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">Wochenziel</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-green-900">{weeklyReflectionCount}</p>
            <p className="text-sm text-green-600">/ {weeklyGoal}</p>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-green-200 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-green-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Top Topics This Week */}
      {sortedTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 rounded-xl p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium text-foreground">Häufige Themen</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {sortedTopics.slice(0, 5).map((topic, index) => (
              <span
                key={topic.topic}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  index === 0 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {topic.topic} ({topic.count})
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-2"
      >
        {weeklyReflectionCount >= weeklyGoal ? (
          <p className="text-sm text-green-600 font-medium">
            🎉 Wochenziel erreicht! Weiter so!
          </p>
        ) : weeklyReflectionCount >= weeklyGoal / 2 ? (
          <p className="text-sm text-muted-foreground">
            Du bist auf einem guten Weg! Noch {weeklyGoal - weeklyReflectionCount} bis zum Ziel.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nimm dir Zeit für dich – jede Reflexion zählt 💫
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyInsights;
