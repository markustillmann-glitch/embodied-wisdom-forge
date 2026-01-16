import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface CollectedNeed {
  name: string;
  count: number;
  firstSeenAt: string;
}

interface NeedsCollectionProps {
  collectedNeeds: CollectedNeed[];
}

const needColors: Record<string, string> = {
  'Sicherheit': 'from-blue-400 to-blue-600',
  'Verbundenheit': 'from-pink-400 to-rose-500',
  'Autonomie': 'from-purple-400 to-violet-600',
  'Anerkennung': 'from-amber-400 to-orange-500',
  'Ruhe': 'from-cyan-400 to-teal-500',
  'Wachstum': 'from-green-400 to-emerald-600',
  'Kreativität': 'from-fuchsia-400 to-pink-600',
  'Freiheit': 'from-sky-400 to-blue-500',
  'Liebe': 'from-red-400 to-rose-600',
  'Selbstfürsorge': 'from-orange-400 to-amber-500',
  'Grenzen': 'from-slate-400 to-gray-600',
  'Zugehörigkeit': 'from-indigo-400 to-purple-600',
};

const getColorForNeed = (name: string): string => {
  for (const [key, value] of Object.entries(needColors)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  // Default gradient based on string hash
  const hash = name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const hue = Math.abs(hash % 360);
  return `from-[hsl(${hue},70%,60%)] to-[hsl(${hue + 20},70%,50%)]`;
};

export const NeedsCollection = ({ collectedNeeds }: NeedsCollectionProps) => {
  const sortedNeeds = [...collectedNeeds].sort((a, b) => b.count - a.count);
  
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <h3 className="text-sm font-semibold text-foreground">Erkannte Bedürfnisse</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {collectedNeeds.length} gesammelt
        </span>
      </div>

      {/* Needs Pearls */}
      {sortedNeeds.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sortedNeeds.map((need, index) => {
            const colorClass = getColorForNeed(need.name);
            const size = Math.min(need.count * 4 + 24, 48);
            
            return (
              <motion.div
                key={need.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                className={`relative group cursor-default`}
                title={`${need.name}: ${need.count}x erkannt`}
              >
                {/* Pearl */}
                <div
                  className={`bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center shadow-lg`}
                  style={{ 
                    width: size, 
                    height: size,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)'
                  }}
                >
                  <span className="text-white text-[10px] font-bold drop-shadow-sm">
                    {need.count}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                    {need.name}
                  </div>
                </div>
                
                {/* Shine effect */}
                <div 
                  className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"
                  style={{ filter: 'blur(1px)' }}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-muted/30 rounded-xl">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 opacity-40" />
          <p className="text-sm text-muted-foreground">
            Deine Bedürfnisse werden hier gesammelt
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Führe Reflexionen durch, um Bedürfnisse zu erkennen
          </p>
        </div>
      )}

      {/* Most common needs list */}
      {sortedNeeds.length >= 3 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Deine häufigsten Bedürfnisse:</p>
          <div className="flex gap-1.5 flex-wrap">
            {sortedNeeds.slice(0, 5).map((need) => (
              <span 
                key={need.name}
                className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700"
              >
                {need.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedsCollection;
