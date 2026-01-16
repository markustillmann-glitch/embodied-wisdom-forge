import { motion } from 'framer-motion';
import { Flower2, TreeDeciduous, Sprout, Leaf } from 'lucide-react';

interface Plant {
  id: string;
  type: 'seedling' | 'sprout' | 'flower' | 'tree';
  topic: string;
  createdAt: string;
}

interface GrowthGardenProps {
  plants: Plant[];
  totalReflections: number;
}

const plantIcons = {
  seedling: Sprout,
  sprout: Leaf,
  flower: Flower2,
  tree: TreeDeciduous,
};

const plantColors = {
  seedling: 'text-green-400',
  sprout: 'text-green-500',
  flower: 'text-pink-500',
  tree: 'text-green-700',
};

const plantSizes = {
  seedling: 'w-4 h-4',
  sprout: 'w-5 h-5',
  flower: 'w-6 h-6',
  tree: 'w-8 h-8',
};

export const GrowthGarden = ({ plants, totalReflections }: GrowthGardenProps) => {
  // Generate garden grid positions
  const gridPositions = [
    { x: 10, y: 70 }, { x: 25, y: 60 }, { x: 40, y: 75 },
    { x: 55, y: 65 }, { x: 70, y: 72 }, { x: 85, y: 68 },
    { x: 15, y: 85 }, { x: 35, y: 88 }, { x: 50, y: 82 },
    { x: 65, y: 90 }, { x: 80, y: 85 }, { x: 95, y: 78 },
  ];

  return (
    <div className="relative w-full h-40 bg-gradient-to-b from-sky-100 to-green-100 rounded-2xl overflow-hidden border border-white/50">
      {/* Sun */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="absolute top-3 right-4 w-10 h-10 bg-yellow-300 rounded-full shadow-lg"
        style={{ boxShadow: '0 0 20px rgba(253, 224, 71, 0.5)' }}
      />
      
      {/* Clouds */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 left-8 w-12 h-4 bg-white rounded-full opacity-80"
      />
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-4 left-14 w-8 h-3 bg-white rounded-full opacity-60"
      />
      
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-300 to-green-200" />
      
      {/* Plants */}
      {plants.slice(0, 12).map((plant, index) => {
        const pos = gridPositions[index % gridPositions.length];
        const Icon = plantIcons[plant.type];
        
        return (
          <motion.div
            key={plant.id}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1 * index, type: 'spring' }}
            className="absolute"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={plant.topic}
          >
            <Icon className={`${plantSizes[plant.type]} ${plantColors[plant.type]} drop-shadow-sm`} />
          </motion.div>
        );
      })}
      
      {/* Empty garden message */}
      {plants.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground/60 italic">
            Dein Garten wartet auf deine erste Reflexion... 🌱
          </p>
        </div>
      )}
      
      {/* Stats overlay */}
      <div className="absolute bottom-2 left-3 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
        <p className="text-xs font-medium text-foreground/70">
          {plants.length} Pflanzen · {totalReflections} Reflexionen
        </p>
      </div>
    </div>
  );
};

export default GrowthGarden;
