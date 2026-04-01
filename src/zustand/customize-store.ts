import { CustomizableProduct } from "@/types/customizable-product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CustomizeState = {
  products: CustomizableProduct[];
  loading: boolean;
  error: string;
};

type CustomizeActions = {
  fetchProducts: () => Promise<void>;
};

export const useCustomizeStore = create<CustomizeState & CustomizeActions>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: "",

      fetchProducts: async () => {
        if (get().products.length > 0) {
          set({ loading: false });
          return;
        }

        set({ loading: true, error: "" });
        try {
          const res = await fetch("/customizable-products.json");
          if (!res.ok) throw new Error("Failed to load customizable products");
          const data = await res.json();
          set({ products: data, loading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unknown error",
            loading: false,
          });
        }
      },
    }),
    {
      name: "zivaro-customize-store",
    }
  )
);
