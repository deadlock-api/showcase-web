import { decode, encode } from "@msgpack/msgpack";
import { type PersistStorage, StorageValue, persist } from "zustand/middleware";
import { create } from "zustand/react";
import type { StateCreator } from "zustand/vanilla";
import { Item, type ItemData } from "../lib/Item";

export type ItemCategory = "Weapon" | "Vitality" | "Spirit";

export type AnalysisResult = {
  winRate: {
    item: ItemData;
    winRate: number;
    sampleSize: number;
    uniqueUsers: number;
  }[];
  pickRate: {
    item: string;
    pickRate: number;
    sampleSize: number;
  }[];
};

type AnalysisState = {
  selectedHero: number | null;
  selectedItems: number[];
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  excludedItems: number[];
  minBadgeLevel: number;
};

type Actions = {
  setSelectedHero: (hero: number | null) => void;
  addSelectedItem: (itemId: number) => void;
  removeSelectedItem: (itemId: number) => void;
  removeManySelectedItems: (itemIds: number[]) => void;
  addExcludedItem: (itemId: number) => void;
  removeExcludedItem: (itemId: number) => void;
  removeManyExcludedItems: (itemIds: number[]) => void;
  submitAnalysis: () => Promise<void>;
  setMinBadgeLevel: (level: number) => void;
};

const analysisSlice: StateCreator<AnalysisState & Actions, [["zustand/persist", unknown]]> = (set, get) => ({
  selectedHero: null,
  selectedItems: [],
  analysisResult: null,
  isLoading: false,
  excludedItems: [],
  minBadgeLevel: 80,

  setSelectedHero: (hero) => set({ selectedHero: hero }),

  addSelectedItem: (itemId: number) =>
    set((state) => ({
      selectedItems: state.selectedItems.includes(itemId) ? state.selectedItems : [...state.selectedItems, itemId],
    })),

  removeSelectedItem: (itemId: number) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((id) => id !== itemId),
    })),

  removeManySelectedItems: (itemIds: number[]) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((id) => !itemIds.includes(id)),
    })),

  addExcludedItem: (itemId) =>
    set((state) => ({
      excludedItems: [...state.excludedItems, itemId],
    })),

  removeExcludedItem: (itemId) =>
    set((state) => ({
      excludedItems: state.excludedItems.filter((id) => id !== itemId),
    })),

  removeManyExcludedItems: (itemIds) =>
    set((state) => ({
      excludedItems: state.excludedItems.filter((id) => !itemIds.includes(id)),
    })),

  setMinBadgeLevel: (level: number) => set({ minBadgeLevel: level }),

  submitAnalysis: async () => {
    set({ isLoading: true });

    const selectedHero = get().selectedHero;
    const selectedItems = get().selectedItems;
    const excludedItems = get().excludedItems;
    const minBadgeLevel = get().minBadgeLevel;

    if (!selectedHero || (selectedItems.length === 0 && excludedItems.length === 0)) {
      set({ isLoading: false });
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.set("hero_id", selectedHero.toString());
      queryParams.set("min_badge_level", minBadgeLevel.toString());

      const result = await fetch(
        `https://analytics.deadlock-api.com/v1/dev/win-rate-analysis?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            required_item_ids: selectedItems,
            excluded_item_ids: excludedItems,
          }),
        },
      );

      if (!result.ok) {
        throw new Error("Failed to fetch analysis", {
          cause: result.statusText,
        });
      }

      const data: {
        item_id: number;
        win_rate: number;
        total: number;
        wins: number;
        unique_users: number;
      }[] = await result.json();
      const filteredData = data.filter((item) => Item.byIdNullable(item.item_id) !== null);

      filteredData.sort((a, b) => b.win_rate - a.win_rate);

      set({
        analysisResult: {
          winRate: filteredData.map((item) => ({
            item: Item.byId(item.item_id),
            winRate: item.win_rate,
            sampleSize: item.total,
            uniqueUsers: item.unique_users,
          })),
          pickRate: [],
        },
      });
    } catch (e) {
      console.error("Error in submitAnalysis", e);
    } finally {
      set({ isLoading: false });
    }
  },
});

type StateKeys<S> = readonly (keyof S)[];

const createURLStorage = <S>(keys: StateKeys<S>): PersistStorage<S> => ({
  getItem: (name) => {
    if (typeof window === "undefined") return null;

    // Try URL first, then localStorage as fallback
    let str = new URLSearchParams(window.location.search).get(name);
    if (!str) {
      try {
        str = localStorage.getItem(name);
      } catch (error) {
        console.error("Failed to load state from localStorage:", error);
      }
    }
    if (!str) return null;

    try {
      // Save URL state to localStorage if it exists
      if (str === new URLSearchParams(window.location.search).get(name)) {
        try {
          localStorage.setItem(name, str);
        } catch (error) {
          console.error("Failed to save state to localStorage:", error);
        }
      }

      // Convert base64 to Uint8Array
      const binaryString = atob(str);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode array and convert back to object
      const [version, state] = decode(bytes) as [number, unknown[]];
      return {
        version,
        state: Object.fromEntries(keys.map((key, index) => [key, state[index]])) as S,
      };
    } catch (error) {
      console.error("Failed to decode state:", error);
      return null;
    }
  },

  setItem: (name, value) => {
    if (typeof window === "undefined") return;

    // Convert object to array format using the provided keys order
    const arrayState = keys.map((key) => value.state[key]);
    const encoded = encode([value.version, arrayState]);

    // Convert Uint8Array to base64
    let binaryString = "";
    for (let i = 0; i < encoded.length; i++) {
      binaryString += String.fromCharCode(encoded[i]);
    }
    const base64 = btoa(binaryString);

    // Update both URL and localStorage
    const params = new URLSearchParams(window.location.search);
    params.set(name, base64);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

    try {
      localStorage.setItem(name, base64);
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  },

  removeItem: (name) => {
    if (typeof window === "undefined") return;

    // Remove from both URL and localStorage
    const params = new URLSearchParams(window.location.search);
    params.delete(name);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error("Failed to remove state from localStorage:", error);
    }
  },
});

// Define the keys we want to persist
const PERSISTED_KEYS = [
  "selectedHero",
  "selectedItems",
  "excludedItems",
  "minBadgeLevel",
] as const satisfies StateKeys<AnalysisState>;

export const useAnalysisStore = create(
  persist(analysisSlice, {
    name: "analysis-store",
    storage: createURLStorage(PERSISTED_KEYS),
    partialize: (state) => ({
      selectedHero: state.selectedHero,
      selectedItems: state.selectedItems,
      excludedItems: state.excludedItems,
      minBadgeLevel: state.minBadgeLevel,
    }),
  }),
);
