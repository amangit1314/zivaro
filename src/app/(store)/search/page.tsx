"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { useProductsStore } from "@/zustand/products-store";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = ["all", "clothing", "shoes", "electronics", "accessories", "sports-fitness", "home-living", "beauty", "books"];
const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const saleOnly = searchParams.get("sale") === "true";
  const featuredOnly = searchParams.get("featured") === "true";

  const { products, fetchProducts } = useProductsStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.productDescription.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sale filter
    if (saleOnly) {
      result = result.filter((p) => p.isOnSale && p.discount && p.discount > 0);
    }

    // Featured filter
    if (featuredOnly) {
      result = result.filter((p) => p.isFeatured);
    }

    // Price range
    result = result.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.productPrice - b.productPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.productPrice - a.productPrice);
        break;
      case "rating":
        result.sort((a, b) => b.productRating - a.productRating);
        break;
      case "discount":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    return result;
  }, [products, query, selectedCategory, sortBy, priceRange, saleOnly, featuredOnly]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search header */}
        <div className="space-y-6 mb-8">
          <SearchBar defaultValue={query} className="max-w-2xl" />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query
                  ? `Results for "${query}"`
                  : saleOnly
                  ? "On Sale"
                  : featuredOnly
                  ? "Featured Products"
                  : "All Products"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 flex-shrink-0 space-y-6`}
          >
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Category
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                      selectedCategory === cat
                        ? "bg-gray-900 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Price Range
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full accent-red-500"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Sort By
              </h3>
              <div className="space-y-1.5">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      sortBy === option.value
                        ? "bg-red-50 text-red-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters */}
            {(selectedCategory !== "all" || saleOnly || featuredOnly) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Active Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                    >
                      <span className="capitalize">{selectedCategory}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <p className="text-lg font-semibold text-gray-900">
                  No products found
                </p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
