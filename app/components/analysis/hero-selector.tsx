import heroes from "@/data/heroes.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalysisStore } from "@/stores/analysis.store";

export function HeroSelector() {
  const { selectedHero, setSelectedHero } = useAnalysisStore();

  return (
    <Select
      value={selectedHero?.toString()}
      onValueChange={(value) => {
        const hero = heroes.find((h) => h.id === Number(value));
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        setSelectedHero(hero!.id);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select hero..." />
      </SelectTrigger>
      <SelectContent>
        {heroes.map((hero) => (
          <SelectItem key={hero.id} value={hero.id.toString()}>
            {hero.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
