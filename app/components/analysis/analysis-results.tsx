import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ItemData } from "@/lib/Item";
import { cn } from "@/lib/utils";
import { useAnalysisStore } from "@/stores/analysis.store";
import { ArrowUpDown, InfoIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

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

type SortField = "wilson" | "raw" | "sample";
type SortDirection = "asc" | "desc";

export function AnalysisResults() {
  const { analysisResult, selectedItems, addSelectedItem, removeSelectedItem } = useAnalysisStore();
  const [sortField, setSortField] = useState<SortField>("wilson");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  if (!analysisResult) return null;

  // Calculate max sample size once
  const maxSampleSize = Math.max(...analysisResult.winRate.map((result) => result.sampleSize));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedWinRateResult = analysisResult.winRate.toSorted((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "wilson": {
        const winsA = Math.round(a.winRate * a.sampleSize);
        const winsB = Math.round(b.winRate * b.sampleSize);
        const lowerBoundA = wilsonScore(winsA, a.sampleSize);
        const lowerBoundB = wilsonScore(winsB, b.sampleSize);
        comparison = lowerBoundB - lowerBoundA;
        break;
      }
      case "raw":
        comparison = b.winRate - a.winRate;
        break;
      case "sample":
        comparison = b.sampleSize - a.sampleSize;
        break;
    }

    return sortDirection === "asc" ? -comparison : comparison;
  });

  const getSortIcon = (field: SortField) => {
    return (
      <ArrowUpDown
        className={cn(
          "ml-1 h-4 w-4 inline-block transition-colors",
          sortField === field ? "text-foreground" : "text-muted-foreground/50",
        )}
      />
    );
  };

  // Update handler for item selection/deselection
  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      removeSelectedItem(itemId);
    } else {
      addSelectedItem(itemId);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Analysis Results</h3>
        <p className="text-sm text-muted-foreground">
          Based on the items you chose, here are the other highest correlated win-rate items.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Win Rate Table */}
        <Table className="border">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-8 whitespace-nowrap">Item</TableHead>
              <TableHead
                className="h-8 text-right whitespace-nowrap flex items-center justify-end gap-1 cursor-pointer"
                onClick={() => handleSort("wilson")}
              >
                Conservative Win Rate
                {getSortIcon("wilson")}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
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
              <TableHead className="h-8 text-right whitespace-nowrap cursor-pointer" onClick={() => handleSort("raw")}>
                Raw Win Rate {getSortIcon("raw")}
              </TableHead>
              <TableHead
                className="h-8 text-right whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("sample")}
              >
                Sample Size {getSortIcon("sample")}
              </TableHead>
              <TableHead className="h-8 text-right whitespace-nowrap flex items-center justify-end gap-1 cursor-pointer">
                Unique Players
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>The number of unique players who have played with this item under this combination.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWinRateResult.map((result) => {
              const wins = result.wins;
              const lowerBound = wilsonScore(wins, result.sampleSize);
              const itemTypeColor = getItemTypeColor(result.item);
              const isSelected = selectedItems.some((item) => item === result.item.id);
              const presenceRatio = ((result.sampleSize / maxSampleSize) * 100).toFixed(1);

              return (
                <TableRow
                  key={result.item.id}
                  className={cn("group hover:bg-muted/50", isSelected && "bg-slate-100 hover:bg-slate-100/75")}
                >
                  <TableCell className="h-7 py-0">
                    <div className="flex items-center">
                      <button
                        className="cursor-pointer w-12 h-6 shrink-0 mr-4"
                        onClick={() => handleItemClick(result.item.id)}
                        type="button"
                      >
                        {isSelected ? (
                          <div className="h-full w-full rounded flex items-center justify-center group-hover:bg-red-500/10 group-hover:ring-1 ring-inset ring-red-500/20">
                            <MinusIcon className="h-4 w-4 text-red-500/70 opacity-0 group-hover:opacity-100" />
                          </div>
                        ) : (
                          <div className="h-full w-full rounded flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:ring-1 ring-inset ring-emerald-500/20">
                            <PlusIcon className="h-4 w-4 text-emerald-500/70 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                      </button>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 my-1 text-sm ${itemTypeColor}`}>
                        {result.item.name}
                        <span className="ml-1 opacity-70">T{result.item.tier}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">{(lowerBound * 100).toFixed(1)}%</TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">
                    {(result.winRate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">
                    {result.sampleSize.toLocaleString()}
                    <span className="text-muted-foreground ml-1">({presenceRatio}%)</span>
                  </TableCell>
                  <TableCell className="h-7 py-1 text-right tabular-nums">
                    {result.uniqueUsers.toLocaleString()}
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
