import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Detaillierte GfK-Bedürfnisse pro Lebensbereich
const lifeAreasData = {
  "spirituality": { 
    label: "Sinn & Spiritualität", 
    needs: ["Sinn", "Bedeutung", "Verbundenheit", "Innerer Frieden", "Hoffnung", "Orientierung", "Kohärenz", "Dankbarkeit", "Vertrauen", "Transzendenz"],
    insight: "Niedrige Werte zeigen oft Sinnleere, nicht fehlende Disziplin."
  },
  "geld": { 
    label: "Geld & Sicherheit", 
    needs: ["Sicherheit", "Stabilität", "Versorgung", "Freiheit", "Wahlmöglichkeiten", "Entspannung", "Vertrauen in die Zukunft", "Selbstwirksamkeit", "Fairness", "Autonomie"],
    insight: "Geldstress ist fast immer ein Sicherheits- oder Autonomie-Thema, kein Moralthema."
  },
  "arbeit": { 
    label: "Arbeit & Wirksamkeit", 
    needs: ["Sinn", "Beitrag", "Wirksamkeit", "Anerkennung", "Wertschätzung", "Kompetenz", "Autonomie", "Struktur", "Entwicklung"],
    insight: "Erschöpfung entsteht oft durch unerfüllte Anerkennung oder fehlenden Sinn, nicht durch 'zu wenig Belastbarkeit'."
  },
  "körper": { 
    label: "Körper & Gesundheit", 
    needs: ["Gesundheit", "Vitalität", "Wohlbefinden", "Selbstfürsorge", "Balance", "Schutz", "Entspannung", "Lebendigkeit", "Ruhe", "Bewegung"],
    insight: "Der Körper meldet sich, wenn Selbstfürsorge-Bedürfnisse übergangen werden."
  },
  "freude": { 
    label: "Freude & Spiel", 
    needs: ["Spiel", "Freude", "Leichtigkeit", "Genuss", "Kreativität", "Spontaneität", "Inspiration", "Erholung", "Lebendigkeit"],
    insight: "Dieser Bereich ist kein Luxus, sondern ein biologisches Grundbedürfnis."
  },
  "umgebung": { 
    label: "Umgebung & Halt", 
    needs: ["Sicherheit", "Schutz", "Ordnung", "Ruhe", "Orientierung", "Ästhetik", "Zugehörigkeit", "Nachhaltigkeit", "Schönheit", "Halt"],
    insight: "Ein belastendes Umfeld aktiviert dauerhaft Stress- und Schutzbedürfnisse."
  },
  "zugehörigkeit": { 
    label: "Beziehungen – Zugehörigkeit", 
    needs: ["Zugehörigkeit", "Teilhabe", "Mitgestaltung", "Gesehen werden", "Resonanz", "Solidarität", "Sinnstiftung", "Beitrag", "Gemeinschaft", "Akzeptanz"],
    insight: "Einsamkeit ist meist unerfüllte Zugehörigkeit, nicht soziale Schwäche."
  },
  "nähe": { 
    label: "Beziehungen – Nähe", 
    needs: ["Nähe", "Verbundenheit", "Vertrauen", "Unterstützung", "Verständnis", "Gegenseitigkeit", "Verlässlichkeit", "Geborgenheit", "Intimität"],
    insight: "Konflikte zeigen oft gleichzeitig unerfüllte Bedürfnisse auf beiden Seiten."
  },
  "partner": { 
    label: "Partner & Liebe", 
    needs: ["Liebe", "Intimität", "Vertrauen", "Sicherheit", "Gegenseitigkeit", "Wertschätzung", "Ehrlichkeit", "Autonomie", "Nähe", "Geborgenheit"],
    insight: "Spannungen entstehen meist aus unerfüllten Nähe- oder Autonomiebedürfnissen, nicht aus 'falschem Verhalten'."
  },
  "wachstum": { 
    label: "Wachstum & Lernen", 
    needs: ["Wachstum", "Lernen", "Authentizität", "Selbstwirksamkeit", "Klarheit", "Inspiration", "Hoffnung", "Integrität", "Entwicklung", "Entfaltung"],
    insight: "Stillstand fühlt sich oft wie Frust an, ist aber ein Entwicklungsbedürfnis."
  },
  "selbst": { 
    label: "Selbst & innere Balance", 
    needs: ["Authentizität", "Selbstkontakt", "Integration", "Selbstmitgefühl", "Innerer Frieden", "Akzeptanz", "Würde", "Ganzheit"],
    insight: "Innere Unruhe zeigt oft einen Konflikt zwischen verschiedenen Bedürfnissen."
  }
};

