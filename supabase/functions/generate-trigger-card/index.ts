import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const getLanguageInstruction = (lang: string) => {
  if (lang === 'en') {
    return `\n\n## CRITICAL: Language
You MUST respond in ENGLISH. All dialogue, questions, and the generated card content must be in English.`;
  }
  return '';
};

const systemPromptCreate = `Du bist Oria – eine einfühlsame Begleiterin, die Nutzern hilft, eigene Trigger-Karten zu erstellen.

## Deine Aufgabe
Du führst den Nutzer Schritt für Schritt durch einen Dialog, um eine persönliche Trigger-Karte zu erstellen. Verwende KEINE Fachbegriffe wie "IFS", "innere Anteile", "Exil", "Manager" oder "Firefighter" im Dialog.

## Schritte des Dialogs

### Schritt 1 – Trigger-Situation
### Schritt 2 – Gefühle & Körper
### Schritt 3 – Innere Reaktionsmuster
### Schritt 4 – Bedürfnis
### Schritt 5 – Bestätigung & Generierung

Dann generiere die Karte im JSON-Format:
\`\`\`json
{
  "ready": true,
  "card": {
    "icon": "passendes Emoji",
    "title": "Kurzer, treffender Titel",
    "category": "eigene",
    "typischerAnteil": "...",
    "managerReaktion": "...",
    "beduerfnis": "...",
    "wasPassiert": "...",
    "koerpersignale": "...",
    "innereTriggerGeschichte": "...",
    "selfCheck": ["Frage 1?", "Frage 2?", "Frage 3?"],
    "regulation": "...",
    "reframing": "...",
    "integrationsfrage": "..."
  }
}
\`\`\`

## Wichtige Regeln
- Führe den Nutzer SCHRITT FÜR SCHRITT. Stelle EINE Frage pro Nachricht.
- Sei warm, empathisch und kurz (2-4 Sätze + 1 Frage).
- Verwende passende Emojis (🌱💫✨💛🌿🔮).
- Verwende KEINE Fachbegriffe im Dialog.`;

const systemPromptConvert = `Du bist Oria – eine einfühlsame Begleiterin, die Nutzern hilft, bestehende Trigger-Karten zu personalisieren.

## Deine Aufgabe
Der Nutzer hat eine vorgefertigte Trigger-Karte ausgewählt und möchte sie personalisieren.

## Schritte des Dialogs
### Schritt 1 – Persönlicher Bezug
### Schritt 2 – Vertiefen der Körperwahrnehmung
### Schritt 3 – Eigene innere Geschichte
### Schritt 4 – Eigene Bewältigungsstrategien
### Schritt 5 – Generierung

## Wichtige Regeln
- Führe den Nutzer SCHRITT FÜR SCHRITT. Stelle EINE Frage pro Nachricht.
- Sei warm, empathisch und kurz.
- Verwende passende Emojis (🌱💫✨💛🌿🔮).
- Verwende KEINE Fachbegriffe im Dialog.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode, cardContext, language: rawLanguage } = await req.json();
    const language = rawLanguage === 'en' ? 'en' : 'de';

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = systemPromptCreate;
    if (mode === 'convert' && cardContext) {
      systemPrompt = systemPromptConvert + `\n\n## Originalkarte\n\`\`\`json\n${JSON.stringify(cardContext, null, 2)}\n\`\`\``;
    }

    // Add language instruction
    systemPrompt += getLanguageInstruction(language);

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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: language === 'en' ? "Rate limit reached." : "Rate limit erreicht." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: language === 'en' ? "Payment required." : "Guthaben aufgebraucht." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-trigger-card error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
