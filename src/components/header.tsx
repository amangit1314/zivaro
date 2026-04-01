"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/user-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Bell, Gift } from "lucide-react";
import { useCartStore } from "@/zustand/cart-store";
import { useNotificationStore } from "@/zustand/notification-store";
import { useRewardStore } from "@/zustand/reward-store";
import UserAvatar from "./user-avatar";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { isAuthenticated, user } = useUserStore();
  const { cartItems } = useCartStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { totalPoints, fetchRewards } = useRewardStore();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications(user.id);
      fetchRewards(user.id);
    }
  }, [isAuthenticated, user?.id, fetchNotifications, fetchRewards]);

  const goToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(`/profile/${user?.id!}/cart`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Shop", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Rewards", href: "/rewards" },
    { label: "Deals", href: "/search?sale=true" },
    { label: "Sell", href: "/seller/dashboard" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tight flex-shrink-0">
              <span className="text-red-500 font-extrabold">Z</span>ivaro
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 ml-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1">
              {/* Search toggle */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <Search className="w-5 h-5" />
              </button>

              {/* Rewards */}
              {mounted && isAuthenticated && (
                <Link href="/rewards" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{totalPoints}</span>
                </Link>
              )}

              {/* Notifications */}
              {mounted && isAuthenticated && (
                <Link href={`/profile/${user?.id}`} className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <button onClick={goToCart} className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* User avatar */}
              {mounted && <UserAvatar />}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar dropdown */}
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, brands..."
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
