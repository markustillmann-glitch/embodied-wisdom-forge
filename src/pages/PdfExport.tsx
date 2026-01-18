import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { PdfPreview } from '@/components/PdfPreview';

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
      toast.error('Bitte wähle ein JPG, PNG oder WebP Bild aus');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Das Bild darf maximal 5MB groß sein');
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
        toast.error('Ungültiges Bildformat');
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
          <Button onClick={() => navigate('/summaries')}>Zurück zum Tresor</Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
              <span className="ios-body">Zurück zum Tresor</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <h1 className="ios-title-1 text-foreground">PDF Export</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Erstelle ein quadratisches PDF mit deiner Reflexion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom,20px),20px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-lg"
        >
          {/* Title display */}
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-foreground">{summary.title}</p>
          </div>

          {/* Cover image upload */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Titelbild (optional)
            </label>
            
            {coverImage ? (
              <div className="relative max-w-sm mx-auto">
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
                className="w-full max-w-sm mx-auto h-32 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-4 hover:border-primary/50 hover:bg-muted/30 transition-colors block"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-left">
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

          {/* PDF Preview - Full Width */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-4 block text-center">
              Vorschau der 4 Seiten
            </label>
            <div className="max-w-2xl mx-auto">
              <PdfPreview summary={summary} coverImage={coverImage} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/summaries')}
              className="sm:w-auto"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
              className="sm:w-auto"
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
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PdfExport;
