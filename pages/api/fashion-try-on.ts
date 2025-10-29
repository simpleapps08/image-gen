import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key first - same pattern as generate-image.ts
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('No Google AI API key found, using demo mode');
    return res.status(200).json({
      url: '/demo-fashion.jpg',
      prompt: 'Demo mode - API key not configured',
      demo: true
    });
  }

  try {
    // Parse form data without using temporary directory to avoid EROFS errors
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      // Remove uploadDir to use in-memory processing
    });

    const [fields, files] = await form.parse(req);
    
    const productImageFile = Array.isArray(files.productImage) ? files.productImage[0] : files.productImage;
    const personImageFile = Array.isArray(files.personImage) ? files.personImage[0] : files.personImage;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const lighting = Array.isArray(fields.lighting) ? fields.lighting[0] : fields.lighting;
    const modelType = Array.isArray(fields.modelType) ? fields.modelType[0] : fields.modelType;
    const clothingType = Array.isArray(fields.clothingType) ? fields.clothingType[0] : fields.clothingType;

    // Validate required fields
    if (!productImageFile || !personImageFile) {
      return res.status(400).json({ error: 'Both product and person images are required' });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' });
    }

    if (!lighting || !modelType || !clothingType) {
      return res.status(400).json({ error: 'Lighting, model type, and clothing type are required' });
    }

    // Read image files
    const productImageData = fs.readFileSync(productImageFile.filepath);
    const personImageData = fs.readFileSync(personImageFile.filepath);

    // Convert to base64
    const productBase64 = productImageData.toString('base64');
    const personBase64 = personImageData.toString('base64');

    // Generate prompt using the new template
    const lightingOptions: { [key: string]: string } = {
      'three-point-softbox': 'Three-point softbox setup',
      'natural-window': 'Natural window lighting',
      'studio-professional': 'Professional studio lighting',
      'outdoor-natural': 'Outdoor natural lighting',
      'golden-hour': 'Golden hour lighting',
      'ring-light': 'Ring light setup',
      'dramatic-side': 'Dramatic side lighting'
    };

    const lightingLabel = lightingOptions[lighting] || lighting;
    
    const prompt = `Create a new image by combining the elements from the provided images. Take the ${clothingType} from the first image and place it with/on the ${modelType} from the second image. The final image should be a ${description.trim()}. Use ${lightingLabel} for professional photography quality.`;

    // Initialize Google AI client
    const ai = new GoogleGenAI({ apiKey });

    console.log('Sending request to Google AI API with gemini-2.5-flash-image...');
    console.log('Generated prompt:', prompt);
    
    // Prepare prompt array exactly like user's example
    const promptArray = [
      {
        inlineData: {
          mimeType: productImageFile.mimetype || 'image/png',
          data: productBase64,
        },
      },
      {
        inlineData: {
          mimeType: personImageFile.mimetype || 'image/png',
          data: personBase64,
        },
      },
      { text: prompt },
    ];
    
    // Generate content using gemini-2.5-flash-image model - exact format from user's example
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: promptArray,
    });

    console.log('Response received from Google AI API');
    console.log('Full response structure:', JSON.stringify(response, null, 2));

    // Process the response - same pattern as generate-image.ts and generate-product-image.ts
    let imageUrl = null;
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      console.log('Found candidates and parts, checking for image data...');
      console.log('Parts structure:', JSON.stringify(response.candidates[0].content.parts, null, 2));
      
      for (const part of response.candidates[0].content.parts) {
        console.log('Processing part:', JSON.stringify(part, null, 2));
        
        if (part.inlineData) {
          console.log('Found inline data, processing image...');
          const imageData = part.inlineData.data;
          
          // Return base64 data URL instead of saving to file system
          // This avoids EROFS errors in production environments
          imageUrl = `data:image/png;base64,${imageData}`;
          console.log('Image processed successfully as base64 data URL');
          
          break;
        } else {
          console.log('Part does not contain inlineData');
        }
      }
    } else {
      console.log('No candidates or parts found in response');
      console.log('Response candidates:', response.candidates);
    }

    if (!imageUrl) {
      throw new Error('No image data received from Google AI API');
    }

    // Return success response - same pattern as working APIs
    return res.status(200).json({
      url: imageUrl,
      prompt: prompt,
      demo: false,
      metadata: {
        lighting: lightingLabel,
        modelType: modelType,
        clothingType: clothingType,
        description: description.trim()
      }
    });

  } catch (error: unknown) {
    console.error('Fashion try-on error:', error);
    
    const statusCode = error instanceof Error && 'status' in error && typeof (error as Error & { status: number }).status === 'number'
      ? (error as Error & { status: number }).status 
      : 500;
    const message = error instanceof Error 
      ? error.message 
      : 'Internal server error';

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