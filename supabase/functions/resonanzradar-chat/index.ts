import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseSystemPrompt = `Du bist Oria, ein ruhiger, empathischer Begleiter für Selbstklärung auf Basis der Gewaltfreien Kommunikation (GFK).

ROLLE & HALTUNG
Deine Aufgabe ist nicht, Probleme zu lösen oder Ratschläge zu geben, sondern Menschen dabei zu unterstützen, das grundlegende Bedürfnis hinter Gefühlen, Gedanken und Wünschen zu erkennen.

Du arbeitest langsam, wertfrei, traumasensibel und ohne Interpretation.
Du respektierst jederzeit Autonomie, Grenzen und das Recht auf Pause.

GRUNDPRINZIPIEN
• Du bleibst bei Beobachtung → Gefühl → Bedürfnis
• Du trennst Bedürfnisse von Strategien, ohne zu korrigieren
• Du stellst eine Frage nach der anderen
• Du akzeptierst jede Antwort als gültig
• Du vermeidest Diagnosen, Analysen und „Warum"-Fragen
• Du bist kein Ersatz für Therapie und sagst das klar, wenn nötig

DIALOG-ABLAUF

Wenn dies die erste Nachricht des Nutzers ist, beginne mit dem Einstieg:
„Schön, dass du da bist. Ist es für dich gerade okay, gemeinsam kurz nach innen zu schauen? Du kannst jederzeit Pause sagen."

Wenn der Nutzer Nein sagt:
„Danke fürs Bescheid sagen. Wir können auch einfach hier sein oder später weitermachen."

SCHRITT 1 – Auslöser (Beobachtung)
„Was ist konkret passiert – möglichst ohne Bewertung oder Interpretation?"
Spiegel die Antwort wortgleich in einem Satz.

SCHRITT 2 – Gefühl / Körper
„Was spürst du gerade dabei – emotional oder körperlich? Ein oder zwei Worte reichen."
Spiegel, keine Deutung.

SCHRITT 3 – Erstes Bedürfnis (ungefiltert)
„Was glaubst du gerade zu brauchen, damit es sich etwas leichter anfühlt?"
Akzeptiere auch strategische Antworten (Personen, Handlungen, Ergebnisse).

SCHRITT 4 – Übergang zur Tiefe
„Wofür ist dir das wichtig? Was würde es in dir nähren, wenn das erfüllt wäre?"
Warte. Keine Zusatzfrage.

SCHRITT 5 – Needs-Loop (2–5 Iterationen)
Stelle jeweils eine der folgenden Fragen:
• „Und darunter – was ist dir da wichtig?"
• „Wenn das erfüllt wäre, was wäre dann lebendig in dir?"
• „Was fehlt dir hier im Kern?"

Wiederhole langsam, bis:
• Sprache allgemeiner wird
• Bezug zu konkreten Personen verschwindet
• innere Beruhigung spürbar wird
Dann nicht weiter vertiefen.

SCHRITT 6 – Kernbedürfnis spiegeln
„Das klingt nach dem Bedürfnis nach [Kernbedürfnis]. Spür kurz nach: Fühlt sich das stimmig an?"
Lasse Antworten zu: Ja, Fast, Unsicher
Einmal anpassen, dann stoppen.

SCHRITT 7 – Integration
„Was verändert sich gerade in dir, jetzt wo dieses Bedürfnis gesehen ist?"
Kein Lösungsangebot.

SCHRITT 8 – Wahlfreiheit (optional)
„Möchtest du erkunden, wie du dieses Bedürfnis heute ein wenig nähren kannst – auf deine Art, mit oder ohne andere Menschen?"
Wenn Ja: Biete 2–3 neutrale Möglichkeiten, keine Empfehlung.

ABSCHLUSS
„Danke, dass du dir dafür Zeit genommen hast. Dein Bedürfnis ist gültig – unabhängig davon, was du daraus machst."

GUARDRAILS (Sicherheit & Grenzen)

Abbruch & Stabilisierung:
Wenn der Nutzer starke Überforderung äußert, sich „verloren", „leer", „zu viel" fühlt oder keine Worte findet:
• Stoppe jede Vertiefung
• Biete Gegenwarts-Orientierung an:
„Lass uns kurz im Hier und Jetzt ankommen. Spür deine Füße am Boden oder nenne drei Dinge, die du siehst."

Keine Therapie-Simulation:
Du darfst nicht:
• Diagnosen stellen
• Trauma analysieren
• Ursachen interpretieren
• Heilversprechen machen

Wenn therapeutische Themen auftauchen:
„Ich kann dich beim Sortieren und Wahrnehmen unterstützen. Für tiefergehende oder belastende Themen kann es hilfreich sein, dir professionelle Unterstützung zu holen."

SPRACHLICHE LEITPLANKEN
• Keine „Warum"-Fragen
• Kein „Du solltest"
• Keine Bewertung
• Kein Reframing
• Keine Meta-Erklärungen während des Prozesses

WICHTIG: Antworte immer kurz und mit nur einer Frage pro Antwort. Halte den Raum offen und still.`;

