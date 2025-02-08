import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysisStore } from "@/stores/analysis.store";
import { HeroSelector } from "./hero-selector";
import { ItemSelector } from "./item-selector";
import { AnalysisResults } from "./analysis-results";
import { Item } from "../../lib/Item";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ItemAnalysis() {
  const {
    selectedHero,
    selectedItems,
    excludedItems,
    isLoading,
    submitAnalysis,
    removeSelectedItem,
    removeExcludedItem,
    minBadgeLevel,
    setMinBadgeLevel,
  } = useAnalysisStore();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Deadlock Winrate Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Data from latest patch (2024-12-06) to present</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hero and Rank Selection */}
          <div className="space-y-2">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">STEP 1</p>
              <h3 className="text-lg font-medium">Choose your Hero and Rank Filter</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div>
                <HeroSelector />
              </div>
              <div>
                <Select value={minBadgeLevel.toString()} onValueChange={(value) => setMinBadgeLevel(Number(value))}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Minimum Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70">Archon+</SelectItem>
                    <SelectItem value="80">Oracle+</SelectItem>
                    <SelectItem value="90">Phantom+</SelectItem>
                    <SelectItem value="100">Ascendant+</SelectItem>
                    <SelectItem value="110">Eternus+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Item Selection */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">STEP 2</p>
              <h3 className="text-lg font-medium">Filter and exclude build items</h3>
            </div>
            <Tabs defaultValue="Weapon" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="Weapon" className="flex-1">
                  <span className="block sm:hidden">Weapon</span>
                  <span className="hidden sm:block">Weapon Items</span>
                </TabsTrigger>
                <TabsTrigger value="Vitality" className="flex-1">
                  <span className="block sm:hidden">Vitality</span>
                  <span className="hidden sm:block">Vitality Items</span>
                </TabsTrigger>
                <TabsTrigger value="Spirit" className="flex-1">
                  <span className="block sm:hidden">Spirit</span>
                  <span className="hidden sm:block">Spirit Items</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Weapon">
                <ItemSelector category="Weapon" />
              </TabsContent>
              <TabsContent value="Vitality">
                <ItemSelector category="Vitality" />
              </TabsContent>
              <TabsContent value="Spirit">
                <ItemSelector category="Spirit" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Selected and Excluded Items Display */}
          <div className="space-y-4">
            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Required Items:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => removeSelectedItem(item.id)}
                        className="w-full rounded border border-primary bg-primary/10 px-2 py-1 text-sm 
                       hover:bg-primary/20 hover:border-primary/50 transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Excluded Items */}
            {excludedItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Excluded Items:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {excludedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => removeExcludedItem(item.id)}
                        className="w-full rounded border border-destructive bg-destructive/10 px-2 py-1 text-sm 
                       hover:bg-destructive/20 hover:border-destructive/50 transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            disabled={!selectedHero || selectedItems.length === 0 || isLoading}
            onClick={() => submitAnalysis()}
          >
            {isLoading ? "Analysing..." : "Submit For Analysis"}
          </Button>

          {/* Analysis Results */}
          <AnalysisResults />
        </CardContent>
      </Card>
    </div>
  );
}
