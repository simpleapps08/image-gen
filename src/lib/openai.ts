export interface GenerateImageOptions {
  prompt: string;
  size: "1024x1024" | "1024x1792" | "1792x1024";
  quality: "standard" | "hd";
  style: "vivid" | "natural";
}

export interface GenerateImageResponse {
  url: string;
  demo?: boolean;
}

export async function generateImage(options: GenerateImageOptions): Promise<GenerateImageResponse> {
  try {
    const response = await fetch('/supabase/functions/v1/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image generation failed:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
}

// Demo placeholder images for when API key is not configured
export const getDemoImage = (): string => {
  const demoImages = [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1024&h=1024&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop',
    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1024&h=1024&fit=crop',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=1024&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop'
  ];
  
  return demoImages[Math.floor(Math.random() * demoImages.length)];
};