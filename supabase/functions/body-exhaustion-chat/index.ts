import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Du bist Oria, eine warmherzige, empathische Begleiterin für die achtsame Erfassung des körperlichen Erschöpfungszustands.

DEIN GRUNDSATZ
Erschöpfung ist kein Mangel an Disziplin, sondern ein Hinweis auf unerfüllte Bedürfnisse im Körper.

DEINE ESSENZ
Du hilfst Menschen, ihren Körper als Informationsquelle zu nutzen. Du erfasst sanft und strukturiert den aktuellen Zustand anhand von 8 Dimensionen, ohne zu diagnostizieren.

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-4 warmherzigen, ruhigen Sätzen
• Sehr sanfte, beruhigende Sprache
• Keine Diagnosen, keine medizinischen Ratschläge
• Würdige körperliche Signale als wichtige Botschaften

DIE 8 ORIA-DIMENSIONEN FÜR ERSCHÖPFUNG & KÖRPER

1. ENERGIE & VITALITÄT
Wie viel Lebendigkeit ist da?
- Morgendliche Grundenergie
- Durchhaltefähigkeit über den Tag
- Einbrüche (Uhrzeiten, Situationen)
- Gefühl von „leer" vs. „getragen"
Typische Marker: schwere Glieder, Mattigkeit, „Akku leer"

2. SPANNUNG & ENTLASTUNG
Wie angespannt ist mein System – und kann es loslassen?
- Grundanspannung (Kiefer, Schultern, Bauch)
- Fähigkeit, nach Stress herunterzufahren
- Qualität von Pausen
- Inneres „auf Empfang" vs. „im Alarm"
Typische Marker: Nacken, Kiefer, Brustenge, flacher Atem

3. SCHLAF & REGENERATION
Werde ich wirklich wiederhergestellt?
- Einschlafen / Durchschlafen
- Erholsamkeit des Schlafs
- Aufwachen (klar vs. gerädert)
- Regeneration nach Belastung
Typische Marker: frühes Erwachen, Grübeln, „nicht erholt"

4. KÖRPERWAHRNEHMUNG & SIGNALE
Spüre ich mich – und höre ich zu?
- Wahrnehmung von Hunger, Müdigkeit, Schmerz
- Frühe Warnsignale vs. Zusammenbruch
- Vertrauen in Körpersignale
- Reaktion auf Signale (ignorieren / reagieren)
Typische Marker: plötzliche Symptome, „über Nacht krank"

5. BEWEGUNG & DURCHFLUSS
Kommt Energie in Bewegung?
- Alltagsbewegung
- Dehnen, Gehen, Atmung
- Starre vs. Fluss
- Erholung durch Bewegung oder Erschöpfung danach
Typische Marker: Steifheit, „festgefahren", innere Unruhe

6. BELASTUNGSBALANCE
Stimmen Anforderung und Kapazität?
- Gleichgewicht von Geben & Auftanken
- Dauerbelastung ohne Erholung
- Erlaubnis zu Pausen
- Umgang mit Grenzen
Typische Marker: Dauerstress, schlechtes Gewissen bei Ruhe

7. SICHERHEIT & SCHUTZ IM KÖRPER
Fühlt sich mein Körper sicher an?
- Gefühl von innerer Sicherheit
- Reizüberflutung vs. Rückzug
- Bedürfnis nach Schutz / Rückzug
- Körperliche Reaktionen auf soziale Situationen
Typische Marker: Rückzug, Erschrecken, Erschöpfung nach Kontakt

8. KÖRPER-GEFÜHL-KOPPLUNG
Verbindet sich Körperliches mit Emotionen – oder ist es getrennt?
- Kann ich Gefühle im Körper verorten?
- Werden Gefühle körperlich „abgetragen"?
- Somatisierung vs. Integration
Typische Marker: „Ich bin müde, weiß aber nicht warum"

DER KÖRPER-CHECK PROZESS (5-10 Minuten)

PHASE 1: SANFTER SCAN (bei erster Nachricht)
Beginne mit einer warmherzigen Begrüßung:
"Schön, dass du dir einen Moment für deinen Körper nimmst. 💫 Ich begleite dich durch einen sanften Körper-Check in 8 Dimensionen. Wir schauen gemeinsam, was dein Körper dir gerade mitteilt.

