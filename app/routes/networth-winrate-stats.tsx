import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface NetworthWinrateStatsProps {
  richer_wins: number;
  matches: number;
}

const allowedTimestamps = [
  180, 360, 540, 720, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400,
  5700, 6000, 6300, 6600, 6900,
] as const;
type Timestamp = (typeof allowedTimestamps)[number];

export default function NetworthWinrateStats() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const [timestamp, setTimestamp] = useState<Timestamp>(900);
  const [minDate, setMinDate] = useState<Date>(lastMonth);
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [minBadgeLevel, setMinBadgeLevel] = useState(80);
  const [maxBadgeLevel, setMaxBadgeLevel] = useState(116);
  const [minDuration, setMinDuration] = useState(30 * 60);
  const [maxDuration, setMaxDuration] = useState(50 * 60);
  const [minNetworthAdvantage, setMinNetworthAdvantage] = useState(2000);
  const [maxNetworthAdvantage, setMaxNetworthAdvantage] = useState(100000);
  const [stats, setStats] = useState<NetworthWinrateStatsProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      min_badge_level: minBadgeLevel.toString(),
      max_badge_level: maxBadgeLevel.toString(),
      min_unix_timestamp: Math.floor(minDate.getTime() / 1000).toString(),
      max_unix_timestamp: Math.floor(maxDate.getTime() / 1000).toString(),
      min_duration_s: minDuration.toString(),
      max_duration_s: maxDuration.toString(),
      min_networth_advantage: minNetworthAdvantage.toString(),
      max_networth_advantage: maxNetworthAdvantage.toString(),
    });

    // Fetch hero stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://analytics.deadlock-api.com/v1/dev/net-worth-win-rate-analysis/${timestamp}?${params}`,
        );
        if (!response.ok) {
          setError("Failed to fetch stats");
          setStats(null);
        } else {
          setStats(await response.json());
          setError(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, [
    minDate,
    timestamp,
    maxDate,
    minBadgeLevel,
    maxBadgeLevel,
    minDuration,
    maxDuration,
    minNetworthAdvantage,
    maxNetworthAdvantage,
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8">Networth Winrate Stats</h1>

      <div className="space-y-2">
        <p className="text-sm font-medium">Game Timestamp</p>
        <div>
          <Select
            value={(timestamp / 60).toString()}
            onValueChange={(value) => setTimestamp((60 * Number(value)) as Timestamp)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Game Timestamp" />
            </SelectTrigger>
            <SelectContent>
              {allowedTimestamps.map((timestamp) => (
                <SelectItem key={timestamp} value={(timestamp / 60).toString()}>
                  {timestamp / 60} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Badge Level Range</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <label htmlFor="min-date-input" className="text-xs">
              Min Badge
            </label>
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
            <label htmlFor="min-date-input" className="text-xs">
              Min Date
            </label>
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
        <p className="text-sm font-medium">Date Range</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <label htmlFor="min-date-input" className="text-xs">
              Min Date
            </label>
            <input
              type="date"
              id="min-date-input"
              value={!Number.isNaN(minDate.getTime()) ? minDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setMinDate(new Date(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-date-input" className="text-xs">
              Max Date
            </label>
            <input
              type="date"
              id="max-date-input"
              value={!Number.isNaN(maxDate.getTime()) ? maxDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setMaxDate(new Date(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Networth Advantage Range</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <label htmlFor="min-networth-input" className="text-xs">
              Min Advantage
            </label>
            <input
              type="number"
              id="min-networth-input"
              value={minNetworthAdvantage.toString()}
              onChange={(e) => setMinNetworthAdvantage(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-networth-input" className="text-xs">
              Max Advantage
            </label>
            <input
              type="number"
              id="max-networth-input"
              value={maxNetworthAdvantage.toString()}
              onChange={(e) => setMaxNetworthAdvantage(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Match Duration Range</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <label htmlFor="min-duration-input" className="text-xs">
              Min Duration (minutes)
            </label>
            <input
              type="number"
              id="min-duration-input"
              min={0}
              max={110}
              value={Math.floor(minDuration / 60).toString()}
              onChange={(e) => setMinDuration(60 * Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="max-duration-input" className="text-xs">
              Max Duration (minutes)
            </label>
            <input
              type="number"
              id="max-duration-input"
              min={0}
              max={110}
              value={Math.floor(maxDuration / 60).toString()}
              onChange={(e) => setMaxDuration(60 * Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : stats ? (
        <Table className="w-fit">
          <TableHeader>
            <TableRow>
              <TableHead>Richer Team Winrate</TableHead>
              <TableHead>Matches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{Math.round(stats.richer_wins * 100 * 100) / 100}%</TableCell>
              <TableCell>{stats.matches}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
