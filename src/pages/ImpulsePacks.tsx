import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Lock, Sparkles, Play, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Impulse pack types
export interface ImpulsePack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  totalImpulses: number;
  usedImpulses: number;
  isUnlocked: boolean;
  isUpcoming?: boolean;
  impulses: string[];
}

// Sample impulse packs data - this would come from database in real implementation
const defaultImpulsePacks: ImpulsePack[] = [
  {
    id: 'basis',
    name: 'Basis-Impulse',
    emoji: '🌱',
    description: 'Grundlegende Reflexions-Impulse für den Alltag',
    totalImpulses: 25,
    usedImpulses: 3,
    isUnlocked: true,
    impulses: [
      "Manchmal gewinnt man, manchmal lernt man",
      "Wachse und gedeihe",
      "Umgib dich mit Menschen, die dich wachsen sehen wollen",
      "Betrachte die Welt, als würdest du sie zum ersten Mal sehen",
      "Je stiller du bist, desto mehr wirst du hören",
      "Scheue dich nie, um die Hilfe zu bitten, die du brauchst",
      "Begrenze nicht die Herausforderungen, fordere die Grenzen heraus",
      "Vergleichen macht unglücklich",
      "Weniger scrollen, mehr leben",
      "Lass ab von dem, was war, und vertraue dem, was kommt",
      "Eine Umarmung macht alles besser",
      "Finde heraus, was du brauchst, scheue dich nicht, darum zu bitten",
      "Du kontrollierst deine Finanzen, nicht sie dich",
      "Aus kleinen Samen wachsen mächtige Bäume",
      "Nimm jeden Tag, wie er kommt",
      "Ein Duft kann tausend Erinnerungen zurückbringen",
      "Es sind die kleinen Dinge, die den größten Unterschied machen",
      "Die Welt gehört jenen, die lesen",
      "Kreativität ist eine unendliche Ressource",
      "Das Leben ist ein Song: Singe!",
      "To do: Lebe den Moment",
      "Aufgeräumtes Haus, aufgeräumte Seele",
      "Wenn nicht jetzt, wann dann?",
      "Manchmal ist Entspannung das Produktivste",
      "Verwandle Angst in Energie",
    ],
  },
  {
    id: 'musik',
    name: 'Musik & Klang',
    emoji: '🎵',
    description: 'Impulse rund um Musik, Klänge und innere Rhythmen',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
    isUpcoming: true,
    impulses: [
      "Welches Lied beschreibt dein Leben gerade?",
      "In der Stille findest du deinen Rhythmus",
      "Manchmal braucht die Seele Musik statt Worte",
      "Welcher Klang beruhigt dich sofort?",
      "Dein Herzschlag ist dein erster Beat",
    ],
  },
  {
    id: 'reisen',
    name: 'Reisen & Orte',
    emoji: '✈️',
    description: 'Impulse über Orte, Reisen und innere Landschaften',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
    impulses: [],
  },
  {
    id: 'natur',
    name: 'Natur & Jahreszeiten',
    emoji: '🌿',
    description: 'Impulse aus der Natur und ihren Zyklen',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
    impulses: [],
  },
  {
    id: 'beziehungen',
    name: 'Beziehungen',
    emoji: '💕',
    description: 'Impulse für Verbindung und Zwischenmenschliches',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
    impulses: [],
  },
  {
    id: 'kreativitaet',
    name: 'Kreativität',
    emoji: '🎨',
    description: 'Impulse für schöpferische Kraft',
    totalImpulses: 25,
    usedImpulses: 0,
    isUnlocked: false,
    impulses: [],
  },
];

const ImpulsePacks = () => {
  const navigate = useNavigate();
  const [packs] = useState<ImpulsePack[]>(defaultImpulsePacks);

  const handlePackClick = (pack: ImpulsePack) => {
    if (!pack.isUnlocked) {
      return; // Do nothing for locked packs
    }
    
    // Get a random unused impulse from the pack
    const availableImpulses = pack.impulses.slice(pack.usedImpulses);
    if (availableImpulses.length === 0) {
      return; // All impulses used
    }
    
    const randomImpulse = availableImpulses[Math.floor(Math.random() * availableImpulses.length)];
    
    // Navigate to selfcare with the selected impulse and pack info
    navigate(`/selfcare?packId=${pack.id}&impulse=${encodeURIComponent(randomImpulse)}`);
  };

  const unlockedPacks = packs.filter(p => p.isUnlocked);
  const upcomingPack = packs.find(p => p.isUpcoming);
  const lockedPacks = packs.filter(p => !p.isUnlocked && !p.isUpcoming);

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
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-800 text-sm font-medium mb-3">
            <Package className="w-4 h-4" />
            <span>{unlockedPacks.length} Paket{unlockedPacks.length !== 1 ? 'e' : ''} freigeschaltet</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Jedes Paket enthält thematisch passende Reflexions-Impulse
          </p>
        </motion.div>

        {/* Unlocked Packs */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-1">
            Freigeschaltet
          </h2>
          
          {unlockedPacks.map((pack, index) => (
            <motion.button
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePackClick(pack)}
              className="w-full text-left"
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
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                          style={{ width: `${(pack.usedImpulses / pack.totalImpulses) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {pack.usedImpulses}/{pack.totalImpulses}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Play className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Upcoming Pack */}
        {upcomingPack && (
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-medium text-foreground/70 uppercase tracking-wider px-1">
              Nächsten Monat
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
                        Bald verfügbar
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{upcomingPack.description}</p>
                    <p className="text-xs text-purple-600 mt-2">
                      Wird zum nächsten Monat freigeschaltet
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
              Alle Pakete freischalten
            </motion.button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImpulsePacks;
