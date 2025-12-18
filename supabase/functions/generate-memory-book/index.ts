import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Memory {
  title: string;
  summary: string | null;
  content: string;
  memory_type: string;
  emotion: string | null;
  memory_date: string | null;
  additional_thoughts: string | null;
  feeling_after: string[] | null;
  needs_after: string[] | null;
  image_url: string | null;
}

interface BookPage {
  id: string;
  type: 'cover' | 'title' | 'chapter' | 'image' | 'quote' | 'context' | 'reflection' | 'ending';
  title?: string;
  content?: string;
  contentExtended?: string; // Extended content for PDF version
  imageUrl?: string;
  subtitle?: string;
}

interface GiftBookSettings {
  isGift: boolean;
  recipientNames: string;
  creatorName: string;
  createdDate: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memory, language = 'de', addContext = false, userProfile, giftSettings } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const memoryData = memory as Memory;
    const isGerman = language === 'de';
    const isGiftBook = giftSettings?.isGift === true;
    
    // Extract coach preferences for book generation
    const coachTonality = userProfile?.coach_tonality || 'warm';
    const interpretationStyle = userProfile?.interpretation_style || 'neutral';
    const praiseLevel = userProfile?.praise_level || 'moderate';
    
    // Build tone instructions for book generation
    const getToneInstructions = () => {
      const tonalityMap: Record<string, {en: string, de: string}> = {
        formal: { en: 'Use formal, professional language', de: 'Nutze formelle, professionelle Sprache' },
        warm: { en: 'Use warm, empathetic language', de: 'Nutze warme, einfühlsame Sprache' },
        casual: { en: 'Use casual, friendly language', de: 'Nutze lockere, freundschaftliche Sprache' },
        poetic: { en: 'Use poetic, metaphorical language with imagery', de: 'Nutze poetische, metaphorische Sprache mit Bildern' }
      };
      
      const interpretationMap: Record<string, {en: string, de: string}> = {
        optimistic: { en: 'Focus on growth, strengths, and positive aspects', de: 'Fokussiere auf Wachstum, Stärken und positive Aspekte' },
        neutral: { en: 'Present a balanced perspective', de: 'Präsentiere eine ausgewogene Perspektive' },
        reserved: { en: 'Be understated and cautious in observations', de: 'Sei zurückhaltend und vorsichtig in Beobachtungen' }
      };
      
      const praiseMap: Record<string, {en: string, de: string}> = {
        minimal: { en: 'Avoid superlatives or excessive appreciation, be factual', de: 'Vermeide Superlative oder übertriebene Wertschätzung, sei sachlich' },
        moderate: { en: 'Include balanced, genuine appreciation', de: 'Füge ausgewogene, echte Wertschätzung ein' },
        generous: { en: 'Warmly celebrate the memory and the person', de: 'Feiere die Erinnerung und die Person warmherzig' }
      };
      
      const lang = isGerman ? 'de' : 'en';
      return `${tonalityMap[coachTonality]?.[lang] || tonalityMap.warm[lang]}. ${interpretationMap[interpretationStyle]?.[lang] || interpretationMap.neutral[lang]}. ${praiseMap[praiseLevel]?.[lang] || praiseMap.moderate[lang]}.`;
    };

    if (addContext) {
      // Generate only context pages
      const contextPrompt = isGerman 
        ? `Basierend auf dieser Erinnerung, erstelle 2-3 Kontextseiten mit relevanten Hintergrundinformationen.

Erinnerung:
Titel: ${memoryData.title}
Typ: ${memoryData.memory_type}
Inhalt: ${memoryData.content?.substring(0, 1000)}

Erstelle Kontext-Informationen die helfen, die Erinnerung besser einzuordnen:
- Historischer/kultureller Kontext falls relevant
- Psychologische Einordnung (z.B. warum bestimmte Emotionen auftraten)
- Verbindung zu allgemeinen menschlichen Erfahrungen

Antworte als JSON-Array mit Objekten die jeweils "id", "type" (immer "context"), "title" und "content" haben.`
        : `Based on this memory, create 2-3 context pages with relevant background information.

Memory:
Title: ${memoryData.title}
Type: ${memoryData.memory_type}
Content: ${memoryData.content?.substring(0, 1000)}

Create context information that helps understand the memory better:
- Historical/cultural context if relevant
- Psychological perspective (e.g., why certain emotions occurred)
- Connection to universal human experiences

Respond as a JSON array with objects containing "id", "type" (always "context"), "title", and "content".`;

      const contextResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: `You are a helpful assistant that creates context pages for memory books. Always respond with valid JSON. IMPORTANT TONE: ${getToneInstructions()}` },
            { role: 'user', content: contextPrompt }
          ],
        }),
      });

      if (!contextResponse.ok) {
        const errorText = await contextResponse.text();
        console.error('AI API error:', contextResponse.status, errorText);
        throw new Error('Failed to generate context');
      }

      const contextData = await contextResponse.json();
      const contextContent = contextData.choices?.[0]?.message?.content || '[]';
      
      let contextPages: BookPage[] = [];
      try {
        // Extract JSON from the response
        const jsonMatch = contextContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          contextPages = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse context pages:', e);
      }

      return new Response(JSON.stringify({ contextPages }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate full book
    const toneInstructions = getToneInstructions();
    
    // Different system prompts for personal vs gift book
    const getSystemPrompt = () => {
      if (isGiftBook) {
        return isGerman
          ? `Du bist ein einfühlsamer Autor, der persönliche Erinnerungen in wunderschöne Geschenk-Bücher verwandelt.
WICHTIG: Dies ist ein GESCHENK-BUCH für "${giftSettings.recipientNames}". 

Erstelle ein Erinnerungsbuch mit ca. 15-20 Seiten. Jede Seite hat zwei Textversionen.

**WICHTIG - GESCHENK-STIL**:
- Fokussiere auf die Beziehung zwischen dem Ersteller und der/den beschenkten Person(en)
- Erzähle die Geschichte so, dass die beschenkte Person im Mittelpunkt steht
- Würdige die Rolle und Bedeutung der beschenkten Person in dieser Erinnerung
- Vermeide zu persönliche Reflexionen, die nur der Ersteller verstehen würde
- Schreibe so, dass es für die beschenkte Person schön zu lesen ist
- Betone was diese Person dem Ersteller bedeutet und was sie in der Erinnerung ausgemacht hat

**WICHTIG - STILANWEISUNG**: ${toneInstructions}

Seitentypen:
- "cover": Titelseite mit Titel und Untertitel (NICHT selbst mit Namen füllen, das wird separat gehandhabt)
- "title": Einführungsseite
- "chapter": Inhaltsseite mit Titel und Text
- "image": Platzhalter für ein Bild (nur imageUrl wenn vorhanden)
- "quote": Zitat oder wichtiger Satz über die gemeinsame Verbindung
- "reflection": Reflexion über die Beziehung und Bedeutung der Person
- "ending": Abschlussseite (NICHT selbst mit Widmung füllen, das wird separat gehandhabt)

Für jede Seite mit Textinhalt erstelle ZWEI Versionen:
- "content": Kurze Version für mobile Vorschau (max 100 Wörter, knapp und prägnant)
- "contentExtended": Ausführliche Version für PDF-Export (200-400 Wörter, detailliert und liebevoll)

Die erweiterte Version sollte:
- Die beschenkte Person feiern und würdigen
- Die gemeinsame Verbindung hervorheben
- Wärme und Wertschätzung ausdrücken

Antworte nur mit einem JSON-Objekt: { "pages": [...] }
Jede Seite braucht: id (string), type (string), und optional title, content, contentExtended, subtitle, imageUrl`
          : `You are an empathetic author who transforms personal memories into beautiful gift books.
IMPORTANT: This is a GIFT BOOK for "${giftSettings.recipientNames}".

Create a memory book with about 15-20 pages. Each page has two text versions.

**IMPORTANT - GIFT STYLE**:
- Focus on the relationship between the creator and the recipient(s)
- Tell the story so that the recipient is at the center
- Honor the role and significance of the recipient in this memory
- Avoid overly personal reflections that only the creator would understand
- Write in a way that's beautiful for the recipient to read
- Emphasize what this person means to the creator and their role in the memory

**IMPORTANT - STYLE INSTRUCTION**: ${toneInstructions}

Page types:
- "cover": Title page with title and subtitle (DO NOT fill with names yourself, that's handled separately)
- "title": Introduction page
- "chapter": Content page with title and text
- "image": Placeholder for an image (only imageUrl if available)
- "quote": Quote or important sentence about the shared connection
- "reflection": Reflection on the relationship and meaning of the person
- "ending": Closing page (DO NOT fill with dedication yourself, that's handled separately)

For each page with text content, create TWO versions:
- "content": Short version for mobile preview (max 100 words, concise and punchy)
- "contentExtended": Detailed version for PDF export (200-400 words, detailed and loving)

The extended version should:
- Celebrate and honor the recipient
- Highlight the shared connection
- Express warmth and appreciation

Respond only with a JSON object: { "pages": [...] }
Each page needs: id (string), type (string), and optionally title, content, contentExtended, subtitle, imageUrl`;
      } else {
        return isGerman
          ? `Du bist ein einfühlsamer Autor, der persönliche Erinnerungen in wunderschöne Buchseiten verwandelt. 
Erstelle ein Erinnerungsbuch mit ca. 15-20 Seiten. Jede Seite hat zwei Textversionen.

**WICHTIG - STILANWEISUNG**: ${toneInstructions}

Seitentypen:
- "cover": Titelseite mit Titel und Untertitel
- "title": Einführungsseite
- "chapter": Inhaltsseite mit Titel und Text
- "image": Platzhalter für ein Bild (nur imageUrl wenn vorhanden)
- "quote": Zitat oder wichtiger Satz aus der Erinnerung
- "reflection": Reflexion über Gefühle und Bedeutung
- "ending": Abschlussseite

Für jede Seite mit Textinhalt erstelle ZWEI Versionen:
- "content": Kurze Version für mobile Vorschau (max 100 Wörter, knapp und prägnant)
- "contentExtended": Ausführliche Version für PDF-Export (200-400 Wörter, detailliert und reflektierend)

Die erweiterte Version sollte:
- Mehr Details und Kontext enthalten
- Tiefere emotionale Reflexionen bieten
- Verbindungen zu Gefühlen und Bedürfnissen ausarbeiten
- Den gewünschten Ton und Stil konsequent einhalten

Antworte nur mit einem JSON-Objekt: { "pages": [...] }
Jede Seite braucht: id (string), type (string), und optional title, content, contentExtended, subtitle, imageUrl`
          : `You are an empathetic author who transforms personal memories into beautiful book pages.
Create a memory book with about 15-20 pages. Each page has two text versions.

**IMPORTANT - STYLE INSTRUCTION**: ${toneInstructions}

Page types:
- "cover": Title page with title and subtitle
- "title": Introduction page
- "chapter": Content page with title and text
- "image": Placeholder for an image (only imageUrl if available)
- "quote": Quote or important sentence from the memory
- "reflection": Reflection on feelings and meaning
- "ending": Closing page

For each page with text content, create TWO versions:
- "content": Short version for mobile preview (max 100 words, concise and punchy)
- "contentExtended": Detailed version for PDF export (200-400 words, detailed and reflective)

The extended version should:
- Include more details and context
- Offer deeper emotional reflections
- Elaborate on connections to feelings and needs
- Maintain the desired tone and style consistently

Respond only with a JSON object: { "pages": [...] }
Each page needs: id (string), type (string), and optionally title, content, contentExtended, subtitle, imageUrl`;
      }
    };

    const systemPrompt = getSystemPrompt();

    const getMemoryPrompt = () => {
      if (isGiftBook) {
        return isGerman
          ? `Erstelle ein GESCHENK-Erinnerungsbuch für "${giftSettings.recipientNames}":

Titel: ${memoryData.title}
Typ: ${memoryData.memory_type}
Datum: ${memoryData.memory_date || 'nicht angegeben'}
Zusammenfassung: ${memoryData.summary || 'keine'}
Emotion während: ${memoryData.emotion || 'nicht angegeben'}
Gefühle danach: ${memoryData.feeling_after?.join(', ') || 'keine'}
Bedürfnisse: ${memoryData.needs_after?.join(', ') || 'keine'}
${memoryData.image_url ? `Bild-URL: ${memoryData.image_url}` : ''}

Hauptinhalt:
${memoryData.content}

${memoryData.additional_thoughts ? `Zusätzliche Gedanken:\n${memoryData.additional_thoughts}` : ''}

WICHTIG: 
- Fokussiere auf die Person(en) "${giftSettings.recipientNames}" und ihre Bedeutung in dieser Erinnerung
- Schreibe so, dass es für sie schön zu lesen ist
- Hebe hervor, was sie für den Ersteller bedeuten

Erstelle jetzt das Geschenk-Erinnerungsbuch als JSON.`
          : `Create a GIFT memory book for "${giftSettings.recipientNames}":

Title: ${memoryData.title}
Type: ${memoryData.memory_type}
Date: ${memoryData.memory_date || 'not specified'}
Summary: ${memoryData.summary || 'none'}
Emotion during: ${memoryData.emotion || 'not specified'}
Feelings after: ${memoryData.feeling_after?.join(', ') || 'none'}
Needs: ${memoryData.needs_after?.join(', ') || 'none'}
${memoryData.image_url ? `Image URL: ${memoryData.image_url}` : ''}

Main content:
${memoryData.content}

${memoryData.additional_thoughts ? `Additional thoughts:\n${memoryData.additional_thoughts}` : ''}

IMPORTANT:
- Focus on the person(s) "${giftSettings.recipientNames}" and their significance in this memory
- Write in a way that's beautiful for them to read
- Highlight what they mean to the creator

Now create the gift memory book as JSON.`;
      } else {
        return isGerman
          ? `Erstelle ein Erinnerungsbuch für diese Erinnerung:

Titel: ${memoryData.title}
Typ: ${memoryData.memory_type}
Datum: ${memoryData.memory_date || 'nicht angegeben'}
Zusammenfassung: ${memoryData.summary || 'keine'}
Emotion während: ${memoryData.emotion || 'nicht angegeben'}
Gefühle danach: ${memoryData.feeling_after?.join(', ') || 'keine'}
Bedürfnisse: ${memoryData.needs_after?.join(', ') || 'keine'}
${memoryData.image_url ? `Bild-URL: ${memoryData.image_url}` : ''}

Hauptinhalt:
${memoryData.content}

${memoryData.additional_thoughts ? `Zusätzliche Gedanken:\n${memoryData.additional_thoughts}` : ''}

Erstelle jetzt das Erinnerungsbuch als JSON.`
          : `Create a memory book for this memory:

Title: ${memoryData.title}
Type: ${memoryData.memory_type}
Date: ${memoryData.memory_date || 'not specified'}
Summary: ${memoryData.summary || 'none'}
Emotion during: ${memoryData.emotion || 'not specified'}
Feelings after: ${memoryData.feeling_after?.join(', ') || 'none'}
Needs: ${memoryData.needs_after?.join(', ') || 'none'}
${memoryData.image_url ? `Image URL: ${memoryData.image_url}` : ''}

Main content:
${memoryData.content}

${memoryData.additional_thoughts ? `Additional thoughts:\n${memoryData.additional_thoughts}` : ''}

Now create the memory book as JSON.`;
      }
    };

    const memoryPrompt = getMemoryPrompt();

    console.log('Generating memory book...', isGiftBook ? '(gift book)' : '(personal book)');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: memoryPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI API error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, parsing...');

    let pages: BookPage[] = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*"pages"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        pages = parsed.pages || [];
      } else {
        // Try parsing as direct array
        const arrayMatch = content.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          pages = JSON.parse(arrayMatch[0]);
        }
      }
    } catch (e) {
      console.error('Failed to parse book pages:', e, content);
    }

    // Ensure we have at least basic pages
    if (pages.length === 0) {
      if (isGiftBook) {
        pages = [
          {
            id: 'cover',
            type: 'cover',
            title: memoryData.title,
            subtitle: memoryData.memory_date ? new Date(memoryData.memory_date).toLocaleDateString(isGerman ? 'de-DE' : 'en-US') : undefined,
            imageUrl: memoryData.image_url || undefined,
          },
          {
            id: 'main',
            type: 'chapter',
            title: isGerman ? 'Unsere gemeinsame Erinnerung' : 'Our Shared Memory',
            content: memoryData.content?.substring(0, 500),
          },
          {
            id: 'ending',
            type: 'ending',
            title: isGerman ? 'Für Dich' : 'For You',
            content: isGerman ? 'Ein Geschenk der Erinnerung.' : 'A gift of memory.',
          },
        ];
      } else {
        pages = [
          {
            id: 'cover',
            type: 'cover',
            title: memoryData.title,
            subtitle: memoryData.memory_date ? new Date(memoryData.memory_date).toLocaleDateString(isGerman ? 'de-DE' : 'en-US') : undefined,
            imageUrl: memoryData.image_url || undefined,
          },
          {
            id: 'main',
            type: 'chapter',
            title: isGerman ? 'Die Erinnerung' : 'The Memory',
            content: memoryData.content?.substring(0, 500),
          },
          {
            id: 'ending',
            type: 'ending',
            title: isGerman ? 'Ende' : 'The End',
            content: isGerman ? 'Danke fürs Erinnern.' : 'Thank you for remembering.',
          },
        ];
      }
    }

    // Add image URL to cover if available
    if (memoryData.image_url && pages[0]?.type === 'cover' && !pages[0].imageUrl) {
      pages[0].imageUrl = memoryData.image_url;
    }

    console.log(`Generated ${pages.length} book pages`);

    return new Response(JSON.stringify({ pages, isGiftBook }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-memory-book:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
