import { Product } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductsState = {
  loading: boolean;
  error: string;
  products: Product[];
};

type ProductsActions = {
  fetchProducts: () => Promise<void>;
  // filterProducts: (queries: string[]) => Promise<void>;
};

export const useProductsStore = create<ProductsState & ProductsActions>()(
  persist(
    (set, get) => ({
      loading: true,
      error: "",
      products: [],
      fetchProducts: async () => {
        const state = get();
        try {
          set({ loading: true });
          const response = await fetch(`/api/products`);
          if (!response.ok) {
            console.log(`Failed to fetch products: ${response.statusText}`);
            set({
              loading: false,
              error: `Failed to fetch products: ${response.statusText}`,
            });
            return;
          }

          const data = await response.json();
          const products: Product[] = data?.data!;

          const uniqueProducts = products.filter(
            (product) => !state.products.some((p) => p.id === product.id)
          );

          set({
            error: "",
            loading: false,
            products: [...state.products, ...uniqueProducts],
          });

          // console.log("Unique products added to the store:", uniqueProducts);
        } catch (error: any) {
          console.error(
            "Error fetching products in catch block:",
            error.message
          );
          set({
            loading: false,
            error: `Error fetching products, ${error.message!}`,
          });
        }
      },
      // filterProducts: async (queries: string[]) => {},
    }),
    {
      name: "zivaro-products-store",
    }
  )
);
