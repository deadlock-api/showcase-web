import { Button } from "@/components/ui/button";
import { type ItemCategory, useAnalysisStore } from "@/stores/analysis.store";
import { Item } from "@/lib/Item";
import { cn } from "@/lib/utils";

// Define the weapon names by tier for organization
const weaponsByTier = {
  T1: [
    "Basic Magazine",
    "Close Quarters",
    "Headshot Booster",
    "High-Velocity Mag",
    "Hollow Point Ward",
    "Monster Rounds",
    "Rapid Rounds",
    "Restorative Shot",
  ],
  T2: [
    "Active Reload",
    "Berserker",
    "Fleetfoot",
    "Kinetic Dash",
    "Long Range",
    "Melee Charge",
    "Mystic Shot",
    "Slowing Bullets",
    "Soul Shredder Bullets",
    "Swift Striker",
  ],
  T3: [
    "Alchemical Fire",
    "Burst Fire",
    "Escalating Resilience",
    "Headhunter",
    "Heroic Aura",
    "Hunter's Aura",
    "Intensifying Magazine",
    "Point Blank",
    "Pristine Emblem",
    "Sharpshooter",
    "Tesla Bullets",
    "Titanic Magazine",
    "Toxic Bullets",
    "Warp Stone",
  ],
  T4: [
    "Crippling Headshot",
    "Frenzy",
    "Glass Cannon",
    "Lucky Shot",
    "Ricochet",
    "Silencer",
    "Shadow Weave",
    "Spiritual Overflow",
    "Vampiric Burst",
  ],
} as const;

// Create a mapping of categories to their tier data
const itemsByCategory = {
  Weapon: weaponsByTier,
  Vitality: {
    T1: [
      "Enduring Spirit",
      "Extra Health",
      "Extra Regen",
      "Extra Stamina",
      "Healing Rite",
      "Melee Lifesteal",
      "Sprint Boots",
    ],
    T2: [
      "Bullet Armor",
      "Bullet Lifesteal",
      "Combat Barrier",
      "Debuff Reducer",
      "Divine Barrier",
      "Enchanter's Barrier",
      "Enduring Speed",
      "Healbane",
      "Healing Booster",
      "Healing Nova",
      "Reactive Barrier",
      "Restorative Locket",
      "Return Fire",
      "Spirit Armor",
      "Spirit Lifesteal",
    ],
    T3: [
      "Debuff Remover",
      "Fortitude",
      "Improved Bullet Armor",
      "Improved Spirit Armor",
      "Lifestrike",
      "Majestic Leap",
      "Metal Skin",
      "Rescue Beam",
      "Superior Stamina",
      "Veil Walker",
    ],
    T4: ["Colossus", "Inhibitor", "Leech", "Phantom Strike", "Siphon Bullets", "Soul Rebirth", "Unstoppable"],
  },
  Spirit: {
    T1: ["Ammo Scavenger", "Extra Charge", "Extra Spirit", "Infuser", "Mystic Burst", "Mystic Reach", "Spirit Strike"],
    T2: [
      "Bullet Resist Shredder",
      "Cold Front",
      "Decay",
      "Duration Extender",
      "Improved Cooldown",
      "Mystic Vulnerability",
      "Quicksilver Reload",
      "Slowing Hex",
      "Suppressor",
      "Withering Whip",
    ],
    T3: [
      "Ethereal Shift",
      "Improved Burst",
      "Improved Reach",
      "Improved Spirit",
      "Knockdown",
      "Mystic Slow",
      "Rapid Recharge",
      "Silence Glyph",
      "Superior Cooldown",
      "Superior Duration",
      "Surge of Power",
      "Torment Pulse",
    ],
    T4: [
      "Boundless Spirit",
      "Curse",
      "Diviner's Kevlar",
      "Echo Shard",
      "Escalating Exposure",
      "Magic Carpet",
      "Mystic Reverb",
      "Refresher",
    ],
  },
} as const;

export function ItemSelector({ category }: { category: ItemCategory }) {
  const {
    selectedItems,
    excludedItems,
    addSelectedItem,
    removeSelectedItem,
    addExcludedItem,
    removeExcludedItem,
    removeManySelectedItems,
    removeManyExcludedItems,
  } = useAnalysisStore();

  const handleDeselectAll = () => {
    removeManySelectedItems(selectedItems);
    removeManyExcludedItems(excludedItems);
  };

  const handleItemClick = (itemId: number) => {
    const isSelected = selectedItems.includes(itemId);
    const isExcluded = excludedItems.includes(itemId);

    if (!isSelected && !isExcluded) {
      // Not selected -> Selected
      addSelectedItem(itemId);
    } else if (isSelected) {
      // Selected -> Excluded
      removeSelectedItem(itemId);
      addExcludedItem(itemId);
    } else {
      // Excluded -> Not selected
      removeExcludedItem(itemId);
    }
  };

  return (
    <div className="space-y-2 p-2">
      {(selectedItems.length > 0 || excludedItems.length > 0) && (
        <div className="flex flex-wrap items-center gap-1">
          <Button variant="ghost" className="h-8 text-sm text-muted-foreground" onClick={handleDeselectAll}>
            Clear All
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-primary bg-primary" /> Selected
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-destructive bg-destructive" /> Excluded
            </div>
          </div>
        </div>
      )}
      {(["T1", "T2", "T3", "T4"] as const).map((tier) => (
        <div key={tier} className="space-y-1">
          <h4 className="font-medium">{tier}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
            {itemsByCategory[category][tier].map((itemName) => {
              const item = Item.byName(itemName);
              const isSelected = selectedItems.includes(item.id);
              const isExcluded = excludedItems.includes(item.id);

              return (
                <Button
                  key={item.id}
                  variant={isSelected ? "default" : isExcluded ? "destructive" : "outline"}
                  className={cn("w-full h-8 text-sm sm:text-xs px-2 truncate", isExcluded && "hover:bg-destructive/90")}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
