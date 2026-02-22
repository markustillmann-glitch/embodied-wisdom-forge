import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronRight, Save, History, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { triggerCategories } from '@/data/triggerCards';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
  id: string;
  text: { de: string; en: string };
  category: string;
}

const testQuestions: Question[] = [
  { id: 'b1', text: { de: 'Ich habe Angst, verlassen oder zurückgewiesen zu werden.', en: 'I am afraid of being abandoned or rejected.' }, category: 'beziehung' },
  { id: 'b2', text: { de: 'Wenn mein Partner / meine Partnerin sich zurückzieht, werde ich unruhig oder ängstlich.', en: 'When my partner withdraws, I become restless or anxious.' }, category: 'beziehung' },
  { id: 'b3', text: { de: 'Ich passe mich stark an andere an, um Konflikte zu vermeiden.', en: 'I strongly adapt to others to avoid conflicts.' }, category: 'beziehung' },
  { id: 'l1', text: { de: 'Ich fühle mich nur wertvoll, wenn ich etwas leiste.', en: 'I only feel valuable when I achieve something.' }, category: 'leistung' },
  { id: 'l2', text: { de: 'Fehler zu machen, löst in mir starke Scham oder Panik aus.', en: 'Making mistakes triggers strong shame or panic in me.' }, category: 'leistung' },
  { id: 'l3', text: { de: 'Ich kann schlecht „Nein" sagen, wenn es um Aufgaben oder Verantwortung geht.', en: 'I find it hard to say "no" when it comes to tasks or responsibilities.' }, category: 'leistung' },
  { id: 'f1', text: { de: 'Bestimmte Familienthemen lösen in mir starke Emotionen aus.', en: 'Certain family topics trigger strong emotions in me.' }, category: 'familie' },
  { id: 'f2', text: { de: 'Ich spüre Schuldgefühle, wenn ich mich von meiner Familie abgrenze.', en: 'I feel guilty when I set boundaries with my family.' }, category: 'familie' },
  { id: 'f3', text: { de: 'Ich habe das Gefühl, alten Rollenmustern aus meiner Familie nicht entkommen zu können.', en: 'I feel unable to escape old role patterns from my family.' }, category: 'familie' },
  { id: 's1', text: { de: 'Ich zweifle häufig an meinem eigenen Wert.', en: 'I frequently doubt my own worth.' }, category: 'selbstwert' },
  { id: 's2', text: { de: 'Kritik trifft mich tief, auch wenn sie sachlich gemeint ist.', en: 'Criticism hits me deeply, even when it is meant objectively.' }, category: 'selbstwert' },
  { id: 's3', text: { de: 'Ich vergleiche mich oft mit anderen und fühle mich dabei unterlegen.', en: 'I often compare myself to others and feel inferior.' }, category: 'selbstwert' },
  { id: 'si1', text: { de: 'Unvorhergesehene Veränderungen lösen in mir starken Stress aus.', en: 'Unexpected changes cause strong stress in me.' }, category: 'sicherheit' },
  { id: 'si2', text: { de: 'Ich brauche Kontrolle über Situationen, um mich sicher zu fühlen.', en: 'I need control over situations to feel safe.' }, category: 'sicherheit' },
  { id: 'si3', text: { de: 'Vertrauensverlust ist für mich extrem schwer zu verarbeiten.', en: 'Loss of trust is extremely hard for me to process.' }, category: 'sicherheit' },
  { id: 'i1', text: { de: 'Körperliche oder emotionale Nähe ist für mich mit Unsicherheit verbunden.', en: 'Physical or emotional closeness is associated with insecurity for me.' }, category: 'intimitaet' },
  { id: 'i2', text: { de: 'Ich fühle mich schnell überfordert, wenn jemand mir sehr nahe kommt.', en: 'I quickly feel overwhelmed when someone gets very close to me.' }, category: 'intimitaet' },
  { id: 'i3', text: { de: 'Ich habe Schwierigkeiten, meine Bedürfnisse in intimen Momenten zu äußern.', en: 'I have difficulty expressing my needs in intimate moments.' }, category: 'intimitaet' },
  { id: 'st1', text: { de: 'Es ist mir wichtig, wie andere mich wahrnehmen.', en: 'It is important to me how others perceive me.' }, category: 'status' },
  { id: 'st2', text: { de: 'Ich fühle mich unwohl, wenn ich in einer Gruppe nicht anerkannt werde.', en: 'I feel uncomfortable when I am not recognized in a group.' }, category: 'status' },
  { id: 'st3', text: { de: 'Soziale Vergleiche beeinflussen mein Wohlbefinden stark.', en: 'Social comparisons strongly influence my well-being.' }, category: 'status' },
  { id: 'sn1', text: { de: 'Ich habe oft das Gefühl, dass meinem Leben etwas Wesentliches fehlt.', en: 'I often feel that something essential is missing from my life.' }, category: 'sinn' },
  { id: 'sn2', text: { de: 'Sinnlosigkeit oder Leere machen mir Angst.', en: 'Meaninglessness or emptiness frightens me.' }, category: 'sinn' },
  { id: 'sn3', text: { de: 'Ich suche ständig nach einem tieferen Zweck oder einer Berufung.', en: 'I constantly search for a deeper purpose or calling.' }, category: 'sinn' },
  { id: 'k1', text: { de: 'Ich nehme körperliche Symptome schnell als bedrohlich wahr.', en: 'I quickly perceive physical symptoms as threatening.' }, category: 'koerper' },
  { id: 'k2', text: { de: 'Ich habe ein schwieriges Verhältnis zu meinem Körper oder meinem Aussehen.', en: 'I have a difficult relationship with my body or appearance.' }, category: 'koerper' },
  { id: 'k3', text: { de: 'Stresssituationen zeigen sich bei mir schnell körperlich.', en: 'Stress situations quickly manifest physically in me.' }, category: 'koerper' },
  { id: 'z1', text: { de: 'Gedanken an die Zukunft lösen Angst oder Überforderung aus.', en: 'Thoughts about the future trigger anxiety or overwhelm.' }, category: 'zukunft' },
  { id: 'z2', text: { de: 'Ich schiebe wichtige Entscheidungen oft vor mir her.', en: 'I often procrastinate on important decisions.' }, category: 'zukunft' },
  { id: 'z3', text: { de: 'Ich habe Angst, die falsche Wahl zu treffen und etwas zu verpassen.', en: 'I am afraid of making the wrong choice and missing out.' }, category: 'zukunft' },
];

