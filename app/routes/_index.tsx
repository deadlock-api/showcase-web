import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to Deadlock API - Showcase</h1>
      <div className="grid gap-6 max-w-2xl">
        <Link to="/item-analysis">
          <Button variant="outline" className="w-full justify-start text-left">
            <div>
              <div className="font-semibold">Item Analysis</div>
              <div className="text-sm text-muted-foreground">Analyze item win rates and build paths</div>
            </div>
          </Button>
        </Link>
        <Link to="/build-analysis">
          <Button variant="outline" className="w-full justify-start text-left">
            <div>
              <div className="font-semibold">Build Analysis</div>
              <div className="text-sm text-muted-foreground">Analyze complete builds</div>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}
