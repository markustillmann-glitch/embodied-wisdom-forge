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
  <div className="relative bg-[#FCFAF8] rounded-lg shadow-lg overflow-hidden border border-border/20" style={{ aspectRatio: '1/1' }}>
    <div className="absolute inset-0 p-4 overflow-hidden">
      {children}
    </div>
    <div className="absolute bottom-2 right-3 text-[8px] text-muted-foreground/50">{pageNumber}</div>
  </div>
);

export const PdfPreview = ({ summary, coverImage }: PdfPreviewProps) => {
  const dateText = format(new Date(summary.created_at), 'dd. MMM yyyy', { locale: de });

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Page 1: Title */}
      <PageWrapper pageNumber={1}>
        <div className="h-full flex flex-col items-center justify-center text-center px-2">
          {/* Circle art decoration at top */}
          <CircleArt size="w-10 h-10" className="mb-3" />
          
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-[85%] h-[40%] object-cover rounded-md mb-3 border border-border/20"
              />
              <p className="text-sm font-semibold text-primary leading-tight line-clamp-2 mb-1 font-serif">
                {summary.title}
              </p>
              {/* Decorative line */}
              <div className="flex items-center gap-2 my-2">
                <div className="w-6 h-[1px] bg-border" />
                <div className="w-2 h-2 rounded-full bg-accent/50" />
                <div className="w-6 h-[1px] bg-border" />
              </div>
              <p className="text-xs text-muted-foreground italic">Eine persoenliche Reflexion</p>
              <p className="text-xs text-muted-foreground mt-auto mb-1">{dateText}</p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-primary leading-tight line-clamp-3 mb-2 font-serif">
                {summary.title}
              </p>
              {/* Decorative line */}
              <div className="flex items-center gap-2 my-2">
                <div className="w-8 h-[1px] bg-border" />
                <div className="w-2 h-2 rounded-full bg-accent/50" />
                <div className="w-8 h-[1px] bg-border" />
              </div>
              <p className="text-xs text-muted-foreground italic">Eine persoenliche Reflexion</p>
              <p className="text-xs text-muted-foreground mt-auto mb-1">{dateText}</p>
              <CircleArt size="w-6 h-6" className="opacity-50" />
            </>
          )}
        </div>
      </PageWrapper>

      {/* Page 2: Summary & Patterns */}
      <PageWrapper pageNumber={2}>
        <div className="h-full overflow-hidden space-y-3">
          {/* Small decorative circle in corner */}
          <div className="absolute top-3 right-3">
            <CircleArt size="w-5 h-5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.summary_text && (
            <div>
              <p className="text-sm font-semibold text-primary font-serif mb-1">Zusammenfassung</p>
              <div className="w-10 h-[1px] bg-border mb-2" />
              <p className="text-xs text-foreground leading-relaxed line-clamp-6">
                {summary.structured_summary.summary_text}
              </p>
            </div>
          )}
          
          {summary.structured_summary?.patterns?.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-3 h-3 text-primary" />
                <p className="text-xs font-semibold text-primary font-serif">Muster</p>
              </div>
              <div className="space-y-1">
                {summary.structured_summary.patterns.slice(0, 3).map((pattern, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                    <p className="text-[10px] text-foreground line-clamp-2">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.needs?.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Heart className="w-3 h-3 text-pink-500" />
                <p className="text-xs font-semibold text-primary font-serif">Beduerfnisse</p>
              </div>
              <p className="text-[10px] text-secondary-foreground italic line-clamp-2">
                {summary.structured_summary.needs.slice(0, 4).join(' | ')}
              </p>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Page 3: Parts & Body */}
      <PageWrapper pageNumber={3}>
        <div className="h-full overflow-hidden space-y-3">
          {/* Small decorative circle in bottom left */}
          <div className="absolute bottom-3 left-3">
            <CircleArt size="w-5 h-5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.parts?.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Brain className="w-3 h-3 text-violet-500" />
                <p className="text-xs font-semibold text-primary font-serif">Innere Anteile</p>
              </div>
              <div className="space-y-2">
                {summary.structured_summary.parts.slice(0, 3).map((part, i) => (
                  <div key={i}>
                    <p className="text-[11px] font-medium text-accent">{part.name}</p>
                    <p className="text-[9px] text-foreground line-clamp-2 pl-2">{part.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.body_areas?.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-3 h-3 text-emerald-500" />
                <p className="text-xs font-semibold text-primary font-serif">Koerperbereiche</p>
              </div>
              <div className="space-y-1.5">
                {summary.structured_summary.body_areas.slice(0, 2).map((area, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] font-medium text-accent">{area.area}: </span>
                      <span className="text-[9px] text-foreground">{area.significance}</span>
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
        <div className="h-full overflow-hidden space-y-3">
          {/* Small decorative circle in top right */}
          <div className="absolute top-3 right-3">
            <CircleArt size="w-5 h-5" className="opacity-40" />
          </div>
          
          {summary.structured_summary?.insights?.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <p className="text-xs font-semibold text-primary font-serif">Erkenntnisse</p>
              </div>
              <div className="space-y-1.5">
                {summary.structured_summary.insights.slice(0, 3).map((insight, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[10px] text-foreground line-clamp-2">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.recommendations && (
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 text-primary" />
                <p className="text-xs font-semibold text-primary font-serif">Empfehlungen</p>
              </div>
              <div className="border border-border/50 rounded-md p-2 space-y-1.5">
                {summary.structured_summary.recommendations.body_exercise && (
                  <div className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <p className="text-[9px] text-foreground line-clamp-2">
                      {summary.structured_summary.recommendations.body_exercise}
                    </p>
                  </div>
                )}
                {summary.structured_summary.recommendations.micro_action && (
                  <div className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                    <p className="text-[9px] text-foreground line-clamp-2">
                      {summary.structured_summary.recommendations.micro_action}
                    </p>
                  </div>
                )}
                {summary.structured_summary.recommendations.reflection_question && (
                  <div className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <p className="text-[9px] text-foreground italic line-clamp-2">
                      {summary.structured_summary.recommendations.reflection_question}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-1">
              <div className="w-4 h-[0.5px] bg-border" />
              <div className="w-1 h-1 rounded-full bg-accent/30" />
              <div className="w-4 h-[0.5px] bg-border" />
            </div>
          </div>
          <p className="absolute bottom-1 left-0 right-0 text-[8px] text-muted-foreground/60 text-center">
            Erstellt mit Oria Selfcare
          </p>
        </div>
      </PageWrapper>
    </div>
  );
};
