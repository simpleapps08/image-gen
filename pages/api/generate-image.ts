import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cleanupOldImages } from '../../lib/cleanup';

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
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt }: GenerateImageRequest = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check for API key with fallback options
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    // If no API key, return demo mode response
    if (!apiKey) {
      console.log('No Google Gemini API key found, returning demo image');
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      return res.json({ 
        url: randomImage, 
        demo: true 
      });
    }

    // Initialize GoogleGenAI with API key
    const genAI = new GoogleGenAI({
      apiKey: apiKey
    });

    // Generate image using Google Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt.trim(),
    });

    // Process the response to extract image data
    let imageUrl = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        // Create a unique filename
        const filename = `gemini-image-${Date.now()}.png`;
        const publicPath = path.join(process.cwd(), 'public', filename);
        
        // Save image to public directory
        fs.writeFileSync(publicPath, buffer);
        
        // Return the public URL
        imageUrl = `/${filename}`;
        
        // Auto cleanup old images (run in background)
        cleanupOldImages({ maxAgeHours: 24 }).catch(error => {
          console.error('Auto cleanup error:', error);
        });
        
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('No image data received from Gemini API');
    }

    res.json({ 
      url: imageUrl,
      demo: false 
    });

  } catch (error: unknown) {
    console.error('Error in generate-image API:', error);
    
    // Handle specific Gemini API errors with standardized responses
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as any).status;
      
      if (status === 401) {
        return res.status(401).json({ 
          error: 'Unauthorized - Invalid API key',
          code: 'INVALID_API_KEY',
          status: 401
        });
      }
      
      if (status === 400) {
        return res.status(400).json({ 
          error: 'Bad Request - Invalid request to Gemini API',
          code: 'INVALID_REQUEST',
          status: 400
        });
      }
      
      if (status === 429) {
        return res.status(429).json({ 
          error: 'Rate Limit Exceeded - Please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          status: 429
        });
      }
    }
    
    // General error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: errorMessage,
      code: 'INTERNAL_ERROR',
      status: 500
    });
  }
}