import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";

interface PromptFormProps {
  onSubmit: (prompt: string, size: string, quality: string, style: string) => void;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [style, setStyle] = useState("vivid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim(), size, quality, style);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    "Seekor naga megah yang terbang melalui awan kosmik",
    "Kota cyberpunk futuristik saat matahari terbenam",
    "Hutan damai dengan jamur bercahaya magis",
    "Seorang astronot mengambang di galaksi bintang-bintang",
    "Kapal udara steampunk di atas London Victoria"
  ];

  return (
    <Card className="p-6 gradient-ai-subtle shadow-ai animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="prompt" className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Apa yang ingin Anda bayangkan hari ini?
          </label>
          
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Jelaskan visi Anda secara detail..."
            className="text-lg py-4 bg-background/80 border-2 border-ai-surface-hover focus:border-primary transition-all duration-300"
            disabled={isLoading}
          />
          
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className="text-xs px-3 py-1 rounded-full bg-ai-surface hover:bg-ai-surface-hover text-ai-text-light hover:text-foreground transition-all duration-200"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Size</label>
            <Select value={size} onValueChange={setSize} disabled={isLoading}>
              <SelectTrigger className="bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024x1024">1024×1024 (Square)</SelectItem>
                <SelectItem value="1024x1792">1024×1792 (Portrait)</SelectItem>
                <SelectItem value="1792x1024">1792×1024 (Landscape)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Quality</label>
            <Select value={quality} onValueChange={setQuality} disabled={isLoading}>
              <SelectTrigger className="bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="hd">HD (Higher Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Style</label>
            <Select value={style} onValueChange={setStyle} disabled={isLoading}>
              <SelectTrigger className="bg-background/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vivid">Vivid (More Creative)</SelectItem>
                <SelectItem value="natural">Natural (More Realistic)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="w-full py-4 text-lg font-semibold gradient-ai hover:shadow-ai-glow transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Membuat gambar Anda...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Buat Gambar
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}