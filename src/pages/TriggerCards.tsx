import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Brain, Eye, Wind, RefreshCw, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Activity, Bookmark, BookmarkCheck, MessageSquare } from 'lucide-react';
import { triggerCategories, triggerCards, TriggerCard } from '@/data/triggerCards';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TriggerCardDetail: React.FC<{
  card: TriggerCard;
  isOpen: boolean;
  onToggle: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onStartReflection: () => void;
  isLoggedIn: boolean;
}> = ({ card, isOpen, onToggle, isSaved, onToggleSave, onStartReflection, isLoggedIn }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="ios-card overflow-hidden bg-secondary/80 border border-border/60"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-center gap-4"
      >
        <div className="text-2xl shrink-0">{card.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="ios-headline text-foreground">{card.title}</h3>
          <p className="ios-caption text-muted-foreground mt-0.5">{card.beduerfnis}</p>
        </div>
        {isLoggedIn && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            className="p-1.5 shrink-0"
            aria-label={isSaved ? 'Entfernen' : 'Speichern'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-accent" />
            ) : (
              <Bookmark className="w-5 h-5 text-muted-foreground/50" />
            )}
          </button>
        )}
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <Section icon={<Brain className="w-4 h-4" />} title="Innere Anteile">
                <LabelValue label="Typischer Anteil" value={card.typischerAnteil} />
                <LabelValue label="Manager-Reaktion" value={card.managerReaktion} />
              </Section>

              <Section icon={<Eye className="w-4 h-4" />} title="Was wirklich passiert">
                <p className="ios-body text-foreground/90">{card.wasPassiert}</p>
              </Section>

              <Section icon={<Activity className="w-4 h-4" />} title="Körpersignale">
                <p className="ios-body text-foreground/90">{card.koerpersignale}</p>
              </Section>

              <Section icon={<AlertTriangle className="w-4 h-4" />} title="Innere Trigger-Geschichte">
                <p className="ios-body text-foreground/90 italic font-serif">{card.innereTriggerGeschichte}</p>
              </Section>

              <Section icon={<Heart className="w-4 h-4" />} title="Self-Check">
                <ul className="space-y-2">
                  {card.selfCheck.map((q, i) => (
                    <li key={i} className="ios-body text-foreground/90 flex items-start gap-2">
                      <span className="text-accent mt-1 shrink-0">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section icon={<Wind className="w-4 h-4" />} title="Regulation">
                <p className="ios-body text-foreground/90 whitespace-pre-line">{card.regulation}</p>
              </Section>

              <Section icon={<RefreshCw className="w-4 h-4" />} title="Reframing">
                <div className="bg-accent/10 rounded-xl p-3">
                  <p className="ios-body text-foreground font-medium">{card.reframing}</p>
                </div>
              </Section>

              <Section icon={<Lightbulb className="w-4 h-4" />} title="Integrationsfrage">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="ios-body text-foreground italic">{card.integrationsfrage}</p>
                </div>
              </Section>

              {/* Reflection CTA */}
              <button
                onClick={onStartReflection}
                className="w-full py-3 rounded-2xl bg-accent text-accent-foreground font-semibold ios-body flex items-center justify-center gap-2 mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                Mit Oria reflektieren
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-accent">
      {icon}
      <span className="ios-footnote font-semibold uppercase tracking-wide">{title}</span>
    </div>
    {children}
  </div>
);

const LabelValue: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-baseline gap-2">
    <span className="ios-caption text-muted-foreground">{label}</span>
    <span className="ios-callout text-foreground text-right">{value}</span>
  </div>
);

type FilterMode = 'all' | 'saved';

const TriggerCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState(triggerCategories[0].id);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [savedCardIds, setSavedCardIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const loadSavedCards = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_trigger_cards' as any)
      .select('card_id')
      .eq('user_id', user.id);
    if (data) {
      setSavedCardIds(new Set((data as any[]).map((d: any) => d.card_id)));
    }
  }, [user]);

  useEffect(() => { loadSavedCards(); }, [loadSavedCards]);

  const toggleSaveCard = async (cardId: string) => {
    if (!user) {
      toast.error('Bitte melde dich an, um Karten zu speichern.');
      return;
    }
    if (savedCardIds.has(cardId)) {
      await supabase.from('saved_trigger_cards' as any).delete().eq('user_id', user.id).eq('card_id', cardId);
      setSavedCardIds(prev => { const n = new Set(prev); n.delete(cardId); return n; });
    } else {
      await supabase.from('saved_trigger_cards' as any).insert({ user_id: user.id, card_id: cardId } as any);
      setSavedCardIds(prev => new Set(prev).add(cardId));
    }
  };

  const startReflection = (card: TriggerCard) => {
    // Navigate to selfcare with trigger card context
    const triggerContext = encodeURIComponent(JSON.stringify({
      title: card.title,
      beduerfnis: card.beduerfnis,
      wasPassiert: card.wasPassiert,
      selfCheck: card.selfCheck,
      innereTriggerGeschichte: card.innereTriggerGeschichte,
      regulation: card.regulation,
      reframing: card.reframing,
      integrationsfrage: card.integrationsfrage,
    }));
    navigate(`/selfcare?triggerCard=${triggerContext}&autostart=true`);
  };

  const filteredCards = triggerCards.filter(c => {
    if (filterMode === 'saved') return savedCardIds.has(c.id);
    return c.category === activeCategory;
  });

  const activeCat = triggerCategories.find(c => c.id === activeCategory);

  return (
    <div className="ios-page ios-font">
      {/* Nav */}
      <div className="ios-nav-bar flex items-end px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-accent ios-body">
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück</span>
        </button>
        <div className="flex-1 text-center">
          <span className="ios-headline text-foreground">Trigger-Karten</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),24px)] space-y-5 mt-4 overflow-y-auto flex-1">
        {/* Intro */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
          <h1 className="ios-title-1 text-foreground">Trigger-Karten</h1>
          <p className="ios-callout text-muted-foreground max-w-md mx-auto">
            Erkenne deine inneren Muster und finde Wege zur Selbstregulation.
          </p>
          <button
            onClick={() => navigate('/trigger-test')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold ios-body shadow-sm"
          >
            🧪 Selbsttest starten
          </button>
        </motion.div>

        {/* Filter tabs: All / Saved */}
        {user && savedCardIds.size > 0 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={cn("px-4 py-2 rounded-full ios-footnote font-medium transition-colors",
                filterMode === 'all' ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              Alle Karten
            </button>
            <button
              onClick={() => setFilterMode('saved')}
              className={cn("px-4 py-2 rounded-full ios-footnote font-medium transition-colors flex items-center gap-1.5",
                filterMode === 'saved' ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Meine Karten ({savedCardIds.size})
            </button>
          </div>
        )}

        {/* Category grid – only show when viewing all */}
        {filterMode === 'all' && (
          <>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {triggerCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenCardId(null); }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-3 rounded-2xl text-left transition-all duration-200",
                    activeCategory === cat.id
                      ? "bg-accent text-accent-foreground shadow-md ring-1 ring-accent/30"
                      : "bg-secondary/80 text-secondary-foreground hover:bg-muted border border-border/40"
                  )}
                >
                  <span className="text-xl leading-none">{cat.icon}</span>
                  <span className="text-[13px] font-medium leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center pt-1">
              <h2 className="ios-title-2 text-foreground">
                {activeCat?.icon} {activeCat?.label}
              </h2>
              <p className="ios-caption text-muted-foreground mt-0.5">{filteredCards.length} Karten</p>
            </div>
          </>
        )}

        {filterMode === 'saved' && (
          <div className="text-center pt-1">
            <h2 className="ios-title-2 text-foreground">📌 Meine gespeicherten Karten</h2>
            <p className="ios-caption text-muted-foreground mt-0.5">{filteredCards.length} Karten</p>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-3 max-w-lg mx-auto">
          {filteredCards.length === 0 && filterMode === 'saved' && (
            <div className="text-center py-8">
              <p className="ios-callout text-muted-foreground">Noch keine Karten gespeichert.</p>
              <p className="ios-caption text-muted-foreground mt-1">Tippe auf das Lesezeichen-Symbol, um Karten zu speichern.</p>
            </div>
          )}
          <AnimatePresence mode="wait">
            {filteredCards.map(card => (
              <TriggerCardDetail
                key={card.id}
                card={card}
                isOpen={openCardId === card.id}
                onToggle={() => setOpenCardId(prev => prev === card.id ? null : card.id)}
                isSaved={savedCardIds.has(card.id)}
                onToggleSave={() => toggleSaveCard(card.id)}
                onStartReflection={() => startReflection(card)}
                isLoggedIn={!!user}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TriggerCardsPage;
