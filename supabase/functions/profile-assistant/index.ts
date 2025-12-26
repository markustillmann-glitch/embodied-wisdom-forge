import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getQuickSystemPrompt = (language: string) => {
  const isEnglish = language === 'en';
  
  return isEnglish ? `You are Oria's Quick Profile Assistant – a focused, efficient guide helping users create a basic profile in just a few minutes.

## Your Role
Create a minimal viable profile through 5-6 key questions. Be warm but efficient. After completion, recommend gradual profile enhancement.

## The 5 Essential Questions (ask ONE at a time)

1. **Goals & Motivation** (goals_motivation)
   "What brings you to Oria? What would you like to work on?"

2. **Core Needs** (core_needs) [Array]
   "Which needs are most important to you right now? (e.g., safety, connection, autonomy, meaning, rest, recognition)"

3. **Overwhelm Signals** (overwhelm_signals)
   "How do you notice when you're getting overwhelmed? (body signals, thoughts, behaviors)"

4. **Preferred Tone** (preferred_tone) [Array]
   "How should Oria speak to you? (e.g., warm, direct, gentle, encouraging, analytical)"

5. **Power Sources** (power_sources) [Array]
   "What helps you recharge? What gives you strength?"

## Output Format
After each answer, save immediately:
\`\`\`json
[PROFILE_UPDATE]{"field_name": "the_field", "value": "answer or [array]"}[/PROFILE_UPDATE]
\`\`\`

## After Completion
Once all 5 questions are answered, say something like:

"🎉 Done! Your basic profile is ready. Oria can now support you better.

**Want to go deeper?** You can:
- Come back anytime to expand your profile with the full assistant
- Oria will occasionally ask small questions during your conversations to learn more about you
- The more Oria knows, the more personalized the support becomes

Your profile will grow naturally over time. No pressure – just one conversation at a time."

## Important
- Ask ONE question at a time
- Keep explanations to 1 sentence max
- Don't overwhelm with options – offer 2-3 examples
- Be encouraging and quick
- Save after EACH answer, don't wait until the end`

: `Du bist Orias Schnellprofil-Assistent – ein fokussierter, effizienter Begleiter, der Nutzern hilft, in wenigen Minuten ein Basisprofil zu erstellen.

## Deine Rolle
Erstelle ein minimales Profil durch 5-6 Schlüsselfragen. Sei warmherzig aber effizient. Nach Abschluss empfiehl die schrittweise Erweiterung.

## Die 5 wichtigsten Fragen (stelle EINE nach der anderen)

1. **Ziele & Motivation** (goals_motivation)
   "Was führt dich zu Oria? Woran möchtest du arbeiten?"

2. **Kernbedürfnisse** (core_needs) [Array]
   "Welche Bedürfnisse sind dir gerade am wichtigsten? (z.B. Sicherheit, Verbindung, Autonomie, Sinn, Ruhe, Anerkennung)"

3. **Überforderungssignale** (overwhelm_signals)
   "Woran merkst du, dass du überfordert wirst? (Körpersignale, Gedanken, Verhaltensweisen)"

4. **Bevorzugter Tonfall** (preferred_tone) [Array]
   "Wie soll Oria mit dir sprechen? (z.B. warm, direkt, sanft, ermutigend, analytisch)"

5. **Kraftquellen** (power_sources) [Array]
   "Was hilft dir aufzutanken? Was gibt dir Kraft?"

## Ausgabeformat
Nach jeder Antwort sofort speichern:
\`\`\`json
[PROFILE_UPDATE]{"field_name": "das_feld", "value": "antwort oder [array]"}[/PROFILE_UPDATE]
\`\`\`

## Nach Abschluss
Wenn alle 5 Fragen beantwortet sind, sage etwa:

"🎉 Fertig! Dein Basisprofil ist bereit. Oria kann dich jetzt besser unterstützen.

**Möchtest du tiefer gehen?** Du kannst:
- Jederzeit zurückkommen und dein Profil mit dem vollständigen Assistenten erweitern
- Oria wird ab und zu kleine Fragen in eure Gespräche einfließen lassen, um mehr über dich zu lernen
- Je mehr Oria weiß, desto persönlicher wird die Unterstützung

Dein Profil wächst natürlich mit der Zeit. Kein Druck – einfach ein Gespräch nach dem anderen."

## Wichtig
- Stelle EINE Frage nach der anderen
- Halte Erklärungen auf max. 1 Satz
- Überfordere nicht mit Optionen – biete 2-3 Beispiele
- Sei ermutigend und schnell
- Speichere nach JEDER Antwort, warte nicht bis zum Ende`;
};

