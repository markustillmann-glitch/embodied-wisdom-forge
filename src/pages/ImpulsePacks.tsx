import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Lock, Sparkles, Play, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useImpulseManager, TIER_LIMITS, PACK_IMPULSES, BASE_IMPULSES } from '@/hooks/useImpulseManager';
import { useAuth } from '@/contexts/AuthContext';

interface PackDisplay {
  id: string;
  name: string;
  emoji: string;
  description: string;
  totalImpulses: number;
  usedImpulses: number;
  isUnlocked: boolean;
  isUpcoming?: boolean;
}

const PACK_INFO: Record<string, { name: string; emoji: string; description: string }> = {
  basis: {
    name: 'Basis-Impulse',
    emoji: '🌱',
    description: 'Grundlegende Reflexions-Impulse für den Alltag',
  },
  musik: {
    name: 'Musik & Klang',
    emoji: '🎵',
    description: 'Impulse rund um Musik, Klänge und innere Rhythmen',
  },
  reisen: {
    name: 'Reisen & Orte',
    emoji: '✈️',
    description: 'Impulse über Orte, Reisen und innere Landschaften',
  },
  natur: {
    name: 'Natur & Jahreszeiten',
    emoji: '🌿',
    description: 'Impulse aus der Natur und ihren Zyklen',
  },
  beziehungen: {
    name: 'Beziehungen',
    emoji: '💕',
    description: 'Impulse für Verbindung und Zwischenmenschliches',
  },
  kreativitaet: {
    name: 'Kreativität',
    emoji: '🎨',
    description: 'Impulse für schöpferische Kraft',
  },
};

const ImpulsePacks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    subscription, 
    loading, 
    impulsesRemaining, 
    getPackStats,
    getRandomAvailableImpulse,
    useImpulse,
  } = useImpulseManager();

  const [packs, setPacks] = useState<PackDisplay[]>([]);

  useEffect(() => {
    if (!subscription) return;

    const packList: PackDisplay[] = [];

    // Basis pack is always available
    const basisStats = getPackStats('basis');
    packList.push({
      id: 'basis',
      ...PACK_INFO.basis,
      totalImpulses: BASE_IMPULSES.length,
      usedImpulses: basisStats.used,
      isUnlocked: true,
    });

    // Check which packs are active
    const activePacks = subscription.activePacks || [];
    
    // Add other packs
    Object.keys(PACK_INFO).forEach(packId => {
      if (packId === 'basis') return;
      
      const isUnlocked = activePacks.includes(packId);
      const stats = getPackStats(packId);
      const packImpulses = PACK_IMPULSES[packId] || [];
      
      packList.push({
        id: packId,
        ...PACK_INFO[packId],
        totalImpulses: packImpulses.length,
        usedImpulses: stats.used,
        isUnlocked,
        isUpcoming: packId === 'musik' && !isUnlocked, // Next pack to unlock
      });
    });

    setPacks(packList);
  }, [subscription, getPackStats]);

  const handlePackClick = async (pack: PackDisplay) => {
    if (!pack.isUnlocked || impulsesRemaining <= 0) return;
    
    const impulse = getRandomAvailableImpulse(pack.id);
    if (!impulse) {
      // No more impulses in this pack
      return;
    }
    
    // Navigate to selfcare with the impulse
    navigate(`/selfcare?packId=${pack.id}&impulse=${encodeURIComponent(impulse.text)}`);
  };

  const unlockedPacks = packs.filter(p => p.isUnlocked);
  const upcomingPack = packs.find(p => p.isUpcoming);
  const lockedPacks = packs.filter(p => !p.isUnlocked && !p.isUpcoming);

  const tierLabel = subscription?.tier === 'premium' ? 'Premium' 
    : subscription?.tier === 'basic' ? 'Basic' : 'Free';
  
  const periodLabel = subscription?.tier === 'basic' ? 'diese Woche' : 'diesen Monat';

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bitte melde dich an.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Anmelden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-amber-100/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/selfcare')}
            className="p-2 rounded-full bg-white/80 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-foreground/70" />
          </motion.button>
          <div>
            <h1 className="text-xl font-serif font-semibold text-foreground">Impulspakete</h1>
            <p className="text-sm text-muted-foreground">Wähle dein Thema</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Subscription Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-amber-100/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold",
                    subscription?.tier === 'premium' ? "bg-purple-100 text-purple-700" :
                    subscription?.tier === 'basic' ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {tierLabel}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {TIER_LIMITS[subscription?.tier || 'free'].impulsesPerPeriod} Impulse {periodLabel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Verbleibend</span>
                    <span className={cn(
                      "font-semibold",
                      impulsesRemaining <= 0 ? "text-red-600" : "text-foreground"
                    )}>
                      {impulsesRemaining} / {TIER_LIMITS[subscription?.tier || 'free'].impulsesPerPeriod}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        impulsesRemaining <= 0 ? "bg-red-400" :
                        impulsesRemaining <= 1 ? "bg-amber-400" :
                        "bg-gradient-to-r from-emerald-400 to-teal-400"
                      )}
                      style={{ 
                        width: `${(impulsesRemaining / TIER_LIMITS[subscription?.tier || 'free'].impulsesPerPeriod) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {impulsesRemaining <= 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Keine Impulse mehr verfügbar {periodLabel}</span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-800 text-sm font-medium mb-3">
                <Package className="w-4 h-4" />
                <span>{unlockedPacks.length} Paket{unlockedPacks.length !== 1 ? 'e' : ''} freigeschaltet</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Jeder Impuls kann nur einmal verwendet werden
              </p>
            </motion.div>

            {/* Unlocked Packs */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-1">
                Freigeschaltet
              </h2>
              
              {unlockedPacks.map((pack, index) => {
                const remaining = pack.totalImpulses - pack.usedImpulses;
                const canUse = impulsesRemaining > 0 && remaining > 0;
                
                return (
                  <motion.button
                    key={pack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileTap={canUse ? { scale: 0.98 } : undefined}
                    onClick={() => handlePackClick(pack)}
                    disabled={!canUse}
                    className={cn(
                      "w-full text-left transition-all",
                      !canUse && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-100/50 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl">
                          {pack.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{pack.name}</h3>
                            <div className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Aktiv
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  remaining === 0 ? "bg-gray-400" : "bg-gradient-to-r from-amber-400 to-orange-400"
                                )}
                                style={{ width: `${(pack.usedImpulses / pack.totalImpulses) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {remaining} übrig
                            </span>
                          </div>
                        </div>
                        {canUse && (
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Play className="w-5 h-5 text-amber-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Upcoming Pack */}
            {upcomingPack && (
              <div className="space-y-4 mb-8">
                <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-1">
                  Nächsten Monat (Premium)
                </h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100/50 shadow-lg opacity-75">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl grayscale-[30%]">
                        {upcomingPack.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground/70">{upcomingPack.name}</h3>
                          <div className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Premium
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{upcomingPack.description}</p>
                        <p className="text-xs text-purple-600 mt-2">
                          {upcomingPack.totalImpulses} neue Impulse
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Locked Packs */}
            {lockedPacks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-1">
                  Premium-Pakete
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {lockedPacks.map((pack, index) => (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="bg-gray-50/80 rounded-xl p-4 border border-gray-100/50 opacity-50"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl mb-2 grayscale">
                          {pack.emoji}
                        </div>
                        <h3 className="text-sm font-medium text-foreground/60">{pack.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Premium</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => navigate('/pricing')}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Auf Premium upgraden
                </motion.button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ImpulsePacks;
