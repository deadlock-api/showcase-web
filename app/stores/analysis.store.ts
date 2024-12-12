import { persist } from "zustand/middleware";
import { create } from "zustand/react";
import { Item, type ItemData } from "../lib/Item";
import type { StateCreator } from "zustand/vanilla";

export type ItemCategory = "Weapon" | "Vitality" | "Spirit";

export type AnalysisResult = {
  winRate: {
    item: ItemData;
    winRate: number;
    sampleSize: number;
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
};

const analysisSlice: StateCreator<AnalysisState & Actions, [["zustand/persist", unknown]]> = (set, get) => ({
  selectedHero: null,
  selectedItems: [],
  analysisResult: null,
  isLoading: false,
  excludedItems: [],

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

  submitAnalysis: async () => {
    set({ isLoading: true });

    const selectedHero = get().selectedHero;
    const selectedItems = get().selectedItems;
    const excludedItems = get().excludedItems;

    if (!selectedHero || (selectedItems.length === 0 && excludedItems.length === 0)) {
      set({ isLoading: false });
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.set("hero_id", selectedHero.toString());

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
        throw new Error("Failed to fetch analysis", { cause: result.statusText });
      }

      const data: { item_id: number; win_rate: number; total: number; wins: number }[] = await result.json();
      const filteredData = data.filter((item) => Item.byIdNullable(item.item_id) !== null);

      filteredData.sort((a, b) => b.win_rate - a.win_rate);

      set({
        analysisResult: {
          winRate: filteredData.map((item) => ({
            item: Item.byId(item.item_id),
            winRate: item.win_rate,
            sampleSize: item.total,
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

export const useAnalysisStore = create(
  persist(analysisSlice, {
    version: 0,
    name: "analysis-store",
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !['analysisResult'].includes(key)),
      ),
  }),
);
