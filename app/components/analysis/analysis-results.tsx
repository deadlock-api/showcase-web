import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAnalysisStore } from "@/stores/analysis.store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { InfoIcon } from "lucide-react";
import type { ItemData } from "@/lib/Item";

// Wilson score interval for 95% confidence
function wilsonScore(wins: number, total: number): number {
  const z = 1.96; // 95% confidence
  const p = wins / total;
  const n = total;

  const numerator = p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const denominator = 1 + (z * z) / n;

  return numerator / denominator;
}

// Update helper function to get item type color
function getItemTypeColor(item: ItemData): string {
  switch (item.item_slot_type) {
    case "weapon":
      return "bg-orange-500/20 text-foreground";
    case "vitality":
      return "bg-green-500/20 text-foreground";
    case "spirit":
      return "bg-purple-500/20 text-foreground";
    default:
      return "bg-muted text-foreground";
  }
}

export function AnalysisResults() {
  const { analysisResult } = useAnalysisStore();

  if (!analysisResult) return null;

  const sortedWinRateResult = analysisResult.winRate.toSorted((a, b) => {
    const wins = Math.round(a.winRate * a.sampleSize);
    const lowerBound = wilsonScore(wins, a.sampleSize);

    const winsB = Math.round(b.winRate * b.sampleSize);
    const lowerBoundB = wilsonScore(winsB, b.sampleSize);

    return lowerBoundB - lowerBound;
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Analysis Results</h3>
        <p className="text-sm text-muted-foreground">
          Based on the items you chose, here are the other highest correlated win-rate and pick-rate items
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Win Rate Table */}
        <Table className="border">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 whitespace-nowrap">Item</TableHead>
              <TableHead className="h-8 text-right whitespace-nowrap flex items-center justify-end gap-1">
                Conservative Win Rate
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>
                        A conservative estimate of the possible win rate, pessimistically assuming the worst case
                        scenario.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="h-8 text-right whitespace-nowrap">Raw Win Rate</TableHead>
              <TableHead className="h-8 text-right whitespace-nowrap">Sample Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWinRateResult.map((result) => {
              const wins = Math.round(result.winRate * result.sampleSize);
              const lowerBound = wilsonScore(wins, result.sampleSize);
              const itemTypeColor = getItemTypeColor(result.item);

              return (
                <TableRow key={result.item.id} className="hover:bg-muted/50">
                  <TableCell className="h-7 py-1">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-sm ${itemTypeColor}`}>
                      {result.item.name}
                      <span className="ml-1 opacity-70">T{result.item.tier}</span>
                    </span>
                  </TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">{(lowerBound * 100).toFixed(1)}%</TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">
                    {(result.winRate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">
                    {result.sampleSize.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
