"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCustomizeStore } from "@/zustand/customize-store";
import Link from "next/link";
import Image from "next/image";
import { Paintbrush, ArrowRight, Sparkles } from "lucide-react";

export default function CustomizePage() {
  const { products, loading, error, fetchProducts } = useCustomizeStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* Hero Section */}
        <section className="pt-8 pb-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Personalize Your Products
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Create Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                Unique
              </span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Choose a product, upload your image or add custom text, and we&apos;ll
              make it just for you. Only{" "}
              <span className="font-semibold text-gray-900">+$5</span> for
              customization.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Choose a Product",
                desc: "Pick from t-shirts, mugs, phone cases, hoodies & more",
              },
              {
                step: "2",
                title: "Add Your Design",
                desc: "Upload an image or type custom text with live preview",
              },
              {
                step: "3",
                title: "Add to Cart",
                desc: "Review your design and add it to cart for just +$5 extra",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Customizable Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {products.length} products available for customization
              </p>
            </div>
          </div>

          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 font-semibold">
                Failed to load products
              </p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          )}

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
                <Link
                  href={`/customize/${product.id}`}
                  key={product.id}
                  className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-md uppercase">
                        Customizable
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-md">
                        +${product.customizationFee}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-base font-bold text-gray-900">
                          ${product.basePrice}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          + ${product.customizationFee} custom
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 font-medium">
                      <Paintbrush className="w-3 h-3" />
                      Customize Now
                      <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