const shuffleQuestions = (qs: Question[]) => {
  const shuffled = [...qs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

type ResultEntry = { category: string; score: number; maxScore: number; percent: number };
type SavedTest = { id: string; created_at: string; results: ResultEntry[] };

const getCategoryInfo = (id: string) => triggerCategories.find(c => c.id === id);

const getRelevanceLabel = (percent: number, t: (key: string) => string) => {
  if (percent >= 75) return { label: t('triggerTest.veryHigh'), color: 'bg-destructive/20 text-destructive' };
  if (percent >= 50) return { label: t('triggerTest.high'), color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400' };
  if (percent >= 25) return { label: t('triggerTest.medium'), color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
  return { label: t('triggerTest.low'), color: 'bg-muted text-muted-foreground' };
};

const formatDate = (iso: string, lang: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

type View = 'test' | 'results' | 'history' | 'compare';

const TriggerTest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [questions] = useState(() => shuffleQuestions(testQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [view, setView] = useState<View>('test');
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedCurrentResult, setSavedCurrentResult] = useState(false);

  const answerOptions = [
    { value: 0, label: t('triggerTest.doesNotApply') },
    { value: 1, label: t('triggerTest.ratherNot') },
    { value: 2, label: t('triggerTest.partially') },
    { value: 3, label: t('triggerTest.ratherApplies') },
    { value: 4, label: t('triggerTest.fullyApplies') },
  ];

  const progress = Object.keys(answers).length / questions.length;
  const currentQ = questions[currentIndex];
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false;
  const allAnswered = Object.keys(answers).length === questions.length;
  const isLast = currentIndex === questions.length - 1;

  const results: ResultEntry[] = useMemo(() => {
    if (view !== 'results' && view !== 'compare') return [];
    const categoryScores: Record<string, { score: number; count: number }> = {};
    triggerCategories.forEach(c => { categoryScores[c.id] = { score: 0, count: 0 }; });
    testQuestions.forEach(q => {
      const val = answers[q.id] ?? 0;
      categoryScores[q.category].score += val;
      categoryScores[q.category].count += 1;
    });
    return Object.entries(categoryScores)
      .map(([category, { score, count }]) => ({
        category, score, maxScore: count * 4,
        percent: Math.round((score / (count * 4)) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [view, answers]);

  const loadSavedTests = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('trigger_test_results' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setSavedTests((data as any[]).map((d: any) => ({ id: d.id, created_at: d.created_at, results: d.results as ResultEntry[] })));
    }
  }, [user]);

  useEffect(() => { loadSavedTests(); }, [loadSavedTests]);

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    setTimeout(() => {
      if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleFinish = () => {
    setSavedCurrentResult(false);
    setView('results');
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSavedCurrentResult(false);
    setView('test');
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: t('triggerTest.pleaseSignIn'), description: t('triggerTest.signInToSave') });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('trigger_test_results' as any).insert({
      user_id: user.id,
      results: results as unknown as Record<string, unknown>[],
    } as any);
    setSaving(false);
    if (error) {
      toast({ title: t('triggerTest.error'), description: t('triggerTest.errorSaving'), variant: 'destructive' });
    } else {
      setSavedCurrentResult(true);
      toast({ title: t('triggerTest.saved'), description: t('triggerTest.savedSuccess') });
      loadSavedTests();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('trigger_test_results' as any).delete().eq('id', id);
    setSavedTests(prev => prev.filter(t => t.id !== id));
    setCompareIds(prev => prev.filter(cid => cid !== id));
    toast({ title: t('triggerTest.deleteSuccess') });
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  // --- COMPARE VIEW ---
  if (view === 'compare' && compareIds.length >= 2) {
    const testsToCompare = compareIds.map(id => savedTests.find(t => t.id === id)!).filter(Boolean);
    const categories = triggerCategories.map(c => c.id);

    return (
      <div className="ios-page ios-font flex flex-col bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
        <div className="ios-nav-bar flex items-end px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
          <button onClick={() => setView('history')} className="flex items-center gap-1 text-accent ios-body">
            <ArrowLeft className="w-5 h-5" /> {t('nav.back')}
          </button>
          <div className="flex-1 text-center">
            <span className="ios-headline text-foreground">{t('triggerTest.comparison')}</span>
          </div>
          <div className="w-16" />
        </div>

        <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),120px)] mt-4 space-y-4 overflow-y-auto flex-1">
          <div className="flex flex-wrap gap-3 justify-center">
            {testsToCompare.map((test, i) => (
              <span key={test.id} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", i === 0 ? "bg-accent/20 text-accent" : i === 1 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive")}>
                {formatDate(test.created_at, language)}
              </span>
            ))}
          </div>

          {categories.map(catId => {
            const cat = getCategoryInfo(catId);
            const values = testsToCompare.map(t => {
              const r = t.results.find(r => r.category === catId);
              return r?.percent ?? 0;
            });
            const diff = values.length >= 2 ? values[values.length - 1] - values[0] : 0;

            return (
              <div key={catId} className="bg-secondary/80 border border-border/40 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat?.icon}</span>
                    <span className="ios-body font-medium text-foreground">{cat?.label}</span>
                  </div>
                  {diff !== 0 && (
                    <span className={cn("flex items-center gap-0.5 text-xs font-semibold", diff > 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                      {diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  )}
                  {diff === 0 && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <div className="space-y-1">
                  {testsToCompare.map((test, i) => {
                    const r = test.results.find(r => r.category === catId);
                    const pct = r?.percent ?? 0;
                    return (
                      <div key={test.id} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-10 shrink-0">{formatDate(test.created_at, language).split(',')[0]}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            className={cn("h-full rounded-full", i === 0 ? "bg-accent" : i === 1 ? "bg-primary" : "bg-destructive")}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- HISTORY VIEW ---
  if (view === 'history') {
    return (
      <div className="ios-page ios-font flex flex-col bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
        <div className="ios-nav-bar flex items-end px-4 pb-2 pt-[max(env(safe-area-inset-top),20px)]">
          <button onClick={() => setView(results.length ? 'results' : 'test')} className="flex items-center gap-1 text-accent ios-body">
            <ArrowLeft className="w-5 h-5" /> {t('nav.back')}
          </button>
          <div className="flex-1 text-center">
            <span className="ios-headline text-foreground">{t('triggerTest.history')}</span>
          </div>
          <div className="w-16" />
        </div>

        <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),120px)] mt-4 space-y-4 overflow-y-auto flex-1">
          {savedTests.length === 0 ? (
            <div className="text-center py-12">
              <p className="ios-callout text-muted-foreground">{t('triggerTest.noSavedTests')}</p>
            </div>
          ) : (
            <>
              {compareIds.length >= 2 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setView('compare')}
                  className="w-full py-3 rounded-2xl bg-accent text-accent-foreground font-semibold ios-body"
                >
                  {compareIds.length} {t('triggerTest.compareTests')}
                </motion.button>
              )}
              <p className="ios-caption text-muted-foreground text-center">
                {t('triggerTest.selectToCompare')}
              </p>

              {savedTests.map(test => {
                const top = [...test.results].sort((a, b) => b.percent - a.percent)[0];
                const topCat = getCategoryInfo(top?.category);
                const selected = compareIds.includes(test.id);
                return (
                  <motion.div
                    key={test.id}
                    layout
                    className={cn(
                      "bg-secondary/80 border rounded-2xl p-4 space-y-2 transition-colors",
                      selected ? "border-accent" : "border-border/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button onClick={() => toggleCompare(test.id)} className="flex-1 text-left flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", selected ? "border-accent bg-accent" : "border-muted-foreground/30")}>
                          {selected && <div className="w-2 h-2 rounded-full bg-accent-foreground" />}
                        </div>
                        <div>
                          <p className="ios-body font-medium text-foreground">{formatDate(test.created_at, language)}</p>
                          <p className="ios-caption text-muted-foreground">
                            Top: {topCat?.icon} {topCat?.label} ({top?.percent}%)
                          </p>
                        </div>
                      </button>
                      <button onClick={() => handleDelete(test.id)} className="p-2 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1 items-end h-8">
                      {[...test.results].sort((a, b) => b.percent - a.percent).map(r => (
                        <div key={r.category} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-muted rounded-sm overflow-hidden" style={{ height: '32px' }}>
                            <div className="w-full bg-accent/60 rounded-sm mt-auto" style={{ height: `${r.percent}%`, marginTop: `${100 - r.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (view === 'results') {
    const topCategory = results[0];
    const topCat = getCategoryInfo(topCategory.category);

    return (
      <div className="ios-page ios-font bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
        <AppHeader />

        <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),120px)] mt-4 space-y-6 overflow-y-auto flex-1">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-2">
            <span className="text-5xl">{topCat?.icon}</span>
            <h1 className="ios-title-1 text-foreground">{t('triggerTest.strongestTrigger')}</h1>
            <p className="ios-title-2 text-accent">{topCat?.label}</p>
            <p className="ios-callout text-muted-foreground">{language === 'de' ? 'Relevanz' : 'Relevance'}: {topCategory.percent}%</p>
          </motion.div>

          <div className="space-y-2.5 max-w-md mx-auto">
            {results.map((r, i) => {
              const cat = getCategoryInfo(r.category);
              const rel = getRelevanceLabel(r.percent, t);
              return (
                <motion.div key={r.category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-secondary/80 border border-border/40 rounded-2xl p-3.5 flex items-center gap-3">
                  <span className="text-lg font-semibold text-muted-foreground w-6 text-center">{i + 1}</span>
                  <span className="text-xl">{cat?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="ios-body font-medium text-foreground truncate">{cat?.label}</p>
                    <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${r.percent}%` }} transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }} className="h-full bg-accent rounded-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="ios-headline text-foreground">{r.percent}%</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", rel.color)}>{rel.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 max-w-md mx-auto pt-2">
            {user && !savedCurrentResult && (
              <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-semibold ios-body flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? t('common.loading') : t('triggerTest.saveResult')}
              </button>
            )}
            {savedCurrentResult && (
              <p className="text-center ios-caption text-muted-foreground">✓ {t('triggerTest.saved')}</p>
            )}
            {user && savedTests.length > 0 && (
              <button onClick={() => setView('history')} className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium ios-body flex items-center justify-center gap-2">
                <History className="w-4 h-4" /> {t('triggerTest.history')} ({savedTests.length})
              </button>
            )}
            <button onClick={() => navigate('/trigger-cards')} className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium ios-body flex items-center justify-center gap-2">
              {language === 'de' ? 'Trigger-Karten erkunden' : 'Explore trigger cards'} <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium ios-body">
              {t('triggerTest.restartTest')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTIONNAIRE VIEW ---
  return (
    <div className="ios-page ios-font flex flex-col bg-gradient-to-b from-amber-50/80 via-orange-50/60 to-rose-50/40">
      <AppHeader />

      <div className="px-4 pt-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent rounded-full" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
        <AnimatePresence mode="wait">
          <motion.div key={currentQ.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="space-y-8">
            <p className="ios-title-2 text-foreground text-center leading-relaxed">„{currentQ.text[language]}"</p>
            <div className="space-y-2.5 max-w-sm mx-auto">
              {answerOptions.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(opt.value)} className={cn(
                  "w-full py-3.5 px-4 rounded-2xl ios-body font-medium transition-all duration-200 text-left",
                  answers[currentQ.id] === opt.value ? "bg-accent text-accent-foreground shadow-md" : "bg-secondary/80 text-secondary-foreground border border-border/40 active:scale-[0.98]"
                )}>
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-8 max-w-sm mx-auto w-full">
          <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="flex items-center gap-1 text-accent ios-body disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> {t('nav.back')}
          </button>
          {allAnswered && isLast ? (
            <button onClick={handleFinish} className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-semibold ios-body">
              {t('triggerTest.finish')}
            </button>
          ) : (
            <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={!isAnswered} className="flex items-center gap-1 text-accent ios-body disabled:opacity-30">
              {language === 'de' ? 'Weiter' : 'Next'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerTest;
