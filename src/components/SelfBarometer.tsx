import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Smile, Pause, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelfBarometerProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'ali' | 'qualities' | 'weite' | 'result';

const QUALITIES = [
  { key: 'calm', de: 'Ruhe', en: 'Calm', emoji: '🧘' },
  { key: 'curiosity', de: 'Neugier', en: 'Curiosity', emoji: '🔍' },
  { key: 'clarity', de: 'Klarheit', en: 'Clarity', emoji: '💎' },
  { key: 'compassion', de: 'Mitgefühl', en: 'Compassion', emoji: '💗' },
  { key: 'confidence', de: 'Selbstvertrauen', en: 'Confidence', emoji: '💪' },
  { key: 'courage', de: 'Mut', en: 'Courage', emoji: '🦁' },
  { key: 'creativity', de: 'Kreativität', en: 'Creativity', emoji: '🎨' },
  { key: 'connectedness', de: 'Verbundenheit', en: 'Connectedness', emoji: '🤝' },
];

const WEITE_QUESTIONS = {
  de: [
    'Fühlt sich mein innerer Raum weit oder eng an?',
    'Bin ich neugierig auf meine Reaktion?',
    'Kann ich gleichzeitig mich und die andere Person sehen?',
  ],
  en: [
    'Does my inner space feel wide or narrow?',
    'Am I curious about my reaction?',
    'Can I see both myself and the other person at the same time?',
  ],
};

type Zone = {
  zone: number;
  color: string;
  bgColor: string;
  borderColor: string;
  label: { de: string; en: string };
  emoji: string;
  desc: { de: string; en: string };
  task: { de: string; en: string };
};

const ZONES: Zone[] = [
  {
    zone: 1, color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200',
    label: { de: 'Reaktiv', en: 'Reactive' }, emoji: '🔴',
    desc: { de: 'Impuls dominiert · Recht haben wollen · starke Emotion · kaum Mitgefühl', en: 'Impulse dominates · wanting to be right · strong emotion · little compassion' },
    task: { de: 'Nur regulieren. Keine Entscheidungen treffen.', en: 'Only regulate. No decisions.' },
  },
  {
    zone: 2, color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
    label: { de: 'Geblendet', en: 'Blended' }, emoji: '🟠',
    desc: { de: 'Anteil ist präsent · etwas Distanz möglich · ALI hilft spürbar', en: 'Part is present · some distance possible · ALI helps noticeably' },
    task: { de: 'Anteil identifizieren.', en: 'Identify the part.' },
  },
  {
    zone: 3, color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200',
    label: { de: 'Teilweise Selbstführung', en: 'Partial Self-Leadership' }, emoji: '🟡',
    desc: { de: 'Neugier möglich · Emotion da, aber nicht dominierend · Gespräch möglich', en: 'Curiosity possible · emotion present but not dominant · conversation possible' },
    task: { de: 'In Verbindung bleiben.', en: 'Stay connected.' },
  },
  {
    zone: 4, color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200',
    label: { de: 'Stabil im Selbst', en: 'Stable in Self' }, emoji: '🟢',
    desc: { de: 'Innere Ruhe · klare Perspektive · Mitgefühl für alle Beteiligten', en: 'Inner calm · clear perspective · compassion for everyone involved' },
    task: { de: 'Gute Zone für wichtige Gespräche.', en: 'Good zone for important conversations.' },
  },
  {
    zone: 5, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
    label: { de: 'Tiefe Selbstpräsenz', en: 'Deep Self-Presence' }, emoji: '🔵',
    desc: { de: 'Weite · Klarheit · Verbundenheit · Kreativer Zugang', en: 'Spaciousness · clarity · connectedness · creative access' },
    task: { de: 'Selten dauerhaft – aber kraftvoll.', en: 'Rarely permanent – but powerful.' },
  },
];

const getZone = (avg: number): Zone => {
  if (avg <= 3) return ZONES[0];
  if (avg <= 5) return ZONES[1];
  if (avg <= 7) return ZONES[2];
  if (avg <= 9) return ZONES[3];
  return ZONES[4];
};

