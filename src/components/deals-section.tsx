"use client";

import { Product } from "@/types/product";
import { ProductCard } from "./product-card";
import Link from "next/link";

export const DealsSection = ({ products }: { products: Product[] }) => {
  const dealsProducts = products.filter(
    (p) => p.isOnSale && p.discount && p.discount > 0
  );

  if (dealsProducts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Hot Deals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Limited time offers you don&apos;t want to miss
          </p>
        </div>
        <Link
          href="/search?sale=true"
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          View all deals →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dealsProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export const FeaturedSection = ({ products }: { products: Product[] }) => {
  const featured = products.filter((p) => p.isFeatured);

  if (featured.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Handpicked selections just for you
          </p>
        </div>
        <Link
          href="/search?featured=true"
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          See more →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featured.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
