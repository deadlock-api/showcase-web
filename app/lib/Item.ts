import rawItems from "../data/items.json";

export interface ItemData {
  id: number;
  name: string;
  item_slot_type: "vitality" | "spirit" | "weapon";
  tier: number;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const itemDataFromRawItem = (raw: any): ItemData => {
  if (raw.type !== "upgrade") throw new Error(`Item with id ${raw.id} is not an upgrade type`);
  return {
    id: raw.id,
    name: raw.name,
    item_slot_type: raw.item_slot_type,
    tier: raw.item_tier,
  };
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const itemDataFromRawItemNullable = (raw: any): ItemData | null => {
  if (raw.type !== "upgrade") return null;
  return {
    id: raw.id,
    name: raw.name,
    item_slot_type: raw.item_slot_type,
    tier: raw.item_tier,
  };
};

export const Item = {
  byId(id: number): ItemData {
    const item = rawItems.find((item) => item.id === id && !item.disabled);
    if (!item) throw new Error(`Item with id ${id} not found`);
    return itemDataFromRawItem(item);
  },
  byIdNullable(id: number): ItemData | null {
    const item = rawItems.find((item) => item.id === id && !item.disabled);
    if (!item) return null;
    return itemDataFromRawItemNullable(item);
  },
  byName(name: string): ItemData {
    const item = rawItems.find((item) => item.name === name);
    if (!item) throw new Error(`Item with name ${name} not found`);
    return itemDataFromRawItem(item);
  },
  compare(a: ItemData, b: ItemData): number {
    // First compare by tier
    if (a.tier !== b.tier) {
      return a.tier - b.tier; // Lower tier first
    }
    // If tiers are equal, compare by name
    return a.name.localeCompare(b.name);
  },
};
