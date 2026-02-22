import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Eye, Wind, RefreshCw, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Activity, Bookmark, BookmarkCheck, MessageSquare, Plus, Trash2, Sparkles, ArrowRightLeft } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { triggerCategories, triggerCards, TriggerCard } from '@/data/triggerCards';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import CreateTriggerCardDialog from '@/components/trigger/CreateTriggerCardDialog';

const TriggerCardDetail: React.FC<{
  card: TriggerCard;
  isOpen: boolean;
  onToggle: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onStartReflection: () => void;
  onConvert: () => void;
  isLoggedIn: boolean;
}> = ({ card, isOpen, onToggle, isSaved, onToggleSave, onStartReflection, onConvert, isLoggedIn }) => {
  const { t } = useLanguage();
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

              {/* Action buttons */}
              <div className="flex gap-2">
                {isLoggedIn && (
                  <button
                    onClick={onConvert}
                    className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold ios-body flex items-center justify-center gap-2 mt-2 border border-border/60"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    {t('trigger.personalize')}
                  </button>
                )}
                <button
                  onClick={onStartReflection}
                  className={cn(
                    "py-3 rounded-2xl bg-accent text-accent-foreground font-semibold ios-body flex items-center justify-center gap-2 mt-2",
                    isLoggedIn ? "flex-1" : "w-full"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('trigger.reflectWithOria')}
                </button>
              </div>
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

type FilterMode = 'all' | 'saved' | 'custom';

interface CustomCard {
  id: string;
  icon: string;
  title: string;
  typischer_anteil: string;
  manager_reaktion: string;
  beduerfnis: string;
  was_passiert: string;
  koerpersignale: string;
  innere_trigger_geschichte: string;
  self_check: string[];
  regulation: string;
  reframing: string;
  integrationsfrage: string;
}

function customToTriggerCard(c: CustomCard): TriggerCard {
  return {
    id: c.id,
    category: 'eigene',
    icon: c.icon,
    title: c.title,
    typischerAnteil: c.typischer_anteil,
    managerReaktion: c.manager_reaktion,
    beduerfnis: c.beduerfnis,
    wasPassiert: c.was_passiert,
    koerpersignale: c.koerpersignale,
    innereTriggerGeschichte: c.innere_trigger_geschichte,
    selfCheck: Array.isArray(c.self_check) ? c.self_check : [],
    regulation: c.regulation,
    reframing: c.reframing,
    integrationsfrage: c.integrationsfrage,
  };
}

const TriggerCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(triggerCategories[0].id);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [savedCardIds, setSavedCardIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [convertCard, setConvertCard] = useState<TriggerCard | undefined>(undefined);

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

  const loadCustomCards = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('custom_trigger_cards' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setCustomCards(data as any[]);
  }, [user]);

  useEffect(() => { loadCustomCards(); }, [loadCustomCards]);

  const deleteCustomCard = async (cardId: string) => {
    if (!user) return;
    await supabase.from('custom_trigger_cards' as any).delete().eq('id', cardId).eq('user_id', user.id);
    setCustomCards(prev => prev.filter(c => c.id !== cardId));
    toast.success(t('trigger.cardDeleted'));
  };

  const toggleSaveCard = async (cardId: string) => {
    if (!user) {
      toast.error(t('trigger.pleaseSignIn'));
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

  const filteredCards: TriggerCard[] = filterMode === 'custom'
    ? customCards.map(customToTriggerCard)
    : filterMode === 'saved'
      ? triggerCards.filter(c => savedCardIds.has(c.id))
      : triggerCards.filter(c => c.category === activeCategory);

  const isCustomCard = (id: string) => customCards.some(c => c.id === id);

  const activeCat = triggerCategories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
      {/* Header */}
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-[max(calc(env(safe-area-inset-bottom)+96px),120px)] space-y-5">
        {/* Intro */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
          <h1 className="ios-title-1 text-foreground">{t('trigger.title')}</h1>
          <p className="ios-callout text-muted-foreground max-w-md mx-auto">
            {t('trigger.description')}
          </p>
          <button
            onClick={() => {
              if (!user) {
                toast.error(t('trigger.pleaseSignIn'));
                navigate('/auth');
                return;
              }
              navigate('/summaries?tab=tests');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold ios-body shadow-sm"
          >
            {t('trigger.startSelftest')}
          </button>
        </motion.div>

        {/* Filter tabs */}
        {user && (
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterMode('all')}
              className={cn("px-4 py-2 rounded-full ios-footnote font-medium transition-colors",
                filterMode === 'all' ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              {t('trigger.allCards')}
            </button>
            {savedCardIds.size > 0 && (
              <button
                onClick={() => setFilterMode('saved')}
                className={cn("px-4 py-2 rounded-full ios-footnote font-medium transition-colors flex items-center gap-1.5",
                  filterMode === 'saved' ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                )}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                {t('trigger.saved')} ({savedCardIds.size})
              </button>
            )}
            <button
              onClick={() => setFilterMode('custom')}
              className={cn("px-4 py-2 rounded-full ios-footnote font-medium transition-colors flex items-center gap-1.5",
                filterMode === 'custom' ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('trigger.custom')} ({customCards.length})
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
              <p className="ios-caption text-muted-foreground mt-0.5">{filteredCards.length} {t('trigger.cards')}</p>
            </div>
          </>
        )}

        {filterMode === 'saved' && (
          <div className="text-center pt-1">
            <h2 className="ios-title-2 text-foreground">{t('trigger.savedCards')}</h2>
            <p className="ios-caption text-muted-foreground mt-0.5">{filteredCards.length} {t('trigger.cards')}</p>
          </div>
        )}

        {filterMode === 'custom' && (
          <div className="text-center pt-1 space-y-3">
            <h2 className="ios-title-2 text-foreground">{t('trigger.customCards')}</h2>
            <p className="ios-caption text-muted-foreground mt-0.5">{filteredCards.length} {t('trigger.cards')}</p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold ios-body shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t('trigger.createNew')}
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-3 max-w-lg mx-auto">
          {filteredCards.length === 0 && filterMode === 'saved' && (
            <div className="text-center py-8">
              <p className="ios-callout text-muted-foreground">{t('trigger.noSavedCards')}</p>
              <p className="ios-caption text-muted-foreground mt-1">{t('trigger.noSavedCardsHint')}</p>
            </div>
          )}
          {filteredCards.length === 0 && filterMode === 'custom' && (
            <div className="text-center py-8">
              <p className="ios-callout text-muted-foreground">{t('trigger.noCustomCards')}</p>
              <p className="ios-caption text-muted-foreground mt-1">{t('trigger.noCustomCardsHint')}</p>
            </div>
          )}
          <AnimatePresence mode="wait">
            {filteredCards.map(card => (
              <div key={card.id} className="relative">
                <TriggerCardDetail
                  card={card}
                  isOpen={openCardId === card.id}
                  onToggle={() => setOpenCardId(prev => prev === card.id ? null : card.id)}
                  isSaved={savedCardIds.has(card.id)}
                  onToggleSave={() => toggleSaveCard(card.id)}
                  onStartReflection={() => startReflection(card)}
                  onConvert={() => { setConvertCard(card); setShowCreateDialog(true); }}
                  isLoggedIn={!!user}
                />
                {filterMode === 'custom' && isCustomCard(card.id) && openCardId === card.id && (
                  <button
                    onClick={() => deleteCustomCard(card.id)}
                    className="absolute top-5 right-16 p-1.5 text-destructive/60 hover:text-destructive"
                    aria-label="Karte löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <CreateTriggerCardDialog
        isOpen={showCreateDialog}
        onClose={() => { setShowCreateDialog(false); setConvertCard(undefined); }}
        onCardCreated={loadCustomCards}
        initialCard={convertCard}
      />
      <AppFooter />
    </div>
  );
};

export default TriggerCardsPage;
