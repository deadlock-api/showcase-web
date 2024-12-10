import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalysisStore } from "@/stores/analysis.store";
import { HeroSelector } from "./hero-selector";
import { ItemSelector } from "./item-selector";
import { AnalysisResults } from "./analysis-results";
import { Item } from "../../lib/Item";

export function DeadlockAnalysis() {
  const { selectedHero, selectedItems, excludedItems, isLoading, submitAnalysis } = useAnalysisStore();

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
          <div className="space-y-4">
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Required Items:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <div key={item.id} className="rounded-lg border border-primary bg-primary/10 p-2">
                        T{item.tier}: {item.name}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {excludedItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Excluded Items:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {excludedItems
                    .map((itemId) => Item.byId(itemId))
                    .sort(Item.compare)
                    .map((item) => (
                      <div key={item.id} className="rounded-lg border border-destructive bg-destructive/10 p-2">
                        T{item.tier}: {item.name}
                      </div>
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
