"use client";

import { useState } from "react";
import { Ticket, Copy, Check } from "lucide-react";

const promos = [
  { code: "WELCOME10", label: "10% off your first order", minOrder: "$50" },
  { code: "SAVE20", label: "20% off orders over $100", minOrder: "$100" },
  { code: "SUMMER25", label: "25% off orders over $150", minOrder: "$150" },
];

export const CouponBanner = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <Ticket className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-bold text-gray-900">Available Coupons</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {promos.map((promo) => (
          <div
            key={promo.code}
            className="relative flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-dashed border-red-200 rounded-xl"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {promo.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Min. order: {promo.minOrder}
              </p>
            </div>
            <button
              onClick={() => copyCode(promo.code)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              {copiedCode === promo.code ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{promo.code}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
