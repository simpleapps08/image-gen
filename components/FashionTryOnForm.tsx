import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Eye, Shirt, User, Camera, Users, Palette } from "lucide-react";
import Image from "next/image";

interface FashionTryOnFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export function FashionTryOnForm({ onSubmit, isLoading }: FashionTryOnFormProps) {
  const [firstImage, setFirstImage] = useState<File | null>(null);
  const [secondImage, setSecondImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [lighting, setLighting] = useState("");
  const [modelType, setModelType] = useState("");
  const [clothingType, setClothingType] = useState("");
  const [firstImagePreview, setFirstImagePreview] = useState<string | null>(null);
  const [secondImagePreview, setSecondImagePreview] = useState<string | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  
  const firstImageInputRef = useRef<HTMLInputElement>(null);
  const secondImageInputRef = useRef<HTMLInputElement>(null);

  const lightingOptions = [
    { value: "three-point-softbox", label: "Three-point softbox setup" },
    { value: "natural-window", label: "Natural window lighting" },
    { value: "studio-professional", label: "Professional studio lighting" },
    { value: "outdoor-natural", label: "Outdoor natural lighting" },
    { value: "golden-hour", label: "Golden hour lighting" },
    { value: "ring-light", label: "Ring light setup" },
    { value: "dramatic-side", label: "Dramatic side lighting" }
  ];

  const modelTypeOptions = [
    { value: "woman", label: "Woman" },
    { value: "man", label: "Man" },
    { value: "child", label: "Child" }
  ];

  const clothingTypeOptions = [
    { value: "dress", label: "Dress" },
    { value: "shirt", label: "Shirt" },
    { value: "pants", label: "Pants" },
    { value: "jacket", label: "Jacket" },
    { value: "skirt", label: "Skirt" },
    { value: "blouse", label: "Blouse" },
    { value: "suit", label: "Suit" },
    { value: "casual-wear", label: "Casual Wear" },
    { value: "formal-wear", label: "Formal Wear" },
    { value: "sportswear", label: "Sportswear" }
  ];

  const handleFirstImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFirstImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setFirstImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSecondImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSecondImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setSecondImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFirstImage = () => {
    setFirstImage(null);
    setFirstImagePreview(null);
    if (firstImageInputRef.current) {
      firstImageInputRef.current.value = "";
    }
  };

  const removeSecondImage = () => {
    setSecondImage(null);
    setSecondImagePreview(null);
    if (secondImageInputRef.current) {
      secondImageInputRef.current.value = "";
    }
  };

  const generatePrompt = () => {
    if (!firstImage || !secondImage || !description.trim() || !lighting || !modelType || !clothingType) {
      return "Lengkapi semua field untuk melihat preview prompt";
    }
    
    const lightingLabel = lightingOptions.find(opt => opt.value === lighting)?.label || lighting;
    
    return `Create a new image by combining the elements from the provided images. Take the ${clothingType} from the first image and place it with/on the ${modelType} from the second image. The final image should be a ${description.trim()}. Use ${lightingLabel} for professional photography quality.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstImage || !secondImage || !description.trim() || !lighting || !modelType || !clothingType) {
      alert("Harap lengkapi semua field yang diperlukan");
      return;
    }

    const formData = new FormData();
    formData.append("productImage", firstImage);
    formData.append("personImage", secondImage);
    formData.append("description", description);
    formData.append("lighting", lighting);
    formData.append("modelType", modelType);
    formData.append("clothingType", clothingType);

    onSubmit(formData);
  };

  return (
    <Card className="w-full bg-card border-border shadow-ai">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Shirt className="w-5 h-5 text-primary" />
          Fashion Try-On Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Kombinasikan pakaian dengan model untuk membuat foto fashion profesional
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Image Upload (Dress/Clothing) */}
          <div className="space-y-2">
            <Label htmlFor="first-image" className="flex items-center gap-2 text-foreground font-medium">
              <Shirt className="w-4 h-4 text-primary" />
              First Image (Dress/Clothing)
            </Label>
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-ai-surface hover:bg-ai-surface-hover transition-colors duration-200">
              {firstImagePreview ? (
                <div className="relative">
                  <Image
                    src={firstImagePreview}
                    alt="First image preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover shadow-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 shadow-lg"
                    onClick={removeFirstImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-primary/60 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload gambar pakaian/dress
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-200"
                    onClick={() => firstImageInputRef.current?.click()}
                  >
                    Pilih Gambar
                  </Button>
                </div>
              )}
              <input
                ref={firstImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleFirstImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Second Image Upload (Model) */}
          <div className="space-y-2">
            <Label htmlFor="second-image" className="flex items-center gap-2 text-foreground font-medium">
              <User className="w-4 h-4 text-primary" />
              Second Image (Men/Women/Child)
            </Label>
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-ai-surface hover:bg-ai-surface-hover transition-colors duration-200">
              {secondImagePreview ? (
                <div className="relative">
                  <Image
                    src={secondImagePreview}
                    alt="Second image preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeSecondImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload gambar model (pria/wanita/anak)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => secondImageInputRef.current?.click()}
                  >
                    Pilih Gambar
                  </Button>
                </div>
              )}
              <input
                ref={secondImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleSecondImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Clothing Type Dropdown */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground font-medium">
              <Palette className="w-4 h-4 text-primary" />
              Jenis Pakaian
            </Label>
            <Select value={clothingType} onValueChange={setClothingType}>
              <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary transition-colors duration-200">
                <SelectValue placeholder="Pilih jenis pakaian" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {clothingTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-accent/10 focus:bg-accent/10">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Type Dropdown */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground font-medium">
              <Users className="w-4 h-4 text-primary" />
              Jenis Model
            </Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary transition-colors duration-200">
                <SelectValue placeholder="Pilih jenis model" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {modelTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-accent/10 focus:bg-accent/10">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lighting Setup Dropdown */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground font-medium">
              <Camera className="w-4 h-4 text-primary" />
              Pengaturan Pencahayaan
            </Label>
            <Select value={lighting} onValueChange={setLighting}>
              <SelectTrigger className="border-border hover:border-primary/50 focus:border-primary transition-colors duration-200">
                <SelectValue placeholder="Pilih pengaturan pencahayaan" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {lightingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-accent/10 focus:bg-accent/10">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Deskripsi Adegan Akhir
            </Label>
            <Textarea
              id="description"
              placeholder="Jelaskan hasil akhir yang diinginkan, contoh: professional e-commerce fashion photo, realistic full-body shot, outdoor environment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none border-border hover:border-primary/50 focus:border-primary transition-colors duration-200 bg-background"
            />
          </div>

          {/* Prompt Preview */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPromptPreview(!showPromptPreview)}
              className="flex items-center gap-2 border-primary/30 hover:bg-accent/10 hover:border-accent transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              {showPromptPreview ? "Sembunyikan" : "Lihat"} Preview Prompt
            </Button>
            
            {showPromptPreview && (
              <div className="p-4 bg-ai-surface rounded-lg border border-primary/20 shadow-sm">
                <p className="text-sm font-medium mb-2 text-foreground">Preview Prompt:</p>
                <p className="text-sm text-muted-foreground">{generatePrompt()}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 font-medium py-3 text-white"
            disabled={isLoading || !firstImage || !secondImage || !description.trim() || !lighting || !modelType || !clothingType}
          >
            {isLoading ? "Membuat gambar..." : "Generate Fashion Photo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}