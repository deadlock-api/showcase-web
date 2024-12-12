import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysisStore } from "@/stores/analysis.store";
import { HeroSelector } from "./hero-selector";
import { ItemSelector } from "./item-selector";
import { AnalysisResults } from "./analysis-results";
import { Item } from "../../lib/Item";
import { cn } from "@/lib/utils";

export function DeadlockAnalysis() {
  const {
    selectedHero,
    selectedItems,
    excludedItems,
    isLoading,
    submitAnalysis,
    removeSelectedItem,
    removeExcludedItem,
  } = useAnalysisStore();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Deadlock Winrate Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Data from latest patch (2024-12-06) to present, with only Oracle+ ranked matches considered
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hero Selection */}
          <div className="space-y-2">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">STEP 1</p>
              <h3 className="text-lg font-medium">Choose your Hero</h3>
            </div>
            <HeroSelector />
          </div>

          {/* Item Selection */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">STEP 2</p>
              <h3 className="text-lg font-medium">Filter and exclude build items</h3>
            </div>
            <Tabs defaultValue="Weapon">
              <TabsList>
                <TabsTrigger value="Weapon">Weapon Items</TabsTrigger>
                <TabsTrigger value="Vitality">Vitality Items</TabsTrigger>
                <TabsTrigger value="Spirit">Spirit Items</TabsTrigger>
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
          <div className="space-y-2">
            {selectedItems.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Required Items:</h3>
                <div className="grid grid-cols-4 gap-1">
                  {selectedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => removeSelectedItem(item.id)}
                        className={cn(
                          "rounded border border-primary bg-primary/10 px-2 py-1 text-sm",
                          "hover:bg-primary/20 hover:border-primary/50 cursor-pointer",
                          "transition-colors duration-200 group relative",
                        )}
                      >
                        {item.name}
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          -
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {excludedItems.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Excluded Items:</h3>
                <div className="grid grid-cols-4 gap-1">
                  {excludedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => removeExcludedItem(item.id)}
                        className={cn(
                          "rounded border border-destructive bg-destructive/10 px-2 py-1 text-sm",
                          "hover:bg-destructive/20 hover:border-destructive/50 cursor-pointer",
                          "transition-colors duration-200 group relative",
                        )}
                      >
                        {item.name}
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          -
                        </span>
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
            {isLoading ? "Analyzing..." : "Submit For Analysis"}
          </Button>

          {/* Analysis Results */}
          <AnalysisResults />
        </CardContent>
      </Card>
    </div>
  );
}
