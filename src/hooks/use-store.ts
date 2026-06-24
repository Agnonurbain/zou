import { create } from "zustand"

interface StoreState {
  // Add future state slices here.
}

interface StoreActions {
  // Add future actions here.
}

export const useStore = create<StoreState & StoreActions>(() => ({
  // Initial state and actions go here.
}))
