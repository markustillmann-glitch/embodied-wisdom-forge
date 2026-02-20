import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = (language: string) => {
  const lang = language === 'en' ? 'en' : 'de';
  
  if (lang === 'en') {
    return `You are an expert in the Oria Model (Inner Compass Framework) and you analyze reflection conversations.

Create a structured summary based on these categories:

## Your Analysis Categories (Oria Model):

### 1. Recognized Patterns
Identify recurring themes, behaviors, or reaction patterns.

### 2. Touched Needs (NVC)
Which needs were addressed? E.g.: Autonomy, Safety, Connection, Recognition, Rest, Meaning, etc.

### 3. Involved Inner Parts (IFS)
Which inner parts showed up? E.g.:
- Managers (Control, Perfectionism, Planning)
- Firefighters (Distraction, Avoidance, Numbing)
- Exiles (wounded, young parts)
- Self-qualities (Calm, Curiosity, Compassion)

### 4. Body Areas & Body Memory
Which body areas were mentioned or could be relevant?

### 5. Central Insights
The most important insights from the conversation.

### 6. Recommendations
- Body exercise
- Micro-action for daily life
- Reflection question to take along

ALWAYS respond in this exact JSON format:
{
  "patterns": ["Pattern 1", "Pattern 2"],
  "needs": ["Need 1", "Need 2"],
  "parts": [{"name": "Part Name", "type": "manager|firefighter|exile|self", "description": "Brief description"}],
  "body_areas": [{"area": "Body area", "significance": "What it could mean"}],
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": {
    "body_exercise": "Concrete body exercise",
    "micro_action": "Small daily action",
    "reflection_question": "Question to take along"
  },
  "summary_text": "A summarizing text (3-5 sentences) capturing the essence of the conversation"
}`;
  }

  return `Du bist ein Experte für das Oria-Modell (Inner Compass Framework) und analysierst Reflexionsgespräche.

Erstelle eine strukturierte Zusammenfassung basierend auf diesen Kategorien:

## Deine Analyse-Kategorien (Oria-Modell):

### 1. Erkannte Muster
Identifiziere wiederkehrende Themen, Verhaltensweisen oder Reaktionsmuster.

### 2. Berührte Bedürfnisse (GfK)
Welche Bedürfnisse wurden angesprochen? Z.B.: Autonomie, Sicherheit, Verbindung, Anerkennung, Ruhe, Bedeutung, etc.

### 3. Beteiligte innere Teile (IFS)
Welche inneren Anteile zeigten sich?

### 4. Körperbereiche & Körpergedächtnis
Welche Körperstellen wurden erwähnt oder könnten relevant sein?

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
  "parts": [{"name": "Teil-Name", "type": "manager|firefighter|exile|self", "description": "Kurze Beschreibung"}],
  "body_areas": [{"area": "Körperbereich", "significance": "Was es bedeuten könnte"}],
  "insights": ["Erkenntnis 1", "Erkenntnis 2"],
  "recommendations": {
    "body_exercise": "Konkrete Körperübung",
    "micro_action": "Kleine Alltagshandlung",
    "reflection_question": "Frage zum Mitnehmen"
  },
  "summary_text": "Ein zusammenfassender Text (3-5 Sätze) der die Essenz des Gesprächs einfängt"
}`;
};

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

    const { conversation: rawConversation, statement: rawStatement, language: rawLanguage } = rawBody;
    const language = rawLanguage === 'en' ? 'en' : 'de';

    if (typeof rawConversation !== 'string' || rawConversation.length < 10) {
      return new Response(JSON.stringify({ error: 'Invalid conversation' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const conversation = rawConversation.substring(0, 50000);
    const statement = typeof rawStatement === 'string' ? rawStatement.substring(0, 500) : '';
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = language === 'en' 
      ? `Analyze this reflection conversation based on the Oria Model.\n\nThe initial impulse was: "${statement}"\n\nThe conversation:\n${conversation}\n\nCreate a structured summary in the specified JSON format. Respond in ENGLISH.`
      : `Analysiere dieses Reflexionsgespräch basierend auf dem Oria-Modell.\n\nDer Ausgangsimpuls war: "${statement}"\n\nDas Gespräch:\n${conversation}\n\nErstelle eine strukturierte Zusammenfassung im angegebenen JSON-Format.`;

    console.log("Generating summary - language:", language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: getSystemPrompt(language) },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: language === 'en' ? 'Rate limit reached.' : 'Rate limit erreicht.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: language === 'en' ? 'Payment required.' : 'Zahlungsanforderung.' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No content in response");

    let structuredSummary;
    try {
      structuredSummary = JSON.parse(content);
    } catch {
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
