import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

type RewardPoint = {
  id: string;
  points: number;
  reason: string;
  description: string | null;
  createdAt: string;
};

type RewardState = {
  loading: boolean;
  error: string;
  totalPoints: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  streak: number;
  lastCheckIn: string | null;
  history: RewardPoint[];
  lastSpinDate: string | null;
};

type RewardActions = {
  fetchRewards: (userId: string) => Promise<void>;
  dailyCheckIn: (userId: string) => Promise<void>;
  spinWheel: (userId: string) => Promise<number>;
  canSpin: () => boolean;
  canCheckIn: () => boolean;
};

export const useRewardStore = create<RewardState & RewardActions>()(
  persist(
    (set, get) => ({
      loading: false,
      error: "",
      totalPoints: 0,
      tier: "BRONZE",
      streak: 0,
      lastCheckIn: null,
      history: [],
      lastSpinDate: null,

      fetchRewards: async (userId) => {
        set({ loading: true });
        try {
          const res = await fetch(`/api/rewards?userId=${userId}`);
          const data = await res.json();
          if (data.success) {
            set({
              totalPoints: data.data.totalPoints,
              tier: data.data.tier,
              streak: data.data.streak,
              lastCheckIn: data.data.lastCheckIn,
              history: data.data.history,
              loading: false,
            });
          }
        } catch (error) {
          set({ loading: false, error: "Failed to fetch rewards" });
        }
      },

      dailyCheckIn: async (userId) => {
        set({ loading: true });
        try {
          const res = await fetch("/api/rewards/check-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set({
            totalPoints: data.data.totalPoints,
            streak: data.data.streak,
            tier: data.data.rewardTier,
            lastCheckIn: new Date().toISOString(),
            loading: false,
          });
          toast.success(data.message);
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.message);
        }
      },

      spinWheel: async (userId) => {
        set({ loading: true });
        try {
          const res = await fetch("/api/rewards/spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          set({
            totalPoints: data.data.totalPoints,
            tier: data.data.tier,
            lastSpinDate: new Date().toDateString(),
            loading: false,
          });
          return data.data.pointsWon;
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.message);
          return 0;
        }
      },

      canSpin: () => {
        const last = get().lastSpinDate;
        return !last || last !== new Date().toDateString();
      },

      canCheckIn: () => {
        const last = get().lastCheckIn;
        if (!last) return true;
        return new Date(last).toDateString() !== new Date().toDateString();
      },
    }),
    { name: "zivaro-reward-store",  }
  )
);
