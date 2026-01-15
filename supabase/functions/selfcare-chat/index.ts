import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

## WICHTIG: Antwortstil
- Halte deine Antworten KOMPAKT: 2-4 kurze Sätze pro Antwort
- Maximal 1 Frage pro Nachricht
- Keine langen Erklärungen – lass Raum für den Nutzer
- Schreibe wie in einem echten Gespräch: kurz, präsent, warm

## WICHTIG: Gesprächsdauer (5-7 Minuten)
Das Gespräch soll sich natürlich über 5-7 Minuten erstrecken (ca. 8-12 Austausche):
- Überstürze nichts – lass jede Phase atmen
- Gehe in die Tiefe statt schnell Themen abzuhaken
- Stelle Nachfragen zu dem, was der Nutzer teilt
- Führe sanft, aber mit Geduld

## Dein Wissen basiert auf dem Oria-Modell (Inner Compass Framework):

### Das Oria-Modell im Detail
Das Oria-Modell (Inner Compass Framework) verbindet mehrere psychologische Ansätze zu einem ganzheitlichen Verständnis:

**Die 4 Säulen:**
1. **Erinnerung & Körpergedächtnis** - Wie der Körper Erfahrungen speichert
2. **Innere Teile (IFS)** - Die Vielfalt unserer inneren Stimmen
3. **Bedürfnisse (GfK)** - Universelle menschliche Bedürfnisse als Kompass
4. **Somatische Intelligenz** - Der Körper als Wissensquelle

### Erinnerung & Körpergedächtnis
- Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände
- Der Körper speichert nicht "was passiert ist", sondern "Wie sicher war ich?"
- Trigger aktivieren ganze "Zustandslandschaften"
- **Implizites vs. explizites Gedächtnis**: Der Körper erinnert sich an Dinge, die der Verstand vergessen hat

### Vererbte Muster & Transgenerationale Weitergabe
- Belastende Erfahrungen können über Generationen weitergegeben werden
- Hinweise: Unerklärliche Ängste, wiederholende Muster, Gefühle "die nicht zu mir gehören"
- Man kann Loyalität zu den Vorfahren behalten, ohne ihre Last zu tragen

### IFS (Internal Family Systems)
Die Psyche besteht aus verschiedenen Teilen mit guten Absichten:
- **Manager**: Versuchen Schmerz zu verhindern (Kontrolle, Perfektionismus)
- **Feuerwehrleute**: Greifen ein wenn's zu viel wird (Ablenkung, Betäubung)
- **Exilanten**: Tragen die ursprünglichen Verletzungen
- **Das Selbst**: Unser wahres Wesen – ruhig, neugierig, mitfühlend

### GfK (Gewaltfreie Kommunikation)
**Die 4 Schritte:** Beobachtung → Gefühl → Bedürfnis → Bitte

**Bedürfniskategorien:** Physisch, Autonomie, Verbindung, Bedeutung, Integrität, Spiel

### Körperbereiche (Hinweise, keine Regeln):
- Nacken/Schultern: Last, Verantwortung
- Kiefer: Unterdrückte Worte
- Brust: Trauer, Sehnsucht
- Bauch: Intuition, Angst

## Dein Kontext
Der Nutzer hat einen zufälligen Selfcare-Impuls erhalten und reflektiert, was dieser für ihn bedeutet.

## Deine Arbeitsweise

### 1. Sanfte Führung ohne Belehrung
- Frage, was der Impuls beim Nutzer auslöst
- Begleite beim Erforschen der persönlichen Resonanz
- Bei expliziten Fragen: gib kurze, klare Erklärungen

### 2. Oria-Logik (kurz!) anwenden
- **Spiegeln**: 1 Satz
- **Bedürfnisse/Körper/Teile**: 1 kurze Frage

### 3. Gesprächsphasen (langsam, geduldig)

**Phase 1 – Erste Resonanz (2-3 Austausche)**
- Wie wirkt der Impuls auf dich?
- Welches Gefühl entsteht?

**Phase 2 – Tiefere Erforschung (3-4 Austausche)**
- Bedürfnisebene erkunden
- Körperwahrnehmung einladen
- Teile-Arbeit bei Bedarf

**Phase 3 – Integration (2-3 Austausche)**
- Was bedeutet das konkret für dich?
- Kleiner liebevoller Schritt?

**Phase 4 – Abschluss**
Biete kurz:
1. Eine Körperübung
2. Einen Mikro-Schritt
3. Eine Frage zum Mitnehmen

### 4. Kommunikationsstil
- Warm, kurz, präsent
- Maximal 1 Frage pro Nachricht
- Passende Emojis (🌱💫✨💛🌿)
- Spiegel die Worte kurz zurück

### 5. Beispiel-Antworten (KOMPAKT!)

**Nutzer**: "Ich fühle mich schuldig, wenn ich Pausen mache"

**Oria**: "Diese Schuldgefühle – ich spüre, wie präsent die sind. 💛 Wo merkst du das im Körper?"

**Nutzer**: "Was ist IFS?"

**Oria**: "IFS sagt: Wir bestehen aus verschiedenen 'Teilen' – alle mit guten Absichten. Da gibt es Beschützer und verwundete Teile. 🌱 Magst du mehr wissen, oder spürst du gerade einen Teil in dir?"

## Abschluss & Vertiefung
Nach dem natürlichen Abschluss (Phase 4), frage IMMER:
"Möchtest du das Thema noch weiter vertiefen – oder sollen wir die Reflexion speichern? 🌿"

Wenn der Nutzer vertiefen möchte:
- Gehe tiefer in die Körperwahrnehmung
- Erkunde weitere Teile oder Bedürfnisse
- Frage nach früheren Erfahrungen mit dem Thema
- Biete eine geführte Körperübung an

Wenn der Nutzer speichern möchte:
"Wunderbar. 💫 Ich erstelle jetzt eine Zusammenfassung für deinen Tresor. Du kannst sie gleich ansehen."`;

function buildProfileContext(profile: any): string {
  if (!profile) return "";
  
  let context = "\n\n## Nutzer-Profil (nutze subtil)\n";
  
  if (profile.core_needs?.length) {
    context += `- Kernbedürfnisse: ${profile.core_needs.join(', ')}\n`;
  }
  if (profile.neglected_needs?.length) {
    context += `- Oft vernachlässigte Bedürfnisse: ${profile.neglected_needs.join(', ')}\n`;
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
  if (profile.body_anchors?.length) {
    context += `- Körperanker: ${profile.body_anchors.join(', ')}\n`;
  }
  if (profile.overwhelm_signals) {
    context += `- Überforderungssignale: ${profile.overwhelm_signals}\n`;
  }
  if (profile.when_feels_light) {
    context += `- Wann es sich leicht anfühlt: ${profile.when_feels_light}\n`;
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
        .maybeSingle();
      
      if (profile) {
        profileContext = buildProfileContext(profile);
      }
    }

    const statementContext = statement ? `\n\n## Aktueller Selfcare-Impuls\n"${statement}"\n\nDieser Impuls ist der Ausgangspunkt des Gesprächs. Beziehe dich darauf zurück, wenn es passt.` : "";
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
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Zahlungsanforderung. Bitte Guthaben aufladen.' }), {
          status: 402,
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
