"use client";

import { Header } from "@/components/header";
import { HeroBanner } from "@/components/hero-banner";
import { CategoryStrip } from "@/components/category-strip";
import { DealsSection, FeaturedSection } from "@/components/deals-section";
import { CouponBanner } from "@/components/coupon-banner";
import { CustomizeBanner } from "@/components/customize-banner";
import { ProductCard } from "@/components/product-card";
import { Footer } from "@/components/footer";
import { useProductsStore } from "@/zustand/products-store";
import { useEffect } from "react";

export default function Home() {
  const { loading, products, fetchProducts, error } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-semibold">Something went wrong</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 pb-8">
        {/* Hero */}
        <section className="pt-6">
          <HeroBanner />
        </section>

        {/* Categories */}
        <section>
          <CategoryStrip />
        </section>

        {/* Coupons */}
        <CouponBanner />

        {/* Customize Your Products */}
        <CustomizeBanner />

        {/* Hot Deals */}
        <DealsSection products={products} />

        {/* Featured */}
        <FeaturedSection products={products} />

        {/* All Products */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              All Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Browse our complete collection
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 rounded-xl aspect-[3/4]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
