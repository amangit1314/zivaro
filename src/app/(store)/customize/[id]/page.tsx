"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCustomizeStore } from "@/zustand/customize-store";
import { useCartStore } from "@/zustand/cart-store";
import { useUserStore } from "@/zustand/user-store";
import {
  Upload,
  Type,
  ArrowLeft,
  ShoppingBag,
  Check,
  X,
  RotateCcw,
  Palette,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CustomizeProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { products, fetchProducts } = useCustomizeStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated, user } = useUserStore();

  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textPosition, setTextPosition] = useState<"top" | "center" | "bottom">(
    "center"
  );
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");
  const [added, setAdded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Draw preview on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !product) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Background - product mockup area
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, 400, 400);

    // Draw product image
    const productImg = new window.Image();
    productImg.crossOrigin = "anonymous";
    productImg.onload = () => {
      ctx.drawImage(productImg, 0, 0, 400, 400);

      // Semi-transparent overlay for the customization area
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      const areaX = 80;
      const areaY = 80;
      const areaW = 240;
      const areaH = 240;
      ctx.fillRect(areaX, areaY, areaW, areaH);
      ctx.strokeRect(areaX, areaY, areaW, areaH);
      ctx.setLineDash([]);

      // Draw custom image if uploaded
      if (customImage) {
        const img = new window.Image();
        img.onload = () => {
          const maxW = 200;
          const maxH = 200;
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          const drawW = img.width * ratio;
          const drawH = img.height * ratio;
          const drawX = 200 - drawW / 2;
          const drawY = 200 - drawH / 2;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);

          // Draw text on top if both exist
          drawText(ctx);
        };
        img.src = customImage;
      } else {
        drawText(ctx);
      }
    };
    productImg.src = product.image;

    function drawText(ctx: CanvasRenderingContext2D) {
      if (!customText) return;

      ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1;

      let y = 200;
      if (textPosition === "top") y = 130;
      if (textPosition === "bottom") y = 300;

      // Word wrap
      const words = customText.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > 220) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const lineHeight = fontSize * 1.3;
      const startY = y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        const ly = startY + i * lineHeight;
        ctx.strokeText(line, 200, ly);
        ctx.fillText(line, 200, ly);
      });
    }
  }, [product, customText, customImage, fontSize, textColor, textPosition]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCustomImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    if (!customText && !customImage) {
      toast.error("Please add custom text or upload an image");
      return;
    }

    if (!product) return;

    const totalPrice = product.basePrice + product.customizationFee;

    addToCart({
      cartItemId: `${product.id}_custom_${Date.now()}`,
      userId: user.id,
      productId: product.id,
      productName: `${product.name} (Custom)`,
      sellerName: "Custom Studio",
      productPrice: totalPrice,
      productImage: product.image,
      totalQuantity: 1,
      totalPrice: totalPrice,
      selectedProductSize: {
        name: `${selectedSize} / ${selectedColor}`,
        availableQuantity: 99,
        inStock: true,
      },
    });

    setAdded(true);
    toast.success("Custom product added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  const resetCustomization = () => {
    setCustomText("");
    setCustomImage(null);
    setFontSize(24);
    setTextColor("#ffffff");
    setTextPosition("center");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-64 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <Link
          href="/customize"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customizable Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Preview */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full aspect-square"
                style={{ imageRendering: "auto" }}
              />
              {!customText && !customImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl">
                    <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Your design preview will appear here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload an image or add text to get started
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-md">
                {product.category}
              </span>
              <span>{product.colors.length} colors</span>
              <span>{product.sizes.length} sizes</span>
            </div>
          </div>

          {/* Right - Controls */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {product.description}
              </p>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-bold text-gray-900">
                  $
                  {(product.basePrice + product.customizationFee).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.basePrice.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  +${product.customizationFee} customization
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Color: {selectedColor}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedColor === color
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Size: {selectedSize}
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedSize === size
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Tabs */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "image"
                      ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "text"
                      ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Custom Text
                </button>
              </div>

              <div className="p-4">
                {activeTab === "image" ? (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {customImage ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={customImage}
                          alt="Custom upload"
                          className="w-full h-40 object-contain rounded-lg bg-gray-50"
                        />
                        <button
                          onClick={() => {
                            setCustomImage(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG up to 5MB
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Enter your custom text..."
                      maxLength={50}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{customText.length}/50</span>
                    </div>

                    {/* Text styling controls */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Font Size
                        </label>
                        <input
                          type="range"
                          min={12}
                          max={48}
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full accent-purple-500"
                        />
                        <span className="text-xs text-gray-400">{fontSize}px</span>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Position
                        </label>
                        <select
                          value={textPosition}
                          onChange={(e) =>
                            setTextPosition(
                              e.target.value as "top" | "center" | "bottom"
                            )
                          }
                          className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        >
                          <option value="top">Top</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={added || (!customText && !customImage)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : !customText && !customImage
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart - $
                    {(product.basePrice + product.customizationFee).toFixed(2)}
                  </>
                )}
              </button>

              <button
                onClick={resetCustomization}
                className="p-3.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
                title="Reset customization"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Info note */}
            <p className="text-xs text-gray-400 text-center">
              Customized products are non-refundable. Please review your design
              carefully before purchasing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
