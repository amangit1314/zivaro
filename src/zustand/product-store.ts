import { CartItem } from "@/types/cart-item";
import { Product } from "@/types/product";
import { ProductSize } from "@/types/product-size";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductState {
  loading: boolean;
  error: string;
  productDetails: Product | null;
  cart: CartItem[];
  selectedSize: ProductSize | null;
  selectedQuantity: number;
}

type ProductActions = {
  fetchProductDetails: (productId: string) => Promise<void>;
  changeQuantity: (productId: string, quantity: number) => void;
  setSelectedSize: (size: ProductSize) => void;
  placeOrder: (
    userId: string,
    shippingAddress: string,
    mobileNumber: string,
    email: string,
    paymentMethod: string
  ) => Promise<void>;
};

export const useProductStore = create<ProductState & ProductActions>()(
  persist(
    (set, get) => ({
      loading: true,
      error: "",
      productDetails: null,
      cart: [],
      selectedSize: null,
      selectedQuantity: 1,
      fetchProductDetails: async (productId: string) => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) {
            console.log(
              `Failed to fetch product details: ${response.statusText}`
            );
            set({
              loading: false,
              error: `Failed to fetch product details: ${response.statusText}`,
            });
            return;
          }

          const data = await response.json();
          const product: Product = data?.data!;

          set({
            error: "",
            loading: false,
            productDetails: product,
          });

          console.log("Product details:", product);
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
      changeQuantity: (productId: string, quantity: number) => {
        const state = get();
        const updatedCart = state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ cart: updatedCart, loading: false });
      },
      setSelectedSize: (size: ProductSize) => {
        set({ selectedSize: size });
      },
      placeOrder: async (
        userId: string,
        shippingAddress: string,
        mobileNumber: string,
        email: string,
        paymentMethod: string
      ) => {
 

        try {
          set({ loading: true });

          const { productDetails, selectedSize, selectedQuantity } = get();

          if (!productDetails || productDetails == null) {
            set({ error: "No product selected for ordering." });
          }

          const orderItem = {
            productId: productDetails?.id!,
            productName: productDetails?.productName! as string,
            productImageLink: productDetails?.productImageLink! as string,
            sellerName: productDetails?.sellerName! as string,
            selectedSize: selectedSize ?? productDetails?.sizes[0],
            quantity: selectedQuantity ?? 1,
            totalPrice: productDetails?.productPrice!,
          };

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              shippingAddress,
              mobileNumber,
              email,
              paymentMethod,
              orderItem,
            }),
          });

          if (!response.ok) {
            set({ error: `Failed to place order: ${response.statusText}` });
          }

          const data = await response.json();

          set({
            selectedQuantity: 1,
            selectedSize: productDetails?.sizes[0],
          });

          console.log("Order placed successfully:", data);
        } catch (error: any) {
          console.error("Place order error:", error);
          set({ error: "Failed to place order", loading: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "zivaro-product-store",
    }
  )
);

/**
 *    ACTIONS:
 *      // addToCart: (cartItem: CartItem) => void;
  // removeFromCart: (productId: string) => void;
 * 
 *      addToCart: (cartItem: CartItem) => {
        const state = get();
        const existingItem = state.cart.find(
          (item) => item.productId === cartItem.productId
        );

        if (existingItem) {
          const updatedCart = state.cart.map((item) =>
            item.productId === cartItem.productId
              ? {
                  ...item,
                  quantity: item.totalQuantity + cartItem.totalQuantity,
                }
              : item
          );
          set({ cart: updatedCart });
        } else {
          set({ cart: [...state.cart, cartItem] });
        }
      },
      removeFromCart: (productId: string) => {
        const state = get();
        const updatedCart = state.cart.filter(
          (item) => item.productId !== productId
        );
        set({ cart: updatedCart });
      },
 */
