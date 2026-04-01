"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Shirt,
  Footprints,
  Monitor,
  Watch,
  Dumbbell,
} from "lucide-react";

const categories = [
  {
    name: "Clothing",
    slug: "clothing",
    description: "T-shirts, jackets, dresses, pants and more",
    icon: Shirt,
    color: "from-blue-500 to-blue-600",
    count: "4 products",
  },
  {
    name: "Shoes",
    slug: "shoes",
    description: "Running shoes, sneakers, and casual footwear",
    icon: Footprints,
    color: "from-emerald-500 to-emerald-600",
    count: "2 products",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Headphones, smartwatches, and tech gadgets",
    icon: Monitor,
    color: "from-purple-500 to-purple-600",
    count: "2 products",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Wallets, bags, bottles, and everyday essentials",
    icon: Watch,
    color: "from-amber-500 to-amber-600",
    count: "3 products",
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Yoga mats, fitness gear, and sports equipment",
    icon: Dumbbell,
    color: "from-red-500 to-red-600",
    count: "1 product",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Browse products by category to find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {cat.description}
                  </p>
                  <p className="text-xs font-medium text-gray-400 mt-3">
                    {cat.count}
                  </p>

                  <svg
                    className="absolute top-6 right-6 w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
