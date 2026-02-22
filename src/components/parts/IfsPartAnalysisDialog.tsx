import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import type { IfsPart } from './IfsPartCard';

interface IfsPartAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: IfsPart | null;
  onAnalysisSaved: (partId: string, analysis: string) => void;
}

export const IfsPartAnalysisDialog: React.FC<IfsPartAnalysisDialogProps> = ({
  open,
  onOpenChange,
  part,
  onAnalysisSaved,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!part) return;
    setLoading(true);
    setAnalysis('');
    setHasAnalyzed(false);

    try {
      const response = await supabase.functions.invoke('analyze-part', {
        body: { part, language },
      });

      if (response.error) throw new Error(response.error.message || 'Analyse fehlgeschlagen');

      const result = response.data?.analysis || '';
      setAnalysis(result);
      setHasAnalyzed(true);
    } catch (error: any) {
      console.error('Error analyzing part:', error);
      toast.error(language === 'en' ? 'Analysis failed' : 'Analyse fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !part || !analysis) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('ifs_parts')
        .update({ ai_analysis: { text: analysis, created_at: new Date().toISOString() } } as any)
        .eq('id', part.id)
        .eq('user_id', user.id);

      if (error) throw error;

      onAnalysisSaved(part.id, analysis);
      toast.success(language === 'en' ? 'Analysis saved! ✨' : 'Analyse gespeichert! ✨');
    } catch (error: any) {
      console.error('Error saving analysis:', error);
      toast.error(language === 'en' ? 'Error saving' : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  // Load existing analysis when dialog opens
  React.useEffect(() => {
    if (open && part) {
      const existing = (part as any).ai_analysis;
      if (existing?.text) {
        setAnalysis(existing.text);
        setHasAnalyzed(true);
      } else {
        setAnalysis('');
        setHasAnalyzed(false);
      }
    }
  }, [open, part]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {language === 'en' ? 'Oria Analysis' : 'Oria-Analyse'}
            {part && `: ${part.name}`}
          </DialogTitle>
          <DialogDescription>
            {language === 'en'
              ? 'AI-powered IFS analysis with classification, strategies, and questions for working with this part.'
              : 'KI-gestützte IFS-Analyse mit Einordnung, Strategien und Fragen zur Arbeit mit diesem Anteil.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 max-h-[60vh]">
          <div className="pb-4">
            {!hasAnalyzed && !loading && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {language === 'en'
                    ? 'Let Oria analyze this part and provide insights based on IFS methodology.'
                    : 'Lass Oria diesen Anteil analysieren und Erkenntnisse basierend auf der IFS-Methodik geben.'}
                </p>
                <Button onClick={handleAnalyze} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  {language === 'en' ? 'Start Analysis' : 'Analyse starten'}
                </Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'Oria is analyzing...' : 'Oria analysiert...'}
                </p>
              </div>
            )}

            {hasAnalyzed && analysis && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-2 gap-2">
          {hasAnalyzed && (
            <>
              <Button variant="outline" onClick={handleAnalyze} disabled={loading} className="gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'en' ? 'Re-analyze' : 'Neu analysieren'}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {language === 'en' ? 'Save Analysis' : 'Analyse speichern'}
              </Button>
            </>
          )}
          {!hasAnalyzed && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'en' ? 'Cancel' : 'Abbrechen'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
