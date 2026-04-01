"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

export const ProductCard = ({ product }: { product: Product }) => {
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.productImageLink}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {product.sellerName}
            </p>
            <div className="flex items-center space-x-1">
              <svg
                className="w-3.5 h-3.5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <span className="text-xs font-semibold text-gray-600">
                {product.productRating}
              </span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
            {product.productName}
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.productPrice}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.category && (
            <span className="inline-block text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
              {product.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
