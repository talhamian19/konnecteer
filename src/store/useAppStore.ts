import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, WatchParty, Notification, FilterOptions } from "@/types";

interface AppState {
  // Auth
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;

  // Filters
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;

  // Watch parties
  selectedParty: WatchParty | null;
  setSelectedParty: (party: WatchParty | null) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;

  // Map
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;

  // UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const DEFAULT_FILTERS: FilterOptions = {};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Filters
      filters: DEFAULT_FILTERS,
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // Watch parties
      selectedParty: null,
      setSelectedParty: (party) => set({ selectedParty: party }),

      // Notifications
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),

      // Map
      mapCenter: { lat: 40.7128, lng: -74.006 },
      mapZoom: 12,
      setMapCenter: (center) => set({ mapCenter: center }),
      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      // UI
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "konnecteer-store",
      partialize: (state) => ({
        theme: state.theme,
        mapCenter: state.mapCenter,
        mapZoom: state.mapZoom,
      }),
    }
  )
);
