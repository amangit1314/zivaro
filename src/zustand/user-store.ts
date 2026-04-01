import { Product } from "@/types/product";
import { Order, ProductSize, User } from "@prisma/client";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  loading: boolean;
  error: string;
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
};

type UserActions = {
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserOrders: (userId: string) => Promise<void>;
  // placeOrder: (
  //   product: Product,
  //   selectedProductSize: ProductSize,
  //   shippingAddress: string,
  //   mobileNumber: string,
  //   paymentMethod: string,
  //   totalPrice: number,
  //   totalQuantity: number
  // ) => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      loading: false,
      error: "",
      user: null,
      orders: [],
      isAuthenticated: false,
      register: async (email: string, password: string) => {
        try {
          set({
            error: "",
            loading: true,
          });
          const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({
              error: "Failed to register ...",
              loading: false,
            });
          }

          const data = await response.json();
          set({
            error: "",
            user: data?.data! as User,
            loading: false,
          });
        } catch (error) {
          console.error("Error in registering user ...", error);
          set({
            error: "Failed to register user in catch block ...",
            loading: false,
          });
        } finally {
          set({ loading: false });
        }
      },
      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({ error: `Login failed: ${response.statusText}` });
          }

          const data = await response.json();
          set({
            loading: false,
            user: data?.data! as User,
            isAuthenticated: true,
            error: "",
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            loading: false,
            error: "Failed to login. Please check your credentials.",
            user: null,
            isAuthenticated: false,
          });
        } finally {
          set({ loading: false });
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, orders: [], loading: false });
      },
      fetchUserOrders: async (userId: string) => {
        try {
          set({ loading: true });
          const response = await fetch(`/api/orders/user/${userId}`);

          if (!response.ok) {
            set({
              error: `Failed to fetch orders: ${response.statusText}`,
              loading: false,
            });
          }

          const data = await response.json();
          set({ orders: data?.data! as Order[], error: "", loading: false });
        } catch (error) {
          console.error("Fetch orders error:", error);
          set({ error: "Failed to fetch user orders ❌ ...", loading: false });
        } finally {
          set({ loading: false });
        }
      },

      // placeOrder: async (
      //   product: Product,
      //   selectedProductSize: ProductSize,
      //   shippingAddress: string,
      //   mobileNumber: string,

      //   paymentMethod: string,
      //   totalPrice: number,
      //   totalQuantity: number
      // ) => {
      //   set({ loading: true });

      //   try {
      //     if (!get().isAuthenticated) {
      //       set({ error: `User is not authenticated` });
      //     }

      //     const response = await fetch("/api/orders", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         userId: get().user?.id! as string,
      //         shippingAddress,
      //         mobileNumber,
      //         email: get().user?.email! as string,
      //         paymentMethod,
      //         orderItems: [
      //           {
      //             productName: product.productName,
      //             productImage: product.productImageLink,
      //             productPrice: product.productPrice,
      //             productRating: product.productRating,
      //             selectedSize: selectedProductSize,
      //             totalPrice: totalPrice,
      //             quantity: totalQuantity,
      //             selectedProductSize: selectedProductSize,
      //           },
      //         ],
      //         orderTotalPrice: totalPrice,
      //       }),
      //     });

      //     if (!response.ok) {
      //       set({
      //         error: `Failed to place order: ${response.statusText}`,
      //       });
      //     }

      //     const data = await response.json();

      //     // Assuming data.order contains the newly created order
      //     set((state) => ({
      //       orders: [...state.orders, data?.data! as Order],
      //       error: "",
      //     }));
      //   } catch (error) {
      //     console.error("Place single product order error:", error);
      //     set({ error: `Failed to place order, Error: ${error}` });
      //   } finally {
      //     set({ loading: false });
      //   }
      // },
    }),
    {
      name: "zivaro-user-store",
    }
  )
);
