import { useState } from "react";
import { ProductPromptForm } from "@/components/ProductPromptForm";
import { ImageDisplay } from "@/components/ImageDisplay";
import { HistoryList, type HistoryItem } from "@/components/HistoryList";
import { toast } from "sonner";
import { Sparkles, Package, Camera } from "lucide-react";

interface ProductFormData {
  productDescription: string;
  backgroundSurface: string;
  specificFeature: string;
  mainDetail: string;
  lightingSetup: string;
  cameraAngle: string;
  aspectRatio: string;
}

const Product = () => {
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    prompt: string;
    isDemo?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerateImage = async (formData: ProductFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        prompt: result.prompt,
        imageUrl: result.url,
        timestamp: new Date(),
        isDemo: result.demo,
      };

      setCurrentImage({
        url: result.url,
        prompt: result.prompt,
        isDemo: result.demo,
      });

      setHistory(prev => [newItem, ...prev].slice(0, 5));
      
      if (result.demo) {
        toast.info("Demo mode: Using placeholder image");
      } else {
        toast.success("Product image generated successfully!");
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to generate product image");
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
        style={{ backgroundImage: `url(/hero-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Product Image Generator
              </h1>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Transform your imagination into stunning Product Image with the Power of AI
            </p>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <span>Studio Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Professional</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>Product Focus</span>
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
            <ProductPromptForm 
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

export default Product;