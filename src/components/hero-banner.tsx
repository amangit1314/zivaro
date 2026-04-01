"use client";

import Link from "next/link";

export const HeroBanner = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(239,68,68,0.15),transparent_50%)]" />
      </div>

      <div className="relative px-8 py-16 md:px-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-6 max-w-lg">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span>New Season Arrivals</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Up to <span className="text-red-500">40% Off</span>
            <br />
            Summer Collection
          </h1>

          <p className="text-gray-400 text-base leading-relaxed">
            Discover the latest trends with exclusive deals. Use code{" "}
            <span className="text-red-400 font-semibold">WELCOME10</span> for
            an extra 10% off your first order.
          </p>

          <div className="flex space-x-4">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-600/25"
            >
              Shop Now
              <svg
                className="w-4 h-4 ml-2"
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
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center px-8 py-3.5 border border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-400 hover:text-white transition-all duration-200"
            >
              Categories
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 mt-8 md:mt-0">
          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-white">200+</p>
            <p className="text-gray-500 text-sm">Products</p>
          </div>
          <div className="w-px h-12 bg-gray-700" />
          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-gray-500 text-sm">Brands</p>
          </div>
          <div className="w-px h-12 bg-gray-700" />
          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-white">4.8</p>
            <p className="text-gray-500 text-sm">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};
