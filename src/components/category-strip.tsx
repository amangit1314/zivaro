"use client";

import Link from "next/link";

const categories = [
  { name: "All", slug: "all", icon: "M4 6h16M4 12h16M4 18h16" },
  {
    name: "Clothing",
    slug: "clothing",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    name: "Shoes",
    slug: "shoes",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.75 1.75 0 003 15.546M12 2l3 7H9l3-7z",
  },
  {
    name: "Sports",
    slug: "sports",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  },
];

export const CategoryStrip = ({
  activeCategory,
}: {
  activeCategory?: string;
}) => {
  return (
    <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug || (!activeCategory && cat.slug === "all");
        return (
          <Link
            key={cat.slug}
            href={cat.slug === "all" ? "/" : `/categories/${cat.slug}`}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? "bg-gray-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
            </svg>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