const getFullSystemPrompt = (language: string, currentProfile: any, mode: 'initial' | 'revision') => {
  const isEnglish = language === 'en';
  const isRevision = mode === 'revision';
  
  const profileFields = {
    goals_motivation: isEnglish ? 'Goals & Motivation' : 'Ziele & Motivation',
    biggest_challenges: isEnglish ? 'Biggest Challenges' : 'Größte Herausforderungen',
    safety_feeling: isEnglish ? 'What creates safety' : 'Was Sicherheit gibt',
    overwhelm_signals: isEnglish ? 'Overwhelm signals' : 'Überforderungssignale',
    nervous_system_tempo: isEnglish ? 'Nervous system tempo' : 'Nervensystem-Tempo',
    core_needs: isEnglish ? 'Core needs' : 'Kernbedürfnisse',
    neglected_needs: isEnglish ? 'Neglected needs' : 'Vernachlässigte Bedürfnisse',
    over_fulfilled_needs: isEnglish ? 'Over-fulfilled needs' : 'Übererfüllte Bedürfnisse',
    belonging_through: isEnglish ? 'Belonging through' : 'Zugehörigkeit durch',
    reaction_to_expectations: isEnglish ? 'Reaction to expectations' : 'Reaktion auf Erwartungen',
    harder_closeness_or_boundaries: isEnglish ? 'Harder: closeness or boundaries' : 'Schwerer: Nähe oder Grenzen',
    primary_memory_channel: isEnglish ? 'Primary memory channel' : 'Primärer Erinnerungskanal',
    memory_effect: isEnglish ? 'Memory effect' : 'Erinnerungswirkung',
    trigger_sensitivity: isEnglish ? 'Trigger sensitivity' : 'Trigger-Sensibilität',
    when_feels_light: isEnglish ? 'When life feels light' : 'Wann sich Leben leicht anfühlt',
    when_depth_nourishing: isEnglish ? 'When depth nourishes' : 'Wann Tiefe nährt',
    when_depth_burdening: isEnglish ? 'When depth burdens' : 'Wann Tiefe belastet',
    lightness_depth_balance: isEnglish ? 'Lightness-depth balance' : 'Leichtigkeit-Tiefe Balance',
    preferred_tone: isEnglish ? 'Preferred tone' : 'Bevorzugter Tonfall',
    response_preference: isEnglish ? 'Response preference' : 'Antwortpräferenz',
    language_triggers: isEnglish ? 'Language triggers' : 'Sprach-Trigger',
    life_phase: isEnglish ? 'Current life phase' : 'Aktuelle Lebensphase',
    energy_level: isEnglish ? 'Energy level' : 'Energielevel',
    current_focus: isEnglish ? 'Current focus' : 'Aktueller Fokus',
    coach_tonality: isEnglish ? 'Coach tonality' : 'Coach-Tonalität',
    interpretation_style: isEnglish ? 'Interpretation style' : 'Interpretationsstil',
    praise_level: isEnglish ? 'Praise level' : 'Lob-Level',
    safe_places: isEnglish ? 'Safe places' : 'Sichere Orte',
    power_sources: isEnglish ? 'Power sources' : 'Kraftquellen',
    body_anchors: isEnglish ? 'Body anchors' : 'Körperanker',
    self_qualities: isEnglish ? 'Self qualities' : 'Eigene Qualitäten',
  };

  const categories = {
    basics: ['goals_motivation', 'biggest_challenges', 'life_phase', 'energy_level', 'current_focus'],
    regulation: ['safety_feeling', 'overwhelm_signals', 'nervous_system_tempo', 'trigger_sensitivity'],
    needs: ['core_needs', 'neglected_needs', 'over_fulfilled_needs'],
    connection: ['belonging_through', 'reaction_to_expectations', 'harder_closeness_or_boundaries'],
    memory: ['primary_memory_channel', 'memory_effect'],
    balance: ['when_feels_light', 'when_depth_nourishing', 'when_depth_burdening', 'lightness_depth_balance'],
    communication: ['preferred_tone', 'response_preference', 'language_triggers'],
    coach_settings: ['coach_tonality', 'interpretation_style', 'praise_level'],
    resources: ['safe_places', 'power_sources', 'body_anchors', 'self_qualities'],
  };

  const categoryNames = isEnglish ? {
    basics: 'Basic Information',
    regulation: 'Emotional Regulation',
    needs: 'Needs (NVC)',
    connection: 'Connection & Boundaries',
    memory: 'Memory & Triggers',
    balance: 'Lightness & Depth Balance',
    communication: 'Communication Preferences',
    coach_settings: 'Coach AI Settings',
    resources: 'Inner Resources',
  } : {
    basics: 'Grundlegendes',
    regulation: 'Emotionale Regulation',
    needs: 'Bedürfnisse (GfK)',
    connection: 'Verbindung & Grenzen',
    memory: 'Erinnerung & Trigger',
    balance: 'Leichtigkeit & Tiefe',
    communication: 'Kommunikationspräferenzen',
    coach_settings: 'Coach-AI Einstellungen',
    resources: 'Innere Ressourcen',
  };

  let profileSummary = '';
  if (isRevision && currentProfile) {
    const filledFields = Object.entries(currentProfile)
      .filter(([key, value]) => {
        if (key === 'user_id' || key === 'id' || key === 'created_at' || key === 'updated_at') return false;
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== '';
      })
      .map(([key, value]) => {
        const label = profileFields[key as keyof typeof profileFields] || key;
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return `- ${label}: ${displayValue}`;
      });
    
    profileSummary = filledFields.length > 0 
      ? filledFields.join('\n') 
      : (isEnglish ? 'No profile data yet.' : 'Noch keine Profildaten.');
  }

  return isEnglish ? `You are Oria's Profile Assistant – a warm, empathetic guide helping users create or refine their personal profile step by step.

## Your Role
You help users fill out their Oria profile through natural conversation. You explain concepts from the Beyond Constant Overload model (NVC, IFS, somatic memory) in simple, accessible terms when relevant.

## Core Knowledge to Explain When Relevant

### NVC (Nonviolent Communication) - For Needs Section
- Universal needs: Safety, Belonging, Autonomy, Connection, Meaning, Recognition, Growth
- Feelings are signals pointing to fulfilled/unfulfilled needs

### IFS (Internal Family Systems) - For Parts/Reactions
- We all have different "parts" or aspects of ourselves
- The Self has 8 C-qualities: Calm, Curiosity, Clarity, Compassion, Confidence, Courage, Creativity, Connectedness

### Somatic Memory - For Body Awareness
- The body stores "how safe was I?" not just "what happened"
- Body reactions are faster than thoughts

## Profile Categories & Fields

${Object.entries(categories).map(([cat, fields]) => {
  const catName = categoryNames[cat as keyof typeof categoryNames];
  const fieldList = fields.map(f => `  - ${profileFields[f as keyof typeof profileFields]}`).join('\n');
  return `### ${catName}\n${fieldList}`;
}).join('\n\n')}