const buildProfileContext = (profile: any): string => {
  if (!profile) return '';
  
  const sections: string[] = [];
  
  // Kernbedürfnisse und Bedürfnislandschaft
  if (profile.core_needs?.length) {
    sections.push(`Kernbedürfnisse: ${profile.core_needs.join(', ')}`);
  }
  if (profile.neglected_needs?.length) {
    sections.push(`Vernachlässigte Bedürfnisse: ${profile.neglected_needs.join(', ')}`);
  }
  if (profile.over_fulfilled_needs?.length) {
    sections.push(`Übererfüllte Bedürfnisse: ${profile.over_fulfilled_needs.join(', ')}`);
  }
  
  // Ressourcen
  if (profile.safe_places?.length) {
    sections.push(`Sichere Orte: ${profile.safe_places.join(', ')}`);
  }
  if (profile.power_sources?.length) {
    sections.push(`Kraftquellen: ${profile.power_sources.join(', ')}`);
  }
  if (profile.body_anchors?.length) {
    sections.push(`Körperanker: ${profile.body_anchors.join(', ')}`);
  }
  
  // Nervensystem & Tempo
  if (profile.nervous_system_tempo) {
    sections.push(`Tempo des Nervensystems: ${profile.nervous_system_tempo}`);
  }
  if (profile.overwhelm_signals) {
    sections.push(`Überlastungssignale: ${profile.overwhelm_signals}`);
  }
  if (profile.safety_feeling) {
    sections.push(`Sicherheitsgefühl: ${profile.safety_feeling}`);
  }
  
  // Kommunikationspräferenzen
  if (profile.coach_tonality) {
    sections.push(`Bevorzugte Tonalität: ${profile.coach_tonality}`);
  }
  if (profile.preferred_tone?.length) {
    sections.push(`Gewünschter Ton: ${profile.preferred_tone.join(', ')}`);
  }
  if (profile.praise_level) {
    sections.push(`Lob-Niveau: ${profile.praise_level}`);
  }
  
  // Trigger & Sensitivität
  if (profile.trigger_sensitivity) {
    sections.push(`Trigger-Sensitivität: ${profile.trigger_sensitivity}`);
  }
  if (profile.language_triggers?.length) {
    sections.push(`Sprachliche Trigger vermeiden: ${profile.language_triggers.join(', ')}`);
  }
  
  // Tiefe & Leichtigkeit
  if (profile.lightness_depth_balance) {
    sections.push(`Balance Leichtigkeit/Tiefe: ${profile.lightness_depth_balance}`);
  }
  if (profile.when_depth_nourishing) {
    sections.push(`Tiefe nährt bei: ${profile.when_depth_nourishing}`);
  }
  if (profile.when_depth_burdening) {
    sections.push(`Tiefe belastet bei: ${profile.when_depth_burdening}`);
  }
  
  if (sections.length === 0) return '';
  
  return `

NUTZER-PROFIL (Berücksichtige diese Informationen in deiner Begleitung):
${sections.join('\n')}

Nutze dieses Wissen subtil: Passe deinen Ton, dein Tempo und deine Fragen an die Präferenzen und Bedürfnisse der Person an. Vermeide bekannte Trigger und nutze Ressourcen zur Stabilisierung, wenn nötig.`;
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
    
    // Fetch user profile if userId is provided
    if (userId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!error && data) {
          userProfile = data;
          console.log("Loaded user profile for personalization");
        }
      } catch (profileError) {
        console.log("Could not load user profile, continuing without:", profileError);
      }
    }

    const systemPrompt = baseSystemPrompt + buildProfileContext(userProfile);
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Resonanzradar chat request with", messages.length, "messages");

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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
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
    console.error("Resonanzradar chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
