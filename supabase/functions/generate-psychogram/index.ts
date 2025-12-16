import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSystemPrompt = (language: string) => {
  const isEnglish = language === 'en';
  
  return isEnglish ? `You are a psychological analyst using the "Beyond Bias through memories" model.

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

### 7. Strengths & Resources
- Resilience patterns
- Coping strategies that work
- Core strengths visible in memories

### 8. Growth Areas
- Patterns that may benefit from attention
- Potential blind spots
- Development opportunities

## Output Format:

Create a structured, compassionate psychogram with clear sections. Use bullet points for clarity. Include specific references to memories where relevant (without quoting private details). End with 3 personalized recommendations for growth.

Be empathetic and non-judgmental. Frame observations as invitations for self-reflection, not diagnoses.`

: `Du bist ein psychologischer Analyst, der das "Beyond Bias through memories" Modell verwendet.

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

### 7. Stärken & Ressourcen
- Resilienz-Muster
- Funktionierende Bewältigungsstrategien
- In Erinnerungen sichtbare Kernstärken

### 8. Wachstumsbereiche
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
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing environment variables");
      throw new Error("Service is not configured");
    }

    const { language = 'de' } = await req.json();
    
    // Create Supabase client with user's auth
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

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

    // Prepare memory summaries for analysis
    const memorySummaries = memories.map((m, i) => {
      const parts = [
        `Memory ${i + 1}:`,
        `- Title: ${m.title}`,
        `- Type: ${m.memory_type}`,
        m.emotion ? `- Emotion: ${m.emotion}` : null,
        m.summary ? `- Summary: ${m.summary}` : null,
        m.feeling_after ? `- Feeling after processing: ${m.feeling_after}` : null,
        m.needs_after && m.needs_after.length > 0 ? `- Needs identified: ${m.needs_after.join(', ')}` : null,
        m.additional_thoughts ? `- Additional thoughts: ${m.additional_thoughts}` : null,
      ].filter(Boolean).join('\n');
      return parts;
    }).join('\n\n');

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
          { role: "system", content: getSystemPrompt(language) },
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
