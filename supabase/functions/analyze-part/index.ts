import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { part, language: rawLanguage } = await req.json();
    const language = rawLanguage === 'en' ? 'en' : 'de';

    if (!part || !part.name) {
      return new Response(JSON.stringify({ error: 'Part data required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const partDescription = [
      `Name: ${part.name}`,
      part.role ? `Rolle: ${part.role}` : null,
      part.age ? `Alter: ${part.age}` : null,
      part.body_location ? `Körperort: ${part.body_location}` : null,
      part.core_emotion ? `Kernemotion: ${part.core_emotion}` : null,
      part.trigger ? `Trigger: ${part.trigger}` : null,
      part.belief ? `Glaubenssatz: ${part.belief}` : null,
      part.need ? `Bedürfnis: ${part.need}` : null,
      part.protection_strategy ? `Schutzstrategie: ${part.protection_strategy}` : null,
      part.counterpart ? `Gegenspieler: ${part.counterpart}` : null,
      part.self_trust_level != null ? `Vertrauen in Self: ${part.self_trust_level}/10` : null,
      part.integration_status ? `Integrationsstand: ${part.integration_status}` : null,
    ].filter(Boolean).join('\n');

    const systemPrompt = language === 'en'
      ? `You are Oria, an expert in Internal Family Systems (IFS) therapy. Analyze the following IFS part and provide a structured assessment.

Your analysis must include these sections:
1. **Classification** - What type of part is this (Manager, Firefighter, Exile, or mixed)? Explain why based on the data.
2. **Inconsistencies** - Are there contradictions or unusual patterns in the described attributes? E.g. a Manager role with Exile-typical emotions.
3. **Deeper Questions** - 3-5 questions the user could explore in meditation or journaling to understand this part better.
4. **Work Strategies** - 3-5 concrete IFS-based strategies for working with this part (e.g. unburdening, reparenting, direct access).
5. **System Dynamics** - How might this part interact with other parts? What polarizations or alliances could exist?

Keep your analysis warm, empathetic, and encouraging. Use emojis sparingly (🌱💫✨). Be specific and reference the actual data provided.`
      : `Du bist Oria, eine Expertin für Internal Family Systems (IFS) Therapie. Analysiere den folgenden IFS-Anteil und erstelle eine strukturierte Einschätzung.

Deine Analyse muss diese Abschnitte enthalten:
1. **Einordnung** - Welcher Typ ist dieser Anteil (Manager, Feuerwehr, Exilant oder Mischform)? Erkläre anhand der Daten warum.
2. **Inkonsistenzen** - Gibt es Widersprüche oder ungewöhnliche Muster in den beschriebenen Attributen? Z.B. eine Manager-Rolle mit exiltypischen Emotionen.
3. **Vertiefende Fragen** - 3-5 Fragen, die der Nutzer in Meditation oder Journaling erkunden könnte, um diesen Anteil besser zu verstehen.
4. **Arbeitsstrategien** - 3-5 konkrete IFS-basierte Strategien für die Arbeit mit diesem Anteil (z.B. Entlastung, Nachnähren, direkter Zugang).
5. **Systemdynamik** - Wie könnte dieser Anteil mit anderen Anteilen interagieren? Welche Polarisierungen oder Allianzen könnten bestehen?

Halte deine Analyse warm, einfühlsam und ermutigend. Verwende Emojis sparsam (🌱💫✨). Sei konkret und beziehe dich auf die tatsächlichen Daten.`;

    const userPrompt = language === 'en'
      ? `Please analyze this IFS part:\n\n${partDescription}`
      : `Bitte analysiere diesen IFS-Anteil:\n\n${partDescription}`;

    console.log("Analyzing part:", part.name, "language:", language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: language === 'en' ? 'Rate limit reached. Please wait a moment.' : 'Rate limit erreicht. Bitte warte einen Moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: language === 'en' ? 'Payment required.' : 'Zahlungsanforderung.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ analysis: analysisText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in analyze-part:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
