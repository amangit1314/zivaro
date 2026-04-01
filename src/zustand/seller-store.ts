import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

type SellerData = {
  id: string;
  shopName: string;
  shopSlug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  totalRevenue: number;
  pendingPayout: number;
  commissionRate: number;
};

type Analytics = {
  totalRevenue: number;
  pendingPayout: number;
  commissionRate: number;
  totalOrders: number;
  totalProducts: number;
  avgRating: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: any[];
  ordersByStatus: Record<string, number>;
};

type SellerState = {
  loading: boolean;
  error: string;
  seller: SellerData | null;
  products: any[];
  orders: any[];
  analytics: Analytics | null;
};

type SellerActions = {
  createShop: (userId: string, shopName: string, description: string) => Promise<void>;
  fetchSeller: (userId: string) => Promise<void>;
  fetchProducts: (sellerId: string) => Promise<void>;
  createProduct: (data: any) => Promise<void>;
  updateProduct: (productId: string, data: any) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchOrders: (sellerId: string) => Promise<void>;
  fetchAnalytics: (sellerId: string) => Promise<void>;
};

export const useSellerStore = create<SellerState & SellerActions>()(
  persist(
    (set, get) => ({
      loading: false,
      error: "",
      seller: null,
      products: [],
      orders: [],
      analytics: null,

      createShop: async (userId, shopName, description) => {
        set({ loading: true, error: "" });
        try {
          const res = await fetch("/api/seller", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, shopName, description }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set({ seller: data.data, loading: false });
          toast.success("Shop created successfully!");
        } catch (error: any) {
          set({ error: error.message, loading: false });
          toast.error(error.message);
        }
      },

      fetchSeller: async (userId) => {
        try {
          const res = await fetch(`/api/seller?userId=${userId}`);
          const data = await res.json();
          if (data.success) set({ seller: data.data });
        } catch (error) {
          console.error("Error fetching seller:", error);
        }
      },

      fetchProducts: async (sellerId) => {
        set({ loading: true });
        try {
          const res = await fetch(`/api/seller/products?sellerId=${sellerId}`);
          const data = await res.json();
          if (data.success) set({ products: data.data, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },

      createProduct: async (productData) => {
        set({ loading: true });
        try {
          const res = await fetch("/api/seller/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set((state) => ({ products: [data.data, ...state.products], loading: false }));
          toast.success("Product created!");
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.message);
        }
      },

      updateProduct: async (productId, productData) => {
        try {
          const res = await fetch(`/api/seller/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set((state) => ({
            products: state.products.map((p) => (p.id === productId ? data.data : p)),
          }));
          toast.success("Product updated!");
        } catch (error: any) {
          toast.error(error.message);
        }
      },

      deleteProduct: async (productId) => {
        try {
          const res = await fetch(`/api/seller/products/${productId}`, { method: "DELETE" });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set((state) => ({ products: state.products.filter((p) => p.id !== productId) }));
          toast.success("Product removed");
        } catch (error: any) {
          toast.error(error.message);
        }
      },

      fetchOrders: async (sellerId) => {
        set({ loading: true });
        try {
          const res = await fetch(`/api/seller/orders?sellerId=${sellerId}`);
          const data = await res.json();
          if (data.success) set({ orders: data.data, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },

      fetchAnalytics: async (sellerId) => {
        try {
          const res = await fetch(`/api/seller/analytics?sellerId=${sellerId}`);
          const data = await res.json();
          if (data.success) set({ analytics: data.data });
        } catch (error) {
          console.error("Error fetching analytics:", error);
        }
      },
    }),
    { name: "zivaro-seller-store",  }
  )
);
