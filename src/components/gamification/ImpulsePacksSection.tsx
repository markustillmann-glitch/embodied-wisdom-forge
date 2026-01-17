import { Package, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImpulseManager, TIER_LIMITS, BASE_IMPULSES, PACK_IMPULSES } from '@/hooks/useImpulseManager';

const PACK_INFO: Record<string, { name: string; emoji: string }> = {
  basis: { name: 'Basis-Impulse', emoji: '🌱' },
  musik: { name: 'Musik & Klang', emoji: '🎵' },
  reisen: { name: 'Reisen & Orte', emoji: '✈️' },
  natur: { name: 'Natur & Jahreszeiten', emoji: '🌿' },
  beziehungen: { name: 'Beziehungen', emoji: '💕' },
  kreativitaet: { name: 'Kreativität', emoji: '🎨' },
};

export const ImpulsePacksSection = () => {
  const navigate = useNavigate();
  const { subscription, getPackStats, impulsesRemaining, loading } = useImpulseManager();

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activePacks = ['basis', ...(subscription?.activePacks || [])];
  
  // Build pack displays
  const packDisplays = activePacks.map(packId => {
    const info = PACK_INFO[packId] || { name: packId, emoji: '📦' };
    const stats = getPackStats(packId);
    return {
      id: packId,
      ...info,
      ...stats,
    };
  });

  const tierLabel = subscription?.tier === 'premium' ? 'Premium' 
    : subscription?.tier === 'basic' ? 'Basic' : 'Free';
  
  const periodLabel = subscription?.tier === 'basic' ? 'Woche' : 'Monat';
  const limit = TIER_LIMITS[subscription?.tier || 'free'].impulsesPerPeriod;

  return (
    <div className="space-y-4">
      {/* Subscription Status */}
      <div className="bg-muted/30 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            subscription?.tier === 'premium' ? 'bg-purple-100 text-purple-700' :
            subscription?.tier === 'basic' ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {tierLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {impulsesRemaining}/{limit} diese {periodLabel}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              impulsesRemaining <= 0 ? 'bg-red-400' :
              impulsesRemaining <= 1 ? 'bg-amber-400' :
              'bg-gradient-to-r from-emerald-400 to-teal-400'
            }`}
            style={{ width: `${(impulsesRemaining / limit) * 100}%` }}
          />
        </div>
      </div>

      {/* Packs */}
      <div className="space-y-2">
        {packDisplays.map((pack) => (
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
                    className={`h-full rounded-full transition-all ${
                      pack.remaining === 0 ? 'bg-gray-400' : 'bg-gradient-to-r from-amber-400 to-orange-400'
                    }`}
                    style={{ width: `${(pack.used / pack.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {pack.remaining} übrig
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
