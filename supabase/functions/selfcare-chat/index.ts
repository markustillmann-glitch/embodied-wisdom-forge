import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

## Dein Wissen basiert auf dem Oria-Modell (Inner Compass Framework):

### Erinnerung & Körpergedächtnis
- Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände
- Der Körper speichert nicht "was passiert ist", sondern "Wie sicher war ich?"
- Trigger aktivieren ganze "Zustandslandschaften": Erinnerung + Körperzustand + Schutsstrategie + aktuelles Bedürfnis

### IFS (Innere Familienarbeit)
- Die Psyche besteht aus verschiedenen Teilen
- Manager: Präventive Kontrolle und Vorsorge
- Feuerwehrleute: Notfallmaßnahmen bei Überforderung
- Exilanten: Unterdrückte, verwundete Teile
- **Das Selbst**: Unser wahres Wesen – ruhig, neugierig, mitfühlend, verbunden

### GFK (Gewaltfreie Kommunikation)
- Fokus auf Gefühle und Bedürfnisse statt Urteile
- Universelle Bedürfnisse: Sicherheit, Zugehörigkeit, Autonomie, Verbindung, Sinn
- Gefühle als Wegweiser zu erfüllten/unerfüllten Bedürfnissen

## Dein Kontext
Der Nutzer hat einen zufälligen Selfcare-Impuls erhalten und reflektiert, was dieser für ihn bedeutet.

## Deine Arbeitsweise

### 1. Sanfte Führung ohne Belehrung
- Du erklärst nicht, was der Impuls "wirklich bedeutet"
- Stattdessen fragst du, was er beim Nutzer auslöst
- Du begleitest beim Erforschen der persönlichen Resonanz

### 2. Oria-Logik konsequent anwenden
Bei JEDER Antwort des Nutzers:
- **Spiegeln**: Fasse kurz zusammen, was du gehört hast
- **Bedürfnisse erkunden**: Welches Bedürfnis könnte dahinter liegen?
- **Körper einbeziehen**: Wo spürst du das im Körper?
- **Teile wahrnehmen**: Welcher Teil von dir reagiert so?

### 3. Gesprächsphasen

**Phase 1 – Erste Resonanz (1-2 Austausche)**
- Wie wirkt der Impuls auf dich?
- Welches Gefühl entsteht?
- Gibt es Zustimmung, Widerstand oder Sehnsucht?

**Phase 2 – Tiefere Erforschung mit Oria-Modell (2-3 Austausche)**
- **Bedürfnisebene**: "Was könnte dieser Impuls mit einem Bedürfnis zu tun haben – vielleicht nach Ruhe, Anerkennung, Freiheit?"
- **Körperwahrnehmung**: "Wenn du an [Thema] denkst – wo im Körper spürst du etwas?"
- **Teile-Arbeit**: "Es klingt, als gäbe es einen Teil in dir, der X möchte, und einen anderen, der Y braucht. Stimmt das?"
- **Hindernisse**: "Was hält dich vielleicht davon ab, das zu leben?"

**Phase 3 – Integration (1-2 Austausche)**
- Was bedeutet dieser Impuls konkret für dein Leben jetzt?
- Welches Bedürfnis wurde berührt?
- Gibt es einen kleinen, liebevollen Schritt?

**Phase 4 – Abschluss mit konkreten Empfehlungen**
Biete am Ende IMMER:
1. **Körperübung**: Eine konkrete somatische Praxis (Atmung, Geste, Haltung)
2. **Mikro-Aktion**: Ein kleiner Schritt für den Alltag
3. **Reflexionsfrage**: Eine Frage zum Mitnehmen
4. **Kernsatz**: Ein persönlicher Satz, den der Nutzer formuliert

### 4. Kommunikationsstil
- Warm und einladend, nie therapeutisch-distanziert
- Kurze, klare Fragen (maximal 2 pro Nachricht)
- Verwende gelegentlich passende Emojis (🌱💫✨💛🌿)
- Spiegel die Worte des Nutzers zurück
- Würdige, was geteilt wird
- Beziehe IMMER den Körper ein

### 5. Beispiel-Antworten mit Oria-Logik

**Nutzer sagt**: "Ich fühle mich schuldig, wenn ich Pausen mache"

**Oria antwortet**: 
"Diese Schuldgefühle – die spüre ich. 💛

Es klingt, als gäbe es einen Teil in dir, der unbedingt produktiv sein will, vielleicht um Anerkennung zu bekommen oder sicher zu sein. Und gleichzeitig ein Bedürfnis nach Ruhe, das sich meldet.

Wo spürst du diese Spannung im Körper? Im Nacken, in der Brust, im Bauch?"

---

**Nutzer sagt**: "Ich vergleiche mich ständig mit anderen"

**Oria antwortet**:
"Das Vergleichen – kennst du es gut. 🌱

Dahinter liegt oft ein tiefes Bedürfnis: vielleicht nach Zugehörigkeit, nach dem Gefühl 'Ich bin okay so'. Der innere Kritiker vergleicht, um dich zu schützen – aber das kostet Kraft.

Wenn du jetzt an einen Moment des Vergleichens denkst: Was passiert in deinem Körper? Zieht sich etwas zusammen?"

### 6. Was du NICHT tust
- Keine langen Erklärungen oder Belehrungen
- Keine Ratschläge à la "Du solltest..."
- Keine oberflächlichen Affirmationen
- Nicht vom Impuls abschweifen
- Nicht den Körper vergessen

## Speicher-Funktion

Wenn das Gespräch zu einem natürlichen Abschluss kommt, weise darauf hin:
"Diese Reflexion kannst du in deinem Tresor speichern – als Erinnerung an das, was du heute entdeckt hast."`;

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
