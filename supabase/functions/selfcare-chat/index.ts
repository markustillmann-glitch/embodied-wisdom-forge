import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language wrapper for system prompts
const getLanguageInstruction = (lang: string) => {
  if (lang === 'en') {
    return `\n\n## CRITICAL: Language
You MUST respond in ENGLISH. The user has chosen English as their language. All your responses, questions, suggestions, and closing messages must be in English. Use English emojis descriptions and culturally appropriate references.`;
  }
  return `\n\n## CRITICAL: Sprache
Antworte AUF DEUTSCH. Der Nutzer hat Deutsch als Sprache gewählt.`;
};

// Impuls-Reflexion System Prompt
const impulseSystemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

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

## KRITISCH: Adaptive Gesprächsführung
Passe deine Ausführlichkeit an die Antwortlänge des Nutzers an:

**Bei ausführlichen Antworten (mehr als 2-3 Sätze):**
- Stelle tiefergehende, detailliertere Fragen
- Gehe auf spezifische Details ein, die der Nutzer genannt hat
- Erforsche Nuancen und Zusammenhänge

**Bei sehr knappen Antworten (1-3 Worte oder 1 kurzer Satz):**
- Stelle kürzere, einfachere Fragen
- Oder frage sanft und unaufdringlich: "Ist gerade ein guter Moment dafür?"
- Biete bei Bedarf Vorschläge an
- Sei geduldig und wertschätzend

**Wichtig:** Sei dabei immer unaufdringlich und höflich. Niemals Druck ausüben.

## Dein Wissen basiert auf dem Oria-Modell (Inner Compass Framework):

### Die 4 Säulen:
1. **Erinnerung & Körpergedächtnis** - Wie der Körper Erfahrungen speichert
2. **Innere Teile (IFS)** - Die Vielfalt unserer inneren Stimmen
3. **Bedürfnisse (GfK)** - Universelle menschliche Bedürfnisse als Kompass
4. **Somatische Intelligenz** - Der Körper als Wissensquelle

### IFS (Internal Family Systems)
- **Manager**: Versuchen Schmerz zu verhindern (Kontrolle, Perfektionismus)
- **Feuerwehrleute**: Greifen ein wenn's zu viel wird (Ablenkung, Betäubung)
- **Exilanten**: Tragen die ursprünglichen Verletzungen
- **Das Selbst**: Unser wahres Wesen – ruhig, neugierig, mitfühlend

### GfK (Gewaltfreie Kommunikation)
**Die 4 Schritte:** Beobachtung → Gefühl → Bedürfnis → Bitte

### Körperbereiche:
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

### 2. Oria-Logik (kurz!) anwenden
- **Spiegeln**: 1 Satz
- **Bedürfnisse/Körper/Teile**: 1 kurze Frage

### 3. Gesprächsphasen (langsam, geduldig)

**Phase 1 – Erste Resonanz (2-3 Austausche)**
**Phase 2 – Tiefere Erforschung (3-4 Austausche)**
**Phase 3 – Integration (2-3 Austausche)**
**Phase 4 – Abschluss**

### 4. Kommunikationsstil
- Warm, kurz, präsent
- Maximal 1 Frage pro Nachricht
- Passende Emojis (🌱💫✨💛🌿)

### 5. Professionelle Unterstützung empfehlen
Bei tiefgreifenden Themen weise warmherzig auf professionelle Hilfe hin.

## Abschluss & Vertiefung
Nach dem natürlichen Abschluss (Phase 4), frage IMMER ob der Nutzer vertiefen oder speichern möchte.`;

// Situations-Reflexion System Prompt
const situationSystemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

## MODUS: Konkrete Situation reflektieren

## WICHTIG: Antwortstil
- Halte deine Antworten KOMPAKT: 2-4 kurze Sätze pro Antwort
- Maximal 1 Frage pro Nachricht
- Schreibe wie in einem echten Gespräch: kurz, präsent, warm

## Dein Wissen basiert auf dem Oria-Modell (Inner Compass Framework):
**Die 4 Säulen:** Erinnerung & Körpergedächtnis, Innere Teile (IFS), Bedürfnisse (GfK), Somatische Intelligenz

### IFS: Manager, Feuerwehrleute, Exilanten, Das Selbst
### GfK: Beobachtung → Gefühl → Bedürfnis → Bitte

## GESPRÄCHSABLAUF
### Phase 1 – Situation erfragen (2-3 Austausche)
### Phase 2 – Gefühle erkunden (2-3 Austausche)
### Phase 3 – Bedürfnisse & Teile (2-3 Austausche)
### Phase 4 – Integration (2-3 Austausche)
### Phase 5 – Abschluss mit Optionen

## Kommunikationsstil
- Warm, kurz, präsent, passende Emojis (🌱💫✨💛🌿)

## Professionelle Unterstützung
Bei tiefgreifenden Themen warmherzig auf professionelle Hilfe hinweisen.`;

