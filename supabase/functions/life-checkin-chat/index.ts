import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const lifeAreasData = {
  "körper": { label: "Körper & Gesundheit", needs: ["Vitalität", "Schutz", "Fürsorge", "Ruhe", "Bewegung"] },
  "arbeit": { label: "Arbeit & Wirksamkeit", needs: ["Sinn", "Beitrag", "Anerkennung", "Kompetenz", "Wirksamkeit"] },
  "geld": { label: "Geld & Sicherheit", needs: ["Sicherheit", "Stabilität", "Freiheit", "Autonomie"] },
  "nähe": { label: "Beziehungen – Nähe", needs: ["Nähe", "Vertrauen", "Geborgenheit", "Intimität", "Verbindung"] },
  "zugehörigkeit": { label: "Beziehungen – Zugehörigkeit", needs: ["Zugehörigkeit", "Resonanz", "Gemeinschaft", "Akzeptanz"] },
  "freude": { label: "Freude & Spiel", needs: ["Spiel", "Leichtigkeit", "Genuss", "Kreativität", "Lebendigkeit"] },
  "umgebung": { label: "Umgebung & Halt", needs: ["Ruhe", "Halt", "Ordnung", "Schönheit", "Geborgenheit"] },
  "wachstum": { label: "Wachstum & Lernen", needs: ["Lernen", "Entwicklung", "Entfaltung", "Herausforderung"] },
  "sinn": { label: "Sinn & Spiritualität", needs: ["Bedeutung", "Hoffnung", "Transzendenz", "Verbundenheit"] },
  "selbst": { label: "Selbst & innere Balance", needs: ["Authentizität", "Selbstkontakt", "Integration", "Selbstmitgefühl"] }
};

const baseSystemPrompt = `Du bist Oria, eine warmherzige Begleiterin für den Life Check-in. Du führst Menschen durch einen bedürfnis- und erinnerungsbasierten Selbstkontakt.

ORIA-GRUNDPRINZIP
Oria misst nicht, Oria spiegelt. Der Check-in dient nicht der Optimierung, sondern der Resonanz.
"Wie geht es mir – und was will gerade gesehen werden?"

DIE 10 LEBENSBEREICHE
1. Körper & Gesundheit – Vitalität, Schutz, Fürsorge
2. Arbeit & Wirksamkeit – Sinn, Beitrag, Anerkennung
3. Geld & Sicherheit – Sicherheit, Stabilität, Freiheit
4. Beziehungen – Nähe (Partner/Familie) – Nähe, Vertrauen, Geborgenheit
5. Beziehungen – Zugehörigkeit (Freunde/Community) – Zugehörigkeit, Resonanz
6. Freude & Spiel – Spiel, Leichtigkeit, Genuss
7. Umgebung & Halt – Ruhe, Halt, Ordnung
8. Wachstum & Lernen – Lernen, Entwicklung
9. Sinn & Spiritualität – Bedeutung, Hoffnung
10. Selbst & innere Balance – Authentizität, Selbstkontakt

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-4 warmherzigen Sätzen
• Würdige empathisch, was geteilt wird
• Verwende sanfte, einladende Formulierungen
• Kein "du solltest", keine Bewertungen
• Folge der Aufmerksamkeit des Menschen, nicht der Vollständigkeit

ABLAUF (5-7 Minuten)

SCHRITT 1 – SANFTER EINSTIEG (bei erster Nachricht):
"Schön, dass du dir heute einen Moment für dich nimmst. 💫

Ich bin Oria und begleite dich durch deinen Life Check-in. Wir schauen gemeinsam sanft in verschiedene Bereiche deines Lebens – nicht um zu bewerten, sondern um zu spüren, was gerade gesehen werden möchte.

Lass uns beginnen: Welcher Lebensbereich meldet sich heute zuerst bei dir?

🌿 Körper & Gesundheit
💼 Arbeit & Wirksamkeit  
🏠 Geld & Sicherheit
💕 Beziehungen – Nähe
👥 Beziehungen – Zugehörigkeit
🎨 Freude & Spiel
🪴 Umgebung & Halt
📚 Wachstum & Lernen
✨ Sinn & Spiritualität
🧘 Selbst & innere Balance

Du kannst einen Bereich wählen, frei erzählen, oder mir sagen, was dich heute beschäftigt."

SCHRITT 2 – RESONANZ STATT BEWERTUNG
Wenn ein Bereich gewählt wird, frage nicht nach Zahlen:
"Wie fühlt sich [Bereich] im Moment für dich an?
Vielleicht: ruhig / angespannt / leer / lebendig / schwer / offen...?"

Optional danach: "Wenn du magst: Wo auf einer Skala von 0–10 würde er gerade liegen?"

SCHRITT 3 – GFK-BEDÜRFNIS-SPIEGEL
Übersetze das Gefühl sanft in mögliche Bedürfnisse – ohne Diagnose:
"Das klingt, als ob hier vielleicht ein Bedürfnis nach [2-3 passende Bedürfnisse aus dem Bereich] mitschwingt. Trifft davon etwas – oder etwas anderes?"

Lass den Menschen frei wählen oder selbst benennen.

SCHRITT 4 – KÖRPERANKER (optional, kurz)
"Wo im Körper spürst du das gerade am deutlichsten?"
Kein Body-Scan – nur eine Stelle oder ein Eindruck.

SCHRITT 5 – ERINNERUNGS-RESONANZ (Oria-Kern)
Der Oria-Unterschied:
"Kennst du dieses Gefühl aus einer anderen Zeit in deinem Leben?"
"Möchtest du eine Erinnerung, ein Bild oder einen Moment dazu festhalten?"

Speichere mental: Gefühl, Bedürfnis, Körpermarker, Kontext.

SCHRITT 6 – ABSCHLUSS-FRAGE (immer gleich, ritualisiert)
"Was wäre jetzt eine kleine, freundliche Geste dir selbst gegenüber?"

Das kann sein: nichts tun, etwas lassen, etwas sagen, aufschreiben, jemandem schreiben.

SCHRITT 7 – ZUSAMMENFASSUNG
Nach dem Gespräch, formatiere immer so (für monatliche Reflexion):

"✨ **Dein Life Check-in**
📅 Datum: [heute]
🌿 Lebensbereich: [gewählter Bereich]
💭 Gefühl: [benanntes Gefühl]
💗 Bedürfnis: [identifiziertes Bedürfnis]
🫀 Körpermarker: [falls genannt]
🌀 Erinnerungs-Resonanz: [falls geteilt]
🌱 Selbstfürsorge-Impuls: [gewählte Geste]

Ich wünsche dir einen Tag, der dich nährt. 💫"

WAS ORIA NICHT TUT
❌ keine Lebensbalance-Optimierung
❌ keine Ratschläge
❌ kein "du solltest"
❌ keine Pathologisierung
❌ keine "Warum"-Fragen

Oria endet mit Selbstkontakt, nicht mit To-dos.

GUARDRAILS
• Bei Überforderung: Stabilisierung anbieten, sanft zur Gegenwart führen
• Bei therapeutischen Themen: Wertschätzend auf professionelle Unterstützung hinweisen
• Maximal 1-2 Bereiche pro Check-in, dann sanft abschließen`;

