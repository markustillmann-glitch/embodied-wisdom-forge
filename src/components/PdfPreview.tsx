import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Heart, Target, Brain, Activity, Sparkles, Star } from 'lucide-react';

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

interface PdfPreviewProps {
  summary: SummaryMemory;
  coverImage: string | null;
}

// Soft circle art SVG component (like the reference image)
const CircleArt = ({ className = "", size = "w-8 h-8" }: { className?: string; size?: string }) => (
  <svg viewBox="0 0 50 50" className={`${size} ${className}`}>
    <circle cx="23" cy="23" r="18" fill="none" stroke="hsl(150 30% 65%)" strokeWidth="0.8" opacity="0.7" />
    <circle cx="27" cy="25" r="16" fill="none" stroke="hsl(0 30% 75%)" strokeWidth="0.8" opacity="0.7" />
    <circle cx="25" cy="27" r="17" fill="none" stroke="hsl(190 30% 60%)" strokeWidth="0.8" opacity="0.7" />
    <circle cx="24" cy="26" r="15" fill="none" stroke="hsl(28 70% 55%)" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

const PageWrapper = ({ children, pageNumber }: { children: React.ReactNode; pageNumber: number }) => (
  <div className="relative bg-[#FCFAF8] rounded-sm shadow-md overflow-hidden border border-border/30" style={{ aspectRatio: '210/297' }}>
    <div className="absolute inset-0 p-2 overflow-hidden">
      {children}
    </div>
    <div className="absolute bottom-1 right-1.5 text-[5px] text-muted-foreground/60">{pageNumber}</div>
  </div>
);

export const PdfPreview = ({ summary, coverImage }: PdfPreviewProps) => {
  const dateText = format(new Date(summary.created_at), 'dd. MMM yyyy', { locale: de });

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Page 1: Title */}
      <PageWrapper pageNumber={1}>
        <div className="h-full flex flex-col items-center justify-center text-center px-1">
          {/* Circle art decoration at top */}
          <CircleArt size="w-6 h-6" className="mb-1" />
          
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-[80%] h-[35%] object-cover rounded-[2px] mb-1.5 border border-border/20"
              />
              <p className="text-[5px] font-semibold text-primary leading-tight line-clamp-2 mb-0.5 font-serif">
                {summary.title}
              </p>
              {/* Decorative line */}
              <div className="flex items-center gap-1 my-0.5">
                <div className="w-3 h-[0.5px] bg-border" />
                <div className="w-1 h-1 rounded-full bg-accent/50" />
                <div className="w-3 h-[0.5px] bg-border" />
              </div>
              <p className="text-[3.5px] text-muted-foreground italic">Eine persoenliche Reflexion</p>
              <p className="text-[3.5px] text-muted-foreground mt-auto mb-0.5">{dateText}</p>
            </>
          ) : (
            <>
              <p className="text-[6px] font-semibold text-primary leading-tight line-clamp-3 mb-1 font-serif">
                {summary.title}
              </p>
              {/* Decorative line */}
              <div className="flex items-center gap-1 my-0.5">
                <div className="w-4 h-[0.5px] bg-border" />
                <div className="w-1 h-1 rounded-full bg-accent/50" />
                <div className="w-4 h-[0.5px] bg-border" />
              </div>
              <p className="text-[3.5px] text-muted-foreground italic">Eine persoenliche Reflexion</p>
              <p className="text-[3.5px] text-muted-foreground mt-auto mb-0.5">{dateText}</p>
              <CircleArt size="w-3 h-3" className="opacity-50" />
            </>
          )}
        </div>
      </PageWrapper>

      {/* Page 2: Summary & Patterns */}
      <PageWrapper pageNumber={2}>
        <div className="h-full overflow-hidden space-y-1">
          {/* Small decorative circle in corner */}
          <div className="absolute top-1 right-1">
            <CircleArt size="w-2.5 h-2.5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.summary_text && (
            <div>
              <p className="text-[4.5px] font-semibold text-primary font-serif mb-0.5">Zusammenfassung</p>
              <div className="w-5 h-[0.5px] bg-border mb-0.5" />
              <p className="text-[3.5px] text-foreground leading-relaxed line-clamp-5">
                {summary.structured_summary.summary_text}
              </p>
            </div>
          )}
          
          {summary.structured_summary?.patterns?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Target className="w-[5px] h-[5px] text-primary" />
                <p className="text-[4px] font-semibold text-primary font-serif">Muster</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.patterns.slice(0, 3).map((pattern, i) => (
                  <div key={i} className="flex items-start gap-0.5">
                    <div className="w-[3px] h-[3px] rounded-full bg-accent mt-[2px] shrink-0" />
                    <p className="text-[3px] text-foreground line-clamp-1">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.needs?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Heart className="w-[5px] h-[5px] text-pink-500" />
                <p className="text-[4px] font-semibold text-primary font-serif">Beduerfnisse</p>
              </div>
              <p className="text-[3px] text-secondary-foreground italic line-clamp-2">
                {summary.structured_summary.needs.slice(0, 4).join(' | ')}
              </p>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Page 3: Parts & Body */}
      <PageWrapper pageNumber={3}>
        <div className="h-full overflow-hidden space-y-1">
          {/* Small decorative circle in bottom left */}
          <div className="absolute bottom-1 left-1">
            <CircleArt size="w-2.5 h-2.5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.parts?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Brain className="w-[5px] h-[5px] text-violet-500" />
                <p className="text-[4px] font-semibold text-primary font-serif">Innere Anteile</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.parts.slice(0, 3).map((part, i) => (
                  <div key={i}>
                    <p className="text-[3.5px] font-medium text-accent">{part.name}</p>
                    <p className="text-[2.5px] text-foreground line-clamp-1 pl-1">{part.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.body_areas?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Activity className="w-[5px] h-[5px] text-emerald-500" />
                <p className="text-[4px] font-semibold text-primary font-serif">Koerperbereiche</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.body_areas.slice(0, 2).map((area, i) => (
                  <div key={i} className="flex items-start gap-0.5">
                    <div className="w-[3px] h-[3px] rounded-full bg-emerald-400 mt-[2px] shrink-0" />
                    <div>
                      <span className="text-[3px] font-medium text-accent">{area.area}: </span>
                      <span className="text-[2.5px] text-foreground">{area.significance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Page 4: Insights & Recommendations */}
      <PageWrapper pageNumber={4}>
        <div className="h-full overflow-hidden space-y-1">
          {/* Small decorative circle in top right */}
          <div className="absolute top-1 right-1">
            <CircleArt size="w-2.5 h-2.5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.insights?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Sparkles className="w-[5px] h-[5px] text-amber-500" />
                <p className="text-[4px] font-semibold text-primary font-serif">Erkenntnisse</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.insights.slice(0, 3).map((insight, i) => (
                  <div key={i} className="flex items-start gap-0.5">
                    <div className="w-[4px] h-[4px] rounded-full bg-accent flex items-center justify-center text-[2px] text-white font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[3px] text-foreground line-clamp-2">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.recommendations && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Star className="w-[5px] h-[5px] text-primary" />
                <p className="text-[4px] font-semibold text-primary font-serif">Empfehlungen</p>
              </div>
              <div className="border border-border/50 rounded-[2px] p-1 space-y-0.5">
                {summary.structured_summary.recommendations.body_exercise && (
                  <div className="flex items-start gap-0.5">
                    <div className="w-[3px] h-[3px] rounded-full bg-emerald-400 mt-[2px] shrink-0" />
                    <p className="text-[2.5px] text-foreground line-clamp-1">
                      {summary.structured_summary.recommendations.body_exercise}
                    </p>
                  </div>
                )}
                {summary.structured_summary.recommendations.micro_action && (
                  <div className="flex items-start gap-0.5">
                    <div className="w-[3px] h-[3px] rounded-full bg-accent mt-[2px] shrink-0" />
                    <p className="text-[2.5px] text-foreground line-clamp-1">
                      {summary.structured_summary.recommendations.micro_action}
                    </p>
                  </div>
                )}
                {summary.structured_summary.recommendations.reflection_question && (
                  <div className="flex items-start gap-0.5">
                    <div className="w-[3px] h-[3px] rounded-full bg-rose-400 mt-[2px] shrink-0" />
                    <p className="text-[2.5px] text-foreground italic line-clamp-1">
                      {summary.structured_summary.recommendations.reflection_question}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-[0.3px] bg-border" />
              <div className="w-[2px] h-[2px] rounded-full bg-accent/30" />
              <div className="w-2 h-[0.3px] bg-border" />
            </div>
          </div>
          <p className="absolute bottom-[3px] left-0 right-0 text-[2.5px] text-muted-foreground/60 text-center">
            Erstellt mit Oria Selfcare
          </p>
        </div>
      </PageWrapper>
    </div>
  );
};