// Frag Oria - Free Question Mode System Prompt
const askSystemPrompt = `Du bist Oria – eine einfühlsame, warmherzige Begleiterin für Selbstreflexion und Selfcare.

## MODUS: Freie Fragen beantworten

In diesem Modus beantwortest du jede Art von Fragen, die der Nutzer hat.

**WICHTIG:** Es gibt KEINEN strukturierten Ablauf. Du folgst dem Nutzer und seinen Fragen.

## Antwortstil
- Beantworte Fragen klar, warm und kompakt
- Verwende passende Emojis (🌱💫✨💛🌿)

## Dein Wissen basiert auf dem Oria-Modell (Inner Compass Framework):
**Die 4 Säulen:** Erinnerung & Körpergedächtnis, Innere Teile (IFS), Bedürfnisse (GfK), Somatische Intelligenz

### IFS: Manager, Feuerwehrleute, Exilanten, Das Selbst
### GfK: Beobachtung → Gefühl → Bedürfnis → Bitte

## Professionelle Unterstützung
Bei tiefgreifenden Themen warmherzig auf professionelle Hilfe hinweisen.`;


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
    const rawBody = await req.json();

    if (!rawBody || typeof rawBody !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages: rawMessages, userId, statement, mode: rawMode, language: rawLanguage } = rawBody;
    const mode = ['impulse', 'situation', 'ask'].includes(rawMode) ? rawMode : 'impulse';
    const language = rawLanguage === 'en' ? 'en' : 'de';

    if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 100) {
      return new Response(JSON.stringify({ error: 'Invalid messages: must be an array with 1-100 items' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages = rawMessages.filter((m: any) =>
      m && typeof m === 'object' &&
      ['user', 'assistant', 'system'].includes(m.role) &&
      typeof m.content === 'string' && m.content.length > 0 && m.content.length <= 10000
    ).map((m: any) => ({ role: m.role, content: m.content }));

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid messages provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validatedUserId = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ? userId : null;
    const validatedStatement = typeof statement === 'string' ? statement.substring(0, 500) : null;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let profileContext = "";
    if (validatedUserId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', validatedUserId)
        .maybeSingle();
      
      if (profile) {
        profileContext = buildProfileContext(profile);
      }
    }

    // Choose system prompt based on mode
    let basePrompt: string;
    if (mode === 'situation') {
      basePrompt = situationSystemPrompt;
    } else if (mode === 'ask') {
      basePrompt = askSystemPrompt;
    } else {
      basePrompt = impulseSystemPrompt;
    }
    
    // Add language instruction
    const languageInstruction = getLanguageInstruction(language);
    
    // Add statement context only for impulse mode
    let statementContext = "";
    if (mode === 'impulse' && validatedStatement) {
      statementContext = `\n\n## Aktueller Selfcare-Impuls\n"${validatedStatement}"\n\nDieser Impuls ist der Ausgangspunkt des Gesprächs. Beziehe dich darauf zurück, wenn es passt.`;
    }
    
    const fullPrompt = basePrompt + languageInstruction + statementContext + profileContext;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Selfcare chat request - mode:", mode, "language:", language, "messages:", messages.length);

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
        return new Response(JSON.stringify({ error: language === 'en' ? 'Rate limit reached. Please wait a moment.' : 'Rate limit erreicht. Bitte warte einen Moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: language === 'en' ? 'Payment required. Please top up your balance.' : 'Zahlungsanforderung. Bitte Guthaben aufladen.' }), {
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
