import { CartItem } from "@/types/cart-item";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  loading: boolean;
  error: string;
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartActions = {
  addToCart: (newCartItem: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (
    userId: string,
    shippingAddress: string,
    mobileNumber: string,
    email: string,
    paymentMethod: string
  ) => Promise<void>;
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      loading: true,
      error: "",
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      fetchCartItems: () => {},
      addToCart: (newCartItem: CartItem) => {
        const { cartItems, totalItems, totalPrice } = get();

        // Check if the item with the same productId and selectedProductSize already exists in the cart
        const existingItemIndex = cartItems.findIndex(
          (item) =>
            item.productId === newCartItem.productId &&
            item.selectedProductSize.name ===
              newCartItem.selectedProductSize.name
        );

        if (existingItemIndex !== -1) {
          // Increment quantity and total price for the existing item with the same size
          const updatedCartItems = cartItems.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  totalQuantity: item.totalQuantity + newCartItem.totalQuantity,
                  totalPrice: item.totalPrice + newCartItem.totalPrice,
                }
              : item
          );

          set({
            loading: false,
            cartItems: updatedCartItems,
            totalItems: totalItems + newCartItem.totalQuantity,
            totalPrice: totalPrice + newCartItem.totalPrice,
          });
        } else {
          // Add the new item to the cart if the size is different
          set({
            loading: false,
            cartItems: [...cartItems, newCartItem],
            totalItems: totalItems + newCartItem.totalQuantity,
            totalPrice: totalPrice + newCartItem.totalPrice,
          });
        }
      },
      removeFromCart: (cartItemId: string) => {
        set((state) => {
          const itemToRemove = state.cartItems.find(
            (item) => item.cartItemId === cartItemId
          );
          if (!itemToRemove) return state;

          const updatedCartItems = state.cartItems.filter(
            (item) => item.cartItemId !== cartItemId
          );

          return {
            loading: false,
            cartItems: updatedCartItems,
            totalItems: state.totalItems - itemToRemove.totalQuantity,
            totalPrice: state.totalPrice - itemToRemove.totalPrice,
          };
        });
      },
      updateQuantity: (cartItemId: string, quantity: number) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          (item) => item.cartItemId === cartItemId
        );

        if (!existingItem) {
          set({
            loading: false,
            error: "No such item exists in the cart...",
          });
          return;
        }

        if (quantity <= 0) {
          set((state) => {
            const updatedCartItems = state.cartItems.filter(
              (item) => item.cartItemId !== cartItemId
            );
            return {
              loading: false,
              cartItems: updatedCartItems,
              totalItems: state.totalItems - existingItem.totalQuantity,
              totalPrice: state.totalPrice - existingItem.totalPrice,
            };
          });
        } else {
          set((state) => {
            const updatedCartItems = state.cartItems.map((item) =>
              item.cartItemId === cartItemId
                ? {
                    ...item,
                    totalQuantity: quantity,
                    totalPrice: item.productPrice * quantity,
                  }
                : item
            );
            const updatedTotalPrice = updatedCartItems.reduce(
              (acc, item) => acc + item.totalPrice,
              0
            );
            return {
              loading: false,
              cartItems: updatedCartItems,
              totalPrice: updatedTotalPrice,
            };
          });
        }
      },

      clearCart: () =>
        set({ loading: false, cartItems: [], totalItems: 0, totalPrice: 0 }),
      placeOrder: async (
        userId: string,
        shippingAddress: string,
        mobileNumber: string,
        email: string,
        paymentMethod: string
      ) => {
        set({ loading: true });

        try {
          const { cartItems, totalPrice } = get();

          if (cartItems.length === 0) {
            set({ error: "Cart is empty 🗳" });
          }

          const response = await fetch("/api/orders/cart", {
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
              cartItems,
              totalPrice,
            }),
          });

          if (!response.ok) {
            set({
              error: `Failed to place order: ${response.statusText}`,
            });
          }

          set({
            cartItems: [],
            totalItems: 0,
            totalPrice: 0,
          });
        } catch (error) {
          console.error("Place order error:", error);
          set({ error: "Failed to place order", loading: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "zivaro-cart-store",
    }
  )
);
