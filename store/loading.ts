import { create } from "zustand";

interface LoadingState {
  isVisible: boolean;
  message: string;

  // Actions
  show: (message?: string) => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isVisible: false,
  message: "Loading...",

  show: (message = "Loading...") => set({ isVisible: true, message }),
  hide: () => set({ isVisible: false }),
}));
