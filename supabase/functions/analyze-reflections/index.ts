import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Du bist ein einfühlsamer psychologischer Analyst, der Muster in Selbstreflexionen erkennt.

Deine Aufgabe ist es, basierend auf den Reflexionsdaten eines Nutzers:
1. Muster zu erkennen, welche Themen schwer fallen
2. Hypothesen über dahinterliegende Bedürfnisse oder Blockaden aufzustellen
3. Konkrete, sanfte Anregungen zu geben, was der Nutzer erforschen könnte

**KATEGORIEN:**
- selfcare: Allgemeine Selbstfürsorge-Themen
- gfk: Gewaltfreie Kommunikation (Bedürfnisse, Gefühle, Bitten, Empathie)
- ifs: Internal Family Systems (innere Anteile, Schutzstrategien, Self-Leadership)

**ANTWORTFORMAT (JSON):**
{
  "patterns": [
    {
      "category": "gfk|ifs|selfcare",
      "theme": "Kurzer Thementitel",
      "observation": "Was du beobachtet hast (2-3 Sätze)",
      "possible_roots": "Mögliche dahinterliegende Ursachen (2-3 Sätze)",
      "exploration_prompts": ["Frage 1", "Frage 2", "Frage 3"]
    }
  ],
  "overall_insight": "Übergreifende Erkenntnis (3-4 Sätze)",
  "recommended_focus": "Empfohlener Fokus für die nächste Zeit (2-3 Sätze)"
}

Sei warm, nicht wertend, und formuliere Hypothesen vorsichtig ("Es könnte sein, dass...").`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's reflections
    const { data: reflections, error: reflError } = await supabase
      .from("statement_reflections")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (reflError) {
      console.error("Error fetching reflections:", reflError);
      return new Response(JSON.stringify({ error: "Failed to fetch reflections" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!reflections || reflections.length === 0) {
      return new Response(JSON.stringify({ 
        patterns: [],
        overall_insight: "Noch keine Reflexionen vorhanden. Nutze die Selfcare-App, um erste Impulse zu erkunden.",
        recommended_focus: "Beginne mit einigen Reflexionen, um Muster erkennen zu können."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("core_needs, neglected_needs, biggest_challenges, goals_motivation")
      .eq("user_id", user.id)
      .maybeSingle();

    // Prepare analysis prompt
    const reflectionsSummary = reflections.map(r => ({
      statement: r.statement,
      category: r.category,
      emotional_response: r.emotional_response,
      difficulty: r.difficulty_level,
      insights: r.insights,
      date: r.created_at
    }));

    const analysisPrompt = `Analysiere die folgenden Reflexionen eines Nutzers:

**REFLEXIONEN (${reflections.length} Einträge):**
${JSON.stringify(reflectionsSummary, null, 2)}

${profile ? `**PROFIL-KONTEXT:**
- Kernbedürfnisse: ${profile.core_needs?.join(", ") || "nicht angegeben"}
- Vernachlässigte Bedürfnisse: ${profile.neglected_needs?.join(", ") || "nicht angegeben"}
- Größte Herausforderungen: ${profile.biggest_challenges || "nicht angegeben"}
- Ziele: ${profile.goals_motivation || "nicht angegeben"}` : ""}

Erstelle eine tiefgehende Analyse mit Mustern, möglichen Ursachen und Erforschungsanregungen.`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
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
          { role: "system", content: systemPrompt },
          { role: "user", content: analysisPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices?.[0]?.message?.content;

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      console.error("Failed to parse AI response:", analysisText);
      analysis = {
        patterns: [],
        overall_insight: analysisText || "Analyse konnte nicht erstellt werden.",
        recommended_focus: "Bitte versuche es später erneut."
      };
    }

    // Add stats
    const stats = {
      total_reflections: reflections.length,
      by_category: {
        selfcare: reflections.filter(r => r.category === "selfcare").length,
        gfk: reflections.filter(r => r.category === "gfk").length,
        ifs: reflections.filter(r => r.category === "ifs").length,
      },
      avg_difficulty: reflections.filter(r => r.difficulty_level).length > 0
        ? (reflections.reduce((sum, r) => sum + (r.difficulty_level || 0), 0) / 
           reflections.filter(r => r.difficulty_level).length).toFixed(1)
        : null,
    };

    return new Response(JSON.stringify({ ...analysis, stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