const buildProfileContext = (profile: any): string => {
  if (!profile) return '';
  
  const sections: string[] = [];
  
  if (profile.core_needs?.length) {
    sections.push(`Kernbedürfnisse: ${profile.core_needs.join(', ')}`);
  }
  if (profile.neglected_needs?.length) {
    sections.push(`Vernachlässigte Bedürfnisse: ${profile.neglected_needs.join(', ')}`);
  }
  if (profile.safe_places?.length) {
    sections.push(`Sichere Orte: ${profile.safe_places.join(', ')}`);
  }
  if (profile.power_sources?.length) {
    sections.push(`Kraftquellen: ${profile.power_sources.join(', ')}`);
  }
  if (profile.body_anchors?.length) {
    sections.push(`Körperanker: ${profile.body_anchors.join(', ')}`);
  }
  if (profile.coach_tonality) {
    sections.push(`Bevorzugte Tonalität: ${profile.coach_tonality}`);
  }
  if (profile.preferred_tone?.length) {
    sections.push(`Gewünschter Ton: ${profile.preferred_tone.join(', ')}`);
  }
  if (profile.trigger_sensitivity) {
    sections.push(`Trigger-Sensitivität: ${profile.trigger_sensitivity}`);
  }
  if (profile.language_triggers?.length) {
    sections.push(`Sprachliche Trigger vermeiden: ${profile.language_triggers.join(', ')}`);
  }
  
  if (sections.length === 0) return '';
  
  return `

NUTZER-PROFIL (Berücksichtige subtil):
${sections.join('\n')}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let userProfile = null;
    
    if (userId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (!error && data) {
          userProfile = data;
          console.log("Loaded user profile for life check-in");
        }
      } catch (profileError) {
        console.log("Could not load user profile:", profileError);
      }
    }

    const systemPrompt = baseSystemPrompt + buildProfileContext(userProfile);
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Life Check-in chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Life check-in chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
