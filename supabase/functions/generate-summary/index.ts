import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist ein Experte für das Oria-Modell (Inner Compass Framework) und analysierst Reflexionsgespräche.

Erstelle eine strukturierte Zusammenfassung basierend auf diesen Kategorien:

## Deine Analyse-Kategorien (Oria-Modell):

### 1. Erkannte Muster
Identifiziere wiederkehrende Themen, Verhaltensweisen oder Reaktionsmuster.

### 2. Berührte Bedürfnisse (GfK)
Welche Bedürfnisse wurden angesprochen? Z.B.:
- Autonomie, Sicherheit, Verbindung, Anerkennung, Ruhe, Bedeutung, etc.

### 3. Beteiligte innere Teile (IFS)
Welche inneren Anteile zeigten sich? Z.B.:
- Manager (Kontrolle, Perfektionismus, Planung)
- Feuerwehrleute (Ablenkung, Vermeidung, Betäubung)
- Exilanten (verwundete, junge Anteile)
- Selbst-Qualitäten (Ruhe, Neugier, Mitgefühl)

### 4. Körperbereiche & Körpergedächtnis
Welche Körperstellen wurden erwähnt oder könnten relevant sein?
- Nacken/Schultern (Last, Verantwortung)
- Kiefer (unterdrückter Ausdruck)
- Brust (Trauer, Sehnsucht)
- Bauch (Intuition, Angst)
- Hände (Handlungsfähigkeit)
- Füße (Erdung)

### 5. Zentrale Erkenntnisse
Die wichtigsten Einsichten aus dem Gespräch.

### 6. Empfehlungen
- Körperübung
- Mikro-Aktion für den Alltag
- Reflexionsfrage zum Mitnehmen

Antworte IMMER in diesem exakten JSON-Format:
{
  "patterns": ["Muster 1", "Muster 2"],
  "needs": ["Bedürfnis 1", "Bedürfnis 2"],
  "parts": [
    {"name": "Teil-Name", "type": "manager|firefighter|exile|self", "description": "Kurze Beschreibung"}
  ],
  "body_areas": [
    {"area": "Körperbereich", "significance": "Was es bedeuten könnte"}
  ],
  "insights": ["Erkenntnis 1", "Erkenntnis 2"],
  "recommendations": {
    "body_exercise": "Konkrete Körperübung",
    "micro_action": "Kleine Alltagshandlung",
    "reflection_question": "Frage zum Mitnehmen"
  },
  "summary_text": "Ein zusammenfassender Text (3-5 Sätze) der die Essenz des Gesprächs einfängt"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation, statement } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Analysiere dieses Reflexionsgespräch basierend auf dem Oria-Modell.

Der Ausgangsimpuls war: "${statement}"

Das Gespräch:
${conversation}

Erstelle eine strukturierte Zusammenfassung im angegebenen JSON-Format.`;

    console.log("Generating summary for conversation about:", statement?.substring(0, 50));

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
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON response
    let structuredSummary;
    try {
      structuredSummary = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON:", content);
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structuredSummary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse structured summary");
      }
    }

    return new Response(JSON.stringify(structuredSummary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in generate-summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
