import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronRight } from 'lucide-react';
import { triggerCategories } from '@/data/triggerCards';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  category: string;
}

const testQuestions: Question[] = [
  // Beziehung & Bindung (3 Fragen)
  { id: 'b1', text: 'Ich habe Angst, verlassen oder zurückgewiesen zu werden.', category: 'beziehung' },
  { id: 'b2', text: 'Wenn mein Partner / meine Partnerin sich zurückzieht, werde ich unruhig oder ängstlich.', category: 'beziehung' },
  { id: 'b3', text: 'Ich passe mich stark an andere an, um Konflikte zu vermeiden.', category: 'beziehung' },

  // Leistung & Arbeit
  { id: 'l1', text: 'Ich fühle mich nur wertvoll, wenn ich etwas leiste.', category: 'leistung' },
  { id: 'l2', text: 'Fehler zu machen, löst in mir starke Scham oder Panik aus.', category: 'leistung' },
  { id: 'l3', text: 'Ich kann schlecht „Nein" sagen, wenn es um Aufgaben oder Verantwortung geht.', category: 'leistung' },

  // Familie & Herkunft
  { id: 'f1', text: 'Bestimmte Familienthemen lösen in mir starke Emotionen aus.', category: 'familie' },
  { id: 'f2', text: 'Ich spüre Schuldgefühle, wenn ich mich von meiner Familie abgrenze.', category: 'familie' },
  { id: 'f3', text: 'Ich habe das Gefühl, alten Rollenmustern aus meiner Familie nicht entkommen zu können.', category: 'familie' },

  // Selbstwert & Identität
  { id: 's1', text: 'Ich zweifle häufig an meinem eigenen Wert.', category: 'selbstwert' },
  { id: 's2', text: 'Kritik trifft mich tief, auch wenn sie sachlich gemeint ist.', category: 'selbstwert' },
  { id: 's3', text: 'Ich vergleiche mich oft mit anderen und fühle mich dabei unterlegen.', category: 'selbstwert' },

  // Sicherheit & Kontrolle
  { id: 'si1', text: 'Unvorhergesehene Veränderungen lösen in mir starken Stress aus.', category: 'sicherheit' },
  { id: 'si2', text: 'Ich brauche Kontrolle über Situationen, um mich sicher zu fühlen.', category: 'sicherheit' },
  { id: 'si3', text: 'Vertrauensverlust ist für mich extrem schwer zu verarbeiten.', category: 'sicherheit' },

  // Intimität
  { id: 'i1', text: 'Körperliche oder emotionale Nähe ist für mich mit Unsicherheit verbunden.', category: 'intimitaet' },
  { id: 'i2', text: 'Ich fühle mich schnell überfordert, wenn jemand mir sehr nahe kommt.', category: 'intimitaet' },
  { id: 'i3', text: 'Ich habe Schwierigkeiten, meine Bedürfnisse in intimen Momenten zu äußern.', category: 'intimitaet' },

  // Status & Soziales
  { id: 'st1', text: 'Es ist mir wichtig, wie andere mich wahrnehmen.', category: 'status' },
  { id: 'st2', text: 'Ich fühle mich unwohl, wenn ich in einer Gruppe nicht anerkannt werde.', category: 'status' },
  { id: 'st3', text: 'Soziale Vergleiche beeinflussen mein Wohlbefinden stark.', category: 'status' },

  // Sinn & Spiritualität
  { id: 'sn1', text: 'Ich habe oft das Gefühl, dass meinem Leben etwas Wesentliches fehlt.', category: 'sinn' },
  { id: 'sn2', text: 'Sinnlosigkeit oder Leere machen mir Angst.', category: 'sinn' },
  { id: 'sn3', text: 'Ich suche ständig nach einem tieferen Zweck oder einer Berufung.', category: 'sinn' },

  // Körper & Gesundheit
  { id: 'k1', text: 'Ich nehme körperliche Symptome schnell als bedrohlich wahr.', category: 'koerper' },
  { id: 'k2', text: 'Ich habe ein schwieriges Verhältnis zu meinem Körper oder meinem Aussehen.', category: 'koerper' },
  { id: 'k3', text: 'Stresssituationen zeigen sich bei mir schnell körperlich.', category: 'koerper' },

  // Zukunft & Lebensplanung
  { id: 'z1', text: 'Gedanken an die Zukunft lösen Angst oder Überforderung aus.', category: 'zukunft' },
  { id: 'z2', text: 'Ich schiebe wichtige Entscheidungen oft vor mir her.', category: 'zukunft' },
  { id: 'z3', text: 'Ich habe Angst, die falsche Wahl zu treffen und etwas zu verpassen.', category: 'zukunft' },
];

