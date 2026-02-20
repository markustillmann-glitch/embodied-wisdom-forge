import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Brain, Eye, Wind, RefreshCw, Lightbulb, ChevronDown, ChevronUp, AlertTriangle, Activity } from 'lucide-react';
import { triggerCategories, triggerCards, TriggerCard } from '@/data/triggerCards';
import { cn } from '@/lib/utils';

const TriggerCardDetail: React.FC<{ card: TriggerCard; isOpen: boolean; onToggle: () => void }> = ({ card, isOpen, onToggle }) => {
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
              {/* Innere Anteile */}
              <Section icon={<Brain className="w-4 h-4" />} title="Innere Anteile">
                <LabelValue label="Typischer Anteil" value={card.typischerAnteil} />
                <LabelValue label="Manager-Reaktion" value={card.managerReaktion} />
              </Section>

              {/* Was wirklich passiert */}
              <Section icon={<Eye className="w-4 h-4" />} title="Was wirklich passiert">
                <p className="ios-body text-foreground/90">{card.wasPassiert}</p>
              </Section>

              {/* Körpersignale */}
              <Section icon={<Activity className="w-4 h-4" />} title="Körpersignale">
                <p className="ios-body text-foreground/90">{card.koerpersignale}</p>
              </Section>

              {/* Innere Trigger-Geschichte */}
              <Section icon={<AlertTriangle className="w-4 h-4" />} title="Innere Trigger-Geschichte">
                <p className="ios-body text-foreground/90 italic font-serif">{card.innereTriggerGeschichte}</p>
              </Section>

              {/* Self-Check */}
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

              {/* Regulation */}
              <Section icon={<Wind className="w-4 h-4" />} title="Regulation">
                <p className="ios-body text-foreground/90 whitespace-pre-line">{card.regulation}</p>
              </Section>

              {/* Reframing */}
              <Section icon={<RefreshCw className="w-4 h-4" />} title="Reframing">
                <div className="bg-accent/10 rounded-xl p-3">
                  <p className="ios-body text-foreground font-medium">{card.reframing}</p>
                </div>
              </Section>

              {/* Integrationsfrage */}
              <Section icon={<Lightbulb className="w-4 h-4" />} title="Integrationsfrage">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="ios-body text-foreground italic">{card.integrationsfrage}</p>
                </div>
              </Section>
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

const TriggerCards: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(triggerCategories[0].id);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const filteredCards = triggerCards.filter(c => c.category === activeCategory);
  const activeCat = triggerCategories.find(c => c.id === activeCategory);

  return (
    <div className="ios-page ios-font">
      {/* Nav */}
      <div className="ios-nav-bar flex items-end px-4 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-accent ios-body">
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück</span>
        </button>
        <div className="flex-1 text-center">
          <span className="ios-headline text-foreground">Trigger-Karten</span>
        </div>
        <div className="w-16" />
      </div>

      <div className="px-4 pb-8 space-y-5 mt-4">
        {/* Intro */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-1">
          <h1 className="ios-title-1 text-foreground">Trigger-Karten</h1>
          <p className="ios-callout text-muted-foreground max-w-md mx-auto">
            Erkenne deine inneren Muster und finde Wege zur Selbstregulation.
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {triggerCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenCardId(null); }}
              className={cn(
                "px-3.5 py-1.5 rounded-full ios-footnote transition-all duration-200",
                activeCategory === cat.id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Active category title */}
        <div className="text-center">
          <h2 className="ios-title-2 text-foreground">
            {activeCat?.icon} {activeCat?.label}
          </h2>
        </div>

        {/* Cards */}
        <div className="space-y-3 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {filteredCards.map(card => (
              <TriggerCardDetail
                key={card.id}
                card={card}
                isOpen={openCardId === card.id}
                onToggle={() => setOpenCardId(prev => prev === card.id ? null : card.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TriggerCards;
