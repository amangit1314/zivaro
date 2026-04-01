"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartItem } from "@/types/cart-item";
import { useCartStore } from "@/zustand/cart-store";
import Link from "next/link";
import React, { useState } from "react";
import { CartItemCard } from "./components/cart-item-card";
import PeopleAlsoBought from "./components/people-also-bought";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Ticket, ShoppingBag, Check } from "lucide-react";

const VALID_COUPONS: Record<
  string,
  { discountPercent: number; minOrderAmount: number; maxDiscount: number }
> = {
  WELCOME10: { discountPercent: 10, minOrderAmount: 50, maxDiscount: 25 },
  SAVE20: { discountPercent: 20, minOrderAmount: 100, maxDiscount: 50 },
  FLASH15: { discountPercent: 15, minOrderAmount: 75, maxDiscount: 30 },
  SUMMER25: { discountPercent: 25, minOrderAmount: 150, maxDiscount: 75 },
};

const CartPage = ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId!;
  const { cartItems } = useCartStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
          Shopping Cart
          {cartItems.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})
            </span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
            <p className="text-lg font-semibold text-gray-900">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-500">
              Looks like you haven&apos;t added anything yet
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:items-start lg:gap-8">
            {/* Cart items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((cartItem: CartItem) => (
                <CartItemCard key={cartItem.cartItemId} cartItem={cartItem} />
              ))}

              <PeopleAlsoBought />
            </div>

            {/* Order summary */}
            <OrderSummary userId={userId} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

const OrderSummary = ({ userId }: { userId: string }) => {
  const { totalItems, totalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const router = useRouter();

  const storePickup = totalItems >= 1 ? (totalPrice > 25 ? 0 : 5) : 0;
  const tax = Math.ceil(totalItems >= 1 ? totalPrice * 0.05 : 0);
  const sumTotal = totalPrice + tax + storePickup - couponDiscount;

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    const coupon = VALID_COUPONS[code];

    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }

    if (totalPrice < coupon.minOrderAmount) {
      toast.error(
        `Minimum order amount is $${coupon.minOrderAmount} for this coupon`
      );
      return;
    }

    const discount = Math.min(
      (totalPrice * coupon.discountPercent) / 100,
      coupon.maxDiscount
    );

    setCouponDiscount(Math.round(discount * 100) / 100);
    setAppliedCoupon(code);
    toast.success(`Coupon ${code} applied! You save $${discount.toFixed(2)}`);
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  return (
    <div className="lg:w-96 mt-8 lg:mt-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 sticky top-24">
        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

        {/* Summary items */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal ({totalItems} items)
            </span>
            <span className="font-medium text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium text-gray-900">
              {storePickup === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `$${storePickup}`
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Tax (5%)</span>
            <span className="font-medium text-gray-900">
              ${tax.toFixed(2)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-emerald-600 font-medium">
                Coupon ({appliedCoupon})
              </span>
              <span className="font-medium text-emerald-600">
                -${couponDiscount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              ${sumTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Coupon code input */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Ticket className="w-4 h-4" />
            <span>Have a coupon?</span>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">
                  {appliedCoupon}
                </span>
                <span className="text-xs text-emerald-600">
                  (-${couponDiscount.toFixed(2)})
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              <button
                onClick={applyCoupon}
                disabled={!couponCode.trim()}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Checkout button */}
        <button
          onClick={() => router.push(`/profile/${userId}/cart/checkout`)}
          disabled={totalPrice === 0}
          className="w-full py-3.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-red-600/25"
        >
          Proceed to Checkout
        </button>

        <Link
          href="/"
          className="block text-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
