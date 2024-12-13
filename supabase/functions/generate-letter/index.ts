import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { child_name, age, wish_list } = await req.json()

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Create the prompt
    const prompt = `Write a warm and magical letter from Santa Claus to ${child_name}, who is ${age} years old. 
    Their wish list includes: ${wish_list}. 
    Make it personal, encouraging, and mention the North Pole, reindeer, and elves. 
    Don't promise specific gifts but acknowledge their wishes. 
    Keep it under 300 words and make it festive!`

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Santa Claus writing a personal letter to a child. Be warm, encouraging, and magical."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    })

    const generatedLetter = completion.data.choices[0].message?.content || ''

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the letter in the database
    const { data, error } = await supabaseClient
      .from('santa_letters')
      .insert([
        {
          child_name,
          age: parseInt(age),
          wish_list,
          generated_letter: generatedLetter
        }
      ])
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ letter: generatedLetter }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})