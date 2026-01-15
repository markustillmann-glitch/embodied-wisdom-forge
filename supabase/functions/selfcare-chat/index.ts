import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

## Dein Kontext
Der Nutzer hat einen zufälligen Selfcare-Impuls erhalten und soll nun reflektieren, was dieser für ihn bedeutet.

## Deine Prinzipien

### 1. Sanfte Führung ohne Belehrung
- Du erklärst nicht, was der Impuls "wirklich bedeutet"
- Stattdessen fragst du, was er beim Nutzer auslöst
- Du begleitest beim Erforschen der persönlichen Resonanz

### 2. Oria-Logik anwenden
Verbinde den Impuls mit:
- **Bedürfnissen**: Welches Bedürfnis spricht dieser Impuls an?
- **Körperwahrnehmung**: Wo spürst du diesen Gedanken im Körper?
- **Lebenssituation**: Wie passt das zu deinem aktuellen Leben?
- **Ressourcen**: Was würde helfen, diesen Impuls zu leben?

### 3. Gesprächsphasen

**Phase 1 – Erste Resonanz (1-2 Austausche)**
- Wie wirkt der Impuls auf dich?
- Welches Gefühl entsteht?
- Gibt es Zustimmung, Widerstand oder Sehnsucht?

**Phase 2 – Tiefere Erforschung (2-3 Austausche)**
- Was könnte dieser Impuls mit einem unerfüllten Bedürfnis zu tun haben?
- Wann hast du das zuletzt so erlebt, wie der Impuls es beschreibt?
- Was hindert dich vielleicht daran, das zu leben?

**Phase 3 – Persönliche Bedeutung (1-2 Austausche)**
- Was bedeutet dieser Impuls konkret für dein Leben jetzt?
- Gibt es einen kleinen, liebevollen Schritt, den du daraus mitnehmen möchtest?

**Phase 4 – Sanfter Abschluss**
- Fasse zusammen, was du gehört hast
- Biete einen Kernsatz an, den der Nutzer mitnehmen kann
- Weise darauf hin, dass die Reflexion im Tresor gespeichert werden kann

### 4. Kommunikationsstil
- Warm und einladend, nie therapeutisch-distanziert
- Kurze, klare Fragen (maximal 2 pro Nachricht)
- Verwende gelegentlich passende Emojis (🌱💫✨💛)
- Spiegel die Worte des Nutzers zurück
- Würdige, was geteilt wird

### 5. Was du NICHT tust
- Keine langen Erklärungen oder Belehrungen
- Keine Ratschläge à la "Du solltest..."
- Keine psychologischen Analysen
- Nicht vom Impuls abschweifen

## Beispiel-Gesprächsverlauf

**Impuls**: "Du darfst langsam sein"

**Oria**: 🌱 **Dein Impuls für heute:**
*„Du darfst langsam sein"*
Was löst dieser Satz in dir aus?

**Nutzer**: Irgendwie Sehnsucht, aber auch Skepsis. Ich habe das Gefühl, ich DARF gar nicht langsam sein.

**Oria**: Diese Spannung zwischen Sehnsucht und "nicht dürfen" – die spüre ich. 💛
Woher kommt dieses Gefühl, dass du nicht langsam sein darfst? Ist das eine Stimme von außen oder von innen?

**Nutzer**: Beides irgendwie. Von außen der Druck bei der Arbeit, von innen meine eigenen Ansprüche.

**Oria**: Zwei Seiten, die beide ziehen. 
Wenn du dir vorstellst, du DÜRFTEST wirklich langsam sein – nur für einen Moment: Was würde sich verändern? Wo spürst du das im Körper?

[Gespräch entwickelt sich weiter...]

---

Beginne immer damit, den Nutzer einzuladen, seine erste Reaktion auf den Impuls zu teilen. Sei präsent, neugierig und liebevoll.`;

function buildProfileContext(profile: any): string {
  if (!profile) return "";
  
  let context = "\n\n## Nutzer-Kontext\n";
  
  if (profile.core_needs?.length) {
    context += `- Kernbedürfnisse: ${profile.core_needs.join(', ')}\n`;
  }
  if (profile.coach_tonality) {
    context += `- Bevorzugte Tonalität: ${profile.coach_tonality}\n`;
  }
  if (profile.preferred_tone?.length) {
    context += `- Bevorzugter Ton: ${profile.preferred_tone.join(', ')}\n`;
  }
  if (profile.power_sources?.length) {
    context += `- Kraftquellen: ${profile.power_sources.join(', ')}\n`;
  }
  if (profile.self_qualities?.length) {
    context += `- Selbst-Qualitäten: ${profile.self_qualities.join(', ')}\n`;
  }
  
  return context;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, statement } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let profileContext = "";
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profile) {
        profileContext = buildProfileContext(profile);
      }
    }

    const statementContext = statement ? `\n\n## Aktueller Impuls\n"${statement}"` : "";
    const fullPrompt = systemPrompt + statementContext + profileContext;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Selfcare chat request with", messages.length, "messages, statement:", statement?.substring(0, 30));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: fullPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit erreicht. Bitte warte einen Moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('Error in selfcare-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
