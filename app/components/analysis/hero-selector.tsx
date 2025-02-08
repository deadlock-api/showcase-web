import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalysisStore } from "@/stores/analysis.store";
import { useEffect, useState } from "react";
import { toTitleCase } from "~/lib/utils";

interface Hero {
  id: number;
  name: string;
  // Add other properties as needed
}

export function HeroSelector({ onChange }: { onChange?: (value: number) => void }) {
  const { selectedHero, setSelectedHero } = useAnalysisStore();
  const [heroes, setHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch("https://assets.deadlock-api.com/v2/heroes?only_active=true");
        const data = await response.json();
        setHeroes(data);
      } catch (error) {
        console.error("Error fetching heroes:", error);
      }
    };

    fetchHeroes();
  }, []);

  return (
    <Select
      value={selectedHero?.toString()}
      onValueChange={(value) => {
        const hero = heroes.find((h) => h.id === Number(value));
        if (!hero) return;

        setSelectedHero(hero.id);
        if (onChange) onChange(hero.id);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select hero..." />
      </SelectTrigger>
      <SelectContent>
        {heroes
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((hero) => (
            <SelectItem key={hero.id} value={hero.id.toString()}>
              {toTitleCase(hero.name)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
