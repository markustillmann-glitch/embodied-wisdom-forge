import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';

interface StructuredSummary {
  patterns: string[];
  needs: string[];
  parts: Array<{ name: string; type: string; description: string }>;
  body_areas: Array<{ area: string; significance: string }>;
  insights: string[];
  recommendations: {
    body_exercise: string;
    micro_action: string;
    reflection_question: string;
  };
  summary_text: string;
}

interface SummaryMemory {
  id: string;
  title: string;
  summary: string | null;
  structured_summary: StructuredSummary | null;
  location: string | null;
  created_at: string;
  memory_date: string | null;
  memory_type: string;
}

const PdfExport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const summaryId = searchParams.get('id');
  
  const { generatePdf } = usePdfGenerator();
  const [summary, setSummary] = useState<SummaryMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && summaryId) {
      loadSummary();
    }
  }, [user, summaryId]);

  const loadSummary = async () => {
    if (!user || !summaryId) return;
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, summary, structured_summary, location, created_at, memory_date, memory_type')
        .eq('id', summaryId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setSummary({
        ...data,
        structured_summary: data.structured_summary as unknown as StructuredSummary | null
      });
    } catch (error) {
      console.error('Error loading summary:', error);
      toast.error('Reflexion konnte nicht geladen werden');
      navigate('/summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      toast.error('Bitte waehle ein JPG, PNG oder WebP Bild aus');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Das Bild darf maximal 5MB gross sein');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      toast.error('Fehler beim Laden des Bildes');
    };
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && result.startsWith('data:image/')) {
        setCoverImage(result);
      } else {
        toast.error('Ungueltiges Bildformat');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePdf = async () => {
    if (!summary) return;
    
    setGeneratingPdf(true);
    try {
      await generatePdf(summary, coverImage);
      toast.success('PDF wurde erstellt');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Fehler beim Erstellen des PDFs');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bitte melde dich an.</p>
          <Button onClick={() => navigate('/auth')}>Anmelden</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Reflexion nicht gefunden</p>
          <Button onClick={() => navigate('/summaries')}>Zurueck zum Tresor</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ios-page ios-font relative overflow-hidden">
      {/* Warm Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Header */}
      <section className="pt-[calc(env(safe-area-inset-top,0px)+44px)] pb-4 sm:pt-20 sm:pb-6 relative z-10">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <button
              onClick={() => navigate('/summaries')}
              className="ios-button-text flex items-center gap-0.5 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              <span className="ios-body">Zurueck</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-foreground tracking-tight">PDF Export</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Erstelle ein quadratisches PDF deiner Reflexion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom,20px),20px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-lg"
        >
          {/* Title display */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reflexion</p>
            <p className="text-lg font-semibold text-foreground">{summary.title}</p>
          </div>

          {/* Cover image upload */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Titelbild (optional)
            </label>
            
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full aspect-square object-cover rounded-xl border border-border"
                />
                <button
                  onClick={() => setCoverImage(null)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-md transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <ImagePlus className="w-7 h-7 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Bild hochladen</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG oder WEBP, max. 5MB</p>
                </div>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* PDF Info */}
          <div className="mb-8 p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Das PDF enthaelt 4 quadratische Seiten im Editorial-Stil:
            </p>
            <ul className="mt-2 text-sm text-foreground space-y-1">
              <li>• Titelseite mit Bild</li>
              <li>• Zusammenfassung & Muster</li>
              <li>• Innere Anteile & Koerperbereiche</li>
              <li>• Erkenntnisse & Empfehlungen</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
              size="lg"
              className="w-full"
            >
              {generatingPdf ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Erstelle PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  PDF erstellen & herunterladen
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/summaries')}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PdfExport;
