"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useUserStore } from "@/zustand/user-store";
import { useCartStore } from "@/zustand/cart-store";
import {
  ShoppingBag,
  Heart,
  Store,
  ChevronRight,
  Package,
  CreditCard,
  MapPin,
  User,
} from "lucide-react";

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const { user, orders, isAuthenticated, fetchUserOrders } = useUserStore();
  const { cartItems } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && params.userId) {
      fetchUserOrders(params.userId);
    }
  }, [isAuthenticated, params.userId, fetchUserOrders]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
          <User className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to view your profile
          </h1>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const quickLinks = [
    {
      icon: Package,
      label: "My Orders",
      description: `${orders.length} order${orders.length !== 1 ? "s" : ""}`,
      href: `/profile/${user.id}/orders`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: ShoppingBag,
      label: "Shopping Cart",
      description: `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`,
      href: `/profile/${user.id}/cart`,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Heart,
      label: "Wishlist",
      description: "Saved items",
      href: `/profile/${user.id}/wishlist`,
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Store,
      label: "Seller Dashboard",
      description: "Manage your store",
      href: "/seller/dashboard",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.email?.split("@")[0]}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Member since{" "}
                {new Date(user.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {cartItems.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cart Items</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Wishlist</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-2xl font-bold text-red-500">3</p>
            <p className="text-xs text-gray-500 mt-1">Coupons</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Payment Methods
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  No payment methods saved
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shipping Addresses
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  No addresses saved
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
