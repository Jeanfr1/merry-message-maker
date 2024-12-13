import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log('Received request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { child_name, age, wish_list } = await req.json();
    console.log('Processing request for:', { child_name, age, wish_list });

    if (!anthropicApiKey) {
      throw new Error('Anthropic API key is not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Write a warm, personalized letter from Santa Claus to ${child_name} who is ${age} years old. Their wish list includes: ${wish_list}. Make it personal, encouraging, and magical. Include mentions of the North Pole, reindeer, and elves. Keep it under 300 words.`
          }
        ]
      }),
    });

    const data = await response.json();
    console.log('Anthropic API response status:', response.status);
    console.log('Full API response:', JSON.stringify(data));

    if (!response.ok) {
      // Enhanced error handling
      const errorMessage = data.error?.message || 'Unknown Anthropic API error';
      console.error('Detailed API Error:', errorMessage);
      
      // Fallback letter generation
      const fallbackLetter = `Dear ${child_name},\n\nGreetings from the North Pole! Santa and his elves are working hard this holiday season. While I can't promise everything on your wish list, I hope the magic of Christmas brings you joy and happiness.\n\nWarmly,\nSanta Claus`;
      
      return new Response(
        JSON.stringify({ 
          letter: fallbackLetter,
          error: errorMessage 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200  // Return 200 to prevent client-side error
        },
      );
    }

    const letter = data.content[0].text;

    return new Response(
      JSON.stringify({ letter }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-letter function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});