import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

type WishlistItem = {
  id: string;
  productId: string;
  createdAt: string;
  product: any;
};

type WishlistState = {
  loading: boolean;
  error: string;
  items: WishlistItem[];
};

type WishlistActions = {
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, productId: string) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      loading: false,
      error: "",
      items: [],

      fetchWishlist: async (userId) => {
        set({ loading: true });
        try {
          const res = await fetch(`/api/wishlist?userId=${userId}`);
          const data = await res.json();
          if (data.success) set({ items: data.data, loading: false, error: "" });
        } catch (error) {
          set({ loading: false, error: "Failed to fetch wishlist" });
        }
      },

      addToWishlist: async (userId, productId) => {
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
          });
          const data = await res.json();
          if (data.success) {
            await get().fetchWishlist(userId);
            toast.success("Added to wishlist");
          }
        } catch (error) {
          toast.error("Failed to add to wishlist");
        }
      },

      removeFromWishlist: async (userId, productId) => {
        try {
          const res = await fetch("/api/wishlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
          });
          const data = await res.json();
          if (data.success) {
            set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
            toast.success("Removed from wishlist");
          }
        } catch (error) {
          toast.error("Failed to remove from wishlist");
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    { name: "zivaro-wishlist-store",  }
  )
);
