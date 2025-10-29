import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { cleanupOldImages } from '../../lib/cleanup';

interface ProductImageRequest {
  productDescription: string;
  backgroundSurface?: string;
  specificFeature?: string;
  mainDetail?: string;
  lightingSetup?: string;
  cameraAngle?: string;
  aspectRatio?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    productDescription,
    backgroundSurface,
    specificFeature,
    mainDetail,
    lightingSetup,
    cameraAngle,
    aspectRatio
  }: ProductImageRequest = req.body;

  if (!productDescription?.trim()) {
    return res.status(400).json({ error: 'Product description is required' });
  }

  // Check for Gemini API key with fallback options
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('No Gemini API key found, using demo mode');
    return res.status(200).json({
      url: '/placeholder.svg',
      prompt: generatePrompt({
        productDescription,
        backgroundSurface,
        specificFeature,
        mainDetail,
        lightingSetup,
        cameraAngle,
        aspectRatio
      }),
      demo: true
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = generatePrompt({
      productDescription,
      backgroundSurface,
      specificFeature,
      mainDetail,
      lightingSetup,
      cameraAngle,
      aspectRatio
    });

    console.log('Generated prompt:', prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Process the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        // Save to public directory
        const timestamp = Date.now();
        const filename = `product-image-${timestamp}.png`;
        const filepath = path.join(process.cwd(), 'public', filename);
        
        fs.writeFileSync(filepath, buffer);
        
        // Auto cleanup old images (run in background)
        cleanupOldImages({ maxAgeHours: 24 }).catch(error => {
          console.error('Auto cleanup error:', error);
        });
        
        return res.status(200).json({
          url: `/${filename}`,
          prompt: prompt,
          demo: false
        });
      }
    }

    // If no image data found
    return res.status(500).json({ error: 'No image data received from Gemini API' });

  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    
    const statusCode = error instanceof Error && 'status' in error && typeof (error as Error & { status: number }).status === 'number'
      ? (error as Error & { status: number }).status 
      : 500;
    const message = error instanceof Error 
      ? error.message 
      : 'Failed to generate product image. Please try again.';

    // Standardized error responses
    if (statusCode === 400) {
      return res.status(400).json({ 
        error: 'Bad Request - Invalid request to Gemini API',
        code: 'INVALID_REQUEST',
        status: 400
      });
    } else if (statusCode === 401) {
      return res.status(401).json({ 
        error: 'Unauthorized - Invalid Gemini API key',
        code: 'INVALID_API_KEY',
        status: 401
      });
    } else if (statusCode === 429) {
      return res.status(429).json({ 
        error: 'Rate Limit Exceeded - Please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429
      });
    } else {
      return res.status(500).json({ 
        error: message,
        code: 'INTERNAL_ERROR',
        status: 500
      });
    }
  }
}

function generatePrompt({
  productDescription,
  backgroundSurface,
  specificFeature,
  mainDetail,
  lightingSetup,
  cameraAngle,
  aspectRatio
}: ProductImageRequest): string {
  // Build the lighting purpose based on setup
  let lightingPurpose = "";
  if (lightingSetup === "three-point softbox setup") {
    lightingPurpose = "designed to create soft, diffused highlights and eliminate harsh shadows";
  } else if (lightingSetup === "dramatic side lighting") {
    lightingPurpose = "designed to create dramatic contrast and prominent texture";
  } else if (lightingSetup === "ring light setup") {
    lightingPurpose = "designed to create even, shadowless illumination";
  } else if (lightingSetup === "natural window lighting") {
    lightingPurpose = "designed to create soft, natural illumination";
  } else if (lightingSetup === "overhead diffused lighting") {
    lightingPurpose = "designed to create even top-down illumination";
  } else if (lightingSetup === "single key light with reflector") {
    lightingPurpose = "designed to create controlled directional lighting with fill";
  } else {
    lightingPurpose = "for optimal lighting";
  }

  // Build the complete prompt
  let prompt = `A high-resolution, studio-lit product photograph of ${productDescription}`;
  
  if (backgroundSurface) {
    prompt += `, presented on ${backgroundSurface}`;
  }
  
  prompt += `. The lighting is ${lightingSetup || 'professional studio lighting'} ${lightingPurpose}`;
  
  if (cameraAngle) {
    prompt += `. The camera angle is ${cameraAngle}`;
    if (specificFeature) {
      prompt += ` to showcase ${specificFeature}`;
    }
  }
  
  prompt += `. Ultra-realistic, with sharp focus`;
  
  if (mainDetail) {
    prompt += ` on ${mainDetail}`;
  }
  
  if (aspectRatio) {
    prompt += `. ${aspectRatio}`;
  } else {
    prompt += `. Square image`;
  }

  return prompt;
}