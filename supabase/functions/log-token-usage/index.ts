import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { 
      functionName, 
      model, 
      inputTokens, 
      outputTokens, 
      userId 
    } = await req.json();

    if (!functionName) {
      return new Response(
        JSON.stringify({ error: "functionName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const totalTokens = (inputTokens || 0) + (outputTokens || 0);
    
    // Pricing estimates per million tokens
    const pricingMap: Record<string, { input: number; output: number }> = {
      'google/gemini-2.5-flash': { input: 0.075, output: 0.30 },
      'google/gemini-2.5-flash-image-preview': { input: 0.075, output: 0.30 },
      'google/gemini-2.5-pro': { input: 1.25, output: 5.00 },
    };
    
    const pricing = pricingMap[model] || { input: 0.10, output: 0.40 };
    const estimatedCost = (inputTokens * pricing.input / 1_000_000) + (outputTokens * pricing.output / 1_000_000);

    const { error } = await supabase.from('token_usage').insert({
      user_id: userId || null,
      function_name: functionName,
      model: model || 'unknown',
      input_tokens: inputTokens || 0,
      output_tokens: outputTokens || 0,
      total_tokens: totalTokens,
      estimated_cost_usd: estimatedCost,
    });

    if (error) {
      console.error("Failed to insert token usage:", error);
      return new Response(
        JSON.stringify({ error: "Failed to log usage" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Token usage logged: ${functionName} - ${totalTokens} tokens, ~$${estimatedCost.toFixed(6)}`);

    return new Response(
      JSON.stringify({ success: true, totalTokens, estimatedCost }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Log token usage error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});