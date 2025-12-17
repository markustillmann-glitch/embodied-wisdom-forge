import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  // Image generation pricing estimate: ~$0.04 per image
  const estimatedCost = 0.04;
  
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
    console.log(`Token usage logged: ${functionName} - ~$${estimatedCost.toFixed(4)}`);
  } catch (e) {
    console.error("Failed to log token usage:", e);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, summary, emotion, memoryType, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create a descriptive prompt for the image
    const promptParts = [
      `Create a symbolic, artistic illustration representing a memory titled "${title}".`,
      summary ? `The memory involves: ${summary}.` : '',
      emotion ? `The emotional tone is ${emotion}.` : '',
      `Memory type: ${memoryType || 'personal reflection'}.`,
      'Style: Soft, dreamy, watercolor-like aesthetic with warm colors.',
      'The image should be abstract and emotionally evocative, not photorealistic.',
      'Include subtle symbolic elements like light rays, soft gradients, or nature motifs.',
      'Avoid any text or words in the image.',
    ].filter(Boolean).join(' ');

    console.log('Generating image with prompt:', promptParts);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: promptParts,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    // Log token usage for image generation
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const usage = data.usage;
      await logTokenUsage(
        supabase,
        userId || null,
        'generate-memory-image',
        'google/gemini-2.5-flash-image-preview',
        usage?.prompt_tokens || Math.ceil(promptParts.length / 4),
        usage?.completion_tokens || 0
      );
    }
    
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