const SelfBarometer: React.FC<SelfBarometerProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('ali');
  const [aliStep, setAliStep] = useState(0); // 0=A, 1=L, 2=I
  const [qualities, setQualities] = useState<Record<string, number>>(
    Object.fromEntries(QUALITIES.map(q => [q.key, 5]))
  );
  const [weiteAnswers, setWeiteAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const handleClose = () => {
    setStep('ali');
    setAliStep(0);
    setQualities(Object.fromEntries(QUALITIES.map(q => [q.key, 5])));
    setWeiteAnswers([null, null, null]);
    onClose();
  };

  const avg = Object.values(qualities).reduce((a, b) => a + b, 0) / QUALITIES.length;
  const weiteScore = weiteAnswers.filter(a => a === true).length;
  const combinedAvg = Math.round(((avg + weiteScore * 3.33) / 2) * 10) / 10;
  const zone = getZone(combinedAvg);

  const aliSteps = [
    {
      letter: 'A', de: 'Atmen', en: 'Breathe',
      icon: <Wind className="w-8 h-8" />,
      desc: { de: '3–5 ruhige Atemzüge. Spüre, wie die Luft ein- und ausströmt.', en: '3–5 calm breaths. Feel the air flowing in and out.' },
    },
    {
      letter: 'F', de: 'Fühlen', en: 'Feel',
      icon: <Smile className="w-8 h-8" />,
      desc: { de: 'Fühle dich in die Situation hinein oder antizipiere sie.\nWas spürst du im Körper? Welche Emotionen tauchen auf?', en: 'Feel into the situation or anticipate it.\nWhat do you notice in your body? What emotions arise?' },
    },
    {
      letter: 'S', de: 'Spontan & Fokussiert', en: 'Spontaneous & Focused',
      icon: <Pause className="w-8 h-8" />,
      desc: { de: 'Bewerte jetzt spontan und fokussiert auf die Situation.\nNicht nachdenken – spüren.', en: 'Now rate spontaneously and focused on the situation.\nDon\'t think – feel.' },
    },
  ];

  const [showIntro, setShowIntro] = useState(true);

  const l = (obj: { de: string; en: string }) => language === 'en' ? obj.en : obj.de;

  const introText = language === 'en'
    ? 'Use the Self-Barometer whenever you want to check in with yourself — for example before or after a difficult conversation, during or after reflecting on a situation or trigger, or while capturing a memory. It helps you gauge how much "Self" is present right now.'
    : 'Nutze das Self-Barometer immer dann, wenn du bei dir einchecken möchtest – zum Beispiel vor oder nach einer schwierigen Situation, während oder nach einer Reflexion über eine Situation oder einen Trigger, oder beim Erfassen einer Erinnerung. Es hilft dir einzuschätzen, wie viel „Selbst" gerade präsent ist.';

  const reset = () => {
    setStep('ali');
    setAliStep(0);
    setQualities(Object.fromEntries(QUALITIES.map(q => [q.key, 5])));
    setWeiteAnswers([null, null, null]);
    setShowIntro(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-[5px] rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌡️</span>
                <h2 className="font-serif text-lg font-semibold text-foreground">Self-Barometer</h2>
              </div>
              <div className="flex items-center gap-2">
                {step !== 'ali' && !showIntro && (
                  <button onClick={reset} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <button onClick={handleClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Progress */}
            {!showIntro && (
              <div className="flex gap-1 px-5 pt-3">
                {['ali', 'qualities', 'weite', 'result'].map((s, i) => (
                  <div key={s} className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    ['ali', 'qualities', 'weite', 'result'].indexOf(step) >= i ? 'bg-accent' : 'bg-muted'
                  )} />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence mode="wait">
                {/* Intro */}
                {showIntro && step === 'ali' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="text-center space-y-2">
                      <span className="text-4xl">🌡️</span>
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {language === 'en' ? 'When to use this?' : 'Wann nutze ich das?'}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {introText}
                    </p>

                    <div className="space-y-2">
                      {(language === 'en' ? [
                        { emoji: '⚡', text: 'Before a difficult situation – as preparation' },
                        { emoji: '🔥', text: 'Right after a difficult situation – to check in' },
                        { emoji: '🔍', text: 'During or after reflecting on a trigger' },
                        { emoji: '💭', text: 'While capturing or revisiting a memory' },
                      ] : [
                        { emoji: '⚡', text: 'Vor einer schwierigen Situation – als Vorbereitung' },
                        { emoji: '🔥', text: 'Direkt nach einer schwierigen Situation – zum Einchecken' },
                        { emoji: '🔍', text: 'Während oder nach einer Reflexion über einen Trigger oder eine spezifische Situation' },
                        { emoji: '💭', text: 'Beim Erfassen oder Wiederbesuchen einer Erinnerung' },
                      ]).map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-card rounded-xl p-3 border border-border/50">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-sm text-foreground">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => setShowIntro(false)}
                        className="flex items-center gap-1 text-sm font-medium text-accent bg-accent/10 px-5 py-2.5 rounded-xl"
                      >
                        {language === 'en' ? 'Start' : 'Starten'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step ALI */}
                {step === 'ali' && !showIntro && (
                  <motion.div
                    key="ali"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-accent uppercase tracking-wider">
                        {language === 'en' ? 'Level A – Regulation' : 'Ebene A – Regulation'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Before measuring, regulate yourself' : 'Bevor du misst, regulierst du'}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <motion.div
                        key={aliStep}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-2xl p-6 text-center space-y-4 w-full max-w-xs border border-border/50"
                      >
                        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto text-accent">
                          {aliSteps[aliStep].icon}
                        </div>
                        <div>
                          <span className="text-3xl font-serif font-bold text-accent">{aliSteps[aliStep].letter}</span>
                          <span className="text-lg font-serif text-foreground ml-2">
                            – {l(aliSteps[aliStep])}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                          {l(aliSteps[aliStep].desc)}
                        </p>
                      </motion.div>
                    </div>

                    <div className="flex justify-center gap-2">
                      {aliSteps.map((_, i) => (
                        <div key={i} className={cn(
                          "w-2.5 h-2.5 rounded-full transition-colors",
                          aliStep === i ? 'bg-accent' : 'bg-muted'
                        )} />
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setAliStep(Math.max(0, aliStep - 1))}
                        disabled={aliStep === 0}
                        className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {language === 'en' ? 'Back' : 'Zurück'}
                      </button>
                      <button
                        onClick={() => {
                          if (aliStep < 2) setAliStep(aliStep + 1);
                          else setStep('qualities');
                        }}
                        className="flex items-center gap-1 text-sm font-medium text-accent"
                      >
                        {aliStep < 2
                          ? (language === 'en' ? 'Next' : 'Weiter')
                          : (language === 'en' ? 'Start Assessment' : 'Einschätzung starten')}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step Qualities */}
                {step === 'qualities' && (
                  <motion.div
                    key="qualities"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-accent uppercase tracking-wider">
                        {language === 'en' ? 'Level B – The 8 Cs' : 'Ebene B – Die 8 Cs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Rate spontaneously from 0–10' : 'Bewerte spontan von 0–10'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {QUALITIES.map((q) => (
                        <div key={q.key} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {q.emoji} {language === 'en' ? q.en : q.de}
                            </span>
                            <span className="text-sm font-bold text-accent min-w-[2rem] text-right">
                              {qualities[q.key]}
                            </span>
                          </div>
                          <Slider
                            value={[qualities[q.key]]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(v) => setQualities(prev => ({ ...prev, [q.key]: v[0] }))}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Live average */}
                    <div className="text-center p-3 bg-card rounded-xl border border-border/50">
                      <span className="text-sm text-muted-foreground">
                        {language === 'en' ? 'Average' : 'Durchschnitt'}: </span>
                      <span className="text-lg font-bold text-accent">{avg.toFixed(1)}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button onClick={() => setStep('ali')} className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ChevronLeft className="w-4 h-4" />
                        {language === 'en' ? 'Back' : 'Zurück'}
                      </button>
                      <button onClick={() => setStep('weite')} className="flex items-center gap-1 text-sm font-medium text-accent">
                        {language === 'en' ? 'Next' : 'Weiter'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step Weite */}
                {step === 'weite' && (
                  <motion.div
                    key="weite"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-accent uppercase tracking-wider">
                        {language === 'en' ? 'Level C – Spaciousness Check' : 'Ebene C – Weite-Check'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Answer intuitively' : 'Beantworte intuitiv'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(language === 'en' ? WEITE_QUESTIONS.en : WEITE_QUESTIONS.de).map((q, i) => (
                        <div key={i} className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
                          <p className="text-sm text-foreground leading-relaxed">{q}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setWeiteAnswers(prev => { const n = [...prev]; n[i] = true; return n; })}
                              className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                                weiteAnswers[i] === true
                                  ? 'bg-green-100 border-green-300 text-green-800'
                                  : 'bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted'
                              )}
                            >
                              {language === 'en' ? 'Yes' : 'Ja'} ✨
                            </button>
                            <button
                              onClick={() => setWeiteAnswers(prev => { const n = [...prev]; n[i] = false; return n; })}
                              className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                                weiteAnswers[i] === false
                                  ? 'bg-orange-100 border-orange-300 text-orange-800'
                                  : 'bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted'
                              )}
                            >
                              {language === 'en' ? 'No' : 'Nein'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button onClick={() => setStep('qualities')} className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ChevronLeft className="w-4 h-4" />
                        {language === 'en' ? 'Back' : 'Zurück'}
                      </button>
                      <button
                        onClick={() => setStep('result')}
                        disabled={weiteAnswers.some(a => a === null)}
                        className="flex items-center gap-1 text-sm font-medium text-accent disabled:opacity-40"
                      >
                        {language === 'en' ? 'Show Result' : 'Ergebnis anzeigen'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Result */}
                {step === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Zone Display */}
                    <div className={cn("rounded-2xl p-5 border text-center space-y-3", zone.bgColor, zone.borderColor)}>
                      <span className="text-4xl">{zone.emoji}</span>
                      <div>
                        <p className={cn("text-xl font-serif font-bold", zone.color)}>
                          {language === 'en' ? `Zone ${zone.zone}` : `Zone ${zone.zone}`} – {l(zone.label)}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-1">{combinedAvg.toFixed(1)} / 10</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{l(zone.desc)}</p>
                      <div className={cn("inline-block px-4 py-2 rounded-full text-sm font-medium", zone.bgColor, zone.color)}>
                        👉 {l(zone.task)}
                      </div>
                    </div>

                    {/* Barometer visualization */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
                        {language === 'en' ? 'Your Position' : 'Deine Position'}
                      </p>
                      <div className="relative h-8 rounded-full overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex">
                          <div className="flex-1 bg-red-400/60" />
                          <div className="flex-1 bg-orange-400/60" />
                          <div className="flex-1 bg-yellow-400/60" />
                          <div className="flex-1 bg-green-400/60" />
                          <div className="flex-1 bg-blue-400/60" />
                        </div>
                        <motion.div
                          initial={{ left: '50%' }}
                          animate={{ left: `${Math.min(95, Math.max(5, combinedAvg * 10))}%` }}
                          transition={{ type: 'spring', damping: 15 }}
                          className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow-lg"
                          style={{ transform: 'translateX(-50%)' }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                        <span>0</span>
                        <span>3</span>
                        <span>5</span>
                        <span>7</span>
                        <span>9</span>
                        <span>10</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">{language === 'en' ? '8 Cs Average' : '8 Cs Ø'}</p>
                        <p className="text-lg font-bold text-foreground">{avg.toFixed(1)}</p>
                      </div>
                      <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">{language === 'en' ? 'Spaciousness' : 'Weite'}</p>
                        <p className="text-lg font-bold text-foreground">{weiteScore}/3</p>
                      </div>
                    </div>

                    {/* All zones mini */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'en' ? 'All Zones' : 'Alle Zonen'}
                      </p>
                      {ZONES.map((z) => (
                        <div key={z.zone} className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
                          zone.zone === z.zone ? cn(z.bgColor, z.borderColor, 'border') : 'bg-muted/30'
                        )}>
                          <span>{z.emoji}</span>
                          <span className={cn("font-medium", zone.zone === z.zone ? z.color : 'text-muted-foreground')}>
                            {l(z.label)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={reset}
                        className="flex-1 py-3 rounded-xl bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                      >
                        {language === 'en' ? 'Measure Again' : 'Erneut messen'}
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-xl bg-accent text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
                      >
                        {language === 'en' ? 'Close' : 'Schließen'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SelfBarometer;
