import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Token tracking helper
async function logTokenUsage(
  supabase: any,
  userId: string | null,
  functionName: string,
  model: string,
  inputTokens: number,
  outputTokens: number
) {
  const totalTokens = inputTokens + outputTokens;
  // Gemini Flash pricing estimate: ~$0.075/1M input, ~$0.30/1M output
  const estimatedCost = (inputTokens * 0.000000075) + (outputTokens * 0.0000003);
  
  try {
    await supabase.from('token_usage').insert({
      user_id: userId,
      function_name: functionName,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      estimated_cost_usd: estimatedCost,
    });
    console.log(`Token usage logged: ${functionName} - ${totalTokens} tokens, ~$${estimatedCost.toFixed(6)}`);
  } catch (e) {
    console.error("Failed to log token usage:", e);
  }
}

const getSystemPrompt = (language: string, compact: boolean = false) => {
  const isEnglish = language === 'en';
  
  if (compact) {
    return isEnglish ? `You are a psychological analyst using the "Beyond the Shallow Through Memories" model.

Your task is to create a COMPACT psychogram summary. Focus on the most essential insights only.

## Output Format (keep it brief, max 600 words total):

### Key Emotional Pattern
One sentence about the dominant emotional tendency.

### Core Protection Strategy  
One sentence about how this person typically protects themselves.

### Primary Need
The most important unfulfilled need visible across memories.

### Inner Journey Insights (if meditation memories exist)
One sentence about recurring themes or insights from meditation experiences.

### Musical Resonance (if song memories exist)
One sentence about what songs/lyrics reveal about emotional processing.

### Main Strength
One key strength visible in the memories.

### Growth Opportunity
One focused area for development.

### One Recommendation
A single, specific actionable recommendation.

Be compassionate and concise. Use bullet points sparingly. Skip sections that don't apply based on memory types present.`

: `Du bist ein psychologischer Analyst, der das "Beyond the Shallow Through Memories" Modell verwendet.

Deine Aufgabe ist es, eine KOMPAKTE Psychogramm-Zusammenfassung zu erstellen. Fokussiere nur auf die wichtigsten Erkenntnisse.

## Ausgabeformat (kurz halten, max 600 Wörter insgesamt):

### Emotionales Kernmuster
Ein Satz über die dominante emotionale Tendenz.

### Zentrale Schutzstrategie
Ein Satz darüber, wie diese Person sich typischerweise schützt.

### Primäres Bedürfnis
Das wichtigste unerfüllte Bedürfnis, das über alle Erinnerungen sichtbar ist.

### Innere Reise-Erkenntnisse (falls Meditationserinnerungen vorhanden)
Ein Satz über wiederkehrende Themen oder Erkenntnisse aus Meditationserfahrungen.

### Musikalische Resonanz (falls Song-Erinnerungen vorhanden)
Ein Satz darüber, was Songs/Texte über die emotionale Verarbeitung verraten.

### Hauptstärke
Eine Kernstärke, die in den Erinnerungen sichtbar ist.

### Wachstumschance
Ein fokussierter Entwicklungsbereich.

### Eine Empfehlung
Eine einzelne, konkrete, umsetzbare Empfehlung.

Sei einfühlsam und prägnant. Verwende Aufzählungspunkte sparsam. Überspringe Abschnitte, die nicht auf Basis der vorhandenen Erinnerungstypen zutreffen.`;
  }
  
  return isEnglish ? `You are a psychological analyst using the "Beyond the Shallow Through Memories" model.

Your task is to create a structured PSYCHOGRAM based on the user's saved memories. Analyze the patterns, recurring themes, emotional tendencies, and psychological dynamics visible across all memories.

## Analysis Framework:

### 1. Core Emotional Patterns
- Identify recurring emotions across memories
- Note emotional intensity patterns
- Recognize emotional triggers

### 2. IFS Parts Analysis
- Identify recurring inner parts (Managers, Firefighters, Exiles)
- Note protection strategies
- Identify potential Self qualities

### 3. Attachment & Relationship Patterns
- Closeness/distance dynamics
- Trust patterns
- Boundary tendencies

### 4. Somatic Patterns
- Recurring body states
- Safety/alarm tendencies
- Physical response patterns

### 5. Core Needs (NVC)
- Most frequently touched needs
- Unfulfilled core needs
- Need priorities

### 6. Trigger Patterns
- Common trigger themes
- Trigger response patterns
- Historical roots

### 7. Meditation & Inner Journey Patterns
- Recurring themes in meditation experiences
- States of consciousness and inner imagery
- Spiritual or existential insights
- Connection to inner wisdom or guidance

### 8. Musical & Lyrical Resonance
- Songs and lyrics that hold emotional significance
- Themes and messages that resonate
- How music reflects inner states
- Emotional processing through musical connection

### 9. Strengths & Resources
- Resilience patterns
- Coping strategies that work
- Core strengths visible in memories

### 10. Growth Areas
- Patterns that may benefit from attention
- Potential blind spots
- Development opportunities

## Output Format:

Create a structured, compassionate psychogram with clear sections. Use bullet points for clarity. Include specific references to memories where relevant (without quoting private details). End with 3 personalized recommendations for growth.

Be empathetic and non-judgmental. Frame observations as invitations for self-reflection, not diagnoses.`

: `Du bist ein psychologischer Analyst, der das "Beyond the Shallow Through Memories" Modell verwendet.

Deine Aufgabe ist es, ein strukturiertes PSYCHOGRAMM basierend auf den gespeicherten Erinnerungen des Users zu erstellen. Analysiere die Muster, wiederkehrenden Themen, emotionalen Tendenzen und psychologischen Dynamiken, die über alle Erinnerungen sichtbar werden.

## Analyse-Framework:

### 1. Emotionale Kernmuster
- Identifiziere wiederkehrende Emotionen über alle Erinnerungen
- Beachte Muster der emotionalen Intensität
- Erkenne emotionale Trigger

### 2. IFS-Anteile-Analyse
- Identifiziere wiederkehrende innere Anteile (Manager, Feuerwehrleute, Exilanten)
- Beachte Schutzstrategien
- Identifiziere potenzielle Selbst-Qualitäten

### 3. Bindungs- & Beziehungsmuster
- Nähe/Distanz-Dynamiken
- Vertrauensmuster
- Grenz-Tendenzen

### 4. Somatische Muster
- Wiederkehrende Körperzustände
- Sicherheits-/Alarm-Tendenzen
- Körperliche Reaktionsmuster

### 5. Kernbedürfnisse (NVC)
- Am häufigsten berührte Bedürfnisse
- Unerfüllte Kernbedürfnisse
- Bedürfnis-Prioritäten

### 6. Trigger-Muster
- Häufige Trigger-Themen
- Trigger-Reaktionsmuster
- Historische Wurzeln

### 7. Meditations- & Innere Reise-Muster
- Wiederkehrende Themen in Meditationserfahrungen
- Bewusstseinszustände und innere Bilder
- Spirituelle oder existenzielle Erkenntnisse
- Verbindung zur inneren Weisheit oder Führung

### 8. Musikalische & Lyrische Resonanz
- Songs und Texte mit emotionaler Bedeutung
- Themen und Botschaften, die resonieren
- Wie Musik innere Zustände widerspiegelt
- Emotionale Verarbeitung durch musikalische Verbindung

### 9. Stärken & Ressourcen
- Resilienz-Muster
- Funktionierende Bewältigungsstrategien
- In Erinnerungen sichtbare Kernstärken

### 10. Wachstumsbereiche
- Muster, die von Aufmerksamkeit profitieren könnten
- Potenzielle blinde Flecken
- Entwicklungsmöglichkeiten

## Ausgabeformat:

Erstelle ein strukturiertes, mitfühlendes Psychogramm mit klaren Abschnitten. Verwende Aufzählungspunkte für Klarheit. Beziehe dich konkret auf Erinnerungen (ohne private Details zu zitieren). Beende mit 3 personalisierten Empfehlungen für Wachstum.

Sei einfühlsam und nicht wertend. Formuliere Beobachtungen als Einladungen zur Selbstreflexion, nicht als Diagnosen.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing environment variables");
      throw new Error("Service is not configured");
    }

    const { language = 'de', compact = false } = await req.json();
    
    // Create Supabase client with user's auth
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Create service role client for token logging
    const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY 
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : supabase;

    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching memories for user:", user.id);

    // Fetch all memories for the user
    const { data: memories, error: memoriesError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
      .order('memory_date', { ascending: false });

    if (memoriesError) {
      console.error("Error fetching memories:", memoriesError);
      throw new Error("Failed to fetch memories");
    }

    if (!memories || memories.length === 0) {
      const noMemoriesMsg = language === 'en' 
        ? "You don't have any saved memories yet. Start by processing some memories with Oria to create your psychogram."
        : "Du hast noch keine gespeicherten Erinnerungen. Beginne damit, einige Erinnerungen mit Oria zu verarbeiten, um dein Psychogramm zu erstellen.";
      
      return new Response(
        JSON.stringify({ psychogram: noMemoriesMsg, memoryCount: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${memories.length} memories, generating psychogram`);

    // Prepare memory summaries for analysis - include ALL fields for equal analysis
    const memorySummaries = memories.map((m, i) => {
      const parts = [
        `Memory ${i + 1}:`,
        `- Title: ${m.title}`,
        `- Type: ${m.memory_type}`,
        m.memory_date ? `- Date: ${m.memory_date}` : null,
        m.emotion ? `- Emotion: ${m.emotion}` : null,
        // Include the full content (journaling responses) - this is the core of the memory
        m.content ? `- Full Content/Journaling:\n${m.content}` : null,
        m.summary ? `- Summary: ${m.summary}` : null,
        m.feeling_after ? `- Feeling after processing: ${m.feeling_after}` : null,
        m.needs_after && m.needs_after.length > 0 ? `- Needs identified: ${m.needs_after.join(', ')}` : null,
        m.additional_thoughts ? `- Additional thoughts: ${m.additional_thoughts}` : null,
      ].filter(Boolean).join('\n');
      return parts;
    }).join('\n\n---\n\n');

    const userPrompt = language === 'en'
      ? `Please create a comprehensive psychogram based on these ${memories.length} memories:\n\n${memorySummaries}`
      : `Bitte erstelle ein umfassendes Psychogramm basierend auf diesen ${memories.length} Erinnerungen:\n\n${memorySummaries}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: getSystemPrompt(language, compact) },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI service error");
    }

    const data = await response.json();
    const psychogram = data.choices?.[0]?.message?.content || "";

    // Log token usage
    const usage = data.usage;
    if (usage) {
      await logTokenUsage(
        supabaseAdmin,
        user.id,
        'generate-psychogram',
        'google/gemini-2.5-flash',
        usage.prompt_tokens || 0,
        usage.completion_tokens || 0
      );
    }

    console.log("Psychogram generated successfully");

    return new Response(
      JSON.stringify({ psychogram, memoryCount: memories.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate psychogram error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
