import { Package, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ImpulsePack {
  id: string;
  name: string;
  emoji: string;
  totalImpulses: number;
  usedImpulses: number;
  isUnlocked: boolean;
}

interface ImpulsePacksSectionProps {
  packs?: ImpulsePack[];
}

// Default pack data - in production this would come from DB
const defaultPacks: ImpulsePack[] = [
  {
    id: 'basis',
    name: 'Basis-Impulse',
    emoji: '🌱',
    totalImpulses: 25,
    usedImpulses: 3,
    isUnlocked: true,
  },
  {
    id: 'musik',
    name: 'Musik & Klang',
    emoji: '🎵',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
  },
  {
    id: 'reisen',
    name: 'Reisen & Orte',
    emoji: '✈️',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
  },
];

export const ImpulsePacksSection = ({ packs = defaultPacks }: ImpulsePacksSectionProps) => {
  const navigate = useNavigate();
  const unlockedPacks = packs.filter(p => p.isUnlocked);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-3">
        Deine freigeschalteten Impulspakete und ihr Fortschritt.
      </p>

      {/* Unlocked Packs */}
      {unlockedPacks.length > 0 ? (
        <div className="space-y-3">
          {unlockedPacks.map((pack) => (
            <div 
              key={pack.id}
              className="bg-muted/30 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-lg">
                {pack.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{pack.name}</span>
                  <div className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                      style={{ width: `${(pack.usedImpulses / pack.totalImpulses) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {pack.usedImpulses}/{pack.totalImpulses}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Package className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Noch keine Pakete freigeschaltet
          </p>
        </div>
      )}

      {/* View All Button */}
      <button
        onClick={() => navigate('/impulse-packs')}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-medium hover:from-amber-200 hover:to-orange-200 transition-all flex items-center justify-center gap-2"
      >
        <Package className="w-4 h-4" />
        Alle Impulspakete anzeigen
      </button>
    </div>
  );
};

export default ImpulsePacksSection;