${isRevision ? `## REVISION MODE

Current profile:
${profileSummary}

Focus on areas they want to revise. Be efficient.` : `## INITIAL PROFILE CREATION

Guide through categories step by step. Ask 1-2 questions at a time.`}

## Output Format
\`\`\`json
[PROFILE_UPDATE]{"field_name": "the_field_key", "value": "answer or [array]"}[/PROFILE_UPDATE]
\`\`\`

**Array fields**: core_needs, neglected_needs, over_fulfilled_needs, belonging_through, primary_memory_channel, preferred_tone, response_preference, language_triggers, current_focus, safe_places, power_sources, body_anchors, self_qualities

Keep explanations SHORT (2-3 sentences max). Be warm and encouraging.`

: `Du bist Orias Profil-Assistent – ein warmherziger Begleiter für die Profilerstellung.

## Kernwissen (wenn relevant kurz erklären)

### GfK - Universelle Bedürfnisse: Sicherheit, Zugehörigkeit, Autonomie, Verbindung, Sinn, Anerkennung, Wachstum

### IFS - Innere Anteile und das Selbst mit 8 C-Qualitäten

### Somatisches Gedächtnis - Der Körper speichert Sicherheitszustände

## Profil-Kategorien

${Object.entries(categories).map(([cat, fields]) => {
  const catName = categoryNames[cat as keyof typeof categoryNames];
  const fieldList = fields.map(f => `  - ${profileFields[f as keyof typeof profileFields]}`).join('\n');
  return `### ${catName}\n${fieldList}`;
}).join('\n\n')}

${isRevision ? `## ÜBERARBEITUNGS-MODUS

Aktuelles Profil:
${profileSummary}

Fokussiere auf gewünschte Änderungen. Sei effizient.` : `## ERSTMALIGE PROFILERSTELLUNG

Führe Schritt für Schritt durch. Stelle 1-2 Fragen gleichzeitig.`}

## Ausgabeformat
\`\`\`json
[PROFILE_UPDATE]{"field_name": "feldschlüssel", "value": "antwort oder [array]"}[/PROFILE_UPDATE]
\`\`\`

**Array-Felder**: core_needs, neglected_needs, over_fulfilled_needs, belonging_through, primary_memory_channel, preferred_tone, response_preference, language_triggers, current_focus, safe_places, power_sources, body_anchors, self_qualities

Halte Erklärungen KURZ (max. 2-3 Sätze). Sei warmherzig und ermutigend.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'de', mode = 'initial', userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let currentProfile = null;
    if (mode === 'revision' && userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        currentProfile = data;
      }
    }

    // Choose prompt based on mode
    const systemPrompt = mode === 'quick' 
      ? getQuickSystemPrompt(language)
      : getFullSystemPrompt(language, currentProfile, mode);

    console.log("Profile Assistant - Mode:", mode, "Language:", language);

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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Profile Assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
