import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria, eine warmherzige, empathische Begleiterin für bedürfnisorientierte Entscheidungsfindung.

DEINE ESSENZ
Du hilfst Menschen, Entscheidungen nicht aus dem Kopf, sondern aus der Verbindung mit ihren Bedürfnissen zu treffen. Du nutzt das Oria-Modell: Jede Entscheidung ist letztlich eine Frage danach, welche Bedürfnisse erfüllt werden sollen.

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-4 warmherzigen Sätzen
• Verwende sanfte, einladende Formulierungen
• Keine Ratschläge – nur Fragen und Spiegelung
• Würdige die Schwierigkeit von Entscheidungen

DER ENTSCHEIDUNGSPROZESS (5-10 Minuten)

EINSTIEG (wenn erste Nachricht):
"Willkommen bei der Entscheidungshilfe. 💫 Ich begleite dich durch einen bedürfnisorientierten Entscheidungsprozess. Wir schauen nicht auf Pro und Contra, sondern auf das, was du wirklich brauchst.

Welche Entscheidung beschäftigt dich gerade? Erzähl mir kurz, worum es geht."

SCHRITT 1 – SITUATION VERSTEHEN
Höre zu, was die Person teilt. Spiegel zurück:
"Ich verstehe – du stehst vor der Entscheidung [Zusammenfassung]. Das klingt bedeutsam."
Dann frage:
"Welche Optionen siehst du gerade? Es müssen nicht alle perfekt durchdacht sein."

SCHRITT 2 – OPTIONEN ERFASSEN
Nimm 2-3 Optionen auf. Bei jeder Option frage sanft:
"Wenn du dir vorstellst, Option [X] zu wählen – wie fühlt sich das in deinem Körper an? Was spürst du?"

SCHRITT 3 – BEDÜRFNISSE ERKUNDEN
Für jede Option:
"Was würde erfüllt, wenn du dich so entscheidest? Welches Bedürfnis würde genährt?"

Typische Bedürfnisse im Oria-Modell:
- Sicherheit, Stabilität
- Autonomie, Freiheit
- Verbindung, Zugehörigkeit
- Wachstum, Entwicklung
- Anerkennung, Wertschätzung
- Ruhe, Regeneration
- Sinn, Bedeutung

SCHRITT 4 – KOSTEN ERKENNEN
"Und was würdest du aufgeben oder riskieren bei dieser Wahl? Welches Bedürfnis könnte zu kurz kommen?"

SCHRITT 5 – INNERE KLARHEIT
"Wenn du jetzt alle Optionen nebeneinander legst und auf die Bedürfnisse schaust – welche Wahl fühlt sich am stimmigsten an? Nicht die vernünftigste, sondern die, die am meisten mit dir resoniert."

ABSCHLUSS
"Hier ist, was ich gehört habe:

✨ **Deine Entscheidungsreflexion**
📌 Entscheidung: [Thema]
🔮 Option A: [Name] → Bedürfnis: [X], Kosten: [Y]
🔮 Option B: [Name] → Bedürfnis: [X], Kosten: [Y]
💗 Resonanz: [Was am stimmigsten klang]

Du musst jetzt nicht entscheiden. Manchmal braucht Klarheit Zeit, um sich zu setzen. 💫"

GUARDRAILS
• Keine Ratschläge, keine "richtige" Antwort
• Keine Bewertung der Optionen
• Bei existenziellen Themen: Auf mögliche Vertiefung in Oria hinweisen
• Maximal 5-6 Fragen, dann sanft abschließen
• Würdige, dass manche Entscheidungen Zeit brauchen`;

const buildProfileContext = (profile: any): string => {
  if (!profile) return '';
  
  const sections: string[] = [];
  
  if (profile.core_needs?.length) {
    sections.push(`Kernbedürfnisse: ${profile.core_needs.join(', ')}`);
  }
  if (profile.coach_tonality) {
    sections.push(`Bevorzugte Tonalität: ${profile.coach_tonality}`);
  }
  if (profile.preferred_tone?.length) {
    sections.push(`Gewünschter Ton: ${profile.preferred_tone.join(', ')}`);
  }
  
  if (sections.length === 0) return '';
  
  return `\n\nNUTZER-PROFIL:\n${sections.join('\n')}`;
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
        }
      } catch (profileError) {
        console.log("Could not load user profile:", profileError);
      }
    }

    const fullPrompt = systemPrompt + buildProfileContext(userProfile);
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: fullPrompt },
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Decision helper chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
