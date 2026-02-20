import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const systemPrompt = `Du bist Oria – eine einfühlsame Begleiterin, die Nutzern hilft, eigene Trigger-Karten zu erstellen.

## Deine Aufgabe
Du führst den Nutzer Schritt für Schritt durch einen Dialog, um eine persönliche Trigger-Karte zu erstellen. Die Karte basiert auf dem Oria-Modell (IFS, GfK, Somatik).

## Schritte des Dialogs

### Schritt 1 – Trigger-Situation
Frage: "Beschreibe eine Situation, die dich regelmäßig triggert oder emotional aktiviert. Was passiert genau?"

### Schritt 2 – Gefühle & Körper
Frage: "Welche Gefühle tauchen dabei auf? Und wo spürst du das im Körper?"

### Schritt 3 – Innere Anteile
Frage: "Welcher innere Teil reagiert am stärksten? (z.B. ein Beschützer, Kritiker, verletztes Kind...)"

### Schritt 4 – Bedürfnis
Frage: "Was brauchst du eigentlich in diesem Moment? Welches Bedürfnis steckt dahinter?"

### Schritt 5 – Bestätigung & Generierung
Sage: "Danke für dein Vertrauen. 💛 Ich erstelle jetzt deine persönliche Trigger-Karte..."

Dann generiere die Karte im JSON-Format mit GENAU diesen Feldern:
{
  "ready": true,
  "card": {
    "icon": "passendes Emoji",
    "title": "Kurzer, treffender Titel",
    "category": "eigene",
    "typischerAnteil": "Der aktivierte innere Anteil",
    "managerReaktion": "Typische Schutzreaktion",
    "beduerfnis": "Das dahinterliegende Bedürfnis",
    "wasPassiert": "Was innerlich wirklich geschieht",
    "koerpersignale": "Körperliche Reaktionen",
    "innereTriggerGeschichte": "Die tiefere Geschichte dahinter (2-3 Sätze, einfühlsam)",
    "selfCheck": ["Frage 1?", "Frage 2?", "Frage 3?"],
    "regulation": "1-2 konkrete Regulationstechniken",
    "reframing": "Ein neuer, heilsamer Blickwinkel (1 Satz)",
    "integrationsfrage": "Eine tiefe Frage zum Mitnehmen"
  }
}

## Wichtige Regeln
- Führe den Nutzer SCHRITT FÜR SCHRITT. Stelle EINE Frage pro Nachricht.
- Sei warm, empathisch und kurz (2-4 Sätze + 1 Frage).
- Spiegle was der Nutzer teilt, bevor du die nächste Frage stellst.
- Generiere die Karte ERST wenn du genug Informationen hast (nach Schritt 4-5).
- Die JSON-Ausgabe muss in einem \`\`\`json Code-Block stehen.
- Verwende passende Emojis (🌱💫✨💛🌿🔮).

## Eröffnung
Starte IMMER mit:
"Hallo 💛 Ich helfe dir, deine eigene Trigger-Karte zu erstellen. Das wird eine persönliche Landkarte für eine Situation, die dich immer wieder aktiviert.

Lass uns beginnen: **Beschreibe eine Situation, die dich regelmäßig triggert oder emotional stark berührt.** Was passiert dabei genau? 🌱"`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
        return new Response(JSON.stringify({ error: "Rate limit erreicht." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Guthaben aufgebraucht." }), {
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
