export type CustomizableProduct = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  customizationFee: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
};

export type CustomizationData = {
  productId: string;
  customText: string;
  customImage: string | null;
  selectedColor: string;
  selectedSize: string;
  fontSize: number;
  textColor: string;
  textPosition: "top" | "center" | "bottom";
};
