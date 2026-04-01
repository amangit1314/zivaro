import { ProductSize } from "./product-size";

export type Product = {
  id: string;
  productRating: number;
  productName: string;
  productDescription: string;
  productImageLink: string;
  productPrice: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  tags?: string[];
  sellerName: string;
  sellerId?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  sizes: ProductSize[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
};

export type Coupon = {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount: number;
  isActive: boolean;
  expiresAt: string;
};
