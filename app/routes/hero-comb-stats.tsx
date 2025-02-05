import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface HeroStats {
  hero_ids: number[];
  wins: number;
  matches: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
}

export default function HeroStats() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const [minDate, setMinDate] = useState<Date>(lastMonth);
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [combSize, setCombSize] = useState(2);
  const [minTotalMatches, setMinTotalMatches] = useState(100);
  const [minBadgeLevel, setMinBadgeLevel] = useState(80);
  const [maxBadgeLevel, setMaxBadgeLevel] = useState(116);
  const [stats, setStats] = useState<HeroStats[] | null>(null);
  const [heroes, setHeroes] = useState<{ [id: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      comb_size: combSize.toString(),
      min_total_matches: minTotalMatches.toString(),
      sorted_by: "winrate",
      min_badge_level: minBadgeLevel.toString(),
      max_badge_level: maxBadgeLevel.toString(),
      min_unix_timestamp: Math.floor(minDate.getTime() / 1000).toString(),
      max_unix_timestamp: Math.floor(maxDate.getTime() / 1000).toString(),
    });

    // Fetch hero stats
    const fetchStats = async () => {
      console.log("Fetching hero stats");
      try {
        setLoading(true);
        const response = await fetch(`https://analytics.deadlock-api.com/v2/hero-combs-win-loss-stats?${params}`);
        if (!response.ok) {
          setError("Failed to fetch hero stats");
          setStats([]);
        } else {
          setStats(await response.json());
          setError(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hero stats:", error);
      }
    };

    // Fetch heroes for names
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://assets.deadlock-api.com/v2/heroes?only_active=true");
        const data = await response.json();
        const heroMap = data.reduce((acc: { [id: number]: string }, hero: { id: number; name: string }) => {
          acc[hero.id] = hero.name;
          return acc;
        }, {});
        setHeroes(heroMap);
      } catch (error) {
        console.error("Error fetching heroes:", error);
      }
    };

    fetchStats();
    fetchHeroes();
  }, [minDate, maxDate, minBadgeLevel, maxBadgeLevel, combSize, minTotalMatches]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8">Hero Combs Winrate Stats</h1>

      <div className="space-y-2">
        <p className="text-sm font-medium">Comb Size</p>
        <div>
          <Select value={combSize.toString()} onValueChange={(value) => setCombSize(Number(value))}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Comb Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6">6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Min Matches</p>
        <div>
          <input
            type="number"
            value={minTotalMatches.toString()}
            onChange={(e) => setMinTotalMatches(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Minimum Matches"
          />
        </div>
      </div>

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
        <p className="text-sm font-medium">Date Range</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <input
              type="date"
              id="min-date-input"
              value={!Number.isNaN(minDate.getTime()) ? minDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setMinDate(new Date(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
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

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : stats ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hero</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead>Matches</TableHead>
              <TableHead>Kills</TableHead>
              <TableHead>Deaths</TableHead>
              <TableHead>Assists</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats
              .sort((a, b) => b.wins / b.matches - a.wins / a.matches)
              .map((stat) => {
                const winRate = (stat.wins / stat.matches) * 100;
                const heroNames = stat.hero_ids.map((id) => heroes[id]).sort();
                if (!heroNames) return null;

                return (
                  <TableRow key={stat.hero_ids.join("-")}>
                    <TableCell className="font-medium">{heroNames.join(", ")}</TableCell>
                    <TableCell>{winRate.toFixed(2)}%</TableCell>
                    <TableCell>{stat.matches.toLocaleString()}</TableCell>
                    <TableCell>{stat.total_kills.toLocaleString()}</TableCell>
                    <TableCell>{stat.total_deaths.toLocaleString()}</TableCell>
                    <TableCell>{stat.total_assists.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
