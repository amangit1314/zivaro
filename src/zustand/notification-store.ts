import { create } from "zustand";
import { persist } from "zustand/middleware";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
};

type NotificationActions = {
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
  clearAll: () => void;
};

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      fetchNotifications: async (userId) => {
        try {
          const res = await fetch(`/api/notifications?userId=${userId}`);
          const data = await res.json();
          if (data.success) {
            set({ notifications: data.data.notifications, unreadCount: data.data.unreadCount });
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      },

      markAsRead: async (notificationId) => {
        try {
          await fetch("/api/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId }),
          });
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        } catch (error) {
          console.error("Error marking notification:", error);
        }
      },

      markAllRead: async (userId) => {
        try {
          await fetch("/api/notifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAll: true, userId }),
          });
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }));
        } catch (error) {
          console.error("Error marking all notifications:", error);
        }
      },

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: "zivaro-notification-store",  }
  )
);
