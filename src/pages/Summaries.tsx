import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, MapPin, Clock, Heart, Brain, Sparkles, Target, Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PolygonalBackground } from '@/components/PolygonalBackground';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import bbOwlLogo from '@/assets/bb-owl-new.png';

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
}

const partTypeLabels: Record<string, { label: string; color: string }> = {
  manager: { label: 'Manager', color: 'bg-blue-500/20 text-blue-700' },
  firefighter: { label: 'Feuerwehr', color: 'bg-orange-500/20 text-orange-700' },
  exile: { label: 'Exilant', color: 'bg-purple-500/20 text-purple-700' },
  self: { label: 'Selbst', color: 'bg-green-500/20 text-green-700' },
};

const Summaries = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<SummaryMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSummaries();
    }
  }, [user]);

  const loadSummaries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, summary, structured_summary, location, created_at, memory_date')
        .eq('user_id', user.id)
        .eq('memory_type', 'selfcare-reflection')
        .eq('summary_requested', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the structured_summary field
      const typedData = (data || []).map(item => ({
        ...item,
        structured_summary: item.structured_summary as unknown as StructuredSummary | null
      }));
      
      setSummaries(typedData);
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bitte melde dich an, um deine Zusammenfassungen zu sehen.</p>
          <Button onClick={() => navigate('/auth')}>Anmelden</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background ios-page ios-font">
      {/* iOS-style Hero Section */}
      <section className="pt-[calc(env(safe-area-inset-top,0px)+44px)] pb-6 sm:pt-24 sm:pb-10 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/selfcare')}
              className="ios-button-text flex items-center gap-0.5 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              <span className="ios-body">Zurück</span>
            </button>
          </motion.div>

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h1 className="ios-title-1 sm:ios-large-title text-foreground">
                Mein Tresor
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="ios-subhead text-muted-foreground max-w-xl mt-3"
            >
              Deine gespeicherten Reflexionen sicher aufbewahrt
            </motion.p>
          </div>
        </div>
      </section>

      {/* Summaries List */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : summaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Noch keine Zusammenfassungen vorhanden.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Starte eine Reflexion und wähle am Ende "Zusammenfassung erstellen".
            </p>
            <Button 
              className="mt-6"
              onClick={() => navigate('/selfcare')}
            >
              Reflexion starten
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Preview Header */}
                <button
                  onClick={() => toggleExpand(summary.id)}
                  className="w-full p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate pr-2">
                        {summary.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(summary.created_at), 'HH:mm', { locale: de })} Uhr
                        </span>
                        {summary.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {summary.location}
                          </span>
                        )}
                      </div>

                      {/* Preview Text */}
                      {summary.structured_summary?.summary_text && !expandedId && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {summary.structured_summary.summary_text}
                        </p>
                      )}
                    </div>
                    
                    <div className="shrink-0">
                      {expandedId === summary.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === summary.id && summary.structured_summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-border pt-5">
                        {/* Summary Text */}
                        <div>
                          <p className="text-foreground leading-relaxed">
                            {summary.structured_summary.summary_text}
                          </p>
                        </div>

                        {/* Patterns */}
                        {summary.structured_summary.patterns?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Target className="w-4 h-4 text-primary" />
                              Erkannte Muster
                            </h4>
                            <ul className="space-y-1">
                              {summary.structured_summary.patterns.map((pattern, i) => (
                                <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-primary">
                                  {pattern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Needs */}
                        {summary.structured_summary.needs?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              Berührte Bedürfnisse
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {summary.structured_summary.needs.map((need, i) => (
                                <span 
                                  key={i} 
                                  className="px-2.5 py-1 bg-pink-500/10 text-pink-700 text-xs rounded-full"
                                >
                                  {need}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Parts */}
                        {summary.structured_summary.parts?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Brain className="w-4 h-4 text-violet-500" />
                              Beteiligte innere Teile
                            </h4>
                            <div className="space-y-2">
                              {summary.structured_summary.parts.map((part, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${partTypeLabels[part.type]?.color || 'bg-gray-500/20 text-gray-700'}`}>
                                    {partTypeLabels[part.type]?.label || part.type}
                                  </span>
                                  <div className="text-sm">
                                    <span className="font-medium text-foreground">{part.name}:</span>{' '}
                                    <span className="text-muted-foreground">{part.description}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Body Areas */}
                        {summary.structured_summary.body_areas?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Activity className="w-4 h-4 text-emerald-500" />
                              Körperbereiche
                            </h4>
                            <div className="space-y-2">
                              {summary.structured_summary.body_areas.map((area, i) => (
                                <div key={i} className="text-sm">
                                  <span className="font-medium text-foreground">{area.area}:</span>{' '}
                                  <span className="text-muted-foreground">{area.significance}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Insights */}
                        {summary.structured_summary.insights?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              Zentrale Erkenntnisse
                            </h4>
                            <ul className="space-y-1">
                              {summary.structured_summary.insights.map((insight, i) => (
                                <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['💡'] before:absolute before:left-0">
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recommendations */}
                        {summary.structured_summary.recommendations && (
                          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                            <h4 className="text-sm font-medium text-foreground">Empfehlungen für dich</h4>
                            
                            {summary.structured_summary.recommendations.body_exercise && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">🧘 Körperübung:</span>{' '}
                                <span className="text-muted-foreground">{summary.structured_summary.recommendations.body_exercise}</span>
                              </div>
                            )}
                            
                            {summary.structured_summary.recommendations.micro_action && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">✨ Mikro-Aktion:</span>{' '}
                                <span className="text-muted-foreground">{summary.structured_summary.recommendations.micro_action}</span>
                              </div>
                            )}
                            
                            {summary.structured_summary.recommendations.reflection_question && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">💭 Zum Nachdenken:</span>{' '}
                                <span className="text-muted-foreground italic">"{summary.structured_summary.recommendations.reflection_question}"</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Summaries;
