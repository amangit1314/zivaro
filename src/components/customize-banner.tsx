"use client";

import Link from "next/link";
import { Paintbrush, Upload, Sparkles, ArrowRight } from "lucide-react";

export function CustomizeBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-14 flex flex-col lg:flex-row items-center gap-8">
        {/* Left content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            New Feature
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Design Your Own{" "}
            <span className="text-yellow-300">Custom Products</span>
          </h2>

          <p className="text-white/80 text-sm sm:text-base max-w-lg mb-6">
            Upload your image or add custom text to t-shirts, mugs, phone cases,
            hoodies & more. Make it uniquely yours for just{" "}
            <span className="font-bold text-white">+$5</span> extra.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <Link
              href="/customize"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              <Paintbrush className="w-4 h-4" />
              Start Customizing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/customize"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Right - feature highlights */}
        <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full max-w-xs">
          {[
            {
              icon: Upload,
              title: "Upload Image",
              desc: "Your photos on products",
            },
            {
              icon: Paintbrush,
              title: "Custom Text",
              desc: "Names, quotes & more",
            },
            {
              icon: Sparkles,
              title: "Live Preview",
              desc: "See before you buy",
            },
            {
              title: "+$5 Only",
              desc: "Affordable customization",
              highlight: true,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl ${
                item.highlight
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-white/15 backdrop-blur-sm text-white"
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5 mb-1.5" />}
              {item.highlight && (
                <span className="text-2xl font-bold block mb-0.5">
                  {item.title}
                </span>
              )}
              {!item.highlight && (
                <p className="text-sm font-semibold">{item.title}</p>
              )}
              <p
                className={`text-xs ${
                  item.highlight ? "text-gray-700" : "text-white/70"
                }`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
