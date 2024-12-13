import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { child_name, age, wish_list } = await req.json();

    console.log('Generating letter for:', { child_name, age, wish_list });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Santa Claus writing a warm, personalized letter to a child. Keep the tone magical, encouraging, and appropriate for their age. Include mentions of the North Pole, reindeer, and elves. Acknowledge their wishes without making specific promises.'
          },
          {
            role: 'user',
            content: `Write a letter to ${child_name} who is ${age} years old. Their wish list includes: ${wish_list}. Make it personal, warm, and magical. Keep it under 300 words.`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (data.error) {
      throw new Error(data.error.message || 'Error generating letter');
    }

    const letter = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ letter }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-letter function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});