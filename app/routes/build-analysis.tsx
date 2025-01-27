import { HeroSelector } from "~/components/analysis/hero-selector";
import { BuildAnalysisForm } from "~/components/analysis/build-analysis-form";
import { AnalysisResults } from "~/components/analysis/analysis-results";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function BuildAnalysis() {
  const [hero, setHero] = useState<number | null>(15);
  const [buildId, setBuildId] = useState<number | null>(12829);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Deadlock Build Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Select a hero and build to analyze win rates.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[300px,1fr]">
            <div className="space-y-6">
              <div>
                <p className="block text-sm font-medium mb-2">Hero</p>
                <HeroSelector
                  onChange={(hero) => {
                    setHero(hero);
                    setBuildId(null);
                  }}
                />
              </div>
              {hero && (
                <div>
                  <label htmlFor="build-id-input" className="block text-sm font-medium mb-2">
                    Build ID
                  </label>
                  <input
                    type="number"
                    id="build-id-input"
                    value={buildId ?? ""}
                    onChange={(e) => setBuildId(Number.parseInt(e.target.value, 10))}
                    placeholder="Enter build id"
                    className="p-2 border rounded"
                  />
                </div>
              )}

              {hero && buildId && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-medium mb-4">Analysis Settings</h2>
                  <BuildAnalysisForm hero={hero} buildId={buildId} />
                </div>
              )}
            </div>

            <div>
              <AnalysisResults />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
