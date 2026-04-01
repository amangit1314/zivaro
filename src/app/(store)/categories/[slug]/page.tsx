"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { CategoryStrip } from "@/components/category-strip";
import { useProductsStore } from "@/zustand/products-store";
import { ChevronRight } from "lucide-react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { products, fetchProducts } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === params.slug);
  }, [products, params.slug]);

  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href="/categories"
            className="hover:text-gray-900 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">{categoryName}</span>
        </nav>

        {/* Category header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {categoryProducts.length} product
            {categoryProducts.length !== 1 ? "s" : ""} in this category
          </p>
        </div>

        {/* Category nav */}
        <CategoryStrip activeCategory={params.slug} />

        {/* Products */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-lg font-semibold text-gray-900">
              No products in this category yet
            </p>
            <p className="text-sm text-gray-500">
              Check back later for new arrivals
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
