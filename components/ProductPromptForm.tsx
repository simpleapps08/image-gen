import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Package } from "lucide-react";

interface ProductFormData {
  productDescription: string;
  backgroundSurface: string;
  specificFeature: string;
  mainDetail: string;
  lightingSetup: string;
  cameraAngle: string;
  aspectRatio: string;
}

interface ProductPromptFormProps {
  onSubmit: (formData: ProductFormData) => void;
  isLoading: boolean;
}

export function ProductPromptForm({ onSubmit, isLoading }: ProductPromptFormProps) {
  const [productDescription, setProductDescription] = useState("");
  const [backgroundSurface, setBackgroundSurface] = useState("");
  const [specificFeature, setSpecificFeature] = useState("");
  const [mainDetail, setMainDetail] = useState("");
  const [lightingSetup, setLightingSetup] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");

  const lightingOptions = [
    { value: "three-point softbox setup", label: "Three-point Softbox Setup" },
    { value: "single key light with reflector", label: "Single Key Light with Reflector" },
    { value: "ring light setup", label: "Ring Light Setup" },
    { value: "natural window lighting", label: "Natural Window Lighting" },
    { value: "dramatic side lighting", label: "Dramatic Side Lighting" },
    { value: "overhead diffused lighting", label: "Overhead Diffused Lighting" }
  ];

  const cameraAngleOptions = [
    { value: "slightly elevated 45-degree shot", label: "Slightly Elevated 45-degree Shot" },
    { value: "straight-on eye level", label: "Straight-on Eye Level" },
    { value: "overhead flat lay", label: "Overhead Flat Lay" },
    { value: "low angle hero shot", label: "Low Angle Hero Shot" },
    { value: "three-quarter angle", label: "Three-quarter Angle" },
    { value: "profile side view", label: "Profile Side View" }
  ];

  const aspectRatioOptions = [
    { value: "Square image", label: "Square (1:1)" },
    { value: "Landscape image", label: "Landscape (16:9)" },
    { value: "Portrait image", label: "Portrait (9:16)" },
    { value: "Wide landscape image", label: "Wide Landscape (21:9)" },
    { value: "Standard photo", label: "Standard Photo (4:3)" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productDescription.trim()) return;

    const formData = {
      productDescription,
      backgroundSurface,
      specificFeature,
      mainDetail,
      lightingSetup,
      cameraAngle,
      aspectRatio
    };

    onSubmit(formData);
  };

  const generatePreview = () => {
    const lightingPurpose = lightingSetup === "three-point softbox setup" 
      ? "untuk menciptakan sorotan yang lembut, menyebar, dan menghilangkan bayangan yang keras"
      : lightingSetup === "dramatic side lighting"
      ? "untuk menciptakan kontras dramatis dan tekstur yang menonjol"
      : "untuk pencahayaan yang optimal";

    return `Foto produk beresolusi tinggi, dengan pencahayaan studio, dari ${productDescription || '[deskripsi produk]'} ${backgroundSurface ? `di atas ${backgroundSurface}` : 'di atas [permukaan/deskripsi latar belakang]'}. Pencahayaannya adalah ${lightingSetup || '[pengaturan pencahayaan]'} ${lightingPurpose}. Sudut kameranya adalah ${cameraAngle || '[jenis sudut]'} untuk menonjolkan ${specificFeature || '[fitur spesifik]'}. Ultra-realistis, dengan fokus tajam pada ${mainDetail || '[detail utama]'}. ${aspectRatio || '[Rasio aspek]'}.`;
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-ai-surface hover:border-ai-surface-hover transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Product Image Generator</h2>
          </div>
          <p className="text-muted-foreground">Buat foto produk profesional dengan template AI</p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productDescription">Deskripsi Produk *</Label>
            <Textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="cangkir kopi keramik minimalis berwarna hitam matte"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundSurface">Permukaan/Latar Belakang</Label>
            <Input
              id="backgroundSurface"
              value={backgroundSurface}
              onChange={(e) => setBackgroundSurface(e.target.value)}
              placeholder="permukaan beton yang dipoles"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificFeature">Fitur Spesifik</Label>
            <Input
              id="specificFeature"
              value={specificFeature}
              onChange={(e) => setSpecificFeature(e.target.value)}
              placeholder="garis-garisnya yang bersih"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainDetail">Detail Utama</Label>
            <Input
              id="mainDetail"
              value={mainDetail}
              onChange={(e) => setMainDetail(e.target.value)}
              placeholder="uap yang mengepul dari kopi"
            />
          </div>
        </div>

        {/* Dropdown Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Pengaturan Pencahayaan</Label>
            <Select value={lightingSetup} onValueChange={setLightingSetup}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pencahayaan" />
              </SelectTrigger>
              <SelectContent>
                {lightingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Jenis Sudut</Label>
            <Select value={cameraAngle} onValueChange={setCameraAngle}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih sudut kamera" />
              </SelectTrigger>
              <SelectContent>
                {cameraAngleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rasio Aspek</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih rasio aspek" />
              </SelectTrigger>
              <SelectContent>
                {aspectRatioOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview */}
        {productDescription && (
          <div className="space-y-2">
            <Label>Preview Prompt:</Label>
            <div className="p-4 bg-muted rounded-lg text-sm">
              {generatePreview()}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={!productDescription.trim() || isLoading}
          className="w-full py-4 text-lg font-semibold gradient-ai hover:shadow-ai-glow transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Membuat gambar produk...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Buat Gambar Produk
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}