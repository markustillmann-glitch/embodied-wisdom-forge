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

const PageWrapper = ({ children, pageNumber }: { children: React.ReactNode; pageNumber: number }) => (
  <div className="relative bg-[#FAF7F3] rounded-sm shadow-md overflow-hidden" style={{ aspectRatio: '210/297' }}>
    <div className="absolute inset-0 p-2 overflow-hidden">
      {children}
    </div>
    <div className="absolute bottom-1 right-1.5 text-[6px] text-[#8C7869]">{pageNumber}</div>
  </div>
);

export const PdfPreview = ({ summary, coverImage }: PdfPreviewProps) => {
  const dateText = format(new Date(summary.created_at), 'dd. MMM yyyy', { locale: de });

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Page 1: Title */}
      <PageWrapper pageNumber={1}>
        <div className="h-full flex flex-col items-center justify-center text-center px-1">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover"
                className="w-[85%] h-[45%] object-cover rounded-[2px] mb-1"
              />
              <p className="text-[6px] font-semibold text-[#594436] leading-tight line-clamp-2 mb-0.5">
                {summary.title}
              </p>
              <p className="text-[4px] text-[#8C7869] italic">Eine persönliche Reflexion</p>
              <p className="text-[4px] text-[#8C7869] mt-auto mb-1">{dateText}</p>
            </>
          ) : (
            <>
              <div className="w-1 h-1 rounded-full bg-[#CD853F] mb-2" />
              <p className="text-[7px] font-semibold text-[#594436] leading-tight line-clamp-3 mb-1">
                {summary.title}
              </p>
              <p className="text-[4px] text-[#8C7869] italic">Eine persönliche Reflexion</p>
              <p className="text-[4px] text-[#8C7869] mt-auto mb-1">{dateText}</p>
              <div className="w-1 h-1 rounded-full bg-[#CD853F]" />
            </>
          )}
        </div>
      </PageWrapper>

      {/* Page 2: Summary & Patterns */}
      <PageWrapper pageNumber={2}>
        <div className="h-full overflow-hidden space-y-1.5">
          {summary.structured_summary?.summary_text && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <div className="w-[3px] h-[3px] rounded-full bg-[#594436]" />
                <p className="text-[5px] font-semibold text-[#594436]">Zusammenfassung</p>
              </div>
              <div className="w-4 h-[0.5px] bg-[#DCD2C8] mb-0.5" />
              <p className="text-[4px] text-[#332921] leading-relaxed line-clamp-6">
                {summary.structured_summary.summary_text}
              </p>
            </div>
          )}
          
          {summary.structured_summary?.patterns?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Target className="w-[6px] h-[6px] text-[#594436]" />
                <p className="text-[5px] font-semibold text-[#594436]">Muster</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.patterns.slice(0, 3).map((pattern, i) => (
                  <p key={i} className="text-[3.5px] text-[#332921] line-clamp-1">• {pattern}</p>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.needs?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Heart className="w-[6px] h-[6px] text-pink-500" />
                <p className="text-[5px] font-semibold text-[#594436]">Bedürfnisse</p>
              </div>
              <p className="text-[3.5px] text-[#806452] italic line-clamp-2">
                {summary.structured_summary.needs.slice(0, 4).join(' • ')}
              </p>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Page 3: Parts & Body */}
      <PageWrapper pageNumber={3}>
        <div className="h-full overflow-hidden space-y-1.5">
          {summary.structured_summary?.parts?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Brain className="w-[6px] h-[6px] text-violet-500" />
                <p className="text-[5px] font-semibold text-[#594436]">Innere Anteile</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.parts.slice(0, 3).map((part, i) => (
                  <div key={i}>
                    <p className="text-[4px] font-medium text-[#CD853F]">{part.name}</p>
                    <p className="text-[3px] text-[#332921] line-clamp-1">{part.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.body_areas?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Activity className="w-[6px] h-[6px] text-emerald-500" />
                <p className="text-[5px] font-semibold text-[#594436]">Körperbereiche</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.body_areas.slice(0, 2).map((area, i) => (
                  <div key={i}>
                    <p className="text-[4px] font-medium text-[#CD853F]">{area.area}</p>
                    <p className="text-[3px] text-[#332921] line-clamp-1">{area.significance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Page 4: Insights & Recommendations */}
      <PageWrapper pageNumber={4}>
        <div className="h-full overflow-hidden space-y-1.5">
          {summary.structured_summary?.insights?.length > 0 && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Sparkles className="w-[6px] h-[6px] text-amber-500" />
                <p className="text-[5px] font-semibold text-[#594436]">Erkenntnisse</p>
              </div>
              <div className="space-y-0.5">
                {summary.structured_summary.insights.slice(0, 3).map((insight, i) => (
                  <p key={i} className="text-[3.5px] text-[#332921] line-clamp-2">
                    {i + 1}. {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {summary.structured_summary?.recommendations && (
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <Star className="w-[6px] h-[6px] text-[#594436]" />
                <p className="text-[5px] font-semibold text-[#594436]">Empfehlungen</p>
              </div>
              <div className="bg-[#F5F0EB] rounded-[2px] p-1 space-y-0.5">
                {summary.structured_summary.recommendations.body_exercise && (
                  <p className="text-[3px] text-[#332921] line-clamp-1">
                    🧘 {summary.structured_summary.recommendations.body_exercise}
                  </p>
                )}
                {summary.structured_summary.recommendations.micro_action && (
                  <p className="text-[3px] text-[#332921] line-clamp-1">
                    ✨ {summary.structured_summary.recommendations.micro_action}
                  </p>
                )}
                {summary.structured_summary.recommendations.reflection_question && (
                  <p className="text-[3px] text-[#332921] italic line-clamp-1">
                    💭 {summary.structured_summary.recommendations.reflection_question}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-[3px] text-[#8C7869] text-center mt-auto pt-1">
            Erstellt mit Oria Selfcare
          </p>
        </div>
      </PageWrapper>
    </div>
  );
};
