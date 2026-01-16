import { motion } from 'framer-motion';
import { Eye, Compass, Anchor, Lightbulb } from 'lucide-react';

interface ReflectionLevelProps {
  currentLevel: string;
  totalReflections: number;
  depthScore: number;
}

const LEVELS = [
  { 
    id: 'observer', 
    name: 'Beobachter', 
    icon: Eye, 
    minReflections: 0, 
    minDepth: 0,
    description: 'Du beginnst deine Reise der Selbstreflexion',
    color: 'from-slate-400 to-gray-500'
  },
  { 
    id: 'explorer', 
    name: 'Entdecker', 
    icon: Compass, 
    minReflections: 5, 
    minDepth: 10,
    description: 'Du erkundest aktiv deine innere Welt',
    color: 'from-blue-400 to-indigo-500'
  },
  { 
    id: 'diver', 
    name: 'Tieftaucher', 
    icon: Anchor, 
    minReflections: 20, 
    minDepth: 50,
    description: 'Du tauchst tief in deine Gefühle und Bedürfnisse ein',
    color: 'from-purple-400 to-violet-600'
  },
  { 
    id: 'sage', 
    name: 'Weiser', 
    icon: Lightbulb, 
    minReflections: 50, 
    minDepth: 150,
    description: 'Du hast tiefe Einsichten über dich selbst gewonnen',
    color: 'from-amber-400 to-orange-500'
  },
];

export const ReflectionLevel = ({ currentLevel, totalReflections, depthScore }: ReflectionLevelProps) => {
  const currentLevelData = LEVELS.find(l => l.id === currentLevel) || LEVELS[0];
  const currentLevelIndex = LEVELS.findIndex(l => l.id === currentLevel);
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  const Icon = currentLevelData.icon;
  
  // Calculate progress to next level
  let progressToNext = 100;
  let reflectionsNeeded = 0;
  let depthNeeded = 0;
  
  if (nextLevel) {
    const reflectionProgress = Math.min(100, (totalReflections / nextLevel.minReflections) * 100);
    const depthProgress = Math.min(100, (depthScore / nextLevel.minDepth) * 100);
    progressToNext = Math.min(reflectionProgress, depthProgress);
    reflectionsNeeded = Math.max(0, nextLevel.minReflections - totalReflections);
    depthNeeded = Math.max(0, nextLevel.minDepth - depthScore);
  }

  return (
    <div className="space-y-3">
      {/* Current Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-r ${currentLevelData.color} rounded-2xl p-4 text-white overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-24 h-24 border-2 border-white rounded-full" />
          <div className="absolute bottom-2 left-2 w-16 h-16 border border-white rounded-full" />
        </div>
        
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs uppercase tracking-wide">Dein Level</p>
            <h3 className="text-xl font-bold">{currentLevelData.name}</h3>
            <p className="text-white/80 text-sm">{currentLevelData.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="bg-muted/30 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nächstes Level:</span>
            <span className="font-medium flex items-center gap-1.5">
              {(() => {
                const NextIcon = nextLevel.icon;
                return <NextIcon className="w-4 h-4" />;
              })()}
              {nextLevel.name}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${nextLevel.color} rounded-full`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{reflectionsNeeded > 0 ? `Noch ${reflectionsNeeded} Reflexionen` : '✓ Reflexionen'}</span>
            <span>{Math.round(progressToNext)}%</span>
          </div>
        </div>
      )}

      {/* Level ladder */}
      <div className="flex justify-between items-center px-2">
        {LEVELS.map((level, index) => {
          const isActive = level.id === currentLevel;
          const isPast = index < currentLevelIndex;
          const LevelIcon = level.icon;
          
          return (
            <div key={level.id} className="flex flex-col items-center gap-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? `bg-gradient-to-br ${level.color} text-white shadow-lg scale-110` 
                    : isPast 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                <LevelIcon className="w-4 h-4" />
              </div>
              {index < LEVELS.length - 1 && (
                <div className={`w-px h-2 ${isPast ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReflectionLevel;
