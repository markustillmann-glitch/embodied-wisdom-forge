import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown, Minus, BarChart3, ClipboardList, Thermometer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCategories } from '@/data/triggerCards';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ResultEntry = { category: string; score: number; maxScore: number; percent: number };
type SavedTest = { id: string; created_at: string; results: ResultEntry[] };
type BarometerResult = {
  id: string;
  created_at: string;
  qualities: Record<string, number>;
  weite_answers: (boolean | null)[];
  qualities_avg: number;
  weite_score: number;
  combined_avg: number;
  zone: number;
  context: string | null;
};

const ZONE_INFO: Record<number, { label: { de: string; en: string }; emoji: string; color: string; bgColor: string }> = {
  1: { label: { de: 'Reaktiv', en: 'Reactive' }, emoji: '🔴', color: 'text-red-700', bgColor: 'bg-red-50' },
  2: { label: { de: 'Geblendet', en: 'Blended' }, emoji: '🟠', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  3: { label: { de: 'Teilweise Selbstführung', en: 'Partial Self-Leadership' }, emoji: '🟡', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  4: { label: { de: 'Stabil im Selbst', en: 'Stable in Self' }, emoji: '🟢', color: 'text-green-700', bgColor: 'bg-green-50' },
  5: { label: { de: 'Tiefe Selbstpräsenz', en: 'Deep Self-Presence' }, emoji: '🔵', color: 'text-blue-700', bgColor: 'bg-blue-50' },
};

const getCategoryInfo = (id: string) => triggerCategories.find(c => c.id === id);

const formatDate = (iso: string, lang: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getRelevanceLabel = (percent: number, t: (key: string) => string) => {
  if (percent >= 75) return { label: t('triggerTest.veryHigh'), color: 'bg-destructive/20 text-destructive' };
  if (percent >= 50) return { label: t('triggerTest.high'), color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400' };
  if (percent >= 25) return { label: t('triggerTest.medium'), color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
  return { label: t('triggerTest.low'), color: 'bg-muted text-muted-foreground' };
};

export const TriggerTestHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [barometerResults, setBarometerResults] = useState<BarometerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteBarometerId, setDeleteBarometerId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'trigger' | 'barometer'>('trigger');

  const loadTests = useCallback(async () => {
    if (!user) return;
    try {
      const [triggerRes, barometerRes] = await Promise.all([
        supabase
          .from('trigger_test_results' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('barometer_results' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (!triggerRes.error && triggerRes.data) {
        setSavedTests((triggerRes.data as any[]).map((d: any) => ({
          id: d.id,
          created_at: d.created_at,
          results: d.results as ResultEntry[],
        })));
      }
      if (!barometerRes.error && barometerRes.data) {
        setBarometerResults(barometerRes.data as any as BarometerResult[]);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadTests(); }, [loadTests]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('trigger_test_results' as any).delete().eq('id', deleteId);
    setSavedTests(prev => prev.filter(t => t.id !== deleteId));
    setCompareIds(prev => prev.filter(c => c !== deleteId));
    setDeleteId(null);
    toast.success(t('triggerTest.deleteSuccess'));
  };

  const handleDeleteBarometer = async () => {
    if (!deleteBarometerId) return;
    await supabase.from('barometer_results' as any).delete().eq('id', deleteBarometerId);
    setBarometerResults(prev => prev.filter(b => b.id !== deleteBarometerId));
    setDeleteBarometerId(null);
    toast.success(language === 'en' ? 'Barometer result deleted' : 'Barometer-Ergebnis gelöscht');
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Compare view
  if (compareMode && compareIds.length >= 2) {
    const testsToCompare = compareIds.map(id => savedTests.find(t => t.id === id)!).filter(Boolean);
    const categories = triggerCategories.map(c => c.id);

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t('triggerTest.comparison')}</h3>
          <Button variant="outline" size="sm" onClick={() => { setCompareMode(false); setCompareIds([]); }}>
            {t('nav.back')}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {testsToCompare.map((test, i) => (
            <span key={test.id} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full",
              i === 0 ? "bg-accent/20 text-accent" : i === 1 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
            )}>
              {formatDate(test.created_at, language)}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          {categories.map(catId => {
            const cat = getCategoryInfo(catId);
            const values = testsToCompare.map(t => {
              const r = t.results.find(r => r.category === catId);
              return r?.percent ?? 0;
            });
            const diff = values.length >= 2 ? values[values.length - 1] - values[0] : 0;

            return (
              <div key={catId} className="bg-card border border-border rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat?.icon}</span>
                    <span className="text-sm font-medium text-foreground">{cat?.label}</span>
                  </div>
                  {diff !== 0 ? (
                    <span className={cn("flex items-center gap-0.5 text-xs font-semibold",
                      diff > 0 ? "text-destructive" : "text-green-600 dark:text-green-400"
                    )}>
                      {diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  {testsToCompare.map((test, i) => {
                    const r = test.results.find(r => r.category === catId);
                    const pct = r?.percent ?? 0;
                    return (
                      <div key={test.id} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-10 shrink-0">
                          {formatDate(test.created_at, language).split(',')[0]}
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            className={cn("h-full rounded-full",
                              i === 0 ? "bg-accent" : i === 1 ? "bg-primary" : "bg-destructive"
                            )}
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

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-5 justify-center">
        <button
          onClick={() => setActiveSubTab('trigger')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5",
            activeSubTab === 'trigger' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <ClipboardList className="w-4 h-4" />
          {language === 'de' ? 'Trigger-Tests' : 'Trigger Tests'}
        </button>
        <button
          onClick={() => setActiveSubTab('barometer')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5",
            activeSubTab === 'barometer' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          <Thermometer className="w-4 h-4" />
          {language === 'de' ? 'Barometer' : 'Barometer'}
          {barometerResults.length > 0 && (
            <span className="text-[10px] bg-background/30 px-1.5 py-0.5 rounded-full">{barometerResults.length}</span>
          )}
        </button>
      </div>

      {activeSubTab === 'trigger' && (
        <>
          <div className="flex justify-center gap-3 mb-6">
            <Button onClick={() => navigate('/trigger-test')} className="gap-2">
              <ClipboardList className="w-4 h-4" />
              {language === 'de' ? 'Neuen Test starten' : 'Start new test'}
            </Button>
            {savedTests.length >= 2 && (
              <Button variant="outline" onClick={() => setCompareMode(true)} className="gap-2">
                <BarChart3 className="w-4 h-4" />
                {language === 'de' ? 'Vergleichen' : 'Compare'}
              </Button>
            )}
          </div>

          {savedTests.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t('triggerTest.noSavedTests')}</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {language === 'de' ? 'Mache den Trigger-Selbsttest und speichere dein Ergebnis.' : 'Take the trigger self-test and save your result.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {compareMode && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t('triggerTest.selectToCompare')}</p>
                  {compareIds.length >= 2 && (
                    <Button onClick={() => {}} className="mb-3" size="sm">
                      {compareIds.length} {t('triggerTest.compareTests')}
                    </Button>
                  )}
                </div>
              )}

              {savedTests.map((test, index) => {
                const sortedResults = [...test.results].sort((a, b) => b.percent - a.percent);
                const top3 = sortedResults.slice(0, 3);
                const isExpanded = expandedId === test.id;
                const isSelected = compareIds.includes(test.id);

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "bg-card border rounded-xl overflow-hidden transition-colors",
                      compareMode && isSelected ? "border-accent" : "border-border"
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {compareMode && (
                            <button onClick={() => toggleCompare(test.id)}
                              className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"
                              )}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-accent-foreground" />}
                            </button>
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{formatDate(test.created_at, language)}</p>
                            <p className="text-xs text-muted-foreground">
                              Top: {getCategoryInfo(top3[0]?.category)?.icon} {getCategoryInfo(top3[0]?.category)?.label} ({top3[0]?.percent}%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : test.id)}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(test.id)}
                            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {!isExpanded && (
                        <div className="flex gap-1 items-end h-6">
                          {sortedResults.map(r => (
                            <div key={r.category} className="flex-1">
                              <div className="w-full bg-muted rounded-sm overflow-hidden" style={{ height: '24px' }}>
                                <div
                                  className="w-full bg-accent/60 rounded-sm"
                                  style={{ height: `${r.percent}%`, marginTop: `${100 - r.percent}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 mt-2"
                        >
                          {sortedResults.map(r => {
                            const cat = getCategoryInfo(r.category);
                            const relevance = getRelevanceLabel(r.percent, t);
                            return (
                              <div key={r.category} className="flex items-center gap-2">
                                <span className="text-base w-6 text-center">{cat?.icon}</span>
                                <span className="text-xs text-foreground w-20 truncate">{cat?.label}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${r.percent}%` }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full bg-accent rounded-full"
                                  />
                                </div>
                                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", relevance.color)}>
                                  {r.percent}%
                                </span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeSubTab === 'barometer' && (
        <>
          {barometerResults.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <Thermometer className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'de' ? 'Noch keine Barometer-Ergebnisse' : 'No barometer results yet'}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {language === 'de' ? 'Nutze das Self-Barometer und speichere dein Ergebnis.' : 'Use the Self-Barometer and save your result.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {barometerResults.map((result, index) => {
                const zoneInfo = ZONE_INFO[result.zone] || ZONE_INFO[1];
                const isExpanded = expandedId === result.id;
                const qualitiesObj = result.qualities as Record<string, number>;

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{zoneInfo.emoji}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{formatDate(result.created_at, language)}</p>
                            <p className={cn("text-xs font-medium", zoneInfo.color)}>
                              Zone {result.zone} – {language === 'en' ? zoneInfo.label.en : zoneInfo.label.de}
                            </p>
                            {result.context && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">📌 {result.context}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-foreground mr-1">{Number(result.combined_avg).toFixed(1)}</span>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : result.id)}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteBarometerId(result.id)}
                            className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mini barometer bar */}
                      <div className="relative h-3 rounded-full overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex">
                          <div className="flex-1 bg-red-400/60" />
                          <div className="flex-1 bg-orange-400/60" />
                          <div className="flex-1 bg-yellow-400/60" />
                          <div className="flex-1 bg-green-400/60" />
                          <div className="flex-1 bg-blue-400/60" />
                        </div>
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow-lg"
                          style={{ left: `${Math.min(95, Math.max(5, Number(result.combined_avg) * 10))}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 space-y-2"
                        >
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <span className="text-muted-foreground">8 Cs Ø</span>
                              <p className="font-bold text-foreground">{Number(result.qualities_avg).toFixed(1)}</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <span className="text-muted-foreground">{language === 'en' ? 'Spaciousness' : 'Weite'}</span>
                              <p className="font-bold text-foreground">{result.weite_score}/3</p>
                            </div>
                          </div>
                          {qualitiesObj && typeof qualitiesObj === 'object' && (
                            <div className="space-y-1">
                              {Object.entries(qualitiesObj).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-xs text-foreground w-24 truncate capitalize">{key}</span>
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-accent rounded-full" style={{ width: `${(Number(val) / 10) * 100}%` }} />
                                  </div>
                                  <span className="text-[10px] font-medium text-muted-foreground w-5 text-right">{val}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'de' ? 'Testergebnis löschen?' : 'Delete test result?'}</AlertDialogTitle>
            <AlertDialogDescription>{language === 'de' ? 'Diese Aktion kann nicht rückgängig gemacht werden.' : 'This action cannot be undone.'}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteBarometerId} onOpenChange={() => setDeleteBarometerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'de' ? 'Barometer-Ergebnis löschen?' : 'Delete barometer result?'}</AlertDialogTitle>
            <AlertDialogDescription>{language === 'de' ? 'Diese Aktion kann nicht rückgängig gemacht werden.' : 'This action cannot be undone.'}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBarometer}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
