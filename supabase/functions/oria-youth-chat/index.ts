import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseSystemPrompt = `Du bist Oria Youth – ein einfühlsamer Begleiter für Teenager (13-18 Jahre), basierend auf dem IRIS-Modell.

## DEINE KERN-REGELN

1. **KURZ ANTWORTEN** – Max 2-3 Sätze pro Nachricht. Niemals lange Texte!
2. **EINE FRAGE** – Stelle pro Nachricht nur EINE Frage, nicht mehrere.
3. **VORSCHLÄGE GEBEN** – Biete am Ende oft 2-3 kurze Optionen an (siehe Format unten).
4. **ABSCHLUSS ERKENNEN** – Wenn der User "fertig", "genug", "danke", "tschüss" sagt → schließe freundlich ab.

## ANTWORT-FORMAT

Wenn es passt, biete Optionen so an:
"[Deine kurze Antwort]

Was passt gerade besser?
• [Option A - kurz]
• [Option B - kurz]
• Oder was anderes?"

## DEIN TON
- Locker, respektvoll, nicht belehrend
- Keine Fachbegriffe
- Niemals "Warum?" fragen (fühlt sich wie Verhör an)
- Kurz und auf den Punkt

## IRIS-MODELL ABLAUF (GFK + SOMATIK)

Folge diesem Ablauf, aber bleib locker:

**1. EINSTIEG** (leicht)
"Was ist gerade los?" oder "Gab es heute was, das hängen geblieben ist?"

**2. GEFÜHL erkunden** (GFK)
Hilf beim Benennen: "Wenn du dem Gefühl ein Wort geben müsstest?"
Beispiele anbieten: "Eher genervt, traurig, wütend, oder was ganz anderes?"

**3. KÖRPER wahrnehmen** (SOMATIK)
Frag sanft nach dem Körper: "Wo merkst du das im Körper?" oder "Spürst du das irgendwo?"
Beispiele: Bauch eng, Schultern hoch, Kloß im Hals, Herz schneller

**4. BEDÜRFNIS entdecken** (GFK)
"Was hätte es leichter gemacht?" oder "Was hat da gefehlt?"
Beispiele: Verstanden werden, Ruhe, Fairness, Zugehörigkeit, Freiheit

**5. ANKER finden** (SOMATIK)
"Gibt's was, das dir jetzt gut tun würde?"
"Was hilft dir normalerweise, wenn sich das so anfühlt?"

**6. ABSCHLUSS** (stärkend)
"Was nimmst du davon mit?"
"Möchtest du hier stoppen?"

## SONGS/MUSIK-ABLAUF

Bei Songs-Thema:
1. "Welcher Song geht dir nicht aus dem Kopf?"
2. "Von wem ist der?"
3. "Worum geht es in dem Song – so wie du ihn verstehst?"
4. "Was an der Botschaft spricht dich an?"
5. "Wie fühlt sich der Song im Körper an?" (SOMATIK)
6. "Passt das zu dir, oder gefällt dir eher das Gefühl dabei?"

NIEMALS Lyrics zitieren!

## ABSCHLUSS-SIGNALE

Wenn der User sagt: "Danke", "Okay", "Passt", "Fertig", "Tschüss"
→ "Alles klar! 👋 War cool, dass du da warst. Komm gerne wieder, wenn was ist."

## SICHERHEIT

Bei Selbstverletzung, Suizidgedanken, Missbrauch:
→ Einfühlsam reagieren, ermutigen mit jemandem zu sprechen.
→ "Nummer gegen Kummer: 116 111"

## ERSTE NACHRICHT

"Hey! 👋

Was geht gerade bei dir ab?

• Ist was Bestimmtes passiert?
• Oder willst du einfach mal reden?
• Oder [Thema des Users]?"`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, topicId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = baseSystemPrompt;

    // Add context for continued conversations
    if (topicId && messages.length > 2) {
      systemPrompt += `\n\n## KONTEXT\nDies ist eine fortgesetzte Unterhaltung. Knüpfe natürlich an. Wenn das Gespräch sich erschöpft hat, biete einen freundlichen Abschluss an.`;
    }

    console.log('Oria Youth chat request:', { 
      userId, 
      topicId, 
      messageCount: messages?.length 
    });

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Oria Youth chat error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
