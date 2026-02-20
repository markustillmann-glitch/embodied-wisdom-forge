import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown, Minus, BarChart3, ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCategories } from '@/data/triggerCards';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

const getCategoryInfo = (id: string) => triggerCategories.find(c => c.id === id);

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getRelevanceLabel = (percent: number) => {
  if (percent >= 75) return { label: 'Sehr hoch', color: 'bg-destructive/20 text-destructive' };
  if (percent >= 50) return { label: 'Hoch', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400' };
  if (percent >= 25) return { label: 'Mittel', color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
  return { label: 'Gering', color: 'bg-muted text-muted-foreground' };
};

export const TriggerTestHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const loadTests = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('trigger_test_results' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setSavedTests((data as any[]).map((d: any) => ({
          id: d.id,
          created_at: d.created_at,
          results: d.results as ResultEntry[],
        })));
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
    toast.success('Testergebnis gelöscht');
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
          <h3 className="text-lg font-semibold text-foreground">Vergleich</h3>
          <Button variant="outline" size="sm" onClick={() => { setCompareMode(false); setCompareIds([]); }}>
            Zurück
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {testsToCompare.map((t, i) => (
            <span key={t.id} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full",
              i === 0 ? "bg-accent/20 text-accent" : i === 1 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
            )}>
              {formatDate(t.created_at)}
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
                  {testsToCompare.map((t, i) => {
                    const r = t.results.find(r => r.category === catId);
                    const pct = r?.percent ?? 0;
                    return (
                      <div key={t.id} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-10 shrink-0">
                          {formatDate(t.created_at).split(',')[0]}
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
      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <Button onClick={() => navigate('/trigger-test')} className="gap-2">
          <ClipboardList className="w-4 h-4" />
          Neuen Test starten
        </Button>
        {savedTests.length >= 2 && (
          <Button variant="outline" onClick={() => setCompareMode(true)} className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Vergleichen
          </Button>
        )}
      </div>

      {savedTests.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Noch keine Testergebnisse gespeichert.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Mache den Trigger-Selbsttest und speichere dein Ergebnis.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {compareMode && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Wähle 2–3 Tests zum Vergleichen</p>
              {compareIds.length >= 2 && (
                <Button onClick={() => {}} className="mb-3" size="sm"
                  // This button is handled by the compare mode check above
                >
                  {compareIds.length} Tests vergleichen
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
                        <p className="text-sm font-medium text-foreground">{formatDate(test.created_at)}</p>
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

                  {/* Mini preview bars */}
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

                  {/* Expanded detail view */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 mt-2"
                    >
                      {sortedResults.map(r => {
                        const cat = getCategoryInfo(r.category);
                        const relevance = getRelevanceLabel(r.percent);
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Testergebnis löschen?</AlertDialogTitle>
            <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
