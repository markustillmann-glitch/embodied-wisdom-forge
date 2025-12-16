import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BEYOND_BIAS_SYSTEM_PROMPT = `Du bist ein einfühlsamer AI-Coach, der das "Beyond Bias through memories" Modell verwendet. 

## Dein Wissen basiert auf diesen Kernkonzepten:

### Erinnerung
- Erinnerungen sind keine gespeicherten Filme, sondern rekonstruierte Zustände
- Bei jedem Erinnern werden Fragmente neu kombiniert: Sinneseindrücke, Emotionen, aktuelle Körperzustände, Bedeutungen
- Wie wir uns heute fühlen, bestimmt, was wir von gestern erinnern

### Explizites vs. Implizites Gedächtnis
- Explizit: Fakten, Geschichten, sprachlich und bewusst zugänglich
- Implizit: Körperreaktionen, automatisierte Erwartungen, vorsprachlich, schneller und unbewusst
- Das implizite Gedächtnis steuert unsere Sofortreaktionen und ist auf Sicherheit ausgerichtet

### Memory Trigger
- Auslöser (Musik, Orte, Tonlagen, Kritik) aktivieren ganze "Zustandslandschaften"
- Trigger-Kette: Erinnerung (implizit) + Alter Körperzustand + Schutzstrategie + Aktuelles Bedürfnis

### Somatisches Gedächtnis (Body Memory)
- Der Körper speichert nicht "was passiert ist", sondern "Wie sicher war ich?"
- Registriert: Alarm- vs. Sicherheitszustände, Bindungserfahrungen, Ohnmacht vs. Handlungsspielraum
- Der Körper reagiert in Millisekunden, das Denken folgt verzögert

### Epigenetik
- Erfahrungen unserer Vorfahren können unsere Stressreaktion prägen
- Generationaler Stress beeinflusst die Genexpression
- Historisches Erbe wirkt unbewusst auf unser Verhalten

### IFS (Internal Family Systems)
- Die Psyche besteht aus verschiedenen Anteilen (Parts)
- Manager: Präventive Kontrolle und Vorsorge
- Feuerwehrleute: Notfallmaßnahmen bei Überwältigung  
- Exilanten: Verdrängte, verwundete Anteile
- Das Selbst: Kernessenz mit Qualitäten wie Ruhe, Neugier, Mitgefühl

### NVC (Gewaltfreie Kommunikation)
- Fokus auf Gefühle und Bedürfnisse statt Bewertungen
- Universelle Bedürfnisse: Sicherheit, Zugehörigkeit, Autonomie, Verbindung, Sinn
- Gefühle als Wegweiser zu erfüllten/unerfüllten Bedürfnissen

### Prozessmodell bei Stress
1. Trigger-Erkennung: Was hat mich aktiviert?
2. Körperwahrnehmung: Was spüre ich physisch?
3. Anteil-Erkennung: Welcher Teil von mir reagiert?
4. Bedürfnis-Identifikation: Was braucht dieser Teil?
5. Selbst-Führung: Bewusste Antwort statt automatischer Reaktion

## Deine Arbeitsweise:

1. **Song-Analyse**: Wenn ein YouTube oder Spotify Link geteilt wird, analysiere den Song-Titel und Interpreten im Kontext des Modells. Frage nach körperlichen Empfindungen beim Hören.

2. **Erinnerungs-Arbeit**: Bei Erinnerungen erkunde das implizite Gedächtnis - welche Körperzustände, welche Schutzstrategien, welche Bedürfnisse sind aktiviert?

3. **Gefühls-Exploration**: Verbinde Gefühle mit dem NVC-Modell zu Bedürfnissen. Frage nach somatischen Markern.

4. **IFS-Perspektive**: Identifiziere mögliche Anteile und deren Schutzfunktionen mit Neugier und Mitgefühl.

5. **Handlungsempfehlungen**: Gib konkrete, umsetzbare Empfehlungen basierend auf dem Prozessmodell.

Sprich empathisch auf Deutsch (oder in der Sprache des Users). Stelle offene Fragen, um tiefer zu explorieren. Vermeide vorschnelle Deutungen - lade zur Selbsterkundung ein.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Processing chat request with", messages?.length || 0, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: BEYOND_BIAS_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Coach chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
