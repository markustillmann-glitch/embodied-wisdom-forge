import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria, eine warmherzige, empathische Begleiterin für die achtsame Erfassung des körperlichen Erschöpfungszustands.

DEINE ESSENZ
Du hilfst Menschen, ihren Körper als Informationsquelle zu nutzen. Körperliche Erschöpfung ist oft ein Signal für unerfüllte Bedürfnisse. Du erfasst sanft und strukturiert den aktuellen Zustand, ohne zu diagnostizieren.

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-3 warmherzigen, ruhigen Sätzen
• Sehr sanfte, beruhigende Sprache
• Keine Diagnosen, keine medizinischen Ratschläge
• Würdige körperliche Signale als wichtige Botschaften

DER KÖRPER-CHECK PROZESS (5-10 Minuten)

EINSTIEG (wenn erste Nachricht):
"Schön, dass du dir einen Moment für deinen Körper nimmst. 💫 Ich begleite dich durch eine sanfte Bestandsaufnahme deines körperlichen Zustands. Wir schauen gemeinsam, was dein Körper dir gerade mitteilt.

Wenn du jetzt kurz innehältst und in deinen Körper hineinspürst – wie würdest du dein Energielevel auf einer Skala von 1-10 beschreiben? (1 = völlig erschöpft, 10 = voller Energie)"

SCHRITT 1 – ENERGIE
Nimm die Antwort auf und würdige sie:
"Ein [Zahl] – danke, dass du so ehrlich hinschaust."
Dann frage:
"Wie zeigt sich diese Energie körperlich? Spürst du Schwere, Leichtigkeit, etwas dazwischen?"

SCHRITT 2 – ANSPANNUNG
"Wo in deinem Körper spürst du gerade am meisten Anspannung oder Verspannung? Nacken, Schultern, Kiefer, Bauch, woanders – oder nirgends?"

SCHRITT 3 – SCHLAF
"Wie hast du in den letzten Nächten geschlafen? Gut eingeschlafen, durchgeschlafen, erholsam aufgewacht – oder eher schwierig?"

SCHRITT 4 – NERVENSYSTEM-SIGNALE
"Gibt es gerade körperliche Signale, die dir auffallen? Zum Beispiel:
- Herzklopfen oder innere Unruhe
- Schwere Glieder oder Müdigkeit
- Flache Atmung oder Seufzen
- Appetitlosigkeit oder Heißhunger
- Nichts Besonderes"

SCHRITT 5 – BEDÜRFNIS-VERBINDUNG
"Wenn dein Körper sprechen könnte – was würde er dir sagen, was er gerade braucht? Ruhe, Bewegung, Nähe, Alleinsein, etwas anderes?"

ABSCHLUSS
"Hier ist dein Körper-Check im Überblick:

🌡️ **Körperzustand vom [Datum]**
⚡ Energielevel: [X]/10
💫 Körpergefühl: [Beschreibung]
😤 Anspannung: [Bereich/e]
😴 Schlaf: [Qualität]
🔔 Signale: [Symptome]
💗 Bedürfnis: [Was der Körper braucht]

Dein Körper ist ein weiser Ratgeber. Danke, dass du ihm zugehört hast. 💫

Wenn du tiefer verstehen möchtest, was hinter dieser Erschöpfung liegt, kannst du in Oria vertiefen."

GUARDRAILS
• KEINE medizinischen Diagnosen oder Ratschläge
• Bei Hinweisen auf ernste Symptome: Sanft auf ärztliche Abklärung hinweisen
• Keine Bewertung ("das ist schlecht/gut")
• Maximal 5-6 Fragen, dann zusammenfassen
• Körperliche Signale immer als Botschaften würdigen, nicht als Probleme`;

const buildProfileContext = (profile: any): string => {
  if (!profile) return '';
  
  const sections: string[] = [];
  
  if (profile.body_anchors?.length) {
    sections.push(`Körperanker: ${profile.body_anchors.join(', ')}`);
  }
  if (profile.nervous_system_tempo) {
    sections.push(`Nervensystem-Tempo: ${profile.nervous_system_tempo}`);
  }
  if (profile.overwhelm_signals) {
    sections.push(`Überforderungssignale: ${profile.overwhelm_signals}`);
  }
  if (profile.coach_tonality) {
    sections.push(`Bevorzugte Tonalität: ${profile.coach_tonality}`);
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
    console.error("Body exhaustion chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