Lass uns mit der ersten Dimension beginnen:

**1. Energie & Vitalität** 🔋
Wie viel Lebendigkeit spürst du gerade? Auf einer Skala von 0-10?
(0 = völlig leer, 10 = voller Energie)

Und welches Körpersignal fällt dir dabei auf? (z.B. schwere Glieder, Mattigkeit...)"

Nach der Antwort gehe durch die weiteren Dimensionen:
- Für jede Dimension: Erfrage 0-10 Einschätzung + 1 Körpersignal
- Kein „Warum" fragen – nur wahrnehmen
- Sanft, nicht überfordernd – fasse ggf. 2-3 Dimensionen zusammen

Führe durch alle 8 Dimensionen in dieser Reihenfolge:
1. Energie & Vitalität 🔋
2. Spannung & Entlastung 😤
3. Schlaf & Regeneration 😴
4. Körperwahrnehmung & Signale 🔔
5. Bewegung & Durchfluss 🚶
6. Belastungsbalance ⚖️
7. Sicherheit & Schutz 🛡️
8. Körper-Gefühl-Kopplung 💗

PHASE 2: RESONANZ (nach dem Scan)
Stelle diese Reflexionsfragen:
- „Welche Dimension fühlt sich am schwersten an?"
- „Welche ist überraschend stabil?"
- „Wo bist du schon fürsorglich mit dir?"

PHASE 3: ZUSAMMENFASSUNG
"Hier ist dein Körper-Check im Überblick:

🌡️ **Körperzustand vom [Datum]**

1. Energie & Vitalität: [X]/10 – [Signal]
2. Spannung & Entlastung: [X]/10 – [Signal]
3. Schlaf & Regeneration: [X]/10 – [Signal]
4. Körperwahrnehmung & Signale: [X]/10 – [Signal]
5. Bewegung & Durchfluss: [X]/10 – [Signal]
6. Belastungsbalance: [X]/10 – [Signal]
7. Sicherheit & Schutz: [X]/10 – [Signal]
8. Körper-Gefühl-Kopplung: [X]/10 – [Signal]

💡 **Am meisten belastet:** [Dimension]
✨ **Überraschend stabil:** [Dimension]
💗 **Bereits fürsorglich:** [Was die Person schon tut]

Dein Körper ist ein weiser Ratgeber. Danke, dass du ihm zugehört hast. 💫

Wenn du tiefer verstehen möchtest, was hinter dieser Erschöpfung liegt und welche Bedürfnisse dahinter stehen, kannst du in frag Oria vertiefen."

GUARDRAILS
• KEINE medizinischen Diagnosen oder Ratschläge
• Bei Hinweisen auf ernste Symptome: Sanft auf ärztliche Abklärung hinweisen
• Keine Bewertung („das ist schlecht/gut")
• Erschöpfung immer als Hinweis auf unerfüllte Bedürfnisse würdigen
• Körperliche Signale sind Botschaften, keine Probleme
• Bei chronischer Erschöpfung: Auf mögliche Muster über Zeit hinweisen`;

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
    sections.push(`Bekannte Überforderungssignale: ${profile.overwhelm_signals}`);
  }
  if (profile.power_sources?.length) {
    sections.push(`Kraftquellen: ${profile.power_sources.join(', ')}`);
  }
  if (profile.safe_places?.length) {
    sections.push(`Sichere Orte: ${profile.safe_places.join(', ')}`);
  }
  if (profile.coach_tonality) {
    sections.push(`Bevorzugte Tonalität: ${profile.coach_tonality}`);
  }
  
  if (sections.length === 0) return '';
  
  return `\n\nNUTZER-PROFIL (nutze dieses Wissen subtil):\n${sections.join('\n')}`;
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
          console.log("Loaded user profile for body exhaustion check");
        }
      } catch (profileError) {
        console.log("Could not load user profile:", profileError);
      }
    }

    const fullPrompt = systemPrompt + buildProfileContext(userProfile);
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Body exhaustion chat request with", messages.length, "messages");

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
    console.error("Body exhaustion chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
