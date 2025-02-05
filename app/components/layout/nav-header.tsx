import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";

export function NavHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold">
              Deadlock API - Showcase
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/item-analysis">
                <Button variant="ghost">Item Analysis</Button>
              </Link>
              <Link to="/build-analysis">
                <Button variant="ghost">Build Analysis</Button>
              </Link>
              <Link to="/hero-stats">
                <Button variant="ghost">Hero Stats</Button>
              </Link>
              <Link to="/hero-comb-stats">
                <Button variant="ghost">Hero Comb Stats</Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
