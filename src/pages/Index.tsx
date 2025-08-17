import { useState } from "react";
import { PromptForm } from "@/components/PromptForm";
import { ImageDisplay } from "@/components/ImageDisplay";
import { HistoryList, type HistoryItem } from "@/components/HistoryList";
import { generateImage } from "@/lib/openai";
import { toast } from "sonner";
import { Sparkles, Palette, Wand2 } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    prompt: string;
    isDemo?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerateImage = async (prompt: string, size: string, quality: string, style: string) => {
    setIsLoading(true);
    
    try {
      const result = await generateImage({
        prompt,
        size: size as any,
        quality: quality as any,
        style: style as any,
      });

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        prompt,
        imageUrl: result.url,
        timestamp: new Date(),
        isDemo: result.demo,
      };

      setCurrentImage({
        url: result.url,
        prompt,
        isDemo: result.demo,
      });

      setHistory(prev => [newItem, ...prev].slice(0, 5));
      
      if (result.demo) {
        toast.info("Demo mode: Using placeholder image");
      } else {
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setCurrentImage({
      url: item.imageUrl,
      prompt: item.prompt,
      isDemo: item.isDemo,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                AI Image Generator
              </h1>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Palette className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Transform your imagination into stunning visuals with the power of DALL·E 3
            </p>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>High Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <span>Creative</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prompt Form */}
          <div className="lg:col-span-2">
            <PromptForm 
              onSubmit={handleGenerateImage} 
              isLoading={isLoading} 
            />
            
            <div className="mt-8">
              <ImageDisplay
                imageUrl={currentImage?.url || null}
                prompt={currentImage?.prompt || ""}
                isDemo={currentImage?.isDemo}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <HistoryList 
              history={history} 
              onSelectImage={handleSelectFromHistory} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
