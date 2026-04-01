"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useUserStore } from "@/zustand/user-store";
import { useWishlistStore } from "@/zustand/wishlist-store";
import { useCartStore } from "@/zustand/cart-store";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function WishlistPage({ params }: { params: { userId: string } }) {
  const { user, isAuthenticated } = useUserStore();
  const { items, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && params.userId) fetchWishlist(params.userId);
  }, [isAuthenticated, params.userId, fetchWishlist]);

  const handleAddToCart = (product: any) => {
    addToCart({
      cartItemId: uuidv4(),
      userId: params.userId,
      productId: product.id,
      productName: product.productName,
      sellerName: product.sellerName,
      productPrice: product.productPrice,
      productImage: product.productImageLink,
      totalQuantity: 1,
      totalPrice: product.productPrice,
      selectedProductSize: product.sizes?.[0] || { name: "One Size", availableQuantity: 10, inStock: true },
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Heart className="w-16 h-16 text-gray-200 mx-auto" />
            <p className="text-lg font-semibold text-gray-900">Your wishlist is empty</p>
            <p className="text-sm text-gray-500">Browse products and tap the heart icon to save favorites</p>
            <Link href="/" className="inline-block mt-4 px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                <Link href={`/products/${item.productId}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image src={item.product.productImageLink} alt={item.product.productName} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    {item.product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{item.product.discount}%</span>
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-400 uppercase">{item.product.sellerName}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.productName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${item.product.productPrice}</span>
                    {item.product.originalPrice && item.product.originalPrice > item.product.productPrice && (
                      <span className="text-sm text-gray-400 line-through">${item.product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleAddToCart(item.product)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button onClick={() => removeFromWishlist(params.userId, item.productId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
