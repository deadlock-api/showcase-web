import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface Result {
  max_distance: number;
  min_distance: number;
  total: number;
  unique_users: number;
  win_rate: number;
  wins: number;
}

export function BuildAnalysisForm({ hero, buildId }: { hero: number; buildId: number }) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const [minDate, setMinDate] = useState<Date>(lastMonth);
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [minBadgeLevel, setMinBadgeLevel] = useState(80);
  const [maxBadgeLevel, setMaxBadgeLevel] = useState(116);
  const [maxDistance, setMaxDistance] = useState(3);
  const [maxUnusedItems, setMaxUnusedItems] = useState(20);
  const [kMostSimilarBuilds, setKMostSimilarBuilds] = useState(10_000);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        hero_id: hero.toString(),
        build_id: buildId.toString(),
        min_badge_level: minBadgeLevel.toString(),
        max_badge_level: maxBadgeLevel.toString(),
        min_unix_timestamp: Math.floor(minDate.getTime() / 1000).toString(),
        max_unix_timestamp: Math.floor(maxDate.getTime() / 1000).toString(),
        max_distance: maxDistance.toString(),
        max_unused_items: maxUnusedItems.toString(),
        k_most_similar_builds: kMostSimilarBuilds.toString(),
        distance_function: "non_matching_items",
      });

      const response = await fetch(
        `https://analytics.deadlock-api.com/v1/dev/item-win-rate-analysis/by-similarity?${params}`,
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing build:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Badge Level Range</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <Select value={minBadgeLevel.toString()} onValueChange={(value) => setMinBadgeLevel(Number(value))}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Minimum Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Obscurus</SelectItem>
                  <SelectItem value="10">Initiate</SelectItem>
                  <SelectItem value="20">Seeker</SelectItem>
                  <SelectItem value="30">Alchemist</SelectItem>
                  <SelectItem value="40">Arcanist</SelectItem>
                  <SelectItem value="50">Ritualist</SelectItem>
                  <SelectItem value="60">Emissary</SelectItem>
                  <SelectItem value="70">Archon</SelectItem>
                  <SelectItem value="80">Oracle</SelectItem>
                  <SelectItem value="90">Phantom</SelectItem>
                  <SelectItem value="100">Ascendant</SelectItem>
                  <SelectItem value="110">Eternus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={maxBadgeLevel.toString()} onValueChange={(value) => setMaxBadgeLevel(Number(value))}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Maximum Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06">Obscurus</SelectItem>
                  <SelectItem value="16">Initiate</SelectItem>
                  <SelectItem value="26">Seeker</SelectItem>
                  <SelectItem value="36">Alchemist</SelectItem>
                  <SelectItem value="46">Arcanist</SelectItem>
                  <SelectItem value="56">Ritualist</SelectItem>
                  <SelectItem value="66">Emissary</SelectItem>
                  <SelectItem value="76">Archon</SelectItem>
                  <SelectItem value="86">Oracle</SelectItem>
                  <SelectItem value="96">Phantom</SelectItem>
                  <SelectItem value="106">Ascendant</SelectItem>
                  <SelectItem value="116">Eternus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="min-date-input" className="text-sm font-medium">
            Minimum Date
          </label>
          <input
            type="date"
            id="min-date-input"
            value={!Number.isNaN(minDate.getTime()) ? minDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setMinDate(new Date(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="max-date-input" className="text-sm font-medium">
            Maximum Date
          </label>
          <input
            type="date"
            id="max-date-input"
            value={!Number.isNaN(maxDate.getTime()) ? maxDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setMaxDate(new Date(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        {/*Show error if max date is before min date*/}
        {maxDate.getTime() < minDate.getTime() && (
          <div className="text-sm text-destructive-foreground">Maximum date must be after minimum date</div>
        )}

        <div>
          <label htmlFor={"max-distance-input"} className="text-sm font-medium">
            Maximum Distance
          </label>
          <input
            type="range"
            id={"max-distance-input"}
            min={1}
            max={10}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number.parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="text-sm text-muted-foreground mt-1">Max distance: {maxDistance}</div>
        </div>

        <div>
          <label htmlFor={"max-unused-items-input"} className="text-sm font-medium">
            Maximum Unused Items
          </label>
          <input
            type="range"
            id={"max-unused-items-input"}
            min={0}
            max={40}
            value={maxUnusedItems}
            onChange={(e) => setMaxUnusedItems(Number.parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="text-sm text-muted-foreground mt-1">Max unused items: {maxUnusedItems}</div>
        </div>

        <div>
          <label htmlFor="k-most-similar-builds-input" className="text-sm font-medium">
            Max Matches to Analyze
          </label>
          <input
            type="range"
            id={"k-most-similar-builds-input"}
            min={0}
            max={100_000}
            step={100}
            value={kMostSimilarBuilds}
            onChange={(e) => setKMostSimilarBuilds(Number.parseInt(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="text-sm text-muted-foreground mt-1">K most similar: {kMostSimilarBuilds}</div>
        </div>
      </div>

      <Button onClick={handleAnalyze} disabled={!hero || !buildId || isLoading} className="w-full">
        {isLoading ? "Analyzing..." : "Analyze Build"}
      </Button>

      {result && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Win Rate: {((100 * result.wins) / result.total).toFixed(2)}%</div>
          <div className="text-sm font-medium">Wins: {result.wins}</div>
          <div className="text-sm font-medium">Total: {result.total}</div>
          <div className="text-sm font-medium">Unique Users: {result.unique_users}</div>
        </div>
      )}
    </div>
  );
}
