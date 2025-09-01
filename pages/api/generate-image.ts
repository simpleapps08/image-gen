import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Demo images for when API key is not configured
const demoImages = [
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1024&h=1024&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1024&h=1024&fit=crop',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=1024&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop'
];

interface GenerateImageRequest {
  prompt: string;
  size?: "1024x1024" | "1024x1792" | "1792x1024";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' }: GenerateImageRequest = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // If no API key, return demo mode response
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found, returning demo image');
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      return res.json({ 
        url: randomImage, 
        demo: true 
      });
    }

    // Generate image using OpenAI DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt.trim(),
      n: 1,
      size: size,
      quality: quality,
      style: style,
    });

    if (!response.data || !response.data[0] || !response.data[0].url) {
      throw new Error('Invalid response from OpenAI API');
    }

    res.json({ 
      url: response.data[0].url,
      demo: false 
    });

  } catch (error: any) {
    console.error('Error in generate-image API:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid request to OpenAI API. Please check your prompt.' 
      });
    } else if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate image. Please try again.' 
    });
  }
}