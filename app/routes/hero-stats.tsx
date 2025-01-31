import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface HeroStats {
  hero_id: number;
  wins: number;
  matches: number;
  hero_name?: string;
}

export default function HeroStats() {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const [minDate, setMinDate] = useState<Date>(lastMonth);
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [minBadgeLevel, setMinBadgeLevel] = useState(80);
  const [maxBadgeLevel, setMaxBadgeLevel] = useState(116);
  const [stats, setStats] = useState<HeroStats[] | null>(null);
  const [heroes, setHeroes] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      min_badge_level: minBadgeLevel.toString(),
      max_badge_level: maxBadgeLevel.toString(),
      min_unix_timestamp: Math.floor(minDate.getTime() / 1000).toString(),
      max_unix_timestamp: Math.floor(maxDate.getTime() / 1000).toString(),
    });

    // Fetch hero stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://analytics.deadlock-api.com/v2/hero-win-loss-stats?${params}`);
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
        const heroMap = data.reduce((acc: { [key: number]: string }, hero: { id: number; name: string }) => {
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
  }, [minDate, maxDate, minBadgeLevel, maxBadgeLevel]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8">Hero Win/Pick Rate Stats</h1>

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

      {loading && !stats ? (
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
              <TableHead>Pick Rate</TableHead>
              <TableHead>Total Matches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats
              .sort((a, b) => b.wins / b.matches - a.wins / a.matches)
              .map((stat) => {
                const winRate = (stat.wins / stat.matches) * 100;
                const totalMatches = stats.reduce((sum, s) => sum + s.matches, 0);
                const pickRate = (stat.matches / totalMatches) * 100 * 12;
                const heroName = heroes[stat.hero_id] || null;
                if (!heroName) return null;
                if (pickRate < 0.01) return null;

                return (
                  <TableRow key={stat.hero_id}>
                    <TableCell className="font-medium">{heroName}</TableCell>
                    <TableCell>{winRate.toFixed(2)}%</TableCell>
                    <TableCell>{pickRate.toFixed(2)}%</TableCell>
                    <TableCell>{stat.matches}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
