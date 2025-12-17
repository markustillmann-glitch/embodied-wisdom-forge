import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for deduplication
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, userId, language = 'de' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only analyze if there's enough conversation content (minimum 3 exchanges)
    const userMessages = messages?.filter((m: any) => m.role === 'user') || [];
    if (userMessages.length < 3) {
      return new Response(
        JSON.stringify({ learned: false, reason: "Not enough conversation data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isEn = language === 'en';
    
    // Build conversation summary for analysis
    const conversationText = messages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
      .join('\n\n');

    const extractionPrompt = isEn 
      ? `You are a discreet psychological pattern analyzer. Analyze this conversation and extract subtle insights about the person. Be extremely careful and respectful - these insights are deeply personal.

EXTRACT ONLY if you have clear evidence. Do NOT speculate. Quality over quantity.

Categories to look for:
1. PATTERN - Recurring behavioral or thinking patterns (e.g., "tends to minimize own needs", "avoids conflict")
2. NEED - Underlying needs that show up repeatedly (e.g., "deep need for validation", "need for autonomy")
3. TRIGGER - What activates emotional responses (e.g., "criticism triggers withdrawal", "change triggers anxiety")
4. STRENGTH - Positive qualities and resources (e.g., "strong reflective capacity", "resilient in crisis")
5. COMMUNICATION - Preferred communication patterns (e.g., "prefers indirect questions", "responds well to metaphors")

Return ONLY a JSON array of insights. Each insight must have:
- type: one of PATTERN, NEED, TRIGGER, STRENGTH, COMMUNICATION
- content: the insight in 1-2 sentences (be specific but compassionate)
- confidence: "emerging" (seen once), "developing" (seen twice), "established" (clear pattern)

If no clear insights can be extracted, return an empty array: []

CONVERSATION:
${conversationText}`
      : `Du bist ein diskreter psychologischer Muster-Analyst. Analysiere dieses Gespräch und extrahiere subtile Erkenntnisse über die Person. Sei äußerst behutsam und respektvoll - diese Erkenntnisse sind zutiefst persönlich.

EXTRAHIERE NUR bei klaren Belegen. SPEKULIERE NICHT. Qualität vor Quantität.

Kategorien zum Suchen:
1. PATTERN - Wiederkehrende Verhaltens- oder Denkmuster (z.B. "neigt dazu, eigene Bedürfnisse zu minimieren", "vermeidet Konflikte")
2. NEED - Zugrundeliegende Bedürfnisse, die wiederholt auftauchen (z.B. "tiefes Bedürfnis nach Bestätigung", "Bedürfnis nach Autonomie")
3. TRIGGER - Was emotionale Reaktionen auslöst (z.B. "Kritik löst Rückzug aus", "Veränderung löst Angst aus")
4. STRENGTH - Positive Qualitäten und Ressourcen (z.B. "starke Reflexionsfähigkeit", "resilient in Krisen")
5. COMMUNICATION - Bevorzugte Kommunikationsmuster (z.B. "bevorzugt indirekte Fragen", "reagiert gut auf Metaphern")

Gib NUR ein JSON-Array mit Erkenntnissen zurück. Jede Erkenntnis muss haben:
- type: eine von PATTERN, NEED, TRIGGER, STRENGTH, COMMUNICATION
- content: die Erkenntnis in 1-2 Sätzen (spezifisch aber mitfühlend)
- confidence: "emerging" (einmal gesehen), "developing" (zweimal gesehen), "established" (klares Muster)

Wenn keine klaren Erkenntnisse extrahiert werden können, gib ein leeres Array zurück: []

GESPRÄCH:
${conversationText}`;

    console.log("Analyzing conversation for learning insights...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: extractionPrompt }
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI extraction failed:", aiResponse.status);
      return new Response(
        JSON.stringify({ learned: false, error: "Analysis failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const responseContent = aiData.choices?.[0]?.message?.content || "[]";
    
    let insights: Array<{type: string, content: string, confidence: string}> = [];
    try {
      const parsed = JSON.parse(responseContent);
      insights = Array.isArray(parsed) ? parsed : (parsed.insights || []);
    } catch (e) {
      console.error("Failed to parse insights JSON:", e);
      return new Response(
        JSON.stringify({ learned: false, error: "Parse error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (insights.length === 0) {
      return new Response(
        JSON.stringify({ learned: false, reason: "No clear patterns detected" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client to store insights securely
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let storedCount = 0;
    let updatedCount = 0;

    for (const insight of insights) {
      if (!insight.type || !insight.content) continue;

      const insightHash = simpleHash(`${insight.type}:${insight.content.toLowerCase().substring(0, 50)}`);
      
      // Check if similar insight exists
      const { data: existing } = await supabase
        .from('coach_insights')
        .select('id, observation_count, confidence_level')
        .eq('user_id', userId)
        .eq('insight_hash', insightHash)
        .single();

      if (existing) {
        // Update existing insight - increase observation count and potentially confidence
        const newCount = (existing.observation_count || 1) + 1;
        let newConfidence = existing.confidence_level;
        
        if (newCount >= 5 && newConfidence !== 'established') {
          newConfidence = 'established';
        } else if (newCount >= 2 && newConfidence === 'emerging') {
          newConfidence = 'developing';
        }

        await supabase
          .from('coach_insights')
          .update({
            observation_count: newCount,
            confidence_level: newConfidence,
            last_observed_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        
        updatedCount++;
      } else {
        // Insert new insight
        await supabase
          .from('coach_insights')
          .insert({
            user_id: userId,
            insight_type: insight.type.toLowerCase(),
            insight_hash: insightHash,
            insight_content: insight.content,
            confidence_level: insight.confidence || 'emerging',
          });
        
        storedCount++;
      }
    }

    console.log(`Learning complete: ${storedCount} new insights, ${updatedCount} reinforced`);

    return new Response(
      JSON.stringify({ 
        learned: true, 
        newInsights: storedCount, 
        reinforcedInsights: updatedCount 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Coach learning error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
