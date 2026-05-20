import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // Notifications badge count
  unreadCount: number;
  setUnreadCount: (n: number) => void;

  // Feed filters
  feedType: string;
  setFeedType: (t: string) => void;
  feedCategory: string;
  setFeedCategory: (c: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      setUnreadCount: (n) => set({ unreadCount: n }),
      feedType: "all",
      setFeedType: (t) => set({ feedType: t }),
      feedCategory: "All",
      setFeedCategory: (c) => set({ feedCategory: c }),
    }),
    { name: "konnecteer-store" }
  )
);
