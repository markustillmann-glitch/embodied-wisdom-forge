import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Heart, MessageCircle, Loader2, RefreshCw, Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Pattern {
  category: 'gfk' | 'ifs' | 'selfcare';
  theme: string;
  observation: string;
  possible_roots: string;
  exploration_prompts: string[];
}

interface AnalysisData {
  patterns: Pattern[];
  overall_insight: string;
  recommended_focus: string;
  stats: {
    total_reflections: number;
    by_category: {
      selfcare: number;
      gfk: number;
      ifs: number;
    };
    avg_difficulty: string | null;
  };
}

const categoryInfo = {
  selfcare: {
    label: 'Selbstfürsorge',
    icon: Heart,
    color: 'text-pink-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-200/50',
  },
  gfk: {
    label: 'GfK (Gewaltfreie Kommunikation)',
    icon: MessageCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-200/50',
  },
  ifs: {
    label: 'IFS (Innere Anteile)',
    icon: Brain,
    color: 'text-violet-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-200/50',
  },
};

const ReflectionAnalysis = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchAnalysis = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-reflections');
      
      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError(err instanceof Error ? err.message : 'Analyse konnte nicht geladen werden');
      toast.error('Fehler beim Laden der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalysis();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/user-profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Profil</span>
          </Link>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h1 className="font-serif text-lg font-medium">Reflexions-Analyse</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchAnalysis}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>KI-gestützte Analyse</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3">
            Deine Reflexionsmuster
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Entdecke wiederkehrende Themen in deinen Reflexionen und erhalte 
            Anregungen zur tieferen Erforschung.
          </p>
        </motion.section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Analysiere deine Reflexionen...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center"
          >
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-medium mb-2">Fehler bei der Analyse</p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button onClick={fetchAnalysis} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && !isLoading && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{analysis.stats.total_reflections}</p>
                <p className="text-xs text-muted-foreground">Reflexionen</p>
              </div>
              <div className={cn("rounded-xl p-4 text-center", categoryInfo.selfcare.bg, categoryInfo.selfcare.border, "border")}>
                <p className={cn("text-2xl font-bold", categoryInfo.selfcare.color)}>{analysis.stats.by_category.selfcare}</p>
                <p className="text-xs text-muted-foreground">Selfcare</p>
              </div>
              <div className={cn("rounded-xl p-4 text-center", categoryInfo.gfk.bg, categoryInfo.gfk.border, "border")}>
                <p className={cn("text-2xl font-bold", categoryInfo.gfk.color)}>{analysis.stats.by_category.gfk}</p>
                <p className="text-xs text-muted-foreground">GfK</p>
              </div>
              <div className={cn("rounded-xl p-4 text-center", categoryInfo.ifs.bg, categoryInfo.ifs.border, "border")}>
                <p className={cn("text-2xl font-bold", categoryInfo.ifs.color)}>{analysis.stats.by_category.ifs}</p>
                <p className="text-xs text-muted-foreground">IFS</p>
              </div>
            </motion.div>

            {/* Overall Insight */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Übergreifende Erkenntnis</h3>
                  <p className="text-muted-foreground leading-relaxed">{analysis.overall_insight}</p>
                </div>
              </div>
            </motion.div>

            {/* Patterns */}
            {analysis.patterns.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-medium">Erkannte Muster</h3>
                {analysis.patterns.map((pattern, index) => {
                  const catInfo = categoryInfo[pattern.category] || categoryInfo.selfcare;
                  const Icon = catInfo.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={cn(
                        "bg-card border rounded-xl p-6 space-y-4",
                        catInfo.border
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", catInfo.bg)}>
                          <Icon className={cn("w-5 h-5", catInfo.color)} />
                        </div>
                        <div>
                          <span className={cn("text-xs uppercase tracking-wide font-medium", catInfo.color)}>
                            {catInfo.label}
                          </span>
                          <h4 className="font-semibold text-foreground">{pattern.theme}</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Beobachtung:</p>
                          <p className="text-sm text-muted-foreground">{pattern.observation}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Mögliche Hintergründe:</p>
                          <p className="text-sm text-muted-foreground">{pattern.possible_roots}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Fragen zur Erforschung:</p>
                          <ul className="space-y-2">
                            {pattern.exploration_prompts.map((prompt, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className={cn("mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0", catInfo.bg.replace('/10', ''))} />
                                {prompt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Recommended Focus */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-accent/50 border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Empfohlener Fokus
              </h3>
              <p className="text-muted-foreground leading-relaxed">{analysis.recommended_focus}</p>
            </motion.div>

            {/* CTA to Selfcare App */}
            {analysis.stats.total_reflections < 5 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground mb-4">
                  Für genauere Muster-Erkennung: Erkunde mehr Impulse!
                </p>
                <Link to="/selfcare-reflection">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Selfcare Impulse erkunden
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        )}

        {/* Empty State */}
        {analysis && analysis.stats.total_reflections === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Noch keine Reflexionen</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Beginne mit der Selfcare-App, um Impulse zu erkunden. 
              Deine Reflexionen werden hier analysiert.
            </p>
            <Link to="/selfcare-reflection">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Ersten Impuls entdecken
              </Button>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ReflectionAnalysis;