// Shuffle deterministically per session
const shuffleQuestions = (qs: Question[]) => {
  const shuffled = [...qs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const answerOptions = [
  { value: 0, label: 'Trifft nicht zu' },
  { value: 1, label: 'Eher nicht' },
  { value: 2, label: 'Teilweise' },
  { value: 3, label: 'Trifft eher zu' },
  { value: 4, label: 'Trifft voll zu' },
];

type Results = { category: string; score: number; maxScore: number; percent: number }[];

const TriggerTest: React.FC = () => {
  const navigate = useNavigate();
  const [questions] = useState(() => shuffleQuestions(testQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = Object.keys(answers).length / questions.length;
  const currentQ = questions[currentIndex];
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false;
  const isLast = currentIndex === questions.length - 1;
  const allAnswered = Object.keys(answers).length === questions.length;

  const results: Results = useMemo(() => {
    if (!showResults) return [];
    const categoryScores: Record<string, { score: number; count: number }> = {};
    triggerCategories.forEach(c => { categoryScores[c.id] = { score: 0, count: 0 }; });

    testQuestions.forEach(q => {
      const val = answers[q.id] ?? 0;
      categoryScores[q.category].score += val;
      categoryScores[q.category].count += 1;
    });

    return Object.entries(categoryScores)
      .map(([category, { score, count }]) => ({
        category,
        score,
        maxScore: count * 4,
        percent: Math.round((score / (count * 4)) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [showResults, answers]);

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const getRelevanceLabel = (percent: number) => {
    if (percent >= 75) return { label: 'Sehr hoch', color: 'bg-destructive/20 text-destructive' };
    if (percent >= 50) return { label: 'Hoch', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400' };
    if (percent >= 25) return { label: 'Mittel', color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
    return { label: 'Gering', color: 'bg-muted text-muted-foreground' };
  };

  const getCategoryInfo = (id: string) => triggerCategories.find(c => c.id === id);

  // Results view
  if (showResults) {
    const topCategory = results[0];
    const topCat = getCategoryInfo(topCategory.category);

    return (
      <div className="ios-page ios-font">
        <div className="ios-nav-bar flex items-end px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
          <button onClick={() => navigate('/trigger-cards')} className="flex items-center gap-1 text-accent ios-body">
            <ArrowLeft className="w-5 h-5" />
            <span>Karten</span>
          </button>
          <div className="flex-1 text-center">
            <span className="ios-headline text-foreground">Ergebnis</span>
          </div>
          <button onClick={handleReset} className="text-accent ios-body flex items-center gap-1">
            <RotateCcw className="w-4 h-4" />
            <span>Neu</span>
          </button>
        </div>

        <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),120px)] mt-4 space-y-6 overflow-y-auto flex-1">
          {/* Hero result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-2"
          >
            <span className="text-5xl">{topCat?.icon}</span>
            <h1 className="ios-title-1 text-foreground">Dein stärkster Trigger-Bereich</h1>
            <p className="ios-title-2 text-accent">{topCat?.label}</p>
            <p className="ios-callout text-muted-foreground">
              Relevanz: {topCategory.percent}%
            </p>
          </motion.div>

          {/* All results ranked */}
          <div className="space-y-2.5 max-w-md mx-auto">
            {results.map((r, i) => {
              const cat = getCategoryInfo(r.category);
              const rel = getRelevanceLabel(r.percent);
              return (
                <motion.div
                  key={r.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-secondary/80 border border-border/40 rounded-2xl p-3.5 flex items-center gap-3"
                >
                  <span className="text-lg font-semibold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <span className="text-xl">{cat?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="ios-body font-medium text-foreground truncate">{cat?.label}</p>
                    <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.percent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="ios-headline text-foreground">{r.percent}%</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", rel.color)}>
                      {rel.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={() => navigate('/trigger-cards')}
              className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-semibold ios-body flex items-center justify-center gap-2"
            >
              Trigger-Karten erkunden <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium ios-body"
            >
              Test wiederholen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire view
  return (
    <div className="ios-page ios-font flex flex-col">
      {/* Nav */}
      <div className="ios-nav-bar flex items-end px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
        <button onClick={() => navigate('/trigger-cards')} className="flex items-center gap-1 text-accent ios-body">
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück</span>
        </button>
        <div className="flex-1 text-center">
          <span className="ios-headline text-foreground">Selbsttest</span>
        </div>
        <span className="ios-caption text-muted-foreground w-16 text-right">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <p className="ios-title-2 text-foreground text-center leading-relaxed">
              „{currentQ.text}"
            </p>

            <div className="space-y-2.5 max-w-sm mx-auto">
              {answerOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={cn(
                    "w-full py-3.5 px-4 rounded-2xl ios-body font-medium transition-all duration-200 text-left",
                    answers[currentQ.id] === opt.value
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-secondary/80 text-secondary-foreground border border-border/40 active:scale-[0.98]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-sm mx-auto w-full">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-accent ios-body disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>

          {allAnswered && isLast ? (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold ios-body"
            >
              Auswerten
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={!isAnswered}
              className="flex items-center gap-1 text-accent ios-body disabled:opacity-30"
            >
              Weiter <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerTest;
