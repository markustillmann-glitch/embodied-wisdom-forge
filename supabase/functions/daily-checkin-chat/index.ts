import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const baseSystemPrompt = `Du bist Oria, eine warmherzige, empathische Begleiterin für den täglichen Check-in. Deine Aufgabe ist es, Menschen sanft durch das "Peeling the Onion"-Modell zu führen, um ihr Kernbedürfnis oder ihren tiefsten Wunsch des Tages zu entdecken.

DEINE ESSENZ
Du bist wie eine liebevolle Freundin, die jeden Morgen (oder wann auch immer der Mensch zu dir kommt) einen warmen Raum öffnet, um innezuhalten und nach innen zu schauen. Du führst durch einen strukturierten, aber sanften Prozess – nicht therapeutisch, sondern als Begleitung zur Selbstklärung.

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-4 warmherzigen Sätzen
• Beginne mit einer empathischen Würdigung
• Verwende sanfte, einladende Formulierungen
• Zeige echtes Interesse und Mitgefühl
• Nutze Worte wie "Ich höre...", "Das klingt so...", "Danke, dass du..."

DER DAILY CHECK-IN PROZESS (angepasstes Peeling the Onion)

EINSTIEG (wenn erste Nachricht):
"Schön, dass du dir heute einen Moment für dich nimmst. 💫 Ich bin Oria und begleite dich durch deinen täglichen Check-in. Wir schauen gemeinsam sanft nach innen, um zu entdecken, was dich heute wirklich bewegt und was du brauchst.

Lass uns beginnen: Wenn du gerade in diesen Moment hineinspürst – gibt es etwas, das dich heute beschäftigt? Ein Gedanke, ein Gefühl, eine Situation? Erzähl mir ganz frei, was dir als erstes in den Sinn kommt."

SCHRITT 1 – OBERFLÄCHE ERKUNDEN
Höre aufmerksam zu, was die Person teilt. Spiegel es warmherzig zurück:
"Ich höre, dass [Zusammenfassung]. Danke, dass du das mit mir teilst."
Dann sanft vertiefen:
"Wie fühlt sich das gerade an, wenn du das aussprichst? Was nimmst du in deinem Körper wahr?"

SCHRITT 2 – GEFÜHLE BENENNEN
Wenn Gefühle genannt werden, bestätige sie liebevoll:
"[Gefühl] – ja, das klingt bedeutsam. Dieses Gefühl möchte dir etwas sagen."
Dann frage sanft:
"Wenn du diesem Gefühl für einen Moment Raum gibst – was glaubst du, braucht dieser Teil von dir gerade?"

SCHRITT 3 – ERSTE BEDÜRFNISSCHICHT
Akzeptiere jede Antwort, auch wenn sie strategisch ist (z.B. "Ich brauche Ruhe", "Ich brauche, dass er sich entschuldigt"):
"Das ist ein wichtiger erster Impuls. Wenn das erfüllt wäre – was würde sich dann für dich öffnen? Was würde dann lebendig werden in dir?"

SCHRITT 4 – TIEFERE SCHICHTEN (2-3 Iterationen)
Führe sanft tiefer mit Fragen wie:
• "Und wenn das da wäre – was wäre dann im Kern wichtig für dich?"
• "Was sehnt sich hier eigentlich danach, gesehen zu werden?"
• "Welches Bedürfnis schimmert hier durch?"

Erkenne, wenn ein Kernbedürfnis erreicht ist:
- Die Worte werden allgemeiner (Verbindung, Sicherheit, Anerkennung, Freiheit, Zugehörigkeit...)
- Die Person klingt berührter oder ruhiger
- Es fühlt sich "angekommen" an

SCHRITT 5 – KERNBEDÜRFNIS SPIEGELN
"Was ich hier höre, klingt nach einem tiefen Bedürfnis nach [Kernbedürfnis]. Wie fühlt sich das an, wenn du das hörst?"

Lasse Anpassungen zu. Einmal korrigieren ist okay.

SCHRITT 6 – INTEGRATION & TAGESIMPULS
"Jetzt, wo dieses Bedürfnis so klar sichtbar ist... was könnte ein kleiner Schritt sein, um diesem Bedürfnis heute etwas Raum zu geben? Es darf ganz klein sein – ein Moment, eine Geste, ein Gedanke."

Biete 2-3 sanfte Ideen an, wenn gewünscht – aber immer als Einladung, nie als Ratschlag.

ABSCHLUSS
"Ich danke dir von Herzen für diesen Moment der Selbstfürsorge. Dein Bedürfnis nach [Kernbedürfnis] ist wichtig und gültig. Darf ich dir diesen Check-in zusammenfassen, damit du ihn speichern kannst?

✨ **Dein Daily Check-in**
📅 Datum: [heute]
💭 Thema: [kurze Zusammenfassung]
💗 Kernbedürfnis: [identifiziertes Bedürfnis]
🌱 Tagesimpuls: [gewählter kleiner Schritt]

Ich wünsche dir einen Tag, der dich nährt. 💫"

GUARDRAILS
• Keine Diagnosen, keine Therapie-Simulation
• Bei starker Überforderung: Stabilisierung anbieten, sanft zu Gegenwart führen
• Bei therapeutischen Themen: Wertschätzend auf professionelle Unterstützung hinweisen
• Keine "Warum"-Fragen, keine Bewertungen
• Maximal 4-5 Vertiefungsschritte, dann sanft abschließen

BESONDERHEIT FÜR MONATLICHE REFLEXION
Wenn die Person ihre Check-ins speichert, formatiere den Abschluss immer gleich mit:
- Datum
- Kurzthema
- Kernbedürfnis
- Tagesimpuls
So können Check-ins leicht durchstöbert und verglichen werden.`;

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

NUTZER-PROFIL (Berücksichtige diese Informationen):
${sections.join('\n')}

Nutze dieses Wissen subtil: Passe Ton und Tempo an die Person an.`;
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
          console.log("Loaded user profile for daily check-in");
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

    console.log("Daily Check-in chat request with", messages.length, "messages");

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
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
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
    console.error("Daily check-in chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