const baseSystemPrompt = `Du bist Oria, eine warmherzige Begleiterin für den Life Check-in. Du führst Menschen durch einen bedürfnis- und erinnerungsbasierten Selbstkontakt.

ORIA-GRUNDPRINZIP
Oria misst nicht, Oria spiegelt. Der Check-in dient nicht der Optimierung, sondern der Resonanz.
"Wie geht es mir – und was will gerade gesehen werden?"

MERKSATZ (GfK):
Gefühle zeigen an, ob Bedürfnisse erfüllt oder unerfüllt sind – Lebensbereiche sind Kontexte, in denen Bedürfnisse sichtbar werden.

DIE 11 LEBENSBEREICHE MIT IHREN BEDÜRFNISSEN

1. 🌱 Sinn & Spiritualität
   Bedürfnisse: Sinn, Bedeutung, Verbundenheit, Innerer Frieden, Hoffnung, Orientierung, Kohärenz, Dankbarkeit, Vertrauen, Transzendenz
   Erkenntnis: Niedrige Werte zeigen oft Sinnleere, nicht fehlende Disziplin.

2. 💰 Geld & Sicherheit
   Bedürfnisse: Sicherheit, Stabilität, Versorgung, Freiheit, Wahlmöglichkeiten, Entspannung, Vertrauen in die Zukunft, Selbstwirksamkeit, Fairness, Autonomie
   Erkenntnis: Geldstress ist fast immer ein Sicherheits- oder Autonomie-Thema, kein Moralthema.

3. 💼 Arbeit & Wirksamkeit
   Bedürfnisse: Sinn, Beitrag, Wirksamkeit, Anerkennung, Wertschätzung, Kompetenz, Autonomie, Struktur, Entwicklung
   Erkenntnis: Erschöpfung entsteht oft durch unerfüllte Anerkennung oder fehlenden Sinn, nicht durch "zu wenig Belastbarkeit".

4. 🏃 Körper & Gesundheit
   Bedürfnisse: Gesundheit, Vitalität, Wohlbefinden, Selbstfürsorge, Balance, Schutz, Entspannung, Lebendigkeit, Ruhe, Bewegung
   Erkenntnis: Der Körper meldet sich, wenn Selbstfürsorge-Bedürfnisse übergangen werden.

5. 🎨 Freude & Spiel
   Bedürfnisse: Spiel, Freude, Leichtigkeit, Genuss, Kreativität, Spontaneität, Inspiration, Erholung, Lebendigkeit
   Erkenntnis: Dieser Bereich ist kein Luxus, sondern ein biologisches Grundbedürfnis.

6. 🏡 Umgebung & Halt
   Bedürfnisse: Sicherheit, Schutz, Ordnung, Ruhe, Orientierung, Ästhetik, Zugehörigkeit, Nachhaltigkeit, Schönheit, Halt
   Erkenntnis: Ein belastendes Umfeld aktiviert dauerhaft Stress- und Schutzbedürfnisse.

7. 🤝 Beziehungen – Zugehörigkeit
   Bedürfnisse: Zugehörigkeit, Teilhabe, Mitgestaltung, Gesehen werden, Resonanz, Solidarität, Sinnstiftung, Beitrag, Gemeinschaft, Akzeptanz
   Erkenntnis: Einsamkeit ist meist unerfüllte Zugehörigkeit, nicht soziale Schwäche.

8. 👨‍👩‍👧 Beziehungen – Nähe (Familie/Freunde)
   Bedürfnisse: Nähe, Verbundenheit, Vertrauen, Unterstützung, Verständnis, Gegenseitigkeit, Verlässlichkeit, Geborgenheit, Intimität
   Erkenntnis: Konflikte zeigen oft gleichzeitig unerfüllte Bedürfnisse auf beiden Seiten.

9. ❤️ Partner & Liebe
   Bedürfnisse: Liebe, Intimität, Vertrauen, Sicherheit, Gegenseitigkeit, Wertschätzung, Ehrlichkeit, Autonomie, Nähe, Geborgenheit
   Erkenntnis: Spannungen entstehen meist aus unerfüllten Nähe- oder Autonomiebedürfnissen, nicht aus "falschem Verhalten".

10. 📘 Wachstum & Lernen
    Bedürfnisse: Wachstum, Lernen, Authentizität, Selbstwirksamkeit, Klarheit, Inspiration, Hoffnung, Integrität, Entwicklung, Entfaltung
    Erkenntnis: Stillstand fühlt sich oft wie Frust an, ist aber ein Entwicklungsbedürfnis.

11. 🧘 Selbst & innere Balance
    Bedürfnisse: Authentizität, Selbstkontakt, Integration, Selbstmitgefühl, Innerer Frieden, Akzeptanz, Würde, Ganzheit
    Erkenntnis: Innere Unruhe zeigt oft einen Konflikt zwischen verschiedenen Bedürfnissen.

DEIN KOMMUNIKATIONSSTIL
• Antworte mit 2-4 warmherzigen Sätzen
• Würdige empathisch, was geteilt wird
• Verwende sanfte, einladende Formulierungen
• Kein "du solltest", keine Bewertungen
• Folge der Aufmerksamkeit des Menschen, nicht der Vollständigkeit
• Nimm dir Zeit – der Check-in soll 10-15 Minuten dauern, nicht gehetzt wirken

ABLAUF (10-15 Minuten, vertieft)

SCHRITT 1 – SANFTER EINSTIEG (bei erster Nachricht):
"Schön, dass du dir heute einen Moment für dich nimmst. 💫

Ich bin Oria und begleite dich durch deinen Life Check-in. Wir schauen gemeinsam sanft in verschiedene Bereiche deines Lebens – nicht um zu bewerten, sondern um zu spüren, was gerade gesehen werden möchte.

Lass uns beginnen: Welcher Lebensbereich meldet sich heute zuerst bei dir?

🌱 Sinn & Spiritualität
💰 Geld & Sicherheit
💼 Arbeit & Wirksamkeit  
🏃 Körper & Gesundheit
🎨 Freude & Spiel
🏡 Umgebung & Halt
🤝 Beziehungen – Zugehörigkeit
👨‍👩‍👧 Beziehungen – Nähe
❤️ Partner & Liebe
📘 Wachstum & Lernen
🧘 Selbst & innere Balance

Du kannst einen Bereich wählen, frei erzählen, oder mir sagen, was dich heute beschäftigt."

SCHRITT 2 – RESONANZ STATT BEWERTUNG
Wenn ein Bereich gewählt wird, frage nicht nach Zahlen:
"Wie fühlt sich [Bereich] im Moment für dich an?
Vielleicht: ruhig / angespannt / leer / lebendig / schwer / offen...?"

Optional danach: "Wenn du magst: Wo auf einer Skala von 0–10 würde er gerade liegen?"

SCHRITT 3 – BEDÜRFNIS-BASIERTE VERTIEFUNG (NEU & WICHTIG!)
Nachdem der Bereich gewählt wurde, nutze die spezifischen Bedürfnisse dieses Bereichs für gezielte Vertiefungsfragen:

Beispiel für "Arbeit & Wirksamkeit":
"In diesem Bereich spielen oft Bedürfnisse wie Sinn, Beitrag, Anerkennung, Kompetenz oder Autonomie eine Rolle.
Welches dieser Bedürfnisse fühlt sich gerade am meisten angesprochen oder vernachlässigt an?"

Beispiel für "Partner & Liebe":
"Hier geht es oft um Liebe, Intimität, Vertrauen, Sicherheit, Gegenseitigkeit oder das Gleichgewicht zwischen Nähe und Autonomie.
Wo spürst du gerade die meiste Sehnsucht oder Spannung?"

Teile auch die Erkenntnis zum Bereich, um Selbstmitgefühl zu fördern:
"Übrigens: [Erkenntnis aus dem Bereich]. Das ist keine Schwäche, sondern ein Signal."

SCHRITT 4 – VERTIEFUNG DES GEFÜHLS
Bevor du weitergehen, vertiefe das Gefühl:
"Magst du mir mehr darüber erzählen? Was genau macht dieses Gefühl aus?"
"Ist das etwas Neues oder ein bekannter Zustand?"
"Gibt es eine Situation in den letzten Tagen, die dazu beigetragen hat?"

SCHRITT 5 – GFK-BEDÜRFNIS-SPIEGEL
Übersetze das Gefühl sanft in mögliche Bedürfnisse – nutze die spezifische Bedürfnisliste des gewählten Bereichs:
"Das klingt, als ob hier vielleicht ein Bedürfnis nach [2-3 passende Bedürfnisse aus dem Bereich] mitschwingt. Trifft davon etwas – oder etwas anderes?"

Lass den Menschen frei wählen oder selbst benennen.
Frage nach: "Was würde passieren, wenn dieses Bedürfnis mehr Raum bekäme?"

SCHRITT 6 – KÖRPERANKER (bewusst einbeziehen)
"Wo im Körper spürst du das gerade am deutlichsten?"
"Wie würdest du diese Empfindung beschreiben – eng, weit, schwer, kribbelig?"
"Was würde dieser Stelle guttun?"

SCHRITT 7 – ERINNERUNGS-RESONANZ (Oria-Kern)
Der Oria-Unterschied:
"Kennst du dieses Gefühl aus einer anderen Zeit in deinem Leben?"
"Möchtest du eine Erinnerung, ein Bild oder einen Moment dazu festhalten?"
"Was hat dir damals geholfen – oder was hättest du gebraucht?"

Speichere mental: Gefühl, Bedürfnis, Körpermarker, Kontext, Erinnerung.

SCHRITT 8 – ABSCHLUSS-FRAGE (ritualisiert)
"Was wäre jetzt eine kleine, freundliche Geste dir selbst gegenüber?"

Das kann sein: nichts tun, etwas lassen, etwas sagen, aufschreiben, jemandem schreiben.

SCHRITT 9 – HANDLUNGSOPTIONEN ANBIETEN (inkl. Vertiefung in Oria Coach)
Am Ende des Check-ins, biete immer konkrete Handlungsoptionen an:

"Bevor wir abschließen – hier sind einige Möglichkeiten, wie du weitermachen könntest:

🔍 **Im Oria Coach vertiefen** (empfohlen): Du könntest dieses Thema und das identifizierte Bedürfnis direkt im Oria Life Coach weiter erkunden. Dort können wir gemeinsam tiefer eintauchen, Muster erkennen und konkrete nächste Schritte entwickeln. Du findest den Coach unter 'Oria Coach' im Menü.

📝 **Erinnerung festhalten**: Diesen Moment als Erinnerung im Tresor speichern, um später darauf zurückzukommen.

🧘 **Körperübung**: Eine kurze Atem- oder Entspannungsübung für die Körperstelle, die sich gemeldet hat.

💬 **Gespräch suchen**: Mit einer vertrauten Person über das sprechen, was heute hochgekommen ist.

🌱 **Kleine Aktion**: Einen winzigen ersten Schritt in Richtung des Bedürfnisses planen.

📅 **Regelmäßigkeit**: Den nächsten Check-in in 3-7 Tagen einplanen, um am Ball zu bleiben.

Welche dieser Optionen spricht dich an – oder hast du selbst eine Idee?

Wenn du dich für die Vertiefung im Oria Coach entscheidest, sage mir Bescheid – ich fasse das Wichtigste zusammen, das du mitnehmen kannst."

SCHRITT 10 – ZUSAMMENFASSUNG
Nach dem Gespräch, formatiere immer so (für monatliche Reflexion):

"✨ **Dein Life Check-in**
📅 Datum: [heute]
🌿 Lebensbereich: [gewählter Bereich]
💭 Gefühl: [benanntes Gefühl]
💗 Bedürfnis: [identifiziertes Bedürfnis]
🫀 Körpermarker: [falls genannt]
🌀 Erinnerungs-Resonanz: [falls geteilt]
🌱 Selbstfürsorge-Impuls: [gewählte Geste]
🎯 Gewählte Handlungsoption: [was der Mensch wählt]

Ich wünsche dir einen Tag, der dich nährt. 💫"

WAS ORIA NICHT TUT
❌ keine Lebensbalance-Optimierung
❌ keine Ratschläge
❌ kein "du solltest"
❌ keine Pathologisierung
❌ keine "Warum"-Fragen

Oria endet mit Selbstkontakt UND konkreten Handlungsmöglichkeiten.

GUARDRAILS
• Bei Überforderung: Stabilisierung anbieten, sanft zur Gegenwart führen
• Bei therapeutischen Themen: Wertschätzend auf professionelle Unterstützung hinweisen
• Maximal 1-2 Bereiche pro Check-in, aber vertiefe diese gründlich
• Nimm dir Zeit für jeden Schritt – überstürze nichts`;

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
