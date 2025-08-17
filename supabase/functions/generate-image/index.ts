import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateImageRequest {
  prompt: string;
  size: "1024x1024" | "1024x1792" | "1792x1024";
  quality: "standard" | "hd";
  style: "vivid" | "natural";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, size, quality, style }: GenerateImageRequest = await req.json()

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    
    // If no API key, return demo mode response
    if (!apiKey) {
      console.log('No OpenAI API key found, returning demo image')
      
      const demoImages = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop'
      ]
      
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)]
      
      return new Response(
        JSON.stringify({ 
          url: randomImage, 
          demo: true 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Make request to OpenAI DALL-E 3 API
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt.trim(),
        n: 1,
        size: size || '1024x1024',
        quality: quality || 'standard',
        style: style || 'vivid',
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate image. Please try again.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await openaiResponse.json()
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('Invalid response from OpenAI API')
    }

    return new Response(
      JSON.stringify({ 
        url: data.data[0].url,
        demo: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in generate-image function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})