import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageDisplayProps {
  imageUrl: string | null;
  prompt: string;
  isDemo?: boolean;
  isLoading: boolean;
}

export function ImageDisplay({ imageUrl, prompt, isDemo, isLoading }: ImageDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-ai animate-slide-up">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Generating your image...</span>
          </div>
          
          <div className="aspect-square w-full bg-gradient-to-br from-ai-surface to-ai-surface-hover rounded-lg animate-shimmer" />
          
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-ai-surface to-ai-surface-hover rounded animate-shimmer" />
            <div className="h-4 bg-gradient-to-r from-ai-surface to-ai-surface-hover rounded animate-shimmer w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!imageUrl) {
    return (
      <Card className="p-6 shadow-ai border-2 border-dashed border-ai-surface-hover">
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-ai-text-light mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Ready to Create
          </h3>
          <p className="text-ai-text-light">
            Enter a prompt above to generate your first image
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-ai animate-fade-in">
      {isDemo && (
        <div className="mb-4 p-3 bg-accent rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-primary" />
          <span className="font-medium">Demo mode:</span>
          <span className="text-muted-foreground">Using placeholder image</span>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative group">
          <img
            src={imageUrl}
            alt={prompt}
            className={`w-full rounded-lg shadow-lg transition-all duration-500 ${
              imageLoaded ? 'opacity-100 animate-bounce-gentle' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              toast.error("Failed to load image");
              setImageLoaded(true);
            }}
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-ai-surface to-ai-surface-hover rounded-lg animate-shimmer" />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="text-foreground">"</span>
            {prompt}
            <span className="text-foreground">"</span>
          </p>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Download Image
          </Button>
        </div>
      </div>
    </Card>
  );
}